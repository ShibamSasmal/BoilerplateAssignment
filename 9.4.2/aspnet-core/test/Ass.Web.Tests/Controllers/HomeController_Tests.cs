using System.Threading.Tasks;
using Ass.Models.TokenAuth;
using Ass.Web.Controllers;
using Shouldly;
using Xunit;

namespace Ass.Web.Tests.Controllers
{
    public class HomeController_Tests: AssWebTestBase
    {
        [Fact]
        public async Task Index_Test()
        {
            await AuthenticateAsync(null, new AuthenticateModel
            {
                UserNameOrEmailAddress = "admin",
                Password = "123qwe"
            });

            //Act
            var response = await GetResponseAsStringAsync(
                GetUrl<HomeController>(nameof(HomeController.Index))
            );

            //Assert
            response.ShouldNotBeNullOrEmpty();
        }
    }
}