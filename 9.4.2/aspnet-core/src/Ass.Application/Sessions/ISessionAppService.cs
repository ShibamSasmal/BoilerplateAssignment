using System.Threading.Tasks;
using Abp.Application.Services;
using Ass.Sessions.Dto;

namespace Ass.Sessions
{
    public interface ISessionAppService : IApplicationService
    {
        Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations();
    }
}
