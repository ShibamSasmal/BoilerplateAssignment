using Abp.Application.Services.Dto;
using Abp.Application.Services;
using Abp.Domain.Repositories;
using Ass.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ass.Links.Dto;
using Microsoft.EntityFrameworkCore;
using Abp.Runtime.Validation;
using Abp;
using Abp.Domain.Entities;
using Abp.Runtime.Session;
using Abp.UI;
using Abp.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IO;



namespace Ass.Links
{
    public class LinkAppService : AsyncCrudAppService<Link, LinkDto, int, PagedAndSortedResultRequestDto, CreateLinkDto, LinkDto>, ILinkAppService
    {
        private readonly IRepository<Ass.Entities.LinkCountryMapping, int> _linkCountryMappingRepository;
        private readonly IRepository<Country, int> _countryRepository;
        private readonly IRepository<Ass.Entities.UserAndLinkMapping, int> _userAndLinkMappingRepository;
        private readonly IRepository<Category, int> _categoryRepository;
        private readonly IAbpSession _abpSession;
        public LinkAppService(
            IRepository<Link, int> repository,
            IRepository<Ass.Entities.LinkCountryMapping, int> linkCountryMappingRepository,
            IRepository<Country, int> countryRepository,
            IRepository<Ass.Entities.UserAndLinkMapping, int> userAndLinkMappingRepository,
            IRepository<Category, int> categoryRepository,
            IAbpSession abpSession) : base(repository)
        {
            _linkCountryMappingRepository = linkCountryMappingRepository;
            _countryRepository = countryRepository;
            _userAndLinkMappingRepository = userAndLinkMappingRepository;
            _categoryRepository = categoryRepository;
            _abpSession = abpSession;
        }
        //first

        //public override async Task<LinkDto> CreateAsync(CreateLinkDto input)
        //{
        //    try
        //    {
        //        if (string.IsNullOrWhiteSpace(input.LinkName))
        //        {
        //            throw new AbpValidationException("Link name is required.");
        //        }

        //        var existingLink = await Repository.FirstOrDefaultAsync(l => l.LinkName == input.LinkName);
        //        if (existingLink != null)
        //        {
        //            throw new AbpValidationException("Link name must be unique.");
        //        }

        //        var link = ObjectMapper.Map<Link>(input);
        //        link.IsActive = input.IsActive;

        //        await Repository.InsertAsync(link);

        //        return MapToEntityDto(link);
        //    }
        //    catch (AbpValidationException vex)
        //    {
        //        // Log specific validation errors
        //        Logger.Error("Validation error: " + vex.Message);
        //        throw;
        //    }
        //    catch (Exception ex)
        //    {
        //        // Log general errors
        //        Logger.Error("An unexpected error occurred: " + ex.Message, ex);
        //        throw new AbpException("An error occurred while creating the link.", ex);
        //    }
        //}

        //second

        //public override async Task<LinkDto> CreateAsync(CreateLinkDto input)
        //{
        //    try
        //    {
        //        // Validate the link name
        //        if (string.IsNullOrWhiteSpace(input.LinkName))
        //        {
        //            throw new AbpValidationException("Link name is required.");
        //        }

        //        // Check for uniqueness of the link name
        //        var existingLink = await Repository.FirstOrDefaultAsync(l => l.LinkName == input.LinkName);
        //        if (existingLink != null)
        //        {
        //            throw new AbpValidationException("Link name must be unique.");
        //        }

        //        // Map CreateLinkDto to Link entity
        //        var link = ObjectMapper.Map<Link>(input);
        //        link.IsActive = input.IsActive;

        //        // Insert the Link entity into the repository
        //        await Repository.InsertAsync(link);

        //        // Now create the LinkCountryMapping entries
        //        if (input.Countries != null && input.Countries.Any())
        //        {
        //            foreach (var countryId in input.Countries)
        //            {
        //                var linkCountryMapping = new Ass.Entities.LinkCountryMapping // Fully qualified
        //                {
        //                    LinkId = link.Id, // Set the LinkId to the newly created link's Id
        //                    CountryId = countryId
        //                };

