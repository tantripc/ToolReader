using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using Newtonsoft.Json;
using ObjectDefine;
using RepositoriesAPI;
using WebAdmin.Helper;
using WebAdmin.Models;

namespace WebAdmin.Controllers
{
    [AuthenticateFilter]
    public class TopicController : Controller
    {
        private readonly IStringLocalizer<TopicController> _localizer;
        rep_topic reptopic = new rep_topic(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);

        RepOrg repOrg = new RepOrg(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        public TopicController(IStringLocalizer<TopicController> localizer)
        {
            _localizer = localizer;
        }
        #region ActionResult

        #region Index

        public IActionResult Index()
        {
            ListBreadcrumb breadcrumb = new ListBreadcrumb();
            breadcrumb.Add(new BreadcrumbObject(_localizer["donvi"]));
            ViewBag.Breadcrumb = breadcrumb;

            //danh sách đơn vị
            organization organization = new organization();
            organization.getby = HttpContext.GetUserID();
            organization.posstart = 1;
            organization.numofrow = -1;
            organization.recursive = true;
            organization.porgid = null;
            organization.orgid = HttpContext.GetUserRole() == 1301 ? HttpContext.GetUserOrgID() : null;
            string res = repOrg.get(organization);
            if (res == null)
            {   
                return View();
            }
            List<organization> organizations = JsonConvert.DeserializeObject<List<organization>>(res);

            if(HttpContext.GetUserRole() == 1301)
            {
                return RedirectToAction("Topic", organizations[0]);
            }
            return View(organizations);
        }

        #endregion

        #region Addupdate

        [HttpPost]
        public IActionResult Addupdate(topic topics)
        {

            topic data = new topic();
            if (topics.topicid != null)
            {
                bool? foredit = true;
                topics.getby = HttpContext.GetUserID();
                //data
                var res = reptopic.Topic_Detail(topics, foredit);
                if (!string.IsNullOrWhiteSpace(res)) data = JsonConvert.DeserializeObject<topic>(res);
                return View(data);
            }
            return View(data);
        }
        #endregion

        #endregion
        public IActionResult Topic(organization organizations)
        {
            ListBreadcrumb breadcrumb = new ListBreadcrumb();
breadcrumb.Add(new BreadcrumbObject(_localizer["donvi"], Url.Action("Index", "Topic")));
            breadcrumb.Add(new BreadcrumbObject(organizations.orgname));
            breadcrumb.Add(new BreadcrumbObject(_localizer["danhmucsach"]));
            ViewBag.Breadcrumb = breadcrumb;
            ViewBag.orgid = organizations.orgid;
            ViewBag.partner = HttpContext.GetUserRole();
            return View();
        }

        #region JsonResult 

        #region AddUpdate
        public JsonResult addupdatetopic(topic topics)
        {
            topics.createdby = HttpContext.GetUserID();
            topics.orgid = HttpContext.GetUserRole() == 1301 ? HttpContext.GetUserOrgID():null;
            string res = reptopic.addupdate(topics);
            ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);
            return Json(new { returncode = returnExecute.returncode, returnmsg = returnExecute.returnmsg });
        }
        #endregion

        #region Delete 
        public JsonResult deletetopic(string? topicid)
        {
            string deletedby = HttpContext.GetUserID().ToString();
            var res = reptopic.delete(topicid, deletedby);
            if (res == null) return Json(new { returncode = -1 });
            //lưu mã lỗi 
            ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);
            return Json(new { returncode = returnExecute.returncode, id = returnExecute.id, returnmsg = returnExecute.returnmsg });

        }
        #endregion

        #region Get 
        public JsonResult gettopic(topic topics)
        {
            List<topic> data = new List<topic>();
            bool? foredit = true;
            //topics.orgid = HttpContext.GetUserRole() == 1301 ? HttpContext.GetUserOrgID() : null;
            //data
            string res = reptopic.get(topics, foredit);
            if (!string.IsNullOrWhiteSpace(res)) data = JsonConvert.DeserializeObject<List<topic>>(res);
            return Json(new { data = data, total = data.Count > 0 ? data[0].total : 0 });
        }
        #endregion

        #endregion
    }
}
