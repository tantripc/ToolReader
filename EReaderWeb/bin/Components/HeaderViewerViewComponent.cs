using EReaderWeb.Helper;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ObjectDefine;
using RepositoriesAPI;

namespace EReaderWeb.Components
{
    public class HeaderViewerViewComponent: ViewComponent
    {
        
        RepUser repUser = new RepUser(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        Rep_DocAttach rep_DocAttach = new Rep_DocAttach(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        public async Task<IViewComponentResult> InvokeAsync(long? id)
        {
            long? UserID = HttpContext.GetUserID();
            users acc = new users();
            if (UserID > 0)
            {
                string result = repUser.getdetailaccount(UserID,null);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    acc = JsonConvert.DeserializeObject<users>(result);
                }               
            }
            string res_attach = rep_DocAttach.DocAttach_Get(null,UserID,id);
            docattach docattach = new docattach();
            if (!string.IsNullOrEmpty(res_attach))
            {
                List<docattach> list_attach=JsonConvert.DeserializeObject<List<docattach>>(res_attach);
                if(list_attach!=null && list_attach.Count > 0)
                {
                    docattach=list_attach[0];
                }
            }
            ViewBag.Attach=docattach;
            return View("~/Views/Common/HeaderViewer.cshtml",acc);
        }
    }
}
