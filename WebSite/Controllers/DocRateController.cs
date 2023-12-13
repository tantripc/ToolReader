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
    public class DocRateController : Controller
    {
        #region Interface
        private readonly IStringLocalizer<DocRateController> _localizer;
        Rep_DocRate RepDocRate = new Rep_DocRate(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        Rep_Doc repdocs = new Rep_Doc(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        public DocRateController(IStringLocalizer<DocRateController> localizer)
        {
            _localizer = localizer;
        }
        #endregion

        #region Index

        public IActionResult Index(long? id)
        {
            doc data = new doc();
            data.docid = id;
            data.getby = HttpContext.GetUserID();
            //data
            string res = repdocs.detail(data.docid, data.getby, true);
            if (!string.IsNullOrWhiteSpace(res)) data = JsonConvert.DeserializeObject<doc>(res);
            if (HttpContext.GetUserRole() == 1301)
            {
                if (data.createdby != HttpContext.GetUserID())
                {
                    return RedirectToAction("Index", "Doc");
                }
            }
            if (id == null)
            {
                return RedirectToAction("Index", "Doc");
            }
            ListBreadcrumb breadcrumb = new ListBreadcrumb();
            breadcrumb.Add(new BreadcrumbObject(_localizer["danhgia"]));
            ViewBag.Breadcrumb = breadcrumb;
            ViewBag.docid = id;
            return View();
        }
        #endregion

        #region Thêm / Sửa đánh giá sách (View)

        public IActionResult Addupdate(docrate docrate)
        {
            List<docrelate> data = new List<docrelate>();
            docrate.getby = HttpContext.GetUserID();
            string res = RepDocRate.get(docrate);
            if (!string.IsNullOrWhiteSpace(res)) data = JsonConvert.DeserializeObject<List<docrelate>>(res);
            return View(data);
        }
        #endregion

        #region Thêm / Sửa đánh giá sách (Function)
        public JsonResult DocRelate_Add(docrate docrate)
        {
            List<JsonDocInterst> objectstrings = new List<JsonDocInterst>();
            docrate.createdby = HttpContext.GetUserID();
            for (var i = 0; i < objectstrings.Count; i++)
            {
                docrate.docid = objectstrings[i].docid;
                string res = RepDocRate.add(docrate);
           
            };
            return Json(new {  });
        }
        #endregion

        #region Xóa đánh giá sách
        public JsonResult DocRate_Delete(long? docrateid, long? deletedby)
        {
            deletedby = HttpContext.GetUserID();
            string res = RepDocRate.delete(docrateid, deletedby);
            if (string.IsNullOrEmpty(res)) return Json(new { returncode = -1 });
            ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);
                return Json(new { returncode = returnExecute.returncode, id = returnExecute.id, returnmsg = returnExecute.returnmsg });

        }
        #endregion

        #region  Danh sách đánh giá sách
        public JsonResult DocRelate_Get(docrate docrate)
        {
            List<docrate> data = new List<docrate>();
            docrate.getby = HttpContext.GetUserID();
            string res = RepDocRate.get(docrate);
            if (!string.IsNullOrWhiteSpace(res)) data = JsonConvert.DeserializeObject<List<docrate>>(res);
            return Json(new { data = data, total = data.Count > 0 ? data[0].total : 0 });
        }
        #endregion

    }
}
