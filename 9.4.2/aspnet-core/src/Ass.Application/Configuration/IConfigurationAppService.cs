using System.Threading.Tasks;
using Ass.Configuration.Dto;

namespace Ass.Configuration
{
    public interface IConfigurationAppService
    {
        Task ChangeUiTheme(ChangeUiThemeInput input);
    }
}
