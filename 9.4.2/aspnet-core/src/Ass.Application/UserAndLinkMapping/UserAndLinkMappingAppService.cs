using Ass.Entities;
using Ass.UserAndLinkMapping.Dto;
using Abp.Application.Services;
using Abp.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Microsoft.Extensions.Configuration;
using Abp.Runtime.Validation;

namespace Ass.UserAndLinkMapping
{
    public class UserAndLinkMappingAppService : AsyncCrudAppService<
        Ass.Entities.UserAndLinkMapping,
        UserAndLinkMappingDto,
        int,
        PagedAndSortedResultRequestDto,
        CreateUserAndLinkMappingDto,
        UserAndLinkMappingDto>,
        IUserAndLinkMappingAppService
    {
        private readonly ILogger<UserAndLinkMappingAppService> _logger;
        private readonly IConfiguration _configuration;

        public UserAndLinkMappingAppService(
            IRepository<Ass.Entities.UserAndLinkMapping, int> repository,
            ILogger<UserAndLinkMappingAppService> logger, IConfiguration configuration) // Inject ILogger
            : base(repository)
        {
            _logger = logger;
            _configuration = configuration;
        }

        // Method to get User and Link Mappings for a specific User ID and Category ID
        public async Task<List<UserAndLinkMappingDto>> GetMappingsForUserAndCategory(long userId, int categoryId)
        {
            var mappings = await Repository.GetAll()
                .Where(mapping => mapping.UserId == userId && mapping.CategoryId == categoryId)
                .ToListAsync();

            return ObjectMapper.Map<List<UserAndLinkMappingDto>>(mappings);
        }

       
        // Method to save or update User and Link Mappings
        public async Task SaveMappings(List<CreateUserAndLinkMappingDto> mappings)
        {
            foreach (var mappingDto in mappings)
            {
                try
                {
                    _logger.LogInformation($"Processing mapping DTO: {JsonConvert.SerializeObject(mappingDto)}");

                    var existingMapping = await Repository.FirstOrDefaultAsync(m =>
                        m.UserId == mappingDto.UserId && m.LinkId == mappingDto.LinkId);

                    if (existingMapping == null)
                    {
                        // If mapping does not exist, create a new one
                        var newMapping = ObjectMapper.Map<Ass.Entities.UserAndLinkMapping>(mappingDto);

                        _logger.LogInformation($"Mapped newMapping: {JsonConvert.SerializeObject(newMapping)}");

                        if (newMapping == null)
                        {
                            _logger.LogError($"Failed to map CreateUserAndLinkMappingDto to UserAndLinkMapping. DTO: {JsonConvert.SerializeObject(mappingDto)}");
                            throw new Exception("Mapping failed. newMapping is null.");
                        }

                        await Repository.InsertAsync(newMapping);
                        _logger.LogInformation($"Inserted new mapping with ID: {newMapping.Id}");
                    }
                    else
                    {
                        // If mapping exists, update the IsActive status
                        existingMapping.IsActive = mappingDto.IsActive;
                        await Repository.UpdateAsync(existingMapping);
                        _logger.LogInformation($"Updated existing mapping with ID: {existingMapping.Id}");
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Error processing mapping DTO: {JsonConvert.SerializeObject(mappingDto)}");
                    throw new Exception("An error occurred while creating the mapping.", ex);
                }
            }

        }

        public async Task<List<UserAndLinkMappingDto>> GetActiveLinksForUserAndCategory(long userId, int categoryId)
        {
            
            var mappings = await Repository.GetAll()
                .Include(mapping => mapping.link)   
                .Include(mapping => mapping.Category) 
                .Where(mapping => mapping.UserId == userId
                                 && mapping.CategoryId == categoryId
                                 && mapping.IsActive
                                 && mapping.link.IsActive
                                 && mapping.Category.IsActive
                                ) 
                .OrderBy(mapping => mapping.Order)
                //.OrderBy(mapping => mapping.Category.order) 
                .Select(mapping => new UserAndLinkMappingDto
                {
                    CategoryId = mapping.CategoryId,
                    CategoryName = mapping.Category.Name,
                    LinkId = mapping.LinkId,
                    LinkName = mapping.link.LinkName,
                    LinkUrl = mapping.link.Url,
                    


                    ImageUrl = $"{_configuration["ServerRootAddress"]}/{mapping.link.ImagePath}",
                    Order = mapping.Order
                })
                .ToListAsync();

            return mappings;
        }


        public async Task UpdateLinkOrder(List<UserAndLinkMappingDto> mappingDtos)
        {
            if (mappingDtos == null || !mappingDtos.Any())
            {
                throw new AbpValidationException("The link list cannot be null or empty.");
            }

            // Extract LinkIds and CategoryIds from the DTOs
            var linkIds = mappingDtos.Select(m => m.LinkId).Distinct().ToList();
            var categoryIds = mappingDtos.Select(m => m.CategoryId).Distinct().ToList();

            //Console.WriteLine("Link IDs: " + string.Join(", ", linkIds));
            //Console.WriteLine("Category IDs: " + string.Join(", ", categoryIds));

            using (var unitOfWork = UnitOfWorkManager.Begin())
            {
                try
                {
                    // Fetch existing mappings from the database
                    var mappings = await Repository.GetAll()
                        .Where(mapping => linkIds.Contains(mapping.LinkId) && categoryIds.Contains(mapping.CategoryId))
                        .ToListAsync();

                    // Check if the number of fetched mappings matches the number of IDs provided
                    if (mappings.Count != mappingDtos.Count)
                    {
                        // Identify any missing link IDs
                        var missingLinkIds = linkIds.Except(mappings.Select(m => m.LinkId)).ToList();
                        throw new AbpValidationException(
                            $"One or more link IDs are invalid: {string.Join(", ", missingLinkIds)}."
                        );
                    }

                    // Update order based on the fetched mappings and DTOs
                    foreach (var mappingDto in mappingDtos)
                    {
                        var mapping = mappings.FirstOrDefault(m => m.LinkId == mappingDto.LinkId && m.CategoryId == mappingDto.CategoryId);
                        if (mapping != null)
                        {
                            mapping.Order = mappingDto.Order;
                            // Update the entity in the repository
                            await Repository.UpdateAsync(mapping);
                        }
                    }

                    // Save changes to the database
                    await unitOfWork.CompleteAsync();
                }
                catch (Exception ex)
                {
                    throw new ApplicationException("An error occurred while updating link order.", ex);
                }
            }
        }




    }
}
