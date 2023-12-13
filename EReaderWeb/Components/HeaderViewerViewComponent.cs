using EReaderWeb.Helper;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ObjectDefine;
using RepositoriesAPI;

namespace EReaderWeb.Components
{
    public class HeaderViewerViewComponent : ViewComponent
    {
        Rep_Library Rep_Librarys = new Rep_Library(WebConfigs.AppSettings.WebApiServiceLibrary, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);

        public async Task<IViewComponentResult> InvokeAsync()
        {
            return View("~/Views/Common/HeaderViewer.cshtml");
        }
    }
}
