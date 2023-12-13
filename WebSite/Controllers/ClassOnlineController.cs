using Microsoft.AspNetCore.Mvc;

namespace WebAdmin.Controllers
{
    public class ClassOnlineController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
