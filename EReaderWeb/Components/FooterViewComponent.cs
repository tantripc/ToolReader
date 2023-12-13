using EReaderWeb.Helper;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ObjectDefine;
using RepositoriesAPI;

namespace EReaderWeb.Components
{
    public class FooterViewComponent : ViewComponent
    {
        public async Task<IViewComponentResult> InvokeAsync()
        {
            return View("~/Views/Common/Footer.cshtml");
        }
    }
}