        //                // Insert the mapping into the LinkCountryMapping repository
        //                await _linkCountryMappingRepository.InsertAsync(linkCountryMapping);
        //            }
        //        }

        //        // Return the mapped LinkDto
        //        return MapToEntityDto(link);
        //    }
        //    catch (AbpValidationException vex)
        //    {
        //        Logger.Error("Validation error: " + vex.Message);
        //        throw;
        //    }
        //    catch (Exception ex)
        //    {
        //        Logger.Error("An unexpected error occurred: " + ex.Message, ex);
        //        throw new AbpException("An error occurred while creating the link.", ex);
        //    }
        //}


        public override async Task<LinkDto> CreateAsync(CreateLinkDto input)
        {
            try
            {
                // Validate the input
                if (input == null)
                {
                    throw new AbpValidationException("Input cannot be null.");
                }

                // Validate the link name
                if (string.IsNullOrWhiteSpace(input.LinkName))
                {
                    throw new AbpValidationException("Link name is required.");
                }

                // Check for uniqueness of the link name
                var existingLink = await Repository.FirstOrDefaultAsync(l => l.LinkName == input.LinkName);
                if (existingLink != null)
                {
                    throw new AbpValidationException("Link name must be unique.");
                }
               



                // Map CreateLinkDto to Link entity
                var link = ObjectMapper.Map<Link>(input);
                //link.CreatorUserId = AbpSession.UserId;
                link.IsActive = input.IsActive;

                // Insert the Link entity into the repository
                var linkId = await Repository.InsertAndGetIdAsync(link);

                // Now create the LinkCountryMapping entries
                if (input.Countries != null && input.Countries.Any())
                {
                    foreach (var countryId in input.Countries)
                    {
                        // Ensure the countryId is valid (if necessary)
                        if (countryId <= 0)
                        {
                            throw new AbpValidationException("Country ID must be a positive integer.");
                        }

                        var linkCountryMapping = new Ass.Entities.LinkCountryMapping // Fully qualified
                        {
                            LinkId = linkId,
                            CountryId = countryId
                        };

                        // Insert the mapping into the LinkCountryMapping repository
                        await _linkCountryMappingRepository.InsertAsync(linkCountryMapping);
                    }
                }
                // Return the mapped LinkDto
                return MapToEntityDto(link);
            }
            catch (AbpValidationException vex)
            {
                Logger.Error("Validation error: " + vex.Message);
                throw;
            }
            catch (Exception ex)
            {
                Logger.Error("An unexpected error occurred: " + ex.Message, ex);
                throw new AbpException("An error occurred while creating the link.", ex);
            }
        }

        // Optionally, override GetAllAsync to include country names for each link
        public override async Task<PagedResultDto<LinkDto>> GetAllAsync(PagedAndSortedResultRequestDto input)
        {
            var query = Repository.GetAllIncluding(link => link.Category);

            // Apply filtering based on input if needed

            var totalCount = await query.CountAsync();
            var links = await query.OrderBy(link => link.Order)
                                   .Skip(input.SkipCount)
                                   .Take(input.MaxResultCount)
                                   .ToListAsync();

            var linkDtos = ObjectMapper.Map<List<LinkDto>>(links);

            // Fetch all country mappings for the retrieved links
            var linkIds = links.Select(l => l.Id).ToList();
            var countryMappings = await _linkCountryMappingRepository.GetAll()
                                                                         .Where(m => linkIds.Contains(m.LinkId))
                                                                         .ToListAsync();

            // Fetch all countries related to these mappings
            var countryIds = countryMappings.Select(m => m.CountryId).Distinct().ToList();
            var countries = await _countryRepository.GetAll()
                                                    .Where(c => countryIds.Contains(c.Id))
                                                    .ToListAsync();

            // Create a dictionary to map LinkId to its country names
            var countryNamesByLinkId = countryMappings.GroupBy(m => m.LinkId)
                                                      .ToDictionary(
                                                          g => g.Key,
                                                          g => g.Select(m => countries.FirstOrDefault(c => c.Id == m.CountryId)?.CountryName)
                                                                .Where(name => !string.IsNullOrEmpty(name))
                                                                .ToList()
                                                      );

            // Assign country names to each LinkDto
            foreach (var linkDto in linkDtos)
            {
                if (countryNamesByLinkId.ContainsKey(linkDto.Id))
                {
                    linkDto.CountryNames = countryNamesByLinkId[linkDto.Id];
                }
                else
                {
                    linkDto.CountryNames = new List<string>();
                }
            }

            return new PagedResultDto<LinkDto>(totalCount, linkDtos);
        }






