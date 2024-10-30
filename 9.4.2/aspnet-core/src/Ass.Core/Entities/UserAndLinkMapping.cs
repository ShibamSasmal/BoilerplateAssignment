using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Domain.Entities.Auditing;

namespace Ass.Entities
{
    public class UserAndLinkMapping : FullAuditedEntity<int>
    {
        [Required]
        public int CategoryId { get; set; }
        [Required]
        public long UserId { get; set; }
        [Required]
        public int LinkId { get; set; }
        [Required]
        public bool IsActive { get; set; }

        [ForeignKey("CategoryId")]
        public Category Category { get; set; }
        [ForeignKey("LinkId")]
        public Link link { get; set; }
        public int Order { get; set; }
    }
}
