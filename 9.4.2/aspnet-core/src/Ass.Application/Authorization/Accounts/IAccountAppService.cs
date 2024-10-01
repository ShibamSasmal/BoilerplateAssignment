using System.Threading.Tasks;
using Abp.Application.Services;
using Ass.Authorization.Accounts.Dto;

namespace Ass.Authorization.Accounts
{
    public interface IAccountAppService : IApplicationService
    {
        Task<IsTenantAvailableOutput> IsTenantAvailable(IsTenantAvailableInput input);

        Task<RegisterOutput> Register(RegisterInput input);
    }
}
