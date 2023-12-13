using DefineConstants;
using EReaderWeb.Helper;
using EReaderWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ObjectDefine;

namespace EReaderWeb.Components
{
    public class MetaViewComponent: ViewComponent
    {
        public async Task<IViewComponentResult> InvokeAsync(MetaObject metatag)
        {
            return View("~/Views/Common/Meta.cshtml", metatag);
        }
    }
}
