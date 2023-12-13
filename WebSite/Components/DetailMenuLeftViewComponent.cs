using Microsoft.AspNetCore.Mvc;

namespace WebAdmin.Components
{
    public class DetailMenuLeftViewComponent : ViewComponent
    {
        public async Task<IViewComponentResult> InvokeAsync(long? id)
        {
            ViewBag.docid = id;
            return View();
        }
    }
}
