using Abp.Application.Services.Dto;
using Abp.Application.Services;
using Abp.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ass.LinkCountryMapping.Dto;

namespace Ass.LinkCountryMapping
{
    public class LinkCountryMappingAppService : AsyncCrudAppService<Ass.Entities.LinkCountryMapping, LinkCountryMappingDto, int, PagedAndSortedResultRequestDto, CreateLinkCountryMappingDto, LinkCountryMappingDto>, ILinkCountryMappingAppService
    {
        public LinkCountryMappingAppService(IRepository<Ass.Entities.LinkCountryMapping, int> repository) : base(repository)
        {
        }
    }
}
