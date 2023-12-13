using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ObjectDefine;
using WebAdmin.Helper;

namespace WebAdmin.Components
{
    public class AdminMenuLeftViewComponent: ViewComponent
    {
        public async Task<IViewComponentResult> InvokeAsync()
        {
            long? role = HttpContext.GetUserRole();
            ViewBag.Role = role;
            return View();
        }
    }
}
