using Abp.AspNetCore;
using Abp.AspNetCore.TestBase;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Ass.EntityFrameworkCore;
using Ass.Web.Startup;
using Microsoft.AspNetCore.Mvc.ApplicationParts;

namespace Ass.Web.Tests
{
    [DependsOn(
        typeof(AssWebMvcModule),
        typeof(AbpAspNetCoreTestBaseModule)
    )]
    public class AssWebTestModule : AbpModule
    {
        public AssWebTestModule(AssEntityFrameworkModule abpProjectNameEntityFrameworkModule)
        {
            abpProjectNameEntityFrameworkModule.SkipDbContextRegistration = true;
        } 
        
        public override void PreInitialize()
        {
            Configuration.UnitOfWork.IsTransactional = false; //EF Core InMemory DB does not support transactions.
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(AssWebTestModule).GetAssembly());
        }
        
        public override void PostInitialize()
        {
            IocManager.Resolve<ApplicationPartManager>()
                .AddApplicationPartsIfNotAddedBefore(typeof(AssWebMvcModule).Assembly);
        }
    }
}