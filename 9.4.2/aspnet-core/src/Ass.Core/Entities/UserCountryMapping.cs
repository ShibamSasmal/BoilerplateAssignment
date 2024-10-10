using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using Ass.Authorization.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ass.Entities
{
    public class UserCountryMapping : FullAuditedEntity<int>
    {
        public long UserId { get; set; }
        public int CountryId { get; set; }

        public User User { get; set; }
        public Country Country { get; set; }
    }
}
