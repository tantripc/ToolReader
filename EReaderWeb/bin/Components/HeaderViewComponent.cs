using EReaderWeb.Helper;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ObjectDefine;
using RepositoriesAPI;

namespace EReaderWeb.Components
{
    public class HeaderViewComponent : ViewComponent
    {
        rep_topic rep_topic = new rep_topic(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        RepUser repUser = new RepUser(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        Rep_DocFavorite rep_DocFavorite = new Rep_DocFavorite(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        public async Task<IViewComponentResult> InvokeAsync()
        {
            long? UserID = HttpContext.GetUserID();
            users acc = new users();
            if (UserID > 0)
            {
                string result = repUser.getdetailaccount(UserID, null);
                if (!string.IsNullOrWhiteSpace(result))
                {
                    acc = JsonConvert.DeserializeObject<users>(result);
                }
            }

            #region Gọi api chủ đề
            string res_topic = rep_topic.get(new topic
            {
                numofrow = -1,
                posstart = 1,
                iseffect = true,
                recursive = false,
            }, false);
            List<topic> list_topic = new List<topic>();
            if (!string.IsNullOrEmpty(res_topic))
            {
                list_topic = JsonConvert.DeserializeObject<List<topic>>(res_topic);
            }
            #endregion
            #region Gọi api sach yeu thich
            string res_DocFavorite = rep_DocFavorite.docfavorite_get(new docfavorite
            {
                userid = UserID,
                numofrow = 1
            });
            List<docfavorite> list_docfavorite = new List<docfavorite>();
            if (!string.IsNullOrEmpty(res_DocFavorite))
            {
                list_docfavorite = JsonConvert.DeserializeObject<List<docfavorite>>(res_DocFavorite);
            }
            #endregion

            ViewBag.Topic = list_topic;
            ViewBag.docfavorite = list_docfavorite;
            return View("~/Views/Common/Header.cshtml", acc);
        }
    }
}
