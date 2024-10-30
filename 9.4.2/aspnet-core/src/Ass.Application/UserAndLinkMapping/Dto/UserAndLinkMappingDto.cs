using Ass.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;

namespace Ass.UserAndLinkMapping.Dto
{
    [AutoMapTo(typeof(Ass.Entities.UserAndLinkMapping))]
    [AutoMapFrom(typeof(Ass.Entities.UserAndLinkMapping))]
    public class UserAndLinkMappingDto : EntityDto<int>
    {
        [Required]
        public int CategoryId { get; set; }

        [Required]
        public long UserId { get; set; }

        [Required]
        public int LinkId { get; set; }

        [Required]
        public bool IsActive { get; set; }

        public string CategoryName { get; set; }  
        public string LinkName { get; set; }      
        public string LinkUrl { get; set; }

        public string ImageUrl { get; set; }

        public int Order { get; set; }

        // Removed navigation properties
        // public Category linkCategory { get; set; }
        // public Link link { get; set; }
    }
}