        //public override async Task<PagedResultDto<LinkDto>> GetAllAsync(PagedAndSortedResultRequestDto input)
        //{
        //    var query = Repository.GetAllIncluding(link => link.Category); // Include Category

        //    // Optionally apply sorting and filtering based on input here

        //    var totalCount = await query.CountAsync();
        //    var links = await query.OrderBy(link => link.Order) // Adjust sorting as needed
        //                           .Skip(input.SkipCount)
        //                           .Take(input.MaxResultCount)
        //                           .ToListAsync();

        //    var linkDtos = ObjectMapper.Map<List<LinkDto>>(links);

        //    return new PagedResultDto<LinkDto>(totalCount, linkDtos);
        //}



        // Override GetAsync to include country IDs and names
        public override async Task<LinkDto> GetAsync(EntityDto<int> input)
        {
            try
            {
                var link = await Repository.GetAllIncluding(l => l.Category)
                                           .FirstOrDefaultAsync(l => l.Id == input.Id);

                if (link == null)
                {
                    throw new EntityNotFoundException(typeof(Link), input.Id);
                }

                var linkDto = ObjectMapper.Map<LinkDto>(link);

                // Fetch associated country mappings
                var countryMappings = await _linkCountryMappingRepository.GetAll()
                                                                             .Where(m => m.LinkId == link.Id)
                                                                             .ToListAsync();

                linkDto.Countries = countryMappings.Select(m => m.CountryId).ToList();

                // Optional: Fetch country names
                var countryIds = linkDto.Countries.Distinct().ToList();
                var countries = await _countryRepository.GetAll()
                                                        .Where(c => countryIds.Contains(c.Id))
                                                        .ToListAsync();
                linkDto.CountryNames = countries.Select(c => c.CountryName).ToList();

                return linkDto;
            }
            catch (Exception ex)
            {
                Logger.Error("Error fetching link details.", ex);
                throw new AbpException("An error occurred while fetching link details.", ex);
            }
        }

        //public override async Task<LinkDto> UpdateAsync(LinkDto input)
        //{
        //    try
        //    {
        //        // Validate the input
        //        if (input == null)
        //        {
        //            throw new AbpValidationException("Input cannot be null.");
        //        }

        //        // Validate the link name
        //        if (string.IsNullOrWhiteSpace(input.LinkName))
        //        {
        //            throw new AbpValidationException("Link name is required.");
        //        }

        //        // Retrieve the existing link
        //        var existingLink = await Repository.GetAsync(input.Id);
        //        if (existingLink == null)
        //        {
        //            throw new AbpValidationException("Link does not exist.");
        //        }

        //        // Map the updated values to the existing link
        //        ObjectMapper.Map(input, existingLink);

        //        // Update the Link entity in the repository
        //        await Repository.UpdateAsync(existingLink);

        //        // Update the LinkCountryMapping entries
        //        if (input.Countries != null)
        //        {
        //            // Remove existing country mappings
        //            var existingMappings = await _linkCountryMappingRepository.GetAllListAsync(m => m.LinkId == existingLink.Id);
        //            foreach (var mapping in existingMappings)
        //            {
        //                await _linkCountryMappingRepository.DeleteAsync(mapping);
        //            }

        //            // Insert new country mappings
        //            foreach (var countryId in input.Countries)
        //            {
        //                var linkCountryMapping = new Ass.Entities.LinkCountryMapping
        //                {
        //                    LinkId = existingLink.Id,
        //                    CountryId = countryId
        //                };

        //                await _linkCountryMappingRepository.InsertAsync(linkCountryMapping);
        //            }
        //        }

