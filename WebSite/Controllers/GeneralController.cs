using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Newtonsoft.Json;
using ObjectDefine;
using OfficeOpenXml;
using RepositoriesAPI;
using WebAdmin.Helper;

namespace WebAdmin.Controllers
{
    public class GeneralController : Controller
    {
        rep_notify rep_notify = new rep_notify(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        Rep_General repgeneral = new Rep_General(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        [HttpPost]
        public JsonResult getnotifymessage(int? posstart, int? numofrow, bool? ishide, int? notifyrecvid, int? useridd)
        {
            //lấy chi tiết đánh giá
            List<notifyrecv> list_notify = new List<notifyrecv>();
            notifyrecv notify = new notifyrecv();
            string res_notify = rep_notify.search_enduser(new notifyrecv
            {
                numofrow = numofrow,
                posstart = posstart,
                notifyrecvid = notifyrecvid,
                ishide = ishide,
                userid = useridd
            });
            if (!string.IsNullOrEmpty(res_notify))
            {
                list_notify = JsonConvert.DeserializeObject<List<notifyrecv>>(res_notify);
            }
            if (list_notify.Count > 0)
            {
                notify = list_notify[0];
            }
            return Json(new { notify });
        }
        [HttpPost]
        public JsonResult searchreflookup(string? lookupid, string? objectname,long? orgid)
        {
            orgid = HttpContext.GetUserRole() == 1301 ? HttpContext.GetUserOrgID() : null;
            string res = repgeneral.searchreflookup(lookupid, objectname, HttpContext.GetCurrentCulture(), orgid);
            if (res == null)
            {
                return Json(new { });
            }
            List<reflookup> lst = JsonConvert.DeserializeObject<List<reflookup>>(res);
            return Json(new { data = lst, total = lst.Count });
        }
        [HttpGet]
        public IActionResult GetHtmlFromView(string pathview)
        {
            return PartialView(pathview);
        }
        [HttpPost]
        public async Task<JsonResult> GetWorkSheetExcel(IFormFile formFile, CancellationToken cancellationToken)
        {
            if (formFile == null || formFile.Length <= 0)
            {
                return Json(new { ReturnCode = 1 });
            }

            if (!Path.GetExtension(formFile.FileName).Equals(".xlsx", StringComparison.OrdinalIgnoreCase))
            {
                return Json(new { ReturnCode = 2 });
            }

            List<WorksheetExcel> lst_worksheet = new List<WorksheetExcel>();

            using (var stream = new MemoryStream())
            {
                await formFile.CopyToAsync(stream, cancellationToken);

                using (var package = new ExcelPackage(stream))
                {
                    int worksheet_count = package.Workbook.Worksheets.Count;
                    for (int i = 0; i < worksheet_count; i++)
                    {
                        ExcelWorksheet worksheet = package.Workbook.Worksheets[i];
                        WorksheetExcel item_worksheet = new WorksheetExcel();
                        item_worksheet.WorkSheetIndex = i;
                        item_worksheet.WorkSheetName = worksheet.Name;
                        lst_worksheet.Add(item_worksheet);
                    }
                }
            }
            return Json(new { data = lst_worksheet, ReturnCode = 0 });
        }
        [HttpPost]
        public async Task<JsonResult> GetHtmlAddUpdateQuestion(string pathview, string json)
        {
            List<question_bank> result = new List<question_bank>();
            if (!string.IsNullOrWhiteSpace(json))
            {
                result = JsonConvert.DeserializeObject<List<question_bank>>(json);
            }
            string viewFromAnotherController = await this.RenderViewToStringAsync("~/" + pathview, result);
            return Json(new { ContentHtml = viewFromAnotherController, data = result });
        }
        
        [HttpPost]
        public async Task<JsonResult> GetHtmlViewQuestion(string pathview, string json)
        {
            List<question_bank> result = new List<question_bank>();
            if (!string.IsNullOrWhiteSpace(json))
            {
                result = JsonConvert.DeserializeObject<List<question_bank>>(json);
            }
            string viewFromAnotherController = await this.RenderViewToStringAsync("~/" + pathview, result);
            return Json(new { ContentHtml = viewFromAnotherController, data = result });
        }
    }

    public static class ControllerExtensions
    {
        public static async Task<string> RenderViewToStringAsync<TModel>(this Controller controller, string viewNamePath, TModel model)
        {
            if (string.IsNullOrEmpty(viewNamePath))
                viewNamePath = controller.ControllerContext.ActionDescriptor.ActionName;

            controller.ViewData.Model = model;

            using (StringWriter writer = new StringWriter())
            {
                try
                {
                    IViewEngine viewEngine = controller.HttpContext.RequestServices.GetService(typeof(ICompositeViewEngine)) as ICompositeViewEngine;

                    ViewEngineResult viewResult = null;

                    if (viewNamePath.EndsWith(".cshtml"))
                        viewResult = viewEngine.GetView(viewNamePath, viewNamePath, false);
                    else
                        viewResult = viewEngine.FindView(controller.ControllerContext, viewNamePath, false);

                    if (!viewResult.Success)
                        return $"A view with the name '{viewNamePath}' could not be found";

                    ViewContext viewContext = new ViewContext(
                        controller.ControllerContext,
                        viewResult.View,
                        controller.ViewData,
                        controller.TempData,
                        writer,
                        new HtmlHelperOptions()
                    );

                    await viewResult.View.RenderAsync(viewContext);

                    return writer.GetStringBuilder().ToString();
                }
                catch (Exception exc)
                {
                    return $"Failed - {exc.Message}";
                }
            }
        }
    }
        public class WorksheetExcel
    {
        public string WorkSheetName { get; set; }
        public int WorkSheetIndex { get; set; }
    }

  
}
