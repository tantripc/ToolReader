using EReaderWeb.Helper;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ObjectDefine;
using RepositoriesAPI;

namespace EReaderWeb.Components
{
    public class FooterViewComponent : ViewComponent
    {
        rep_topic rep_topic = new rep_topic(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        public async Task<IViewComponentResult> InvokeAsync()
        {
            string res = rep_topic.get(new topic
            {
                numofrow = 16,
                posstart = 1,
                iseffect = true,
                recursive = false,
            }, false);
            List<topic> list = new List<topic>();
            if (!string.IsNullOrEmpty(res))
            {
                list = JsonConvert.DeserializeObject<List<topic>>(res);
            }
            return View("~/Views/Common/Footer.cshtml", list);
        }
    }
}
