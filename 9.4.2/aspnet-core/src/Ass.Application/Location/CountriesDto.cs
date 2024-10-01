using Abp.AutoMapper;
using Ass.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ass.Location
{
    [AutoMapTo(typeof(Ass.LocatonEntities.Countries))]
    [AutoMapFrom(typeof(Ass.LocatonEntities.Countries))]
    public class CountriesDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}
