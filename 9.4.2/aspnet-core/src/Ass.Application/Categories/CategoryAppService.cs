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

namespace Ass.Categories
{
    public class CategoryAppService : AsyncCrudAppService<Category, CategoryDto, int, PagedAndSortedResultRequestDto, CreateCategoryDto, CategoryDto>, ICategoryAppService
    {
        public CategoryAppService(IRepository<Category, int> repository) : base(repository)
        {
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
    }
}
