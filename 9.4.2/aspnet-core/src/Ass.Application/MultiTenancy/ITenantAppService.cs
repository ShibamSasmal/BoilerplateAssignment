using Abp.Application.Services;
using Ass.MultiTenancy.Dto;

namespace Ass.MultiTenancy
{
    public interface ITenantAppService : IAsyncCrudAppService<TenantDto, int, PagedTenantResultRequestDto, CreateTenantDto, TenantDto>
    {
    }
}

