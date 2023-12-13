using EReaderWeb.Helper;
using EReaderWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ObjectDefine;
using RepositoriesAPI;

namespace EReaderWeb.Components
{
    public class CatgViewComponent: ViewComponent
    {
        rep_category rep_category = new rep_category(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        public async Task<IViewComponentResult> InvokeAsync()
        {
            List<category> categoryList = new List<category>();
            string res = rep_category.get(new category
            {
                posstart = 1,
                numofrow = 20,
                iseffect=true
            }, false);
            if (!string.IsNullOrEmpty(res))
            {
                categoryList= JsonConvert.DeserializeObject<List<category>>(res);
            }
            return View("~/Views/Common/Catg.cshtml",categoryList);
        }
    }
}
