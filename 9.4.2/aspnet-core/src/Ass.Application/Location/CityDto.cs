using Abp.AutoMapper;
using Ass.LocatonEntities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ass.Location
{
    [AutoMapTo(typeof(City))]
    [AutoMapFrom(typeof(City))]
    public class CityDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int StateId { get; set; }
    }
}
