using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ass.LinkCountryMapping.Dto
{
    [AutoMapTo(typeof(Ass.Entities.LinkCountryMapping))]
    [AutoMapFrom(typeof(Ass.Entities.LinkCountryMapping))]
    public class LinkCountryMappingDto : EntityDto<int>
    {
        public int LinkId { get; set; }
        public int CountryId { get; set; }
    }
}
