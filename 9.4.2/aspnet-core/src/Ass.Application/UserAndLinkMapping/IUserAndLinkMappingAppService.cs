using Abp.Application.Services.Dto;
using Abp.Application.Services;
using Ass.LinkCountryMapping.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ass.UserAndLinkMapping.Dto;

namespace Ass.UserAndLinkMapping
{
    public interface IUserAndLinkMappingAppService : IAsyncCrudAppService<UserAndLinkMappingDto, int, PagedAndSortedResultRequestDto, CreateUserAndLinkMappingDto, UserAndLinkMappingDto>
    {
    }
}
