using Abp.Application.Services;
using Abp.Domain.Repositories;
using Ass.LocatonEntities;
using AutoMapper.Internal.Mappers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ass.Location
{
    public class LocationAppService : ApplicationService, ILocationAppService
    {
        private readonly IRepository<LocatonEntities.Countries, int> _countryRepository;
        private readonly IRepository<State, int> _stateRepository;
        private readonly IRepository<City, int> _cityRepository;

        public LocationAppService(IRepository<LocatonEntities.Countries, int> countryRepository,
                                  IRepository<State, int> stateRepository,
                                  IRepository<City, int> cityRepository)
        {
            _countryRepository = countryRepository;
            _stateRepository = stateRepository;
            _cityRepository = cityRepository;
        }

        public async Task<List<CountriesDto>> GetAllCountriesAsync()
        {
            var countries = await _countryRepository.GetAllListAsync();
            return ObjectMapper.Map<List<CountriesDto>>(countries);
        }

        public async Task<List<StateDto>> GetStatesByCountryAsync(int countryId)
        {
            var states = await _stateRepository.GetAllListAsync(s => s.CountryId == countryId);
            return ObjectMapper.Map<List<StateDto>>(states);
        }

        public async Task<List<CityDto>> GetCitiesByStateAsync(int stateId)
        {
            var cities = await _cityRepository.GetAllListAsync(c => c.StateId == stateId);
            return ObjectMapper.Map<List<CityDto>>(cities);
        }
    }
}
