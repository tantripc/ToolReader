using DefineConstants;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using Newtonsoft.Json;
using ObjectDefine;
using WebAdmin.Helper;
using WebAdmin.Models;
using RepositoriesAPI;

namespace WebAdmin.Controllers
{

    [AuthenticateFilter]
    public class HomeController : Controller
    {
        private readonly IStringLocalizer<HomeController> _localizer;
        Rep_General rep_General = new Rep_General(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        public HomeController(IStringLocalizer<HomeController> localizer)
        {
            _localizer = localizer;
        }
        public IActionResult Index()
        {

            return RedirectToAction("Index","Doc");
        }
        public IActionResult Error404()
        {
            return View();
        }
        public IActionResult NoPermission()
        {
            return View();
        }
        public IActionResult NoBook()
        {
            return View();
        }
        [HttpGet]
        public async Task<IActionResult> ExportFileTemplate(string fileTemplateName)
        {
            var res = rep_General.getfiletemplate(fileTemplateName);
            if (res != null)
            {
                Stream response = await res.Content.ReadAsStreamAsync();
                return File(response, res.Content.Headers.ContentType.ToString(), fileTemplateName);
            }
            else
            {
                return RedirectToAction("Error404", "Home");
            }
        }
        
    }
}
