using Abp.Authorization;
using Ass.Authorization.Roles;
using Ass.Authorization.Users;

namespace Ass.Authorization
{
    public class PermissionChecker : PermissionChecker<Role, User>
    {
        public PermissionChecker(UserManager userManager)
            : base(userManager)
        {
        }
    }
}
