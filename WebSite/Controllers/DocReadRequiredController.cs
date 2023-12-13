using DefineConstants;
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
    [AuthenticateFilter]
    public class DocReadRequiredController : Controller
    {
        private readonly IStringLocalizer<DocReadRequiredController> _localizer;
        Rep_DocReadRequire RepDocReadRequire = new Rep_DocReadRequire(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        rep_refmailtemplate reprefmailtemplate = new rep_refmailtemplate(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        Rep_Mail repmailtemplate = new Rep_Mail(WebConfigs.AppSettings.WebApiServiceSendMail, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        Rep_UserGroup RepUserGroup = new Rep_UserGroup(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        RepUser repuser = new RepUser(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        public DocReadRequiredController(IStringLocalizer<DocReadRequiredController> localizer)
        {
            _localizer = localizer;
        }

        public IActionResult Index()
        {
            ListBreadcrumb breadcrumb = new ListBreadcrumb();
            breadcrumb.Add(new BreadcrumbObject(_localizer["phancongdocsach"]));
            ViewBag.Breadcrumb = breadcrumb;
            return View();
        }

        public IActionResult Addupdate(long? docid)
        {

            ViewBag.docid = docid;
            ViewBag.createdby = HttpContext.GetUserID();
            return View();
        }
        #region danh sách sách được giao
        [HttpPost]
        public JsonResult DocReadRequire_Search(docreadrequire docreadrequires)
        {
            List<docreadrequire> lsdocreadrequires = new List<docreadrequire>();
            docreadrequires.getby = HttpContext.GetUserID();
            docreadrequires.foredit = true;
            docreadrequires.orgid = HttpContext.GetUserRole() == 1301 ? HttpContext.GetUserOrgID() : null;
            // trả dữ liệu
            string res = RepDocReadRequire.DocReadRequire_Search(docreadrequires);
            if (!string.IsNullOrWhiteSpace(res))
            {
                lsdocreadrequires = JsonConvert.DeserializeObject<List<docreadrequire>>(res);
            }
            return Json(new { data = lsdocreadrequires, total = lsdocreadrequires.Count > 0 ? lsdocreadrequires[0].total : 0 });
        }
        #endregion
        #region xóa sách được giao
        [HttpPost]
        public JsonResult DocReadRequire_Delete(long? docrequireid)
        {
            long? modifiedby = HttpContext.GetUserID();
            string res = RepDocReadRequire.DocReadRequire_Delete(docrequireid, modifiedby);
            if (string.IsNullOrEmpty(res)) Json(new { returncode = -1 });
            //trả thông báo 
            ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);
            return Json(new { returncode = returnExecute.returncode, id = returnExecute.id, returnmsg = returnExecute.returnmsg });
        }
        #endregion
        #region Thêm sách được giao
        [HttpPost]
        public JsonResult DocReadRequire_AddUpdate(docreadrequire docreadrequires, string? arrdocreadrequired)
        {
            List<ObjectstringDocreadrequired> ObjectstringDocreadrequireds = new List<ObjectstringDocreadrequired>();
            List<ReturnExecute> list = new List<ReturnExecute>();
            if (!string.IsNullOrWhiteSpace(arrdocreadrequired)) ObjectstringDocreadrequireds = JsonConvert.DeserializeObject<List<ObjectstringDocreadrequired>>(arrdocreadrequired);
            docreadrequires.modifiedby = HttpContext.GetUserID();
            int? numok = 0;
            int? numerr = 0;
            docreadrequires.orgid = HttpContext.GetUserRole() == 1301 ? HttpContext.GetUserOrgID() : null;
            for (var i = 0; i < ObjectstringDocreadrequireds.Count; i++)
            {
                if (ObjectstringDocreadrequireds[i].userid != null)
                {
                    docreadrequires.userid = ObjectstringDocreadrequireds[i].userid;
                    docreadrequires.emailaddr = ObjectstringDocreadrequireds[i].emailaddr;
                    docreadrequires.fullname = ObjectstringDocreadrequireds[i].fullname;
                }
                else
                {
                    docreadrequires.ugid = ObjectstringDocreadrequireds[i].ugid;
                    users_in_usergroup users_in_usergroups = new users_in_usergroup();
                    List<users_in_usergroup> data = new List<users_in_usergroup>();
                    users_in_usergroups.numofrow = 20;
                    //data
                    string res_users_in_usergroup = RepUserGroup.UserGroup_GetMember(users_in_usergroups);
                    if (!string.IsNullOrWhiteSpace(res_users_in_usergroup))
                    {
                        data = JsonConvert.DeserializeObject<List<users_in_usergroup>>(res_users_in_usergroup);
                        if (data.Count > 0)
                        {
                            for (var j = 0; j < data.Count; j++)
                            {
                                users_in_usergroups = data[j];
                            }
                        }
                    }
                    docreadrequires.emailaddr = users_in_usergroups.emailaddr;
                }

                string res = RepDocReadRequire.DocReadRequire_AddUpdate(docreadrequires);
                if (!string.IsNullOrWhiteSpace(res))
                {
                    ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);
                    if (returnExecute.returncode == 0)
                    {
                        numok++;
                    }
                    else
                    {
                        numerr++;
                    }
                    returnExecute.fullname = docreadrequires.fullname;
                    returnExecute.emailaddr = docreadrequires.emailaddr;

                    list.Add(returnExecute);
                };
            }
            return Json(new { data = list, numok = numok, numerr = numerr });
        }
        #endregion
        [HttpPost]
        public JsonResult Import(IFormFile file, long? createdby)
        {   
            createdby = HttpContext.GetUserID();
            string res = RepDocReadRequire.DocReadRequire_Import_User(file, createdby);
            List<import_return> import_return = new List<import_return>();
            if (res != null)
            {
                import_return = JsonConvert.DeserializeObject<List<import_return>>(res);
            }
            return Json(new { data = import_return });
        }
        public IActionResult ExportFileView(long? docid)
        {
            ViewBag.docid = docid;
            return View();
        }

        public async Task<IActionResult> ExportFileViewResult(string? doccode)
        {
            var res = RepDocReadRequire.exportuser(doccode, null);
            if (res != null)
            {
                string filename = "DocReadRequired_";
                filename += DateTime.Now.ToString("yyyyMMddHHmmssfff") + ".xlsx";
                Stream response = await res.Content.ReadAsStreamAsync();
                return File(response, res.Content.Headers.ContentType.ToString(), filename);
            }
            else
            {
                return RedirectToAction("Error404", "Home", new { Areas = area.HOME });
            }
        }
        #region danh sách user đã được giao
        public JsonResult Docreadrequire_serarch_user(users user, long? docid)
        {
            List<users> lst_user = new List<users>();
            user.createdby = HttpContext.GetUserID(); 
            user.orgid = HttpContext.GetUserRole() == 1301 ? HttpContext.GetUserOrgID() : null; 
            string res_api = repuser.Docreadrequire_serarch_user(user, docid);
            if (!string.IsNullOrEmpty(res_api))
            {
                lst_user = JsonConvert.DeserializeObject<List<users>>(res_api);
            };
            return Json(new { data = lst_user });
        }
        #endregion
        #region giao 1 cuốn sách cho người dùng và nhóm người dùng
        public ActionResult Docreadrequire_User(long? docid)
        {
            ViewBag.docid = docid;
            ViewBag.createdby = HttpContext.GetUserID();
            return View();
        }
        #endregion
        #region Cập nhật trạng thái bắt buộc đọc
        [HttpPost]
        public JsonResult Docreadrequire_Update(docreadrequire docreadrequires)
        {
            docreadrequires.orgid = HttpContext.GetUserRole() == 1301 ? HttpContext.GetUserOrgID() : null;
            docreadrequires.modifiedby = HttpContext.GetUserID();
            docreadrequires.userid = HttpContext.GetUserID();
            string res = RepDocReadRequire.DocReadRequire_AddUpdate(docreadrequires);
            ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);
            return Json(new { returncode = returnExecute.returncode, id = returnExecute.id, returnmsg = returnExecute.returnmsg });
        }
        #endregion
    }
}
