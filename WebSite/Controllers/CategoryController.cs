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
    public class CategoryController : Controller
    {
        #region Interface
        private readonly IStringLocalizer<CategoryController> _localizer;
        rep_category repcategory = new rep_category(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        public CategoryController(IStringLocalizer<CategoryController> localizer)
        {
            _localizer = localizer;
        }
        #endregion

        #region Trang index của thể loại sách

        public IActionResult Index()
        {
            ListBreadcrumb breadcrumb = new ListBreadcrumb();
            breadcrumb.Add(new BreadcrumbObject(_localizer["theloai"]));
            ViewBag.Breadcrumb = breadcrumb;
            return View();
        }
        #endregion

        #region Thêm / Sửa thông tin của thể loại sách (View)

        [HttpPost]
        public IActionResult Addupdate(category categorys)
        {
            List<category> data = new List<category>();
            if (categorys.catgid != null)
            {
                bool? foredit = true;
                categorys.numofrow = 1;
                //data
                string res = repcategory.get(categorys, foredit);
                if (!string.IsNullOrWhiteSpace(res)) data = JsonConvert.DeserializeObject<List<category>>(res);
                return View(data);
            }
            return View(data);
        }
        #endregion

        #region Thêm / Sửa thông tin của thể loại sách (Function)
        public JsonResult addupdatecategory(category categorys)
        {
            categorys.createdby = HttpContext.GetUserID();
            string res = repcategory.addupdate(categorys);
            ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);
            return Json(new { returncode = returnExecute.returncode, returnmsg = returnExecute.returnmsg });
        }
        #endregion

        #region Xóa thể loại sách  
        public JsonResult deletecategory(long? catgid)
        {
            long? deletedby = HttpContext.GetUserID();
            string res = repcategory.delete(catgid, deletedby);
            if (res == null)
            {
                return Json(new { returncode = -1 });
            }
            //lưu mã lỗi 
            ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);
            return Json(new { returncode = returnExecute.returncode, id = returnExecute.id, returnmsg = returnExecute.returnmsg });
        }
        #endregion

        #region Lấy thông tin thể loại sách  
        public JsonResult getcategory(category categorys)
        {
            List<category> data = new List<category>();
            bool? foredit = true;
            //data
            string res = repcategory.get(categorys, foredit);
            if (!string.IsNullOrWhiteSpace(res))
            {
                data = JsonConvert.DeserializeObject<List<category>>(res);
            }
            return Json(new { data = data, total = data.Count > 0 ? data[0].total : 0 });
        }
        #endregion

    }
}
