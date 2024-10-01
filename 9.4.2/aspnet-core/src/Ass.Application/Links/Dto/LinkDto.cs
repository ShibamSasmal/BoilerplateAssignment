using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Ass.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ass.Links.Dto
{
    public class LinkDto : EntityDto<int>
    {
        
        public string LinkName { get; set; }
        public string ImagePath { get; set; }
        public string Url { get; set; }
        public bool IsActive { get; set; }
        public int Order { get; set; }
        public int CategoryId { get; set; } // Foreign key
        public string CategoryName { get; set; } // For displaying the category name

        public List<int> Countries { get; set; }
        public List<string> CountryNames { get; set; }
    }
}
