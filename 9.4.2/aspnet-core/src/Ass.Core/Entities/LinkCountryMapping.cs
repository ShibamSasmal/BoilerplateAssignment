using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ass.Entities
{
    public class LinkCountryMapping : FullAuditedEntity<int>
    {
        public int LinkId { get; set; }

        public int CountryId { get; set; }
    }
}
