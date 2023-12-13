using EReaderWeb.Helper;
using EReaderWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ObjectDefine;

namespace EReaderWeb.Components
{
    public class BreadcrumbViewComponent: ViewComponent
    {
        public async Task<IViewComponentResult> InvokeAsync(ListBreadcrumb breadcrumb)
        {
            return View("~/Views/Common/Breadcrumb.cshtml",breadcrumb);
        }
    }
}
