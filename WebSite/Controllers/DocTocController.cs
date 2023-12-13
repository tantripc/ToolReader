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
    public class DocTocController : Controller
    {
        private readonly IStringLocalizer<DocTocController> _localizer;
        Rep_DocToc RepDocToc = new Rep_DocToc(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        public DocTocController(IStringLocalizer<DocTocController> localizer)
        {
            _localizer = localizer;
        }
        
        public IActionResult Index()
        {
            return View();
        }


        #region hàm này dùng để lấy mục lục
        [HttpPost]
        public JsonResult DocToc_Get(doctoc doctoces)
        {
            List<doctoc> doctocs = new List<doctoc>();
            string res = RepDocToc.DocToc_Get(doctoces);
            if (!string.IsNullOrEmpty(res)) doctocs = JsonConvert.DeserializeObject<List<doctoc>>(res);
            return Json(new { data = doctocs, total = doctocs.Count > 0 ? doctocs[0].total : 0 });
        }
        #endregion

        #region hàm này lấy mục lục 
        
        public IActionResult Addupdate(doctoc doctoces)
         {
                List<doctoc> data = new List<doctoc>();
                doctoces.getby = HttpContext.GetUserID();
                var res = RepDocToc.DocToc_Get(doctoces);
                if (!string.IsNullOrEmpty(res.ToString()) && res.Length>2) data = JsonConvert.DeserializeObject<List<doctoc>>(res);
                return View(data);
        }
        #endregion

        #region hàm này dùng để tạo mục lục
        [HttpPost]
        public JsonResult DocToc_Addupdate(doctoc doctoces)
        {
            List <doctoc> doctocs = new List<doctoc>();
            doctoces.createdby = HttpContext.GetUserID();
            var res = RepDocToc.DocToc_Addupdate(doctoces);
            if (res == null) Json(new { returncode = -1 });
            ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);
            return Json(new { returncode = returnExecute.returncode, id = returnExecute.id, returnmsg = returnExecute.returnmsg });
        }
        #endregion

        #region hàm này xóa mục lục
        public JsonResult DocToc_Delete(doctoc doctocs)
        {
            doctocs.deletedby = HttpContext.GetUserID();
            var res = RepDocToc.DocToc_Delete(doctocs);
            if (res == null) Json(new { returncode = -1 });
            //lưu mã lỗi 
            ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);
            return Json(new { returncode = returnExecute.returncode, id = returnExecute.id, returnmsg = returnExecute.returnmsg });

        }
        #endregion

        #region hàm này di chuyển mục lục
        public JsonResult DocToc_Move(doctoc doctocs,string move)
        {
            doctocs.modifiedby = HttpContext.GetUserID();
            var res = "";
            if (move == "movedown")
            {
                res = RepDocToc.DocToc_MoveDown(doctocs);
            }
            else if (move == "moveup"){
                res = RepDocToc.DocToc_MoveUp(doctocs);
            }
            else {
                return Json(new { returncode = -1 });
            }
            if (res == null) Json(new { returncode = -1 });
            //trả mã lỗi,thông báo
            ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);
            return Json(new { returncode = returnExecute.returncode, id = returnExecute.id, returnmsg = returnExecute.returnmsg });
        }
        #endregion
        
    }
}
