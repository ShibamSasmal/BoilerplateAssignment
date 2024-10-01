using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ass.LocatonEntities
{
    public class Countries : Entity<int>
    {
        public string Name { get; set; }
        public virtual ICollection<State> States { get; set; }
    }
}
