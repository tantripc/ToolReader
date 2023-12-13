using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ObjectDefine;
using WebAdmin.Helper;

namespace WebAdmin.Components
{
    public class AdminHeaderViewComponent: ViewComponent
    {
        public async Task<IViewComponentResult> InvokeAsync()
        {
            long? UserID = HttpContext.GetUserID();
            users acc = new users();
            if (UserID > 0)
            {
                string result = new RepositoriesAPI.RepUser(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret).getdetailaccount(UserID,null);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    acc = JsonConvert.DeserializeObject<users>(result);
                }               
            }
            return View(acc);
        }
    }
}
