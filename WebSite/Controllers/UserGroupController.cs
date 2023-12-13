using DefineConstants;
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
    public class UserGroupController : Controller
    {
        private readonly IStringLocalizer<UserGroupController> _localizer;
        Rep_UserGroup RepUserGroup = new Rep_UserGroup(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        public UserGroupController(IStringLocalizer<UserGroupController> localizer)
        {
            _localizer = localizer;
        }
        #region Trang chủ nhóm tài khoản  
        
        public IActionResult Index()
        {
            ListBreadcrumb breadcrumb = new ListBreadcrumb();
            breadcrumb.Add(new BreadcrumbObject(_localizer["nhomtaikhoan"]));
            ViewBag.Breadcrumb = breadcrumb;
            ViewBag.orgid = HttpContext.GetUserRole() == 1301 ? HttpContext.GetUserOrgID() : 0;
            return View();
        }
        #endregion
        #region Trang chủ user trong nhóm

        public IActionResult IndexUser(long? ugid,string? ugname,long? orgid)
        {
            ListBreadcrumb breadcrumb = new ListBreadcrumb();
            breadcrumb.Add(new BreadcrumbObject(_localizer["nhomtaikhoan"], Url.Action("Index")));
            breadcrumb.Add(new BreadcrumbObject(_localizer[ugname]));
            ViewBag.Breadcrumb = breadcrumb;
            ViewBag.ugid = ugid;
            ViewBag.ugname = ugname;
            ViewBag.orgid = orgid;
            return View();
        }
        #endregion
        #region Danh sách nhóm
        [HttpPost]
        public JsonResult UserGroup_Search(user_group user_groups)
        {
            List<user_group> lsuser_groups = new List<user_group>();
            user_groups.orgid = HttpContext.GetUserRole() == 1301 ? HttpContext.GetUserOrgID() : null;
            //data
            string res = RepUserGroup.UserGroup_Search(user_groups);
            if (!string.IsNullOrWhiteSpace(res))
            {
                lsuser_groups = JsonConvert.DeserializeObject<List<user_group>>(res);
            }
            return Json(new { data = lsuser_groups, total = lsuser_groups.Count > 0 ? lsuser_groups[0].total : 0 });
        }
        #endregion
        #region Danh sách user trong nhóm
        [HttpPost]
        public JsonResult UserGroup_Search_Member(users_in_usergroup users_in_usergroups)
        {
            List<users_in_usergroup> data = new List<users_in_usergroup>();
            users_in_usergroups.numofrow = 20;
            //data
            string res = RepUserGroup.UserGroup_GetMember(users_in_usergroups);
            if (!string.IsNullOrWhiteSpace(res))
            {
                data = JsonConvert.DeserializeObject<List<users_in_usergroup>>(res);
            }
            return Json(new { data = data, total = data.Count > 0 ? data[0].total : 0 });
        }
        #endregion
        #region Thêm mới nhóm và cập nhật nhóm: hiển thị
        [HttpGet]
        public ActionResult Addupdate(user_group user_groups)
        {
            List<user_group> data = new List<user_group>();
            if (user_groups.ugid != null)
            {
                user_groups.numofrow = 1;
                //data
                string res = RepUserGroup.UserGroup_Search(user_groups);
                if (!string.IsNullOrWhiteSpace(res))
                {
                    data = JsonConvert.DeserializeObject<List<user_group>>(res);
                }
                return View(data);
            }
            return View(data);
        }
        #endregion
        #region thêm mới user vào nhóm và cập nhật user vào nhóm: hiển thị

        public ActionResult AddupdateUser(long? ugid)
        {
            ViewBag.ugid = ugid;
            return View();
        }
        #endregion
        #region Thêm user mới vào nhóm, cập nhật user vào nhóm
        public JsonResult AddupdateUser_Callapi(users_in_usergroup users_in_usergroups,string? usermember)
        {
            if (users_in_usergroups.userid != null)
            {
                users_in_usergroups.createdby = HttpContext.GetUserID();
                string res = RepUserGroup.UserGroup_AddMember(users_in_usergroups);
                if (string.IsNullOrWhiteSpace(res)) Json(new { returncode = -1 });
                ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);
                return Json(new { returncode = returnExecute.returncode, id = returnExecute.id, returnmsg = returnExecute.returnmsg });
            }
            else
            {
                int? numok = 0;
                int? numerr = 0;
                //users_in_usergroups.orgid = HttpContext.GetUserRole() == 1301 ? HttpContext.GetUserOrgID() : null;
                List<ObjectstringUser> ObjectstringUsers = new List<ObjectstringUser>();
                List<ReturnExecute> list = new List<ReturnExecute>();
                if (!string.IsNullOrWhiteSpace(usermember)) ObjectstringUsers = JsonConvert.DeserializeObject<List<ObjectstringUser>>(usermember);
                users_in_usergroups.createdby = HttpContext.GetUserID();
                for (var i = 0; i < ObjectstringUsers.Count; i++)
                {
                    users_in_usergroups.userid = ObjectstringUsers[i].userid;
                    string res = RepUserGroup.UserGroup_AddMember(users_in_usergroups);
                    if (!string.IsNullOrWhiteSpace(res)) { ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);
                        returnExecute.emailaddr = ObjectstringUsers[i].emailaddr;
                        returnExecute.username = ObjectstringUsers[i].username;
                        if (returnExecute.returncode == 0)
                        {
                            numok++;
                        }
                        else
                        {
                            numerr++;
                        }
                        list.Add(returnExecute); }
                };
                return Json(new { data = list, numok = numok, numerr = numerr });
            }
        }
        #endregion
        #region Xóa nhóm
        public JsonResult UserGroup_Delete(user_group user_groups)
        {
            user_groups.deletedby = HttpContext.GetUserID();
            string res = RepUserGroup.UserGroup_Delete(user_groups);
            if (res == null)
            {
                return Json(new { returncode = -1 });
            }
            //lưu mã lỗi 
            ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);
            return Json(new { returncode = returnExecute.returncode, id = returnExecute.id, returnmsg = returnExecute.returnmsg });
        }
        #endregion
        #region Xóa user trong nhóm
        public JsonResult UserGroup_Delete_Member(users_in_usergroup users_in_usergroups)
        {
            users_in_usergroups.deletedby = HttpContext.GetUserID();
            string res = RepUserGroup.UserGroup_RemoveMember(users_in_usergroups);
            if (res == null)
            {
                return Json(new { returncode = -1 });
            }
            //lưu mã lỗi 
            ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);
            return Json(new { returncode = returnExecute.returncode, id = returnExecute.id, returnmsg = returnExecute.returnmsg });
        }
        #endregion
        #region Thêm nhóm mới, cập nhật nhóm
        public JsonResult UserGroup_AddUpdate(user_group user_groups)
        {
            user_groups.createdby = HttpContext.GetUserID();
            user_groups.orgid = HttpContext.GetUserRole() == 1301 ? HttpContext.GetUserOrgID() : null;
            string res = RepUserGroup.UserGroup_AddUpdate(user_groups);
            if (res == null)
            {
                return Json(new { returncode = -1 });
            }
            //lưu mã lỗi 
            ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);
            return Json(new { returncode = returnExecute.returncode, id = returnExecute.id, returnmsg = returnExecute.returnmsg });
        }
        #endregion
        #region import user vào nhóm
        [HttpPost]
        public JsonResult Import_UserGroup(IFormFile file, long? createdby, long? ugid)
        {
            createdby = HttpContext.GetUserID();
            string res = RepUserGroup.Import_UserGroup(file, createdby, ugid);
            List<import_return> import_return = new List<import_return>();
            if (res != null)
            {
                import_return = JsonConvert.DeserializeObject<List<import_return>>(res);
            }
            return Json(new { data = import_return });
        }
        #endregion

        public async Task<IActionResult> ExportFileViewResult()
        {
            long? orgid = HttpContext.GetUserRole() == 1301? HttpContext.GetUserOrgID() : null;
            var res = RepUserGroup.Export_member(null, null, null, orgid);
            if (res != null)
            {
                string filename = "UserInGroup_";
                filename += DateTime.Now.ToString("yyyyMMddHHmmssfff") + ".xlsx";
                Stream response = await res.Content.ReadAsStreamAsync();
                return File(response, res.Content.Headers.ContentType.ToString(), filename);
            }
            else
            {
                return RedirectToAction("Error404", "Home", new { Areas = area.HOME });
            }
        }
    }
}
