using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ass.Location
{
    public interface ILocationAppService
    {
        Task<List<CountriesDto>> GetAllCountriesAsync();
        Task<List<StateDto>> GetStatesByCountryAsync(int countryId);
        Task<List<CityDto>> GetCitiesByStateAsync(int stateId);
    }
}
