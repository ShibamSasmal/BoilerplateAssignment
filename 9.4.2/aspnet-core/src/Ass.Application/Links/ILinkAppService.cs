using Abp.Application.Services.Dto;
using Abp.Application.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ass.Links.Dto;

namespace Ass.Links
{
    public interface ILinkAppService : IAsyncCrudAppService<LinkDto, int, PagedAndSortedResultRequestDto, CreateLinkDto, LinkDto>
    {
        
    }
}
