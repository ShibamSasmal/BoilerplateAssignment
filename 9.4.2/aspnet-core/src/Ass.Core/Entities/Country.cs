using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ass.Entities
{
    public class Country : FullAuditedEntity<int>
    {
        
        public string CountryName { get; set; }
        
        public string CountryCode { get; set; }
        public bool IsActive { get; set; }
        public ICollection<Link> Links { get; set; }

    }
}
