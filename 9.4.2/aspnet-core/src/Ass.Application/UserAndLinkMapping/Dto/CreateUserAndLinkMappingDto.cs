﻿using Ass.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.AutoMapper;

namespace Ass.UserAndLinkMapping.Dto
{
    [AutoMapTo(typeof(Ass.Entities.UserAndLinkMapping))]
    [AutoMapFrom(typeof(Ass.Entities.UserAndLinkMapping))]
    public class CreateUserAndLinkMappingDto
    {
        [Required]
        public int CategoryId { get; set; }

        [Required]
        public long UserId { get; set; }

        [Required]
        public int LinkId { get; set; }

        [Required]
        public bool IsActive { get; set; }

        // Removed navigation properties
        // public Category linkCategory { get; set; }
        // public Link link { get; set; }
    }
}
