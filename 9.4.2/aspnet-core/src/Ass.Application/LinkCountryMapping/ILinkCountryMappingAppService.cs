using Abp.Application.Services.Dto;
using Abp.Application.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ass.LinkCountryMapping.Dto;
using Ass.Links.Dto;

namespace Ass.LinkCountryMapping
{
    public interface ILinkCountryMappingAppService : IAsyncCrudAppService<LinkCountryMappingDto, int, PagedAndSortedResultRequestDto, CreateLinkCountryMappingDto, LinkCountryMappingDto>
    {
        
    }
}
