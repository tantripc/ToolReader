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
    public class DocController : Controller
    {
        #region Interface
        private readonly IStringLocalizer<DocController> _localizer;
        Rep_Doc repdocs = new Rep_Doc(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        rep_topic reptopic = new rep_topic(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        public DocController(IStringLocalizer<DocController> localizer)
        {
            _localizer = localizer;
        }
        #endregion

        #region Trang index của Sách
        public IActionResult Index()
        {
            ListBreadcrumb breadcrumb = new ListBreadcrumb();
            breadcrumb.Add(new BreadcrumbObject(_localizer["sach"]));
            ViewBag.Breadcrumb = breadcrumb;
            ViewBag.Role = HttpContext.GetUserRole();
            ViewBag.OrgID = HttpContext.GetUserOrgID();
            return View();
        }
        #endregion

        #region Lấy danh sách sách bằng quyền admin
        [HttpPost]
        public JsonResult search_foradmin(doc docs)
        {
            List<doc> data = new List<doc>();
            docs.orgid = HttpContext.GetUserRole() == 1301 ? HttpContext.GetUserOrgID() : null;
            docs.getby = HttpContext.GetUserID();
            string res = repdocs.search_foradmin(docs);
            if (!string.IsNullOrWhiteSpace(res)) data = JsonConvert.DeserializeObject<List<doc>>(res);
            return Json(new { data = data, total = data.Count > 0 ? data[0].total : 0 });
        }
        #endregion
        #region Lấy danh sách sách liên quan bằng quyền admin
        [HttpPost]
        public JsonResult docinfo_Docrelate_Search(doc docs)
        {
            List<doc> data = new List<doc>();
            docs.getby = HttpContext.GetUserID();
            string res = repdocs.docinfo_Docrelate_Search(docs);
            if (!string.IsNullOrWhiteSpace(res)) data = JsonConvert.DeserializeObject<List<doc>>(res);
            return Json(new { data = data, total = data.Count > 0 ? data[0].total : 0 });
        }
        #endregion

        #region Thêm / Sửa sách (View)
        [HttpPost]
        public IActionResult Addupdate(long? id)
        {
            doc data = new doc();
            if (id != null)
            {
                data.docid = id;
                data.getby = HttpContext.GetUserID();
                //data
                string res = repdocs.detail(id, data.getby, true);
                if (!string.IsNullOrWhiteSpace(res)) data = JsonConvert.DeserializeObject<doc>(res);
            }
            ViewBag.id = id;
            return View(data);
        }
        #endregion
        #region Lấy sách từ kho sách full
        public ActionResult GetBookWarehouse()
        {
            return View();
        }
        //Lấy sách từ kho cho người dùng partner chọn
        [HttpPost]
        public JsonResult GetBookWarehousedata(doc docs)
        {
            List<doc> data = new List<doc>();
            docs.getby = HttpContext.GetUserID();
            docs.iscopy = false;
            string res = repdocs.search_foradmin(docs);
            if (!string.IsNullOrWhiteSpace(res)) data = JsonConvert.DeserializeObject<List<doc>>(res);
            return Json(new { data = data, total = data.Count > 0 ? data[0].total : 0 });
        }
        //Lấy sách từ kho của tài khoản partner
        [HttpPost]
        public JsonResult copy_book(long? userid, bool? isdocquiz,string? docids,long? topicid)
        {
            int? numok = 0;
            int? numerr = 0;
            userid = HttpContext.GetUserID();//Lấy userid của người dùng
            //lấy được docid của những cuốn sách đã chọn
            List<JsonDocInterst> jsonDoc = new List<JsonDocInterst>();//Model hứng docid đã chọn
            List<ReturnExecute> list = new List<ReturnExecute>();//Model hứng param trả về
            if (!string.IsNullOrWhiteSpace(docids))
            {
                jsonDoc = JsonConvert.DeserializeObject<List<JsonDocInterst>>(docids);//parse mảng docids => jsonDoc

            }
            foreach(var item in jsonDoc)
            {
                string res = repdocs.copy_book(userid, item.docid, isdocquiz, topicid);//gọi api copybook
                if (!string.IsNullOrEmpty(res))
                {
                    //Hứng mã lỗi từ api trả về
                    ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);
                    if(returnExecute.returncode != 0)
                    {
                        numerr++;// nếu thất bại hoặc lỗi thì tăng lên 1
                    }
                    else
                    {
                        numok++; //nếu thành công hoặc lỗi thì tăng lên 1
                    }
                    list.Add(returnExecute);
                }
               
            }

            return Json(new { data = list, numok = numok, numerr = numerr });

        }
        #endregion
        #region Thêm / Sửa sách (Function)
        [HttpPost]
        public JsonResult addupdatedoc(doc docs)
        {
            docs.isblock = false;
            docs.isdelete = false;
            docs.ishide = false;
            docs.createdby = HttpContext.GetUserID();
            docs.lang = HttpContext.GetCurrentCulture();
            //data
            string res = repdocs.addupdate(docs);
            if (string.IsNullOrWhiteSpace(res))
            {
                return Json(new { returncode = -1 });
            }
            ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);
            return Json(new { returncode = returnExecute.returncode, returnmsg = returnExecute.returnmsg });
        }
        #endregion

        #region Xóa sách
        [HttpPost]
        public JsonResult deletedoc(long? docid,bool? delete_anyway)
        {
            long? deletedby = HttpContext.GetUserID();
            string res = repdocs.delete(docid, deletedby, delete_anyway);
            if (string.IsNullOrEmpty(res)) Json(new { returncode = -1 });
            //lưu mã lỗi 
            ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);
            return Json(new { returncode = returnExecute.returncode, id = returnExecute.id, returnmsg = returnExecute.returnmsg });
        }
        #endregion

        #region Cập nhật trạng thái sách
        [HttpPost]
        public JsonResult Update_status(doc docs)
        {
            docs.modifiedby = HttpContext.GetUserID();
            //data
            string res = repdocs.update_status(docs);
            if (!string.IsNullOrWhiteSpace(res)) docs = JsonConvert.DeserializeObject<doc>(res);
            ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);
            return Json(new { returncode = returnExecute.returncode, returnmsg = returnExecute.returnmsg });
        }
        #endregion
        #region Lấy sách từ kho (chỉ riêng cho tài khoản partner)
        [HttpPost]
        public JsonResult GetBook_Partner(doc docs,string? docids)
        {
            List<doc> data = new List<doc>();
            docs.getby = HttpContext.GetUserID();
            docs.iscopy = false;
            //data
            string res = repdocs.get_bypartner(docs, docids);
            if (!string.IsNullOrWhiteSpace(res)) data = JsonConvert.DeserializeObject<List<doc>>(res);
            return Json(new { data = data });
        }
        #endregion
        #region Lấy detail của sách
        [HttpPost]
        public JsonResult Detail_Book(long? docid, long? getby, bool? foredit)
        {
            doc data = new doc();
            getby = HttpContext.GetUserID();
            //data
            string res = repdocs.detail(docid, getby, true);
            if (!string.IsNullOrWhiteSpace(res))
            {
                data = JsonConvert.DeserializeObject<doc>(res);
            }
            return Json(new { data = data});
        }
        #endregion
    }
}
