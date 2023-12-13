 using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using Newtonsoft.Json;
using ObjectDefine;
using RepositoriesAPI;
using WebAdmin.Helper;
using WebAdmin.Models;
using XAct;

namespace WebAdmin.Controllers
{
    public class RefMailTemplateController : Controller
    {
        private readonly IStringLocalizer<RefMailTemplateController> _localizer;
        rep_refmailtemplate reprefmailtemplate = new rep_refmailtemplate(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        public RefMailTemplateController(IStringLocalizer<RefMailTemplateController> localizer)
        {
            _localizer = localizer;
        }
        #region ActionResult

        #region Index

        public IActionResult Index()
        {
            ListBreadcrumb breadcrumb = new ListBreadcrumb();
            breadcrumb.Add(new BreadcrumbObject(_localizer["maumail"]));
            ViewBag.Breadcrumb = breadcrumb;
            return View();
        }
        #endregion
        #region Addupdate

        [HttpPost]
        public IActionResult Addupdate(refmailtemplate refmailtemplates)
        {
            List<refmailtemplate> data = new List<refmailtemplate>();
            if (refmailtemplates.mailtemplateid != null)
            {
                refmailtemplates.numofrow = 1;
                //data
                string res = reprefmailtemplate.refmailtemplate_search(refmailtemplates);
                if (!string.IsNullOrWhiteSpace(res)) data = JsonConvert.DeserializeObject<List<refmailtemplate>>(res);
                return View(data);
            }
            return View(data);
        }
        #endregion
        #region Addupdate
        [HttpPost]
        public IActionResult Previewmail(string? mailtemplatecontents,
            refmailtemplate refmailtemplates)
        {
            List<refmailtemplate> data = new List<refmailtemplate>();
            if (refmailtemplates.mailtemplateid != null)
            {
                refmailtemplates.numofrow = 1;
                //data
                string res = reprefmailtemplate.refmailtemplate_search(refmailtemplates);
                if (!string.IsNullOrWhiteSpace(res)) data = JsonConvert.DeserializeObject<List<refmailtemplate>>(res);
                ViewBag.content = mailtemplatecontents;
                return View(data);
            }
            ViewBag.content = mailtemplatecontents;
            return View(mailtemplatecontents);
        }
        #endregion
        [HttpPost]
        public JsonResult Addupdate_RefMailTemplate(refmailtemplate refmailtemplates)
        {
            refmailtemplates.getby = HttpContext.GetUserID();
            refmailtemplates.mailtemplatename = refmailtemplates.mailtemplatename.Replace(" ", "");
            string res = reprefmailtemplate.refmailtemplate_addupdate(refmailtemplates);
            ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);
            return Json(new { returncode = returnExecute.returncode, returnmsg = returnExecute.returnmsg });
        }
        #endregion

        #region Delete 
        public JsonResult Delete_RefMailTemplate(long? mailtemplateid)
        {
            long? getby = HttpContext.GetUserID();
            string res = reprefmailtemplate.refmailtemplate_delete(getby, mailtemplateid);
            if (res == null)
            {
                return Json(new { returncode = -1 });
            }
            //lưu mã lỗi 
            ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);
            return Json(new { returncode = returnExecute.returncode, id = returnExecute.id, returnmsg = returnExecute.returnmsg });
        }
        #endregion

        #region Get 
        public JsonResult Search_RefMailTemplate(refmailtemplate refmailtemplates)
        {
            List<refmailtemplate> data = new List<refmailtemplate>();
            //data
            string res = reprefmailtemplate.refmailtemplate_search(refmailtemplates);
            if (!string.IsNullOrWhiteSpace(res))
            {
                data = JsonConvert.DeserializeObject<List<refmailtemplate>>(res);
            }
            return Json(new { data = data, total = data.Count > 0 ? data[0].total : 0 });
        }
        #endregion
    }
}
