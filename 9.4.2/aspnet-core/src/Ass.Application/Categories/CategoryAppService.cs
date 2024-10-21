using Abp.Application.Services.Dto;
using Abp.Application.Services;
using Abp.Domain.Repositories;
using Ass.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ass.Categories.Dto;
using Abp.Runtime.Validation;
using Ass.Links.Dto;
using Microsoft.EntityFrameworkCore;

namespace Ass.Categories
{
    public class CategoryAppService : AsyncCrudAppService<Category, CategoryDto, int, PagedAndSortedResultRequestDto, CreateCategoryDto, CategoryDto>, ICategoryAppService
    {
        private readonly IRepository<Link, int> _linkMappingRepository;
        private readonly IRepository<Ass.Entities.UserAndLinkMapping, int> _userAndLinkMappingRepository;
        private readonly IRepository<Link, int> _linkRepository;
        private readonly IRepository<Ass.Entities.LinkCountryMapping, int> _linkcountryMapping;
        private readonly IRepository<UserCountryMapping, int> _userCountryMappingRepository;
        public CategoryAppService(IRepository<Category, int> repository, IRepository<Link, int> linkMappingRepository, IRepository<Ass.Entities.UserAndLinkMapping, int> userAndLinkMappingRepository,IRepository<Link, int> linkRepository, IRepository<Entities.LinkCountryMapping, int> linkcountryMapping, IRepository<UserCountryMapping, int> userCountryMappingRepository) : base(repository)
        {
            _linkMappingRepository = linkMappingRepository;
            _userAndLinkMappingRepository = userAndLinkMappingRepository;
            _linkRepository = linkRepository;
            _linkcountryMapping = linkcountryMapping;
            _userCountryMappingRepository = userCountryMappingRepository;
        }
        public override async Task<CategoryDto> CreateAsync(CreateCategoryDto input)
        {
            // Validate input data
            if (string.IsNullOrWhiteSpace(input.Name))
            {
                throw new AbpValidationException("Category name is required.");
            }

            // Check for uniqueness of Name if necessary
            var existingCategory = await Repository.FirstOrDefaultAsync(c => c.Name == input.Name);
            if (existingCategory != null)
            {
                throw new AbpValidationException("Category name must be unique.");
            }

            // Create the new category entity
            var category = ObjectMapper.Map<Category>(input);
            category.IsActive = input.IsActive;
            // Insert into repository
            await Repository.InsertAsync(category);

            // Return the DTO of the created category
            return MapToEntityDto(category);
        }

        //public async Task<List<LinkDto>> GetAllLinksByCategoryId(int categoryId)
        //{
        //    try
        //    {
        //        // Fetch links directly associated with the given CategoryId from the Link repository
        //        var links = await _linkRepository.GetAll()
        //            .Where(link => link.CategoryId == categoryId)
        //            .ToListAsync();

        //        // Map the links to LinkDto objects
        //        List<LinkDto> linkDtos = links.Select(link => new LinkDto
        //        {
        //            Id = link.Id,
        //            LinkName = link.LinkName,
        //            Url = link.Url,
        //            IsActive = link.IsActive,
        //            Order = link.Order,
        //            ImagePath = link.ImagePath,
        //            CategoryId = link.CategoryId
        //        }).ToList();

        //        return linkDtos;
        //    }
        //    catch (Exception ex)
        //    {
        //        // Log the error or handle it as needed
        //        throw new Exception("An error occurred while fetching links for the category.", ex);
        //    }
        //}



        //public async Task<List<LinkDto>> GetAllLinksByCategoryIdAndUserId(int categoryId, long userId)
        //{
        //    try
        //    {
        //        var links = await _linkRepository.GetAll()
        //            .Where(link => link.CategoryId == categoryId)
        //            .Select(link => new
        //            {
        //                link.Id,
        //                link.LinkName,
        //                link.Url,
        //                link.Order,
        //                link.ImagePath,
        //                link.CategoryId,
        //                IsUserActive = _userAndLinkMappingRepository.GetAll()
        //                    .Where(mapping => mapping.LinkId == link.Id && mapping.UserId == userId)
        //                    .Select(mapping => (bool?)mapping.IsActive) 
        //                    .FirstOrDefault() 
        //            })
        //            .ToListAsync();

        //        // Map the results to LinkDto
        //        List<LinkDto> linkDtos = links.Select(link => new LinkDto
        //        {
        //            Id = link.Id,
        //            LinkName = link.LinkName,
        //            Url = link.Url,
        //            IsActive = link.IsUserActive ?? false, // Handle null case with ?? false
        //            Order = link.Order,
        //            ImagePath = link.ImagePath,
        //            CategoryId = link.CategoryId
        //        }).ToList();

        //        return linkDtos;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new Exception("An error occurred while fetching links for the category.", ex);
        //    }
        //}



