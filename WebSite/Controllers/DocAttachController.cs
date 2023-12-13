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
    public class DocAttachController : Controller
    {
        #region Interface
        private readonly IStringLocalizer<DocAttachController> _localizer;
        string urlreadfile = WebConfigs.AppSettings.WebApiFileUrl;
        Rep_DocAttach RepDocAttach = new Rep_DocAttach(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        Rep_Doc repdocs = new Rep_Doc(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        public DocAttachController(IStringLocalizer<DocAttachController> localizer)
        {
            _localizer = localizer;
        }
        #endregion

        #region Trang index của file sách
        public IActionResult Index(long? id)
        {
            doc data = new doc();
            data.docid = id;
            data.getby = HttpContext.GetUserID();
            //data
            string res = repdocs.detail(data.docid, data.getby, true);
            if (!string.IsNullOrWhiteSpace(res)) data = JsonConvert.DeserializeObject<doc>(res);
            if (id == null)
            {
                return RedirectToAction("NoBook", "Home");
            }
            if (HttpContext.GetUserRole() == 1301)
            {
                if (data.createdby != HttpContext.GetUserID())
                {
                    return RedirectToAction("NoPermission", "Home");
                }
            }
            ViewBag.docid = id;
            ViewBag.role = HttpContext.GetUserRole();
            ListBreadcrumb breadcrumb = new ListBreadcrumb();
            breadcrumb.Add(new BreadcrumbObject(_localizer["filenoidung"]));
            ViewBag.Breadcrumb = breadcrumb;
            return View();
        }
        #endregion

        #region Thêm / Sửa file sách (View)

        public IActionResult Addupdate(long? docattachid)
        {
            List<docattach> data = new List<docattach>();
            if (!string.IsNullOrEmpty(docattachid.ToString()))
            {
                long? docid = null;
                long? getby = HttpContext.GetUserID();
                string res = RepDocAttach.DocAttach_Get(docid, getby, docattachid);
                if (!string.IsNullOrWhiteSpace(res)) data = JsonConvert.DeserializeObject<List<docattach>>(res);
                return View(data);
            }
            else
            {
                return View(data);
            }
        }
        #endregion

        #region Thêm / Sửa file sách (Function)
        public JsonResult DocAttach_Update(docattach docattachs)
        {

            docattachs.modifiedby = HttpContext.GetUserID();
            string res = RepDocAttach.DocAttach_Update(docattachs);
            if (res == null) return Json(new { returncode = -1 });
            ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);
            return Json(new { returncode = returnExecute.returncode, id = returnExecute.id, returnmsg = returnExecute.returnmsg });
        }
        #endregion

        #region Xóa file sách
        public JsonResult DocAttach_Delete(docattach docattachs)
        {
            long? deletedby = HttpContext.GetUserID();
            string res = RepDocAttach.DocAttach_Delete(docattachs, deletedby);
            if (res == null) return Json(new { returncode = -1 });
            ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);
            return Json(new { returncode = returnExecute.returncode, id = returnExecute.id, returnmsg = returnExecute.returnmsg });

        }
        #endregion

        #region Cập nhật trạng thái sách
        public JsonResult DocAttach_update_status(docattach docattachs)
        {
            docattachs.modifiedby = HttpContext.GetUserID();
            string res = RepDocAttach.DocInfo_Update_Attach_Default(docattachs);
            if (res == null) return Json(new { returncode = -1 });
            ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);
            return Json(new { returncode = returnExecute.returncode, id = returnExecute.id, returnmsg = returnExecute.returnmsg });

        }
        #endregion

        #region  Lấy danh sách file sách
        public JsonResult DocAttach_Get(long? docid, long? docattachid)
        {
            List<docattach> data = new List<docattach>();
            docattach attach = new docattach();
            long? getby = HttpContext.GetUserID();

            string res = RepDocAttach.DocAttach_Get(docid, getby, docattachid);
            if (!string.IsNullOrWhiteSpace(res))
            {
                data = JsonConvert.DeserializeObject<List<docattach>>(res);
                if (data != null && data.Count > 0)
                {
                    attach = data[0];
                    attach.urlreadfile = urlreadfile;
                    foreach (docattach item in data)
                    {
                        string filename = item.attachfile;
                        if (string.IsNullOrEmpty(item.attachfile) && !string.IsNullOrEmpty(item.attachlink))
                        {
                            filename = item.attachlink;
                        }
                        if (!string.IsNullOrEmpty(filename))
                        {
                            string ext = Path.GetExtension(filename).ToLower().Trim();
                            switch (ext)
                            {
                                case ".pdf": item.name_file = "PDF"; break;
                                case ".azw3": item.name_file = "AZW3"; break;
                                case ".azw": item.name_file = "AZW3"; break;
                                case ".kfx": item.name_file = "AZW3"; break;
                                case ".epub": item.name_file = "EPUB"; break;
                                case ".mobi": item.name_file = "MOBI"; break;
                                case ".prc": item.name_file = "MOBI"; break;
                                case ".ppt": item.name_file = "PPT"; break;
                                case ".pptx": item.name_file = "PPT"; break;
                                case ".docx": item.name_file = "WORD"; break;
                                case ".doc": item.name_file = "WORD"; break;
                                case ".mp3": item.name_file = "audio"; break;
                                case ".mp4": item.name_file = "video"; break;
                                case ".sureBoard": item.name_file = "sureBoard"; break;
                                default: item.name_file = "noFile"; break;
                            }
                            if (ext == ".pdf" && item.doconline_status != "suc" && !string.IsNullOrEmpty(item.attachlink))
                            {
                                item.name_file = "PDF";
                            }
                            else if (!string.IsNullOrEmpty(item.attachlink))
                            {
                                if (PubFunc.isEmbedCode(item.attachlink))
                                {
                                    item.name_file = "Embed";
                                }
                                else if (PubFunc.isCheckUrlYoutube(item.attachlink))
                                {
                                    item.name_file = "Embed";
                                }
                            }
                        }
                    }
                }
            }

            return Json(new { data = data, total = data.Count > 0 ? data[0].total : 0 });

        }
        #endregion

    }
}
