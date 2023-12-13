using DefineConstants;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using Newtonsoft.Json;
using ObjectDefine;
using RepositoriesAPI;
using System.Data;
using System.Text.Json.Nodes;
using System.Threading;
using WebAdmin.Helper;
using WebAdmin.Models;

namespace WebAdmin.Controllers
{
    public class AccountController : Controller
    {
        #region Interface 
        private readonly IStringLocalizer<AccountController> _localizer;
        RepUser repuser = new RepUser(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        Rep_Mail repmailtemplate = new Rep_Mail(WebConfigs.AppSettings.WebApiServiceSendMail, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        rep_refmailtemplate reprefmailtemplate = new rep_refmailtemplate(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        RepOrg repOrg = new RepOrg(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        public AccountController(IStringLocalizer<AccountController> localizer)
        {
            _localizer = localizer;
        }
        #endregion

        #region Trang index của người dùng 
        [AuthenticateFilter]
        public IActionResult Index()
        {
            ListBreadcrumb breadcrumb = new ListBreadcrumb();
            breadcrumb.Add(new BreadcrumbObject(_localizer["taikhoan"]));
            ViewBag.Breadcrumb = breadcrumb;
            return View();
        }
        #endregion

        #region Login View
        public IActionResult Login()
        {
            if (!string.IsNullOrEmpty(HttpContext.GetCurrentCulture()))
            {
                HttpContext.SetCurrentCulture("vi");
            }
            organization organization = new organization();
            List<organization> lst_organization = new List<organization>();
            organization.issync = true;
            organization.posstart = 1;
            organization.numofrow = 20;
            string res = repOrg.get(organization);
            if (!string.IsNullOrEmpty(res))
            {
                lst_organization = JsonConvert.DeserializeObject<List<organization>>(res);
            }
            return View(lst_organization);
        }
        #endregion

        #region Forgotpassword View
        public IActionResult Forgotpassword()
        {
            if (!string.IsNullOrEmpty(HttpContext.GetCurrentCulture()))
            {
                HttpContext.SetCurrentCulture("vi");
            }
            return View();
        }
        #endregion

        #region Forgotpassword API
        [HttpPost]
        public JsonResult Forgotpassword(users datauser)
        {
            string? lang = HttpContext.GetCurrentCulture();
            string res = repuser.forgotpass(datauser.emailaddr, lang);
            string resupdatedetail = repuser.getdetailaccount(datauser.userid, datauser.emailaddr);
            if (resupdatedetail == null)
            {
                return Json(new { returncode = -1 });
            }
            if (res == null)
            {
                return Json(new { returncode = -1 });
            }
            //lưu mã lỗi 
            ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);
            users userss = JsonConvert.DeserializeObject<users>(resupdatedetail);
            if (returnExecute.returncode == 0)
            {
                refmailtemplate refmailtemplates = new refmailtemplate();
                List<refmailtemplate> data = new List<refmailtemplate>();
                refmailtemplates.numofrow = 1;
                refmailtemplates.mailtemplatename = MailTeamplateName.MAILQUENMATKHAU;
                //data
                string res_refmail = reprefmailtemplate.refmailtemplate_search(refmailtemplates);
                if (!string.IsNullOrWhiteSpace(res_refmail)) data = JsonConvert.DeserializeObject<List<refmailtemplate>>(res_refmail);
                if (data.Count > 0)
                {
                    string strBody = data[0].mailtemplatecontents;
                    strBody = strBody.Replace("%DomainName%", WebConfigs.AppSettings.DomainName)
                       .Replace("%SiteName%", WebConfigs.AppSettings.MailFrom.ToUpper())
                       .Replace("%LinkLogo%", WebConfigs.AppSettings.DomainName + Url.RouteUrl("~/images/Logo.svg"))
                    .Replace("%linkFinishForgotPassword%", WebConfigs.AppSettings.DomainName + Url.Action("Changepwd", "Home") + "?code=" + returnExecute.forgotpwdcode + "&userid=" + userss.userid)
                       .Replace("%AccountNameEmailAddr%", datauser.emailaddr);
                    mail mails = new mail();
                    mails.mailserver = WebConfigs.AppSettings.MailServer;
                    mails.mailfrom = WebConfigs.AppSettings.MailAccount;
                    mails.fromname = WebConfigs.AppSettings.MailFrom;
                    mails.mailto = userss.emailaddr;
                    mails.account = WebConfigs.AppSettings.MailAccount;
                    mails.port = WebConfigs.AppSettings.MailSmtpPort;
                    mails.pwd = WebConfigs.AppSettings.MailAccountPass;
                    mails.subject = MailTeamplateName.TITLEQUENMATKHAU;
                    mails.body = strBody;
                    mails.isenablessl = WebConfigs.AppSettings.MailEnableSSL;
                    string res_mail = repmailtemplate.sendmail(mails);
                }
            }
            return Json(new { returncode = returnExecute.returncode, returnmsg = returnExecute.returnmsg });
        }
        #endregion

        #region Chức năng đăng nhập
        [HttpPost]
        public async Task<JsonResult> SignIn(string username, string password, string DeviceKey, string Language, string UserAgent, string Vendor, string returnurl, bool signinoauth = false, string providername = "", string provideruserid = "", string profilephoto = "")
        {
            string res = null;
            HttpContext.Session.Remove("UserID");
            HttpContext.RemoveToken();
            //đăng nhập bằng tài khoản hệ thống
            if ((!string.IsNullOrWhiteSpace(username) && !string.IsNullOrWhiteSpace(password) && !signinoauth) || (!string.IsNullOrEmpty(username) && signinoauth && !string.IsNullOrEmpty(provideruserid)))
            {
                res = repuser.signin(
                    emailaddr: username,
                    username: username,
                    pwd: PubFunc.GetMD5(password),
                    signinoauth: signinoauth,
                    providername: providername,
                    provideruserid: provideruserid,
                    profilephoto: profilephoto
                    //lang: HttpContext.GetCurrentCulture()
                    );
            }

            ////null data
            //if (string.IsNullOrEmpty(res))
            //{
            //    return Json(new { returncode = -1 });
            //}
            //lưu mã lỗi 
            returnsigin returnExecute = JsonConvert.DeserializeObject<returnsigin>(res);
            if (returnExecute.id > 0 && returnExecute.returncode == 0)
            {
                //lưu sesion - cookie
                UserAccount account = new UserAccount();
                account.userid = (int)returnExecute.id;
                //SET SESSION
                HttpContext.Session.SetString("UserID", account.userid.ToString());
                //HttpContext.SetUserID(account.userid);

                res = repuser.getdetailaccount(account.userid, null);
                users users = new users();
                if (!string.IsNullOrWhiteSpace(res))
                {
                    users = JsonConvert.DeserializeObject<users>(res);
                }
                if (users != null && users.v_role != null)
                {
                    HttpContext.SetUserRole((long)users.v_role);
                }

                if (!string.IsNullOrEmpty(account.connectionid))
                {
                    HttpContext.Session.SetString("connectionid", account.connectionid);
                }
                //SET COOKIE TOKEN
                HttpContext.SetToken(account.userid, DeviceKey, Language, UserAgent, Vendor);



                returnurl = Url.Action("Index", "Home");

                //Trường hợp chưa đổi pass lần nào(đối với tk được import)
                if (returnExecute.isrequirechangepass == true)
                {
                    returnurl = Url.Action("ChangePass", "User", new { Area = area.HOME, isrequire = true, emailaddr = username });
                }

                return Json(new { returncode = returnExecute.returncode, username = account.AccountNameEmailAddr, returnurl = returnurl });
            }
            return Json(new { returncode = returnExecute.returncode, id = returnExecute.id, returnmsg = returnExecute.returnmsg });
        }
        #endregion

        #region Chức năng đăng xuất
        [AuthenticateFilter]
        public async Task<ActionResult> SignOut()
        {
            HttpContext.Session.Remove("UserID");
            HttpContext.RemoveToken();
            return RedirectToAction("Login", "Account");
        }
        [AuthenticateFilter]
        public async Task<IActionResult> ExportFile(string emailaddr, string fullname, int? gender, long? v_role, long? orgid)
        {
            orgid = HttpContext.GetUserRole() == 1301 ? HttpContext.GetUserOrgID() : null;
            var res = repuser.export(emailaddr, fullname, gender, v_role, orgid);
            if (res != null)
            {
                string filename = "User_";
                filename += DateTime.Now.ToString("yyyyMMddHHmmssfff") + ".xlsx";
                Stream response = await res.Content.ReadAsStreamAsync();
                return File(response, res.Content.Headers.ContentType.ToString(), filename);
            }
            else
            {
                return RedirectToAction("Error404", "Home", new { Areas = area.HOME });
            }
        }
        #endregion

        #region Thêm / Sửa thông tin của người dùng (bao gồm cả view và function)
        //gọi vào action này để load bảng
        [HttpPost]
        [AuthenticateFilter]
        public IActionResult AddUser(long? id)
        {

            users data = new users();
            if (id != null)
            {
                //data
                string res = repuser.getdetailaccount(id, null);
                if (!string.IsNullOrWhiteSpace(res))
                {
                    data = JsonConvert.DeserializeObject<users>(res);
                }
            }
            return View(data);
        }
        //gọi vào action này gọi api addupdate user
        [HttpPost]
        [AuthenticateFilter]
        public JsonResult Action_addupdate(users users)
        {
            var password_new = users.pwd;
            var isuserid = users.userid;
            if (users.userid == 0)
            {
                return Json(new { returncode = -1 });
            }
            if (!string.IsNullOrEmpty(users.pwd))
            {
                users.pwd = PubFunc.GetMD5(users.pwd);
            }
            users.orgid = HttpContext.GetUserOrgID(); 
            string res = repuser.addupdate(users);
            if (!string.IsNullOrWhiteSpace(res))
            {
                ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);
                if (isuserid == null)
                {

                    if (returnExecute.returncode == 0)
                    {
                        refmailtemplate refmailtemplates = new refmailtemplate();
                        List<refmailtemplate> data = new List<refmailtemplate>();
                        refmailtemplates.numofrow = 1;
                        refmailtemplates.mailtemplatename = MailTeamplateName.MAILCAPTAIKHOAN;
                        //data
                        string res_refmail = reprefmailtemplate.refmailtemplate_search(refmailtemplates);
                        if (!string.IsNullOrWhiteSpace(res_refmail)) data = JsonConvert.DeserializeObject<List<refmailtemplate>>(res_refmail);
                        if (data.Count > 0)
                        {
                            string strBody = data[0].mailtemplatecontents;
                            strBody = strBody.Replace("%AccountNameEmailAddr%", users.emailaddr)
                               .Replace("%FullName%", users.firstname + " " + users.lastname)
                               .Replace("%UserName%", users.username)
                               .Replace("%linkEreader%", Request.Scheme + "://" + Request.Host.Value.ToString() + Url.Action("Index", "Home"))
                               .Replace("%AppName%", WebConfigs.AppSettings.AppName)
                               .Replace("%Password%", password_new)
                               .Replace("%More%", Request.Scheme + "://" + Request.Host.Value.ToString() + Url.Action("Index", "Home"))
                                .Replace("%Home%", Request.Scheme + "://" + Request.Host.Value.ToString() + Url.Action("Index", "Home"))
                               .Replace("%LinkLogo%", Request.Scheme + "://" + Request.Host.Value.ToString() + Url.Content("~/images/favicon.ico"));
                            mail mails = new mail();
                            mails.mailserver = WebConfigs.AppSettings.MailServer;
                            mails.mailfrom = WebConfigs.AppSettings.MailAccount;
                            mails.fromname = WebConfigs.AppSettings.MailFrom;
                            mails.mailto = users.emailaddr;
                            mails.account = WebConfigs.AppSettings.MailAccount;
                            mails.port = WebConfigs.AppSettings.MailSmtpPort;
                            mails.pwd = WebConfigs.AppSettings.MailAccountPass;
                            mails.subject = MailTeamplateName.TITLECAPTAIKHOAN;
                            mails.body = strBody;
                            mails.isenablessl = WebConfigs.AppSettings.MailEnableSSL;
                            repmailtemplate.sendmail(mails);
                        }
                    }
                }
                return Json(new { returncode = returnExecute.returncode, returnmsg = returnExecute.returnmsg });
            }
            return Json(new { returncode = -1 });

        }
        #endregion

        #region Đặt lại mật khẩu
        [HttpPost]
        [AuthenticateFilter]
        public IActionResult Setpassword(users users)
        {

            List<users> data = new List<users>();
            users.posstart = 1;
            users.sortfield = 1;
            users.numofrow = 1;
            users.sorttype = null;
            users.foreditor = true;
            //data
            string res = repuser.search(users);
            if (!string.IsNullOrWhiteSpace(res))
            {
                data = JsonConvert.DeserializeObject<List<users>>(res);
            }
            return View(data);
        }
        [HttpPost]
        [AuthenticateFilter]
        public JsonResult Setpass(users users)
        {
            if (!string.IsNullOrEmpty(users.pwd))
            {
                users.createdby = HttpContext.GetUserID();
                users.appfuncid = 2;
                users.pwd = PubFunc.GetMD5(users.pwd);
            }
            string res = repuser.setpass(users);
            if (res == null)
            {
                return Json(new { returncode = -1 });
            }
            ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);
            return Json(new { returncode = returnExecute.returncode, returnmsg = returnExecute.returnmsg });

        }
        #endregion

        #region Danh sách nhiều người dùng
        [HttpPost]
        [AuthenticateFilter]
        public JsonResult search(users users)
        {
            List<users> data = new List<users>();
            users.foreditor = true;
            users.getby = HttpContext.GetUserID();
            users.orgid = HttpContext.GetUserRole() == 1301 ? HttpContext.GetUserOrgID() : users.orgid;
            //data
            string res = repuser.search(users);
            if (!string.IsNullOrWhiteSpace(res))
            {
                data = JsonConvert.DeserializeObject<List<users>>(res);
            }
            return Json(new { data = data, total = data.Count > 0 ? data[0].total : 0 });
        }
        #endregion

        #region Danh sách 1 người dùng
        [HttpGet]
        [AuthenticateFilter]
        public JsonResult Users_Search_Brief(users users)
        {
            List<users> data = new List<users>();
            users.v_role = HttpContext.GetUserRole() == 1302 ? HttpContext.GetUserRole() : null;
            users.orgid = HttpContext.GetUserRole() == 1301 ? HttpContext.GetUserOrgID() : null;
            //data
            string res = repuser.Users_Search_Brief(users);
            if (!string.IsNullOrWhiteSpace(res))
            {
                data = JsonConvert.DeserializeObject<List<users>>(res);
            }
            return Json(new { data = data, total = data.Count > 0 ? data[0].total : 0 });
        }
        #endregion

        #region Lấy thông tin chi tiết của 1 người dùng
        [HttpPost]
        [AuthenticateFilter]
        public JsonResult getdetailaccount(long? userid, string? emailaddr)
        {
            users users = new users();
            //data
            string res = repuser.getdetailaccount(userid, emailaddr);
            if (!string.IsNullOrWhiteSpace(res))
            {
                users = JsonConvert.DeserializeObject<users>(res);
            }
            return Json(new { data = users });
        }
        #endregion

        #region Xóa người dùng
        [HttpPost]
        [AuthenticateFilter]
        public JsonResult Delete(string userid, bool delete_anyway)
        {
            string deletedby = HttpContext.GetUserID().ToString();
            string res = repuser.delete(userid, deletedby, delete_anyway, HttpContext.GetCurrentCulture());
            if (res == null)
            {
                return Json(new { returncode = -1 });
            }
            //lưu mã lỗi 
            ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);
            return Json(new { returncode = returnExecute.returncode, id = returnExecute.id, returnmsg = returnExecute.returnmsg });
        }
        #endregion

