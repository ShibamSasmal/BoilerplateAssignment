using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ass.Entities
{
    public class Link : FullAuditedEntity<int>
    {
        public string LinkName { get; set; }
        public string ImagePath { get; set; }
        public string Url { get; set; }
        public bool IsActive { get; set; }
        public int Order { get; set; }

        // Foreign Key
        public int CategoryId { get; set; }
        public virtual Category Category { get; set; }
    }
}
