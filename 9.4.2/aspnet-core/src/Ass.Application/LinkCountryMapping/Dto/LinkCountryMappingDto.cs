using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ass.LinkCountryMapping.Dto
{
    public class LinkCountryMappingDto : EntityDto<int>
    {
        public int LinkId { get; set; }
        public int CountryId { get; set; }
    }
}
