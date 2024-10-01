using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ass.LocatonEntities
{
   
    public class City : Entity<int>
    {
        public string Name { get; set; }
        public int StateId { get; set; }
        public virtual State State { get; set; }
    }
}
