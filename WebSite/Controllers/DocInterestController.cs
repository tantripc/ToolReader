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
    public class DocinterestController : Controller
    {
        #region Interface
        private readonly IStringLocalizer<DocinterestController> _localizer;
        rep_docinterest repdocinterest = new rep_docinterest(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        Rep_Doc repdocs = new Rep_Doc(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        public DocinterestController(IStringLocalizer<DocinterestController> localizer)
        {
            _localizer = localizer;
        }
        #endregion

        #region Trang index của sách mới hay
        public IActionResult Index()
        {
            ListBreadcrumb breadcrumb = new ListBreadcrumb();
            breadcrumb.Add(new BreadcrumbObject(_localizer["sachmoihay"]));
            ViewBag.Breadcrumb = breadcrumb;
            return View();
        }
        #endregion

        #region Thêm / Sửa sách mới hay (Function)
        public JsonResult addupdate_docinterests(docinterest docinterests, string? docids)
        {
            int? numok = 0;
            int? numerr = 0;
            List<JsonDocInterst> jsonDocInterst = new List<JsonDocInterst>();
            List<ReturnExecute> list = new List<ReturnExecute>();
            docinterests.createdby = HttpContext.GetUserID();
            if (!string.IsNullOrWhiteSpace(docids))
            {
                jsonDocInterst = JsonConvert.DeserializeObject<List<JsonDocInterst>>(docids);

            }
            else
            {
                string res_indoc = repdocinterest.DocInterest_Add(docinterests);
                if (!string.IsNullOrWhiteSpace(res_indoc))
                {
                    ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res_indoc);
                    list.Add(returnExecute);
                }

                return Json(new { data = list });
            }
            if (jsonDocInterst != null && jsonDocInterst.Count > 0)
            {
                for (var i = 0; i < jsonDocInterst.Count; i++)
                {
                    docinterests.docid = jsonDocInterst[i].docid;
                    string res = repdocinterest.DocInterest_Add(docinterests);
                    if (!string.IsNullOrWhiteSpace(res))
                    {
                        ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);
                        returnExecute.titledoc = jsonDocInterst[i].title;
                        if (returnExecute.returncode == 0)
                        {
                            numok++;
                        }
                        else
                        {
                            numerr++;
                        }
                        list.Add(returnExecute);
                    }
                };
                return Json(new { data = list, numok = numok, numerr = numerr });
            }
            return Json(new { data = list, numok = numok, numerr = numerr });
        }
        #endregion

        #region Xóa sách mới hay
        public JsonResult DocInterest_Delete(string? docitrid)
        {
            string deletedby = HttpContext.GetUserID().ToString();
            string res = repdocinterest.DocInterest_Delete(docitrid, deletedby);
            if (string.IsNullOrWhiteSpace(res)) Json(new { returncode = -1 });
            ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);
            return Json(new { returncode = returnExecute.returncode, id = returnExecute.id, returnmsg = returnExecute.returnmsg });
        }
        #endregion

        #region Lấy danh sách sách mới hay
        public JsonResult gettable(docinterest docinterests)
        {
            List<docinterest> data = new List<docinterest>();
            //data
            docinterests.foredit = true;
            docinterests.getby = HttpContext.GetUserID();
            string res = repdocinterest.DocInterest_Get(docinterests);
            if (!string.IsNullOrWhiteSpace(res)) data = JsonConvert.DeserializeObject<List<docinterest>>(res);
            return Json(new { data = data, total = data.Count > 0 ? data[0].total : 0 });
        }
        #endregion

        #region Thêm / Sửa sách mới hay (View)

        public IActionResult Addupdate(docinterest docinterests)
        {
            List<docinterest> data = new List<docinterest>();
            docinterests.getby = HttpContext.GetUserID();
            //data
            string res = repdocinterest.DocInterest_Get(docinterests);
            if (!string.IsNullOrWhiteSpace(res)) data = JsonConvert.DeserializeObject<List<docinterest>>(res);
            return View(data);
        }
        #endregion

    }
}
