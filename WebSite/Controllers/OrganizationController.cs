using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using RepositoriesAPI;
using WebAdmin.Helper;
using WebAdmin.Models;
using ObjectDefine;
using Newtonsoft.Json;
using DefineConstants;

namespace WebAdmin.Controllers
{
    [AuthenticateFilter]
    
    public class OrganizationController : Controller
    {
        private readonly IStringLocalizer<OrganizationController> _localizer;
        RepOrg repOrg = new RepOrg(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        RepUser repAccount = new RepUser(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        rep_vebrary rep_vebrary = new rep_vebrary(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        public OrganizationController(IStringLocalizer<OrganizationController> localizer)
        {
            _localizer = localizer;
        }
        public IActionResult Index()
        {

            ListBreadcrumb breadcrumb = new ListBreadcrumb();
            breadcrumb.Add(new BreadcrumbObject(_localizer["donvi"]));
            ViewBag.Breadcrumb = breadcrumb;            
            return View();
        }
        [HttpGet]
        public IActionResult ViewDetail(long? orgid)
        {
            organization organization = new organization();
            string result = repOrg.get(new organization { posstart = 1, numofrow = 1, orgid = orgid, porgid = -1 });
            if (result != null)
            {
                List<organization> lst = JsonConvert.DeserializeObject<List<organization>>(result);
                if (lst.Count > 0)
                {
                    organization = lst[0];
                }
            }

            return View(organization);
        }
        [HttpGet]
        public IActionResult ViewAddUpdate(long? orgid)
        {
            organization organization = new organization();
            if (orgid != null)
            {
                string result = repOrg.get(new organization { posstart = 1, numofrow = 1, orgid = orgid, porgid = -1 });
                if (result != null)
                {
                    List<organization> lst = JsonConvert.DeserializeObject<List<organization>>(result);
                    if (lst.Count > 0)
                    {
                        organization = lst[0];
                    }
                }
            }
            return View(organization);
        }

        public IActionResult ViewAddUser(long? orgid)
        {
            List<users> lst = new List<users>();
            //data
            string res = repAccount.search(new users { orgid=orgid});
            if (!string.IsNullOrWhiteSpace(res))
            {
                lst = JsonConvert.DeserializeObject<List<users>>(res);
            }
            ViewBag.OrgID = orgid;
            return View(lst);
        }
        [HttpPost]
        public JsonResult get_organization(organization organization)
        {
            organization.getby = HttpContext.GetUserID();
            organization.orgid = HttpContext.GetUserRole() == 1301 ? HttpContext.GetUserOrgID() : null;
            string res = repOrg.get(organization);
            if (res == null)
            {
                return Json(new { returncode = -1 });
            }
            List<organization> lst = JsonConvert.DeserializeObject<List<organization>>(res);
            return Json(new { data = lst, total = lst.Count > 0 ? lst[0].total : 0 });
        }
        [HttpPost]
        public JsonResult addupdate_organization(organization organization)
        {
            long? getuserid = HttpContext.GetUserID();
            organization.modifiedby = getuserid;
            organization.createdby = getuserid;
            organization.routing = "organization";
            organization.lang = HttpContext.GetCurrentCulture();
            string res = repOrg.addupdate(organization);
            if (res == null)
            {
                return Json(new { returncode = -1 });
            }
            ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);
            return Json(new { returncode = returnExecute.returncode, returnmsg = returnExecute.returnmsg });
        }
        [HttpPost]
        public JsonResult delete_organization(organization organization)
        {

            long? deleteby = HttpContext.GetUserID();
            organization.routing = "organization";
            organization.lang = HttpContext.GetCurrentCulture();
            string res = repOrg.delete(organization, deleteby);
            if (res == null)
            {
                return Json(new { returncode = -1 });
            }
            ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);


            return Json(new { returncode = returnExecute.returncode, returnmsg = returnExecute.returnmsg });
        }
        [HttpPost]
        public JsonResult organization_movedown(long? orgid, string orgname)
        {
            long? modifiedby = HttpContext.GetUserID();
            string res = repOrg.movedown(orgid, modifiedby, HttpContext.GetCurrentCulture());
            if (res == null)
            {
                return Json(new { returncode = -1 });
            }
            //lưu mã lỗi 
            ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);


            return Json(new { returncode = returnExecute.returncode, id = returnExecute.id, returnmsg = returnExecute.returnmsg });
        }

        [HttpPost]
        public JsonResult organization_moveup(long? orgid, string orgname)
        {
            long? modifiedby = HttpContext.GetUserID();
            string res = repOrg.moveup(orgid, modifiedby, HttpContext.GetCurrentCulture());
            if (res == null)
            {
                return Json(new { returncode = -1 });
            }
            //lưu mã lỗi 
            ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);