        #region Chặn người dùng
        [HttpPost]
        [AuthenticateFilter]
        public JsonResult Blockuser(string userid, bool isblocked, string blockedreason)
        {
            string blockedby = HttpContext.GetUserID().ToString();
            string res = repuser.blockuser(userid, isblocked, blockedby, HttpContext.GetCurrentCulture());
            if (res == null) return Json(new { returncode = -1 });
            //lưu mã lỗi 
            ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);
            return Json(new { returncode = returnExecute.returncode, id = returnExecute.id, returnmsg = returnExecute.returnmsg });
        }
        #endregion

        #region Kích hoạt tài khoản người dùng
        [HttpPost]
        [AuthenticateFilter]
        public JsonResult Activateuser(string emailaddr, string activationcode, string lang)
        {
            string res = repuser.Activeuser(emailaddr, activationcode, lang);
            if (res == null) Json(new { returncode = -1 });
            //lưu mã lỗi 
            ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);
            return Json(new { returncode = returnExecute.returncode, id = returnExecute.id, returnmsg = returnExecute.returnmsg });
        }
        #endregion

        #region Thêm bằng file (Import)
        [HttpPost]
        [AuthenticateFilter]
        public JsonResult import(IFormFile formFile, string sheetname, long? v_role, long? orgid)
        {
            long? createdby = HttpContext.GetUserID();
            orgid = HttpContext.GetUserRole() == 1301 ? HttpContext.GetUserOrgID() : null;
            string res = repuser.import(formFile, sheetname, createdby, v_role, orgid);
            List<import_return> import_return = new List<import_return>();
            if (res != null)
            {
                import_return = JsonConvert.DeserializeObject<List<import_return>>(res);
            }
            return Json(new { data = import_return });
        }
        #endregion

        #region Lấy danh sách người dùng chưa được thêm vào nhóm
        public JsonResult useraddgroup_search(users user)
        {
            List<users> data = new List<users>();
            user.createdby = HttpContext.GetUserID();
            user.orgid = HttpContext.GetUserRole() == 1301 ? HttpContext.GetUserOrgID() : null;
            //data
            string res = repuser.useraddgroup_search(user);
            if (!string.IsNullOrWhiteSpace(res))
            {
                data = JsonConvert.DeserializeObject<List<users>>(res);
            }
            return Json(new { data = data, total = data.Count > 0 ? data[0].total : 0 });
        }
        #endregion
        public ActionResult Profile()
        {
            ListBreadcrumb breadcrumb = new ListBreadcrumb();
            breadcrumb.Add(new BreadcrumbObject(_localizer["thongtincanhan"]));
            ViewBag.Breadcrumb = breadcrumb;
            users data = new users();
            string res = repuser.getdetailaccount(HttpContext.GetUserID(), null);
            if (!string.IsNullOrWhiteSpace(res))
            {
                data = JsonConvert.DeserializeObject<users>(res);
            }
            return View(data);
        }
        public ActionResult ChangPass_admin()
        {
            ListBreadcrumb breadcrumb = new ListBreadcrumb();
            breadcrumb.Add(new BreadcrumbObject(_localizer["doimatkhau"]));
            ViewBag.Breadcrumb = breadcrumb;
            users data = new users();
            string res = repuser.getdetailaccount(HttpContext.GetUserID(), null);
            if (!string.IsNullOrWhiteSpace(res))
            {
                data = JsonConvert.DeserializeObject<users>(res);
            }
            return View(data);
        }
        public JsonResult changepass_admin(users user)
        {
            user.newpwd = PubFunc.GetMD5(user.newpwd);
            user.pwd = PubFunc.GetMD5(user.pwd);
            string? resdetail = repuser.getdetailaccount(user.userid, null);
            users users = JsonConvert.DeserializeObject<users>(resdetail);
            //call api setpass
            user.emailaddr = users.emailaddr;

            user.forgotpwdcode = null;
            string ressetpass = repuser.Users_ChangePass(user);
            if (ressetpass == null)
            {
                return Json(new { returncode = -1 });
            }

            ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(ressetpass);
            return Json(new { returncode = returnExecute.returncode, id = returnExecute.id, returnmsg = returnExecute.returnmsg });
        }
        [HttpPost]
        public JsonResult SignIn_Library(string? username, string? password,
            string DeviceKey, string Language, string UserAgent, string Vendor, string returnurl, long? orgid)
        {
            string WebApi_Library = "";
            if (orgid != null)
            {
                List<organization> lst_organization = new List<organization>();
                string res = repOrg.get(new organization
                {
                    issync = true,
                    posstart = 1,
                    numofrow = 1,
                    orgid = orgid
                });
                if (!string.IsNullOrEmpty(res))
                {
                    lst_organization = JsonConvert.DeserializeObject<List<organization>>(res);
                    if (lst_organization.Count > 0)
                    {
                        WebApi_Library = lst_organization[0].syncapi;
                    }
                }
            }
            Rep_Library Rep_Library = new Rep_Library(WebApi_Library);
            var url = Url.Action("Index", "Home");
            //string? value = "grant_type=password&UserName=" + username + "&Password=" + password + "&scope=DEFAULT";
            List<KeyValuePair<string, string>> value = new List<KeyValuePair<string, string>>();
            value.Add(new KeyValuePair<string, string>("grant_type", "password"));
            value.Add(new KeyValuePair<string, string>("UserName", username));
            value.Add(new KeyValuePair<string, string>("Password", password));
            value.Add(new KeyValuePair<string, string>("scope", "DEFAULT"));
            //gọi api login từ thư viện
            string res_login_library = Rep_Library.Login(value);
            //kiểm tra res_login_library khác null
            if (!string.IsNullOrWhiteSpace(res_login_library))
            {
                //khai báo object để nhận param trả về
                library data_library = new library();
                errors data_errors = new errors();
                data_library = JsonConvert.DeserializeObject<library>(res_login_library);
                if (data_library.UserName != null)
                {
                    //gọi tiếp hàm detail user để lấy thông tin
                    string res_detail_library = repuser.getdetailaccount(null, username);
                    //kiểm tra (res_detail_library == null) thì đi tiếp còn (res_detail_library != null) thì return
                    if (string.IsNullOrWhiteSpace(res_detail_library))
                    {
                        //khai báo object user để nhận param
                        users data = new users();

                        //kiểm tra UserType để gán Role và signup
                        if (data_library.UserType == "USER")
                        {
                            data.v_role = 1301;
                        }
                        //kiểm tra UserType để gán Role và signup
                        else if (data_library.UserType == "PATRON")
                        {
                            data.v_role = 1302;
                        }
                        //gán Fullname để signup
                        data.fullname = data_library.FullName;
                        data.profilephoto = data_library.UrlImage;
                        data.username = username;
                        data.signinoauth = true;
                        data.providername = "Library";
                        data.provideruserid = data_library.UserName;
                        //gọi api signup
                        string res_register_library = repuser.Users_SignUp(data);
                        if (!string.IsNullOrEmpty(res_register_library))
                        {
                            ReturnExecute returnExecute_library = JsonConvert.DeserializeObject<ReturnExecute>(res_register_library);
                            string res_detail_library_part2 = repuser.getdetailaccount(null, username);
                            if (!string.IsNullOrEmpty(res_detail_library_part2))
                            {
                                users data_detail_part2 = new users();
                                data_detail_part2 = JsonConvert.DeserializeObject<users>(res_detail_library_part2);
                                string res_active_library = repuser.Activeuser(data_detail_part2.emailaddr, data_detail_part2.activationcode, null);
                                if (!string.IsNullOrEmpty(res_active_library))
                                {
                                    // SET SESSION
                                    HttpContext.Session.SetString("UserID", data_detail_part2.userid.ToString());
                                    if (!string.IsNullOrEmpty(data_detail_part2.connectionid))
                                    {
                                        HttpContext.Session.SetString("connectionid", data_detail_part2.connectionid);
                                    }
                                    //SET COOKIE TOKEN
                                    HttpContext.SetToken((long)data_detail_part2.userid, DeviceKey, Language, UserAgent, Vendor);
                                    return Json(new { returncode = 0, url = url });
                                }

                            }
                            return Json(new { returncode = 0, url = url });

                        }

                    }
                    users data_detail_part1 = new users();
                    data_detail_part1 = JsonConvert.DeserializeObject<users>(res_detail_library);
                    // SET SESSION
                    HttpContext.Session.SetString("UserID", data_detail_part1.userid.ToString());
                    if (!string.IsNullOrEmpty(data_detail_part1.connectionid))
                    {
                        HttpContext.Session.SetString("connectionid", data_detail_part1.connectionid);
                    }
                    //SET COOKIE TOKEN
                    HttpContext.SetToken((long)data_detail_part1.userid, DeviceKey, Language, UserAgent, Vendor);
                    return Json(new { returncode = 0, url = url });
                }
                else
                {
                    data_errors = JsonConvert.DeserializeObject<errors>(res_login_library);
                    return Json(new { returncode = -1, reps = data_errors });
                }
            }
            else
            {
                return Json(new { returncode = -1 });
            }
        }
    }
}
