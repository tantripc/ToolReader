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
    public class DocCommentController : Controller
    {
        #region Interface
        private readonly IStringLocalizer<DocCommentController> _localizer;
        Rep_DocComment RepDocComment = new Rep_DocComment(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        RepUser repuser = new RepUser(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        Rep_Doc repdocs = new Rep_Doc(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        public DocCommentController(IStringLocalizer<DocCommentController> localizer)
        {
            _localizer = localizer;
        }

        #endregion

        #region Trang index của bình luận sách

        public IActionResult Index(long? id, users users)
        {
            doc isdata = new doc();
            isdata.docid = id;
            isdata.getby = HttpContext.GetUserID();
            //data
            string isres = repdocs.detail(isdata.docid, isdata.getby, true);
            if (!string.IsNullOrWhiteSpace(isres)) isdata = JsonConvert.DeserializeObject<doc>(isres);
            if (HttpContext.GetUserRole() == 1301)
            {
                if (isdata.createdby != HttpContext.GetUserID())
                {
                    return RedirectToAction("Index", "Doc");
                }
            }
            //id của sách
            if (id == null)
            {
                return RedirectToAction("Index", "Doc");
            }
            else
            {
                ViewBag.docid = id;
                ViewBag.userid = HttpContext.GetUserID();
                ListBreadcrumb breadcrumb = new ListBreadcrumb();
                breadcrumb.Add(new BreadcrumbObject(_localizer["quanlybinhluan"]));
                ViewBag.Breadcrumb = breadcrumb;
                List<users> data = new List<users>();
                users.userid = HttpContext.GetUserID();
                string res = repuser.search(users);
                if (!string.IsNullOrWhiteSpace(res)) data = JsonConvert.DeserializeObject<List<users>>(res);
                foreach (var item in data) {
                    ViewBag.fullname = item.fullname;
                }
            }
            return View();
        }
        #endregion

        #region Thêm bình luận sách (View)

        public IActionResult DocComment_Add(doccomment doccomments)
        {
            List<doccomment> data = new List<doccomment>();
            doccomments.userid = HttpContext.GetUserID();
            string res = RepDocComment.DocComment_Add(doccomments);
            if (res == null) return Json(new { returncode = -1 });
            ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);
            return Json(new { returncode = returnExecute.returncode, id = returnExecute.id, returnmsg = returnExecute.returnmsg });
        }
        #endregion

        #region Lấy danh sách bình luận sách
        public JsonResult DocComment_Get(doccomment doccomments)
        {
            List<doccomment> data = new List<doccomment>();
            doccomments.getby = HttpContext.GetUserID();
            string res = RepDocComment.DocComment_Get(doccomments);
            if (!string.IsNullOrWhiteSpace(res)) data = JsonConvert.DeserializeObject<List<doccomment>>(res);
            return Json(new { data = data });
        }
        #endregion

        #region Xóa bình luận sách
        public JsonResult DocComment_Delete(doccomment doccomments)
        {
            doccomments.userid = HttpContext.GetUserID();
            doccomments.foredit = true;
            string res = RepDocComment.DocComment_Delete(doccomments);
            if (res == null) return Json(new { returncode = -1 });
            ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);
            return Json(new { returncode = returnExecute.returncode, id = returnExecute.id, returnmsg = returnExecute.returnmsg });
        }
        #endregion

        #region Sửa bình luận sách (Function)
        public IActionResult DocComment_Update(doccomment doccomments)
        {
            List<doccomment> data = new List<doccomment>();
            doccomments.userid = HttpContext.GetUserID();
            string res = RepDocComment.DocComment_Update(doccomments);
            if (res == null) return Json(new { returncode = -1 });
            ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);
            return Json(new { returncode = returnExecute.returncode, id = returnExecute.id, returnmsg = returnExecute.returnmsg });
        }
        #endregion
    }
}