        //public async Task<List<LinkDto>> GetAllLinksByCategoryIdUserIdAndCountryId(int categoryId, long userId, int countryId)
        //{
        //    try
        //    {
        //        // Fetch links based on CategoryId and LinkCountryMapping for the selected CountryId
        //        var links = await _linkRepository.GetAll()
        //            .Where(link => link.CategoryId == categoryId)
        //            .Join(_linkcountryMapping.GetAll(), // Join with LinkCountryMapping table
        //                link => link.Id,
        //                linkCountryMapping => linkCountryMapping.LinkId,
        //                (link, linkCountryMapping) => new { link, linkCountryMapping })
        //            .Where(result => result.linkCountryMapping.CountryId == countryId) // Filter by selected CountryId
        //            .Select(result => new
        //            {
        //                result.link.Id,
        //                result.link.LinkName,
        //                result.link.Url,
        //                result.link.Order,
        //                result.link.ImagePath,
        //                result.link.CategoryId,
        //                IsUserActive = _userAndLinkMappingRepository.GetAll()
        //                    .Where(mapping => mapping.LinkId == result.link.Id && mapping.UserId == userId)
        //                    .Select(mapping => (bool?)mapping.IsActive)
        //                    .FirstOrDefault()
        //            })
        //            .ToListAsync();

        //        // Map the results to LinkDto
        //        List<LinkDto> linkDtos = links.Select(link => new LinkDto
        //        {
        //            Id = link.Id,
        //            LinkName = link.LinkName,
        //            Url = link.Url,
        //            IsActive = link.IsUserActive ?? false, // Handle null case with ?? false
        //            Order = link.Order,
        //            ImagePath = link.ImagePath,
        //            CategoryId = link.CategoryId

        //        }).ToList();

        //        return linkDtos;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new Exception("An error occurred while fetching links for the category and country.", ex);
        //    }
        //}


        public async Task<List<LinkDto>> GetAllLinksByCategoryIdUserIdAndCountryId(int categoryId, long userId)
        {
            try
            {
                // Fetch the country ID associated with the user
                var userCountryId = await _userCountryMappingRepository.GetAll()
                    .Where(mapping => mapping.UserId == userId)
                    .Select(mapping => mapping.CountryId)
                    .FirstOrDefaultAsync();

                // Check if userCountryId is found
                if (userCountryId == default)
                {
                    return new List<LinkDto>(); // Return an empty list if no country is found for the user
                }

                // Fetch links based on CategoryId and LinkCountryMapping for the user's CountryId
                var links = await _linkRepository.GetAll()
                    .Where(link => link.CategoryId == categoryId)
                    .Join(_linkcountryMapping.GetAll(), // Join with LinkCountryMapping table
                        link => link.Id,
                        linkCountryMapping => linkCountryMapping.LinkId,
                        (link, linkCountryMapping) => new { link, linkCountryMapping })
                    .Where(result => result.linkCountryMapping.CountryId == userCountryId) // Filter by user's CountryId
                    .Select(result => new
                    {
                        result.link.Id,
                        result.link.LinkName,
                        result.link.Url,
                        result.link.Order,
                        result.link.ImagePath,
                        result.link.CategoryId,
                        IsUserActive = _userAndLinkMappingRepository.GetAll()
                            .Where(mapping => mapping.LinkId == result.link.Id && mapping.UserId == userId)
                            .Select(mapping => (bool?)mapping.IsActive)
                            .FirstOrDefault()
                    })
                    .ToListAsync();

                // Map the results to LinkDto
                List<LinkDto> linkDtos = links.Select(link => new LinkDto
                {
                    Id = link.Id,
                    LinkName = link.LinkName,
                    Url = link.Url,
                    IsActive = link.IsUserActive ?? false, // Handle null case with ?? false
                    Order = link.Order,
                    ImagePath = link.ImagePath,
                    CategoryId = link.CategoryId
                }).ToList();

                return linkDtos;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while fetching links for the category and user country.", ex);
            }
        }


        public async Task UpdateCategoryOrder(List<CategoryDto> categoryDtos)
        {
            if (categoryDtos == null || !categoryDtos.Any())
            {
                throw new AbpValidationException("The category list cannot be null or empty.");
            }

            // Start a transaction to ensure atomicity
            using (var unitOfWork = UnitOfWorkManager.Begin())
            {
                try
                {
                    // Extract category IDs from the input DTOs
                    var categoryIds = categoryDtos.Select(c => c.Id).ToList();

                    // Fetch all categories that are in the input list
                    var categories = await Repository.GetAll()
                        .Where(c => categoryIds.Contains(c.Id))
                        .ToListAsync();

                    // Check if all provided category IDs are valid
                    if (categories.Count != categoryDtos.Count)
                    {
                        throw new AbpValidationException("One or more category IDs are invalid.");
                    }

                    // Update the Order property based on the order in the input DTOs
                    foreach (var categoryDto in categoryDtos)
                    {
                        var category = categories.First(c => c.Id == categoryDto.Id);

                        // Assuming the DTO contains the new order
                        category.order = categoryDto.order;

                        // Update the category in the repository
                        await Repository.UpdateAsync(category);
                    }

                    // Commit the transaction
                    await unitOfWork.CompleteAsync();
                }
                catch (Exception ex)
                {
                    // Rollback is automatic if an exception occurs
                    throw new ApplicationException("An error occurred while updating category order.", ex);
                }
            }
        }

        public override async Task<PagedResultDto<CategoryDto>> GetAllAsync(PagedAndSortedResultRequestDto input)
        {
            
            CheckGetAllPermission();

            
            var query = CreateFilteredQuery(input);

            
            var totalCount = await AsyncQueryableExecuter.CountAsync(query);

            
            query = query.OrderBy(c => c.order); 

            
            query = ApplyPaging(query, input);

            
            var entities = await AsyncQueryableExecuter.ToListAsync(query);

            
            return new PagedResultDto<CategoryDto>(
                totalCount,
                entities.Select(MapToEntityDto).ToList() 
            );
        }




    }
}
