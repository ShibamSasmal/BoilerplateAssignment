using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Runtime.Session;
using Ass.Configuration.Dto;

namespace Ass.Configuration
{
    [AbpAuthorize]
    public class ConfigurationAppService : AssAppServiceBase, IConfigurationAppService
    {
        public async Task ChangeUiTheme(ChangeUiThemeInput input)
        {
            await SettingManager.ChangeSettingForUserAsync(AbpSession.ToUserIdentifier(), AppSettingNames.UiTheme, input.Theme);
        }
    }
}
