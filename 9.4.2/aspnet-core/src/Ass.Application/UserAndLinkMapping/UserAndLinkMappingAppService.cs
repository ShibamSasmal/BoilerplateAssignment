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

        public UserAndLinkMappingAppService(
            IRepository<Ass.Entities.UserAndLinkMapping, int> repository,
            ILogger<UserAndLinkMappingAppService> logger) // Inject ILogger
            : base(repository)
        {
            _logger = logger;
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
    }
}