        //        // Return the updated LinkDto
        //        return MapToEntityDto(existingLink);
        //    }
        //    catch (AbpValidationException vex)
        //    {
        //        Logger.Error("Validation error: " + vex.Message);
        //        throw;
        //    }
        //    catch (Exception ex)
        //    {
        //        Logger.Error("An unexpected error occurred: " + ex.Message, ex);
        //        throw new AbpException("An error occurred while updating the link.", ex);
        //    }
        //}

        // Implement the UpdateAsync method
        public override async Task<LinkDto> UpdateAsync(LinkDto input)
        {
            try
            {
                // Validate the input
                if (input == null)
                {
                    throw new AbpValidationException("Input cannot be null.");
                }

                // Validate the link name
                if (string.IsNullOrWhiteSpace(input.LinkName))
                {
                    throw new AbpValidationException("Link name is required.");
                }

                // Retrieve the existing link
                var existingLink = await Repository.GetAllIncluding(l => l.Category)
                                                   .FirstOrDefaultAsync(l => l.Id == input.Id);

                if (existingLink == null)
                {
                    throw new EntityNotFoundException(typeof(Link), input.Id);
                }

                // Check for uniqueness of the link name (excluding the current link)
                var duplicateLink = await Repository.FirstOrDefaultAsync(l => l.LinkName == input.LinkName && l.Id != input.Id);
                if (duplicateLink != null)
                {
                    throw new AbpValidationException("Link name must be unique.");
                }

                // Update the Link entity's properties
                existingLink.LinkName = input.LinkName;
                existingLink.Url = input.Url;
                existingLink.IsActive = input.IsActive;
                existingLink.CategoryId = input.CategoryId;
                existingLink.Order = input.Order;
                existingLink.ImagePath = input.ImagePath;

                // Update the Link entity in the repository
                await Repository.UpdateAsync(existingLink);

                // Update the LinkCountryMapping entries
                if (input.Countries != null)
                {
                    // Fetch existing country mappings for the link
                    var existingMappings = await _linkCountryMappingRepository.GetAllListAsync(m => m.LinkId == existingLink.Id);

                    // Determine which mappings to remove
                    var mappingsToRemove = existingMappings.Where(m => !input.Countries.Contains(m.CountryId)).ToList();

                    foreach (var mapping in mappingsToRemove)
                    {
                        await _linkCountryMappingRepository.DeleteAsync(mapping);
                    }

                    // Determine which mappings to add
                    var existingCountryIds = existingMappings.Select(m => m.CountryId).ToList();
                    var countryIdsToAdd = input.Countries.Except(existingCountryIds).ToList();

                    foreach (var countryId in countryIdsToAdd)
                    {
                        // Optional: Validate the country ID exists
                        var countryExists = await _countryRepository.FirstOrDefaultAsync(c => c.Id == countryId);
                        if (countryExists == null)
                        {
                            throw new AbpValidationException($"Country with ID {countryId} does not exist.");
                        }

                        var newMapping = new Ass.Entities.LinkCountryMapping
                        {
                            LinkId = existingLink.Id,
                            CountryId = countryId
                        };

                        await _linkCountryMappingRepository.InsertAsync(newMapping);
                    }
                }

                // Optionally, fetch and assign CountryNames
                if (input.Countries != null && input.Countries.Any())
                {
                    var countryNames = await _countryRepository.GetAll()
                                                               .Where(c => input.Countries.Contains(c.Id))
                                                               .Select(c => c.CountryName)
                                                               .ToListAsync();
                    input.CountryNames = countryNames;
                }
                else
                {
                    input.CountryNames = new List<string>();
                }

                // Return the updated LinkDto
                return ObjectMapper.Map<LinkDto>(existingLink);
            }
            catch (AbpValidationException vex)
            {
                Logger.Error("Validation error: " + vex.Message);
                throw;
            }
            catch (EntityNotFoundException enfe)
            {
                Logger.Error("Entity not found: " + enfe.Message);
                throw;
            }
            catch (Exception ex)
            {
                Logger.Error("An unexpected error occurred: " + ex.Message, ex);
                throw new AbpException("An error occurred while updating the link.", ex);
            }
        }

    }
}
