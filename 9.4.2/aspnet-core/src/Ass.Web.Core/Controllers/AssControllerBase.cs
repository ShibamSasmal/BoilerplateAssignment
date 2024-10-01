using Abp.AspNetCore.Mvc.Controllers;
using Abp.IdentityFramework;
using Microsoft.AspNetCore.Identity;

namespace Ass.Controllers
{
    public abstract class AssControllerBase: AbpController
    {
        protected AssControllerBase()
        {
            LocalizationSourceName = AssConsts.LocalizationSourceName;
        }

        protected void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }
    }
}
