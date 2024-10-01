using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ass.Links.Dto
{
    public class GetLinksByCountryInput : PagedAndSortedResultRequestDto
    {
        public int CountryId { get; set; }
    }
}