            return Json(new { returncode = returnExecute.returncode, id = returnExecute.id, returnmsg = returnExecute.returnmsg });
        }
        public IActionResult ViewUser(string id)
        {
            
            string name = "";
            try
            {
                organization organization = new organization();
                string res = repOrg.get(new organization { posstart = 1, numofrow = 1, orgid = Int64.Parse(id), porgid = -1 });
                if (res != null)
                {
                    List<organization> lst = JsonConvert.DeserializeObject<List<organization>>(res);
                    if (lst.Count > 0)
                    {
                        organization = lst[0];
                        name = organization.orgname;
                    }
                }
            }
            catch { }

            ListBreadcrumb breadcrumb = new ListBreadcrumb();
            breadcrumb.Add(new BreadcrumbObject(_localizer["donvi"], Url.Action("Organization", "Setup")));
            if (name != "")
            {
                breadcrumb.Add(new BreadcrumbObject(name));
            }
            breadcrumb.Add(new BreadcrumbObject(_localizer["danhsachnguoidung"]));

            ViewBag.Breadcrumb = breadcrumb;
            ViewBag.ID = id;            
            return View();
        }

        [HttpPost]
        public JsonResult import_org(IFormFile formFile, string sheetname, string v_role)
        {
            string createdby = HttpContext.GetUserID().ToString();
            string res = repOrg.import(formFile, sheetname, createdby);
            List<import_return> import_return = new List<import_return>();
            if (res != null)
            {
                import_return = JsonConvert.DeserializeObject<List<import_return>>(res);
            }
            return Json(new { data = import_return });
        }
        [HttpPost]
        public JsonResult org_add_user(organization_user org)
        {
            org.routing = "organization";
            org.modifiedby = HttpContext.GetUserID();
            org.lang = HttpContext.GetCurrentCulture();
            string res = repOrg.add_users(org);
            List<import_return> import_return = new List<import_return>();
            if (res != null)
            {
                import_return = JsonConvert.DeserializeObject<List<import_return>>(res);
            }
            return Json(new { data = import_return });
        }

        [HttpPost]
        public JsonResult org_delete_user(organization_user org)
        {
            org.routing = "organization";
            org.deletedby = HttpContext.GetUserID();
            org.lang = HttpContext.GetCurrentCulture();
            string res = repOrg.delete_users(org);
            if (res == null)
            {
                return Json(new { returncode = -1 });
            }
            ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);
            return Json(new { returncode = returnExecute.returncode, returnmsg = returnExecute.returnmsg });
        }      
        [HttpPost]
        public JsonResult set_isdefault(organization_user org)
        {
            org.routing = "organization";
            org.createdby = HttpContext.GetUserID();
            string res = repOrg.set_isdefault(org);
            if (res == null)
            {
                return Json(new { returncode = -1 });
            }
            ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);
            return Json(new { returncode = returnExecute.returncode, returnmsg = returnExecute.returnmsg });
        }        
        [HttpGet]
        public async Task<IActionResult> ExportFile(long? orgid, string orgcode)
        {
            var res = repOrg.organization_tree_export(orgid, orgcode);
            if (res != null)
            {
                string filename = "Organization_";
                filename += DateTime.Now.ToString("yyyyMMddHHmmssfff") + ".xlsx";
                Stream response = await res.Content.ReadAsStreamAsync();
                return File(response, res.Content.Headers.ContentType.ToString(), filename);
            }
            else
            {
                return RedirectToAction("Error404", "Home");
            }
        }
        public IActionResult User(string id)
        {
           string name = "";
            try
            {
                organization organization = new organization();
                string res = repOrg.get(new organization { posstart = 1, numofrow = 1, orgid = Int64.Parse(id), porgid = -1 });
                if (res != null)
                {
                    List<organization> lst = JsonConvert.DeserializeObject<List<organization>>(res);
                    if (lst.Count > 0)
                    {
                        organization = lst[0];
                        name = organization.orgname;
                    }
                }
            }
            catch { }

            ListBreadcrumb breadcrumb = new ListBreadcrumb();
            breadcrumb.Add(new BreadcrumbObject(_localizer["donvi"], Url.Action("Index", "Organization")));
            if (name != "")
            {
                breadcrumb.Add(new BreadcrumbObject(name));
            }
            breadcrumb.Add(new BreadcrumbObject(_localizer["danhsachnguoidung"]));

            ViewBag.Breadcrumb = breadcrumb;
            ViewBag.OrgID = id;
            return View("~/Views/Account/Index.cshtml");
        }
        [HttpPost]
        public JsonResult synctopic(VebSyncTopicReq vebSyncTopicReqed)
        {
            vebSyncTopicReqed.createdby = HttpContext.GetUserID();
            string res = rep_vebrary.synctopic(vebSyncTopicReqed);
            if (!string.IsNullOrEmpty(res))
            {
                ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);
                return Json(new { returncode = returnExecute.returncode, returnmsg = returnExecute.returnmsg });
            }
            return Json(new { returncode = -1 });

        }
        [HttpPost]
        public JsonResult syncdoc(VebSyncDocReq VebSyncDocReqed)
        {
            VebSyncDocReqed.createdby = HttpContext.GetUserID();
            string res = rep_vebrary.syncdoc(VebSyncDocReqed);
            if (!string.IsNullOrEmpty(res))
            {
                ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);
                return Json(new { returncode = returnExecute.returncode, returnmsg = returnExecute.returnmsg });
            }
            return Json(new { returncode = -1 });

        }
    }
}
