using Abp.Application.Services.Dto;
using Abp.Application.Services;
using Abp.Domain.Repositories;
using Ass.Entities;
using System.Threading.Tasks;
using Ass.Countries.Dto;
using Abp.Runtime.Validation;
using Microsoft.EntityFrameworkCore;
using Abp.Domain.Entities;
using System.Linq;
using Abp.Authorization;
using Ass.Links.Dto;
using System.Collections.Generic;
using System;

namespace Ass.Countries
{
   
    public class CountryAppService : AsyncCrudAppService<Country, CountryDto, int, PagedAndSortedResultRequestDto, CreateCountryDto, CountryDto>, ICountryAppService
    {
        private readonly IRepository<Country, int> _countryRepository;
        private readonly IRepository<Ass.Entities.LinkCountryMapping, int> _countryMappingRepository;
        private readonly IRepository <Link, int> _linkMappingRepository;
        public CountryAppService(IRepository<Country, int> countryRepository, IRepository<Ass.Entities.LinkCountryMapping, int> linkRepository, IRepository<Link, int> linkMappingRepository) : base(countryRepository)
        {
            _countryRepository = countryRepository;
            _countryMappingRepository = linkRepository;
            _linkMappingRepository = linkMappingRepository;
        }


        protected override async Task<Country> GetEntityByIdAsync(int id)
        {
            // Use Repository.GetAllIncluding to include related entities such as Links
            var country = await _countryRepository.GetAllIncluding(c => c.Links)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (country == null)
            {
                throw new EntityNotFoundException(typeof(Country), id);
            }

            return country;
        }

        // Override GetAsync to fetch the country with related links
        public override async Task<CountryDto> GetAsync(EntityDto<int> input)
        {
            var country = await GetEntityByIdAsync(input.Id); // Fetch country with links

            // Map the entity to the DTO
            return new CountryDto
            {
                Id = country.Id,
                CountryName = country.CountryName,
                CountryCode = country.CountryCode,
                IsActive = country.IsActive,
                Links = country.Links?.Select(cl => cl.Url).ToList() // Map related links
            };
        }

       
        public override async Task<CountryDto> CreateAsync(CreateCountryDto input)
        {
            // Validate input data
            if (string.IsNullOrWhiteSpace(input.CountryName))
            {
                throw new AbpValidationException("Country name is required.");
            }

            if (string.IsNullOrWhiteSpace(input.CountryCode))
            {
                throw new AbpValidationException("Country code is required.");
            }

            // Check for uniqueness of CountryCode
            var existingCountry = await _countryRepository.FirstOrDefaultAsync(c => c.CountryCode == input.CountryCode);
            if (existingCountry != null)
            {
                throw new AbpValidationException("Country code must be unique.");
            }

            // Create the new country entity
            var country = ObjectMapper.Map<Country>(input);
            await _countryRepository.InsertAsync(country);

            // Return the DTO of the created country
            return MapToEntityDto(country);
        }

        public async Task<List<LinkDto>> GetAllLinksByCountryId(int countryId)
        {
            try
            {
                // Fetch the country mappings associated with the given country ID
                var countryMappings = await _countryMappingRepository.GetAll()
                    .Where(mapping => mapping.CountryId == countryId)
                    .ToListAsync();

                // Extract all LinkIds to fetch links in a single query
                var linkIds = countryMappings.Select(mapping => mapping.LinkId).Distinct().ToList();

                // Fetch all links for the extracted LinkIds
                var links = await _linkMappingRepository.GetAll()
                    .Where(link => linkIds.Contains(link.Id))
                    .ToListAsync();

                // Map links to DTOs
                List<LinkDto> linkDtos = new List<LinkDto>();
                foreach (var link in links)
                {
                    linkDtos.Add(new LinkDto
                    {
                        Id = link.Id,
                        LinkName = link.LinkName,
                        Url = link.Url
                    });
                }

                return linkDtos;
            }
            catch (Exception ex)
            {
                // Log the exception (implement your logging framework here)
                // e.g., _logger.LogError(ex, "An error occurred while fetching links for country ID {countryId}", countryId);
                throw new Exception("An error occurred while fetching links.", ex);
            }
        }


        //public async Task<List<LinkDto>> GetAllLinksByCountryId(int countryId)
        //{
        //    try
        //    {

        //        // Fetch the country from the repository
        //        var countries = await _countryMappingRepository.GetAll()
        //                                   .Where(c => c.CountryId == countryId).ToListAsync();
        //        List<LinkDto> links = new List<LinkDto>();
        //        foreach (var country in countries)
        //        {
        //            var link = await _linkMappingRepository.GetAll().FirstOrDefaultAsync(c => c.Id == country.LinkId);

        //            if(link != null)
        //            {

        //                var linkDto = new LinkDto()
        //                {
        //                    Id = link.Id,
        //                    LinkName = link.LinkName,

        //                };
        //                links.Add(linkDto);
        //            }
        //        }

        //        return links;
        //    }
        //    catch (Exception ex)
        //    {
        //        // Log the exception (implement your logging framework here)
        //        // e.g., _logger.LogError(ex, "An error occurred while fetching links for country ID {countryId}", countryId);
        //        throw new Exception("An error occurred while fetching links.", ex);
        //    }

        //}





    }
}
