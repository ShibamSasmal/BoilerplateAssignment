using Abp.AutoMapper;
using Ass.Authorization.Users;
using Ass.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ass.Countries.Dto
{
    [AutoMapTo(typeof(Country))]
    [AutoMapFrom(typeof(Country))]
    public class CreateCountryDto
    {
       
        public string CountryName { get; set; }
       
        public string CountryCode { get; set; }
        public bool IsActive { get; set; }
    }
}
