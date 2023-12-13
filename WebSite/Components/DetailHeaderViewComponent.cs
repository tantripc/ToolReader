using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ObjectDefine;
using RepositoriesAPI;
using WebAdmin.Helper;

namespace WebAdmin.Components
{
    public class DetailHeaderViewComponent : ViewComponent
    {
        Rep_Doc repdocs = new Rep_Doc(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        RepUser repuser = new RepUser(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        public async Task<IViewComponentResult> InvokeAsync(long? id)
        {
            long? UserID = HttpContext.GetUserID();
            users acc = new users();
            if (UserID > 0)
            {
                string result = repuser.getdetailaccount(UserID,null);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    acc = JsonConvert.DeserializeObject<users>(result);
                }
            }
            doc doces = new doc();
            List<doc> data = new List<doc>();
            doces.getby = HttpContext.GetUserID();
            doces.docid = id;
            doces.numofrow = -1;
            string res = repdocs.search_foradmin(doces);
            if (!string.IsNullOrWhiteSpace(res))
            { 
                data = JsonConvert.DeserializeObject<List<doc>>(res);
                if (data.Count > 0)
                {
                    doces = data[0];
                }
            }
            ViewBag.Doc = doces;
            return View(acc);
        }
    }
}
