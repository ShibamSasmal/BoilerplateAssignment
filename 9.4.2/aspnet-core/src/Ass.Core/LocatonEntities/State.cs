using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ass.LocatonEntities
{
    public class State : Entity<int>
    {
        public string Name { get; set; }
        public int CountryId { get; set; }
        public virtual Countries Country { get; set; }
        public virtual ICollection<City> Cities { get; set; }
    }
}
