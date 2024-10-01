using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Ass.Authorization;
using Ass.Entities;
using Ass.Links.Dto;

namespace Ass
{
    [DependsOn(
        typeof(AssCoreModule), 
        typeof(AbpAutoMapperModule))]
    public class AssApplicationModule : AbpModule
    {
        public override void PreInitialize()
        {
            Configuration.Authorization.Providers.Add<AssAuthorizationProvider>();
            Configuration.Modules.AbpAutoMapper().Configurators.Add(cfg =>
            {
                // Manually configure the mappings
                cfg.CreateMap<CreateLinkDto, Link>();
                cfg.CreateMap<Link, LinkDto>();
            });
        }

        public override void Initialize()
        {
            var thisAssembly = typeof(AssApplicationModule).GetAssembly();

            IocManager.RegisterAssemblyByConvention(thisAssembly);

            Configuration.Modules.AbpAutoMapper().Configurators.Add(
                // Scan the assembly for classes which inherit from AutoMapper.Profile
                cfg => cfg.AddMaps(thisAssembly)
            );
        }
    }
}
