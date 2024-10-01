using Abp.Application.Services.Dto;
using Abp.Application.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ass.Countries.Dto;

namespace Ass.Countries
{
    public interface ICountryAppService : IAsyncCrudAppService<CountryDto, int, PagedAndSortedResultRequestDto, CreateCountryDto, CountryDto>
    {
    }
}
