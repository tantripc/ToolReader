using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using Newtonsoft.Json;
using ObjectDefine;
using RepositoriesAPI;
using WebAdmin.Helper;
using WebAdmin.Models;

namespace WebAdmin.Controllers
{
    public class DocReadRequiredInDocController : Controller
    {
        private readonly IStringLocalizer<DocReadRequiredInDocController> _localizer;
        Rep_DocReadRequire RepDocReadRequire = new Rep_DocReadRequire(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        rep_refmailtemplate reprefmailtemplate = new rep_refmailtemplate(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        Rep_Mail repmailtemplate = new Rep_Mail(WebConfigs.AppSettings.WebApiServiceSendMail, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        Rep_UserGroup RepUserGroup = new Rep_UserGroup(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        RepUser repuser = new RepUser(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        Rep_Doc repdocs = new Rep_Doc(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        public DocReadRequiredInDocController(IStringLocalizer<DocReadRequiredInDocController> localizer)
        {
            _localizer = localizer;
        }
        public IActionResult Index(long? id)
        {
            doc data = new doc();
            data.docid = id;
            data.getby = HttpContext.GetUserID();
            //data
            string res = repdocs.detail(data.docid, data.getby, true);
            if (!string.IsNullOrWhiteSpace(res)) data = JsonConvert.DeserializeObject<doc>(res);
            if (id == null)
            {
                return RedirectToAction("Index", "Doc");
            }
            if (HttpContext.GetUserRole() == 1301)
            {
                if (data.createdby != HttpContext.GetUserID())
                {
                    return RedirectToAction("Index", "Doc");
                }
            }
            ViewBag.docid = id;
            ListBreadcrumb breadcrumb = new ListBreadcrumb();
            breadcrumb.Add(new BreadcrumbObject(_localizer["phancongdocsach"]));
            ViewBag.Breadcrumb = breadcrumb;
            return View();
        }
    }
}
