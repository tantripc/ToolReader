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
    public class CopyRightController : Controller
    {
        #region Interface
        private readonly IStringLocalizer<CopyRightController> _localizer;
        Rep_CopyRight repcopyright = new Rep_CopyRight(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        public CopyRightController(IStringLocalizer<CopyRightController> localizer)
        {
            _localizer = localizer;
        }
        #endregion

        #region Trang index của tác quyền
        public IActionResult Index()
        {
            ListBreadcrumb breadcrumb = new ListBreadcrumb();
            breadcrumb.Add(new BreadcrumbObject(_localizer["tacquyen"]));
            ViewBag.Breadcrumb = breadcrumb;
            return View();
        }
        #endregion

        #region Thêm / sửa thông tin tác quyền (View)

        [HttpPost]
        public IActionResult Addupdate(long? id)
        {
            List<copyright> data = new List<copyright>();
            
            if (id != null)
            {
                copyright copyrights = new copyright();
                copyrights.cprid = id;
                bool? foredit = true;
                copyrights.numofrow = 1;
                copyrights.getby = HttpContext.GetUserID();
                //data
                string res = repcopyright.copyright_search(copyrights, foredit);
                if (!string.IsNullOrWhiteSpace(res)) data = JsonConvert.DeserializeObject<List<copyright>>(res);
                return View(data);
            }
            return View(data);
        }
        #endregion

        #region  Thêm / sửa thông tin tác quyền (Function)
        [HttpPost]
        public JsonResult Addupdate_api(copyright copyrights)
        {
            copyrights.createdby = HttpContext.GetUserID();
            string res = repcopyright.copyright_addupdate(copyrights);
            if (string.IsNullOrEmpty(res)) Json(new { returncode = -1 });
            ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);
            return Json(new { returncode = returnExecute.returncode, returnmsg = returnExecute.returnmsg });
        }
        #endregion

        #region Xóa tác quyền
        [HttpPost]
        public JsonResult CopyRight_Delete(copyright copyrights)
        {
            copyrights.getby = HttpContext.GetUserID();
            string res = repcopyright.copyright_delete(copyrights);
            if (string.IsNullOrEmpty(res)) Json(new { returncode = -1 });
            //lưu mã lỗi 
            ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);
            return Json(new { returncode = returnExecute.returncode, id = returnExecute.id, returnmsg = returnExecute.returnmsg });
        }
        #endregion

        #region Danh sách tác quyền
        public JsonResult Search(copyright copyrights)
        {
            List<copyright> data = new List<copyright>();
            bool? foredit = true;
            copyrights.getby = HttpContext.GetUserID();
            //data
            string res = repcopyright.copyright_search(copyrights, foredit);
            if (!string.IsNullOrWhiteSpace(res)) data = JsonConvert.DeserializeObject<List<copyright>>(res);
            return Json(new { data = data, total = data.Count > 0 ? data[0].total : 0 });
        }
        #endregion
    }
}
