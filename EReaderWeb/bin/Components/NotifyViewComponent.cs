using EReaderWeb.Helper;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ObjectDefine;
using RepositoriesAPI;
using System.ComponentModel;

namespace EReaderWeb.Components
{
    public class NotifyViewComponent : ViewComponent
    {
        rep_notify rep_notify = new rep_notify(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);

        public async Task<IViewComponentResult> InvokeAsync()
        {
            List<notifyrecv> list_notify = new List<notifyrecv>();
            long? UserID = HttpContext.GetUserID();
            string res_notify = rep_notify.search_enduser(new notifyrecv
            {
                numofrow = 7,
                posstart = 1,
                ishide = false,
                userid = UserID
            });
            if (!string.IsNullOrEmpty(res_notify))
            {
                list_notify = JsonConvert.DeserializeObject<List<notifyrecv>>(res_notify);
            }
            return View("~/Views/Common/Notify.cshtml", list_notify);
        }
    }
}
