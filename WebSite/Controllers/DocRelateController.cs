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
    public class DocRelateController : Controller
    {
        private readonly IStringLocalizer<DocRelateController> _localizer;
        Rep_Docrelate RepDocrelate = new Rep_Docrelate(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        Rep_Doc repdocs = new Rep_Doc(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        public DocRelateController(IStringLocalizer<DocRelateController> localizer)
        {
            _localizer = localizer;
        }
        #region ActionResult

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
            breadcrumb.Add(new BreadcrumbObject(_localizer["sachlienquan"]));
            ViewBag.Breadcrumb = breadcrumb;
            ViewBag.docid = id;
            return View();
        }
        #endregion

        #region DocRelate_Get hàm này dùng để lấy dữ liệu để load lên popup sau khi nhấn thêm sách liên quan
        
        public IActionResult Addupdate(docrelate docrelates)
        {
            List<docrelate> data = new List<docrelate>();
            docrelates.getby = HttpContext.GetUserID();
            string res = RepDocrelate.DocRelate_Get(docrelates);
            if (!string.IsNullOrWhiteSpace(res)) data = JsonConvert.DeserializeObject<List<docrelate>>(res);
            ViewBag.docid = docrelates.docid;
            return View(data);
        }
        #endregion

        #endregion

        #region JsonResult 

        #region DocRelate_Add hàm này dùng để thêm sách liên quan 
        public JsonResult DocRelate_Add(docrelate docrelates, string? docids)
        {
            List<JsonDocInterst> objectstrings = new List<JsonDocInterst>();
            List<ReturnExecute> list = new List<ReturnExecute>();
            if (!string.IsNullOrWhiteSpace(docids)) objectstrings = JsonConvert.DeserializeObject<List<JsonDocInterst>>(docids);
            docrelates.createdby = HttpContext.GetUserID();
            for (var i = 0; i < objectstrings.Count; i++)
            {
                docrelates.docid = objectstrings[i].docid;
                string res = RepDocrelate.DocRelate_Add(docrelates);
                if (!string.IsNullOrWhiteSpace(res)) { ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res); list.Add(returnExecute); }
            };
            return Json(new { data = list });
        }
        #endregion

        #region DocRelate_Delete  hàm này dùng để xóa sách liên quan
        public JsonResult DocRelate_Delete(docrelate docrelate)
        {
            docrelate.deletedby = HttpContext.GetUserID();
            string res = RepDocrelate.DocRelate_Delete(docrelate);
            if (res == null) return Json(new { returncode = -1 });
            ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);
            return Json(new { returncode = returnExecute.returncode, id = returnExecute.id, returnmsg = returnExecute.returnmsg });

        }
        #endregion

        #region  DocRelate_Get hàm này dùng để lấy bảng để load lên
        public JsonResult DocRelate_Get(docrelate docrelates)
        {
            List<docrelate> data = new List<docrelate>();
            docrelates.getby = HttpContext.GetUserID();
            string res = RepDocrelate.DocRelate_Get(docrelates);
            if (!string.IsNullOrWhiteSpace(res)) data = JsonConvert.DeserializeObject<List<docrelate>>(res);
            return Json(new { data = data, total = data.Count > 0 ? data[0].total : 0 });
        }
        #endregion
        [HttpPost]
        public JsonResult addrelate_search(docrelate docrelates)
        {
            List<docrelate> data = new List<docrelate>();
            docrelates.createdby = HttpContext.GetUserID();
            docrelates.orgid = HttpContext.GetUserOrgID();
            string res= RepDocrelate.addrelate_search(docrelates);
            if (!string.IsNullOrWhiteSpace(res)) data = JsonConvert.DeserializeObject<List<docrelate>>(res);
            return Json(new { data = data, total = data.Count > 0 ? data[0].total : 0 });
        }

        #endregion
    }
}
