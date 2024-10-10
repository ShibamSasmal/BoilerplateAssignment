using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Entities;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.IdentityFramework;
using Abp.Linq.Extensions;
using Abp.Localization;
using Abp.Runtime.Session;
using Abp.UI;
using Ass.Authorization;
using Ass.Authorization.Accounts;
using Ass.Authorization.Roles;
using Ass.Authorization.Users;
using Ass.Entities;
using Ass.Roles.Dto;
using Ass.Users.Dto;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Ass.Users
{
    [AbpAuthorize(PermissionNames.Pages_Users)]
    public class UserAppService : AsyncCrudAppService<User, UserDto, long, PagedUserResultRequestDto, CreateUserDto, UserDto>, IUserAppService
    {
        private readonly UserManager _userManager;
        private readonly RoleManager _roleManager;
        private readonly IRepository<Role> _roleRepository;
        private readonly IPasswordHasher<User> _passwordHasher;
        private readonly IAbpSession _abpSession;
        private readonly LogInManager _logInManager;
        private readonly IRepository<Country, int> _countryRepository;
        private readonly IRepository<UserCountryMapping, int> _userCountryMappingRepository;

        public UserAppService(
            IRepository<User, long> repository,
            UserManager userManager,
            RoleManager roleManager,
            IRepository<Role> roleRepository,
            IPasswordHasher<User> passwordHasher,
            IAbpSession abpSession,
            LogInManager logInManager,
             IRepository<Country, int> countryRepository,
            IRepository<UserCountryMapping, int> userCountryMappingRepository)
            : base(repository)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _roleRepository = roleRepository;
            _passwordHasher = passwordHasher;
            _abpSession = abpSession;
            _logInManager = logInManager;
            _countryRepository = countryRepository;
            _userCountryMappingRepository = userCountryMappingRepository;
        }

        public override async Task<UserDto> CreateAsync(CreateUserDto input)
        {
            CheckCreatePermission();

            // Map input to user entity
            var user = ObjectMapper.Map<User>(input);
            user.TenantId = AbpSession.TenantId;
            user.IsEmailConfirmed = true;

            // Initialize user options
            await _userManager.InitializeOptionsAsync(AbpSession.TenantId);
            CheckErrors(await _userManager.CreateAsync(user, input.Password));

            // Associate country with the user
            if (input.CountryId > 0)
            {
                var country = await _countryRepository.GetAsync(input.CountryId);
                if (country != null && country.IsActive)
                {
                    await _userCountryMappingRepository.InsertAsync(new UserCountryMapping
                    {
                        UserId = user.Id,
                        CountryId = country.Id // Insert into UserCountryMapping
                    });
                }
            }

            // Set roles for the user
            if (input.RoleNames != null)
            {
                CheckErrors(await _userManager.SetRolesAsync(user, input.RoleNames));
            }

            // Save changes
            await CurrentUnitOfWork.SaveChangesAsync();

            // Construct UserDto to return
            var userDto = new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Name = user.Name,
                Surname = user.Surname,
                EmailAddress = user.EmailAddress,
                IsActive = user.IsActive,
                CountryId = input.CountryId, 
                                             
            };

            return userDto; 
        }



        //public override async Task<UserDto> CreateAsync(CreateUserDto input)
        //{
        //    CheckCreatePermission();

        //    var user = ObjectMapper.Map<User>(input);
        //    user.TenantId = AbpSession.TenantId;
        //    user.IsEmailConfirmed = true;

        //    await _userManager.InitializeOptionsAsync(AbpSession.TenantId);
        //    CheckErrors(await _userManager.CreateAsync(user, input.Password));

        //    // Associate country with the user (single country)
        //    if (input.CountryId > 0)
        //    {

        //        var country = await _countryRepository.GetAsync(input.CountryId);
        //        if (country != null && country.IsActive)
        //        {


        //            await _userCountryMappingRepository.InsertAsync(new UserCountryMapping
        //            {
        //                UserId = user.Id,
        //                CountryId = country.Id
        //            });
        //        }
        //    }

        //    if (input.RoleNames != null)
        //    {
        //        CheckErrors(await _userManager.SetRolesAsync(user, input.RoleNames));
        //    }

        //    CurrentUnitOfWork.SaveChanges();

        //    return MapToEntityDto(user);
        //}





        public override async Task<UserDto> UpdateAsync(UserDto input)
        {
            CheckUpdatePermission();

            // Get the existing user entity by ID
            var user = await GetEntityByIdAsync(input.Id);

            // Map the updated values from input to the existing user entity
            MapToEntity(input, user);

            // Update the country if CountryId is provided
            if (input.CountryId > 0)
            {
                // Check if the user already has an associated country
                var existingMapping = await _userCountryMappingRepository
                    .FirstOrDefaultAsync(ucm => ucm.UserId == user.Id);

                // If there's an existing country mapping, update it
                if (existingMapping != null)
                {
                    existingMapping.CountryId = input.CountryId;
                }
                else
                {
                    // Otherwise, insert a new country mapping
                    await _userCountryMappingRepository.InsertAsync(new UserCountryMapping
                    {
                        UserId = user.Id,
                        CountryId = input.CountryId
                    });
                }
            }

            // Save the changes to the user entity and country mapping
            await CurrentUnitOfWork.SaveChangesAsync();

            // Return the updated UserDto
            return MapToEntityDto(user);
        }

        public override async Task<PagedResultDto<UserDto>> GetAllAsync(PagedUserResultRequestDto input)
        {
            CheckGetAllPermission();

            // Create the filtered query for users
            var query = CreateFilteredQuery(input);

            // Count total users
            var totalCount = await AsyncQueryableExecuter.CountAsync(query);

            // Apply sorting and paging
            query = ApplySorting(query, input);
            query = ApplyPaging(query, input);

            // Fetch the user entities
            var users = await AsyncQueryableExecuter.ToListAsync(query);

            // Create the result list including country information
            var userDtos = new List<UserDto>();
            foreach (var user in users)
            {
                var userDto = MapToEntityDto(user);

                // Get the first country associated with the user
                var countryInfo = await _userCountryMappingRepository.GetAll()
                    .Where(ucm => ucm.UserId == user.Id)
                    .Include(ucm => ucm.Country)
                    .Select(ucm => new
                    {
                        CountryId = ucm.Country.Id,
                        CountryName = ucm.Country.CountryName
                    })
                    .FirstOrDefaultAsync(); // Get only the first country

                // Assign the country information to the userDto
                if (countryInfo != null)
                {
                    userDto.CountryId = countryInfo.CountryId; // Assuming UserDto has a CountryId property
                    userDto.CountryNames = countryInfo.CountryName; // Assuming UserDto has a CountryNames property
                }

                userDtos.Add(userDto);
            }

            // Return paged result with country information included
            return new PagedResultDto<UserDto>(
                totalCount,
                userDtos
            );
        }




        public override async Task DeleteAsync(EntityDto<long> input)
        {
            var user = await _userManager.GetUserByIdAsync(input.Id);
            await _userManager.DeleteAsync(user);
        }

        [AbpAuthorize(PermissionNames.Pages_Users_Activation)]
        public async Task Activate(EntityDto<long> user)
        {
            await Repository.UpdateAsync(user.Id, async (entity) =>
            {
                entity.IsActive = true;
            });
        }

        [AbpAuthorize(PermissionNames.Pages_Users_Activation)]
        public async Task DeActivate(EntityDto<long> user)
        {
            await Repository.UpdateAsync(user.Id, async (entity) =>
            {
                entity.IsActive = false;
            });
        }

        public async Task<ListResultDto<RoleDto>> GetRoles()
        {
            var roles = await _roleRepository.GetAllListAsync();
            return new ListResultDto<RoleDto>(ObjectMapper.Map<List<RoleDto>>(roles));
        }

        public async Task ChangeLanguage(ChangeUserLanguageDto input)
        {
            await SettingManager.ChangeSettingForUserAsync(
                AbpSession.ToUserIdentifier(),
                LocalizationSettingNames.DefaultLanguage,
                input.LanguageName
            );
        }

        protected override User MapToEntity(CreateUserDto createInput)
        {
            var user = ObjectMapper.Map<User>(createInput);
            user.SetNormalizedNames();
            return user;
        }

        protected override void MapToEntity(UserDto input, User user)
        {
            ObjectMapper.Map(input, user);
            user.SetNormalizedNames();
        }

        protected override UserDto MapToEntityDto(User user)
        {
            var roleIds = user.Roles.Select(x => x.RoleId).ToArray();

            var roles = _roleManager.Roles.Where(r => roleIds.Contains(r.Id)).Select(r => r.NormalizedName);

            var userDto = base.MapToEntityDto(user);
            userDto.RoleNames = roles.ToArray();

            return userDto;
        }

        protected override IQueryable<User> CreateFilteredQuery(PagedUserResultRequestDto input)
        {
            return Repository.GetAllIncluding(x => x.Roles)
                .WhereIf(!input.Keyword.IsNullOrWhiteSpace(), x => x.UserName.Contains(input.Keyword) || x.Name.Contains(input.Keyword) || x.EmailAddress.Contains(input.Keyword))
                .WhereIf(input.IsActive.HasValue, x => x.IsActive == input.IsActive);
        }

        protected override async Task<User> GetEntityByIdAsync(long id)
        {
            var user = await Repository.GetAllIncluding(x => x.Roles).FirstOrDefaultAsync(x => x.Id == id);

            if (user == null)
            {
                throw new EntityNotFoundException(typeof(User), id);
            }

            return user;
        }

        protected override IQueryable<User> ApplySorting(IQueryable<User> query, PagedUserResultRequestDto input)
        {
            return query.OrderBy(r => r.UserName);
        }

        protected virtual void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }

        public async Task<bool> ChangePassword(ChangePasswordDto input)
        {
            await _userManager.InitializeOptionsAsync(AbpSession.TenantId);

            var user = await _userManager.FindByIdAsync(AbpSession.GetUserId().ToString());
            if (user == null)
            {
                throw new Exception("There is no current user!");
            }
            
            if (await _userManager.CheckPasswordAsync(user, input.CurrentPassword))
            {
                CheckErrors(await _userManager.ChangePasswordAsync(user, input.NewPassword));
            }
            else
            {
                CheckErrors(IdentityResult.Failed(new IdentityError
                {
                    Description = "Incorrect password."
                }));
            }

            return true;
        }

        public async Task<bool> ResetPassword(ResetPasswordDto input)
        {
            if (_abpSession.UserId == null)
            {
                throw new UserFriendlyException("Please log in before attempting to reset password.");
            }
            
            var currentUser = await _userManager.GetUserByIdAsync(_abpSession.GetUserId());
            var loginAsync = await _logInManager.LoginAsync(currentUser.UserName, input.AdminPassword, shouldLockout: false);
            if (loginAsync.Result != AbpLoginResultType.Success)
            {
                throw new UserFriendlyException("Your 'Admin Password' did not match the one on record.  Please try again.");
            }
            
            if (currentUser.IsDeleted || !currentUser.IsActive)
            {
                return false;
            }
            
            var roles = await _userManager.GetRolesAsync(currentUser);
            if (!roles.Contains(StaticRoleNames.Tenants.Admin))
            {
                throw new UserFriendlyException("Only administrators may reset passwords.");
            }

            var user = await _userManager.GetUserByIdAsync(input.UserId);
            if (user != null)
            {
                user.Password = _passwordHasher.HashPassword(user, input.NewPassword);
                await CurrentUnitOfWork.SaveChangesAsync();
            }

            return true;
        }
    }
}

