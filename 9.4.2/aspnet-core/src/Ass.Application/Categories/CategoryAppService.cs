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
        public CategoryAppService(IRepository<Category, int> repository, IRepository<Link, int> linkMappingRepository, IRepository<Ass.Entities.UserAndLinkMapping, int> userAndLinkMappingRepository,IRepository<Link, int> linkRepository) : base(repository)
        {
            _linkMappingRepository = linkMappingRepository;
            _userAndLinkMappingRepository = userAndLinkMappingRepository;
            _linkRepository = linkRepository;
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



        public async Task<List<LinkDto>> GetAllLinksByCategoryIdAndUserId(int categoryId, long userId)
        {
            try
            {
                var links = await _linkRepository.GetAll()
                    .Where(link => link.CategoryId == categoryId)
                    .Select(link => new
                    {
                        link.Id,
                        link.LinkName,
                        link.Url,
                        link.Order,
                        link.ImagePath,
                        link.CategoryId,
                        IsUserActive = _userAndLinkMappingRepository.GetAll()
                            .Where(mapping => mapping.LinkId == link.Id && mapping.UserId == userId)
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
                throw new Exception("An error occurred while fetching links for the category.", ex);
            }
        }




    }
}
