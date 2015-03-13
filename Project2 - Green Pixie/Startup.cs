using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Project2___Green_Pixie.Startup))]
namespace Project2___Green_Pixie
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
