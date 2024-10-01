using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Ass.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ass.Categories.Dto
{
    [AutoMapTo(typeof(Category))]
    [AutoMapFrom(typeof(Category))]
    public class CategoryDto : EntityDto<int>
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
    }
}
