using EReaderWeb.Helper;
using EReaderWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ObjectDefine;
using RepositoriesAPI;

namespace EReaderWeb.Components
{
    public class RateViewComponent: ViewComponent
    {
        public async Task<IViewComponentResult> InvokeAsync(data_rate data_rate)
        {
            return View("~/Views/Common/StarRate.cshtml",data_rate);
        }
    }
}
