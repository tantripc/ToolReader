using Microsoft.AspNetCore.Mvc;
using WebAdmin.Models;

namespace WebAdmin.Components
{
    public class AdminBreadcrumbViewComponent : ViewComponent
    {
        public async Task<IViewComponentResult> InvokeAsync(ListBreadcrumb breadcrumb)
        {
            return View(breadcrumb);
        }
    }
}
