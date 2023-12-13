using HtmlAgilityPack;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using Newtonsoft.Json;
using ObjectDefine;
using RepositoriesAPI;
using Spire.Doc.Documents.XML;
using System.Net;
using System.Text;
using System.Web.Helpers;
using System.Xml;
using WebAdmin.Helper;
using WebAdmin.Models;

namespace WebAdmin.Controllers
{
    [AuthenticateFilter]
    public class DocExamController : Controller
    {
        #region Interface
        private readonly IStringLocalizer<DocExamController> _localizer;
        Rep_DocExam repdocexam = new Rep_DocExam(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        Rep_Doc repdocs = new Rep_Doc(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        Rep_File repfile = new Rep_File(WebConfigs.AppSettings.WebApiFile, WebConfigs.AppSettings.WebApiFile_clientId, WebConfigs.AppSettings.WebApiFile_clientSecret);
        Rep_DocQuizResult rep_DocQuizResult = new Rep_DocQuizResult(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        string readfile = WebConfigs.AppSettings.WebApiFileUrl;

        public DocExamController(IStringLocalizer<DocExamController> localizer)
        {
            _localizer = localizer;
        }
        #endregion

        #region Trang index của bài kiểm tra 
        public IActionResult Index(long? id)
        {
            doc data = new doc();
            data.docid = id;
            data.getby = HttpContext.GetUserID();
            //data
            string res = repdocs.detail(data.docid, data.getby, true);
            if (!string.IsNullOrWhiteSpace(res)) data = JsonConvert.DeserializeObject<doc>(res);
            if (HttpContext.GetUserRole() == 1301)
            {
                if (data.createdby != HttpContext.GetUserID())
                {
                    return RedirectToAction("Index", "Doc");
                }
            }
            if (id == null)
            {
                return RedirectToAction("Index", "Doc");
            }
            ListBreadcrumb breadcrumb = new ListBreadcrumb();
            breadcrumb.Add(new BreadcrumbObject(_localizer["baikiemtra"]));
            ViewBag.Breadcrumb = breadcrumb;
            ViewBag.docid = id;
            ViewBag.userid = HttpContext.GetUserID();
            return View();
        }
        #endregion

        #region Xem bài kiểm tra mẫu 

        [HttpGet]
        public IActionResult Detail(docexam docexams)
        {
            List<docexam> data = new List<docexam>();
            if (docexams.docquizid != null)
            {
                docexams.getby = HttpContext.GetUserID();
                docexams.foredit = true;
                docexams.numofrow = 1;
                //data
                string? res = repdocexam.DocExam_search(docexams);
                if (!string.IsNullOrWhiteSpace(res)) data = JsonConvert.DeserializeObject<List<docexam>>(res);
                for (var i = 0; i < data.Count; i++)
                {
                    docexams = data[i];
                    if (!string.IsNullOrEmpty(docexams.content_link))
                    {
                        ServicePointManager.Expect100Continue = true;
                        ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                        string? json = (new WebClient()).DownloadString(readfile + docexams.content_link);
                        docexams.json_content = JsonConvert.DeserializeObject<List<question_bank>>(json);
                    }
                    data[i].json_content = docexams.json_content;
                    break;
                }
                return View(data);
            }
            return View(data);
        }
        #endregion

        #region Thêm / Sửa bài kiểm tra (View)

        public IActionResult Addupdate(long? docid, long? id)
        {
            List<docexam> data = new List<docexam>();
            if (id != null)
            {
                docexam docexams = new docexam();
                docexams.docquizid = id;
                docexams.docid = docid;
                docexams.getby = HttpContext.GetUserID();
                docexams.foredit = true;
                docexams.numofrow = 1;
                //data
                string res = repdocexam.DocExam_search(docexams);
                if (!string.IsNullOrWhiteSpace(res)) data = JsonConvert.DeserializeObject<List<docexam>>(res);
                return View(data);
            }
            return View(data);
        }
        #endregion

        #region Thêm / Sửa bài kiểm tra (Function)
        [HttpPost]
        public JsonResult Addupdate_api(docexam docexams)
        {
            if (!string.IsNullOrEmpty(docexams.content))
            {
                string filename_output = DateTime.Now.ToString("yyyyMMddHHmmssfff") + ".json";
                byte[] data_response = Encoding.UTF8.GetBytes(docexams.content);
                var res_upload = repfile.Upload(data_response, filename_output, "document", "questionnaire", false, true);
                return_upload return_upload = JsonConvert.DeserializeObject<return_upload>(res_upload);
                if (return_upload != null && return_upload.ReturnCode == 0)
                {
                    if (return_upload.file != null && return_upload.file.name != null)
                    {
                        docexams.content_link = return_upload.path + "/" + return_upload.file.name;
                    }

                }
            }
            docexams.createdby = HttpContext.GetUserID();
            //data
            string res = repdocexam.DocExam_addupdate(docexams);
            ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);
            return Json(new { returncode = returnExecute.returncode, id = returnExecute.id, returnmsg = returnExecute.returnmsg });
        }
        #endregion

        #region Lấy danh sách bài kiểm tra
        public JsonResult Search(docexam docexams)
        {
            List<docexam> data = new List<docexam>();
            docexams.getby = HttpContext.GetUserID();
            docexams.foredit = true;
            //data
            string res = repdocexam.DocExam_search(docexams);
            if (!string.IsNullOrWhiteSpace(res)) data = JsonConvert.DeserializeObject<List<docexam>>(res);
            return Json(new { data = data, total = data.Count > 0 ? data[0].total : 0 });
        }
        #endregion

        #region Danh sách các người dùng đã làm bài kiểm tra
        public JsonResult docquiz_search_user(docquiz_result docquiz_results)
        {
            List<docquiz_result> data = new List<docquiz_result>();
            docquiz_results.getby = HttpContext.GetUserID();
            //data
            string res = rep_DocQuizResult.search_user(docquiz_results);
            if (!string.IsNullOrWhiteSpace(res)) data = JsonConvert.DeserializeObject<List<docquiz_result>>(res);
            return Json(new { data = data, total = data.Count > 0 ? data[0].total : 0 });
        }
        #endregion

        #region Thêm / Sửa câu hỏi trong bài kiểm tra
        public IActionResult Addquestion(string json)
        {
            List<question_bank> result = new List<question_bank>();
            if (!string.IsNullOrWhiteSpace(json))
            {
                result = JsonConvert.DeserializeObject<List<question_bank>>(json);
            }
            return View(result);
        }
        #endregion

        #region Lấy danh sách câu hỏi (View)
        public IActionResult ViewQuestion(string json)
        {
            List<question_bank> result = new List<question_bank>();
            if (!string.IsNullOrWhiteSpace(json))
            {
                result = JsonConvert.DeserializeObject<List<question_bank>>(json);
            }
            return View(result);
        }
        #endregion

        #region Xóa bài kiểm tra
        [HttpPost]
        public JsonResult DocExam_delete(docexam docexams)
        {
            docexams.getby = HttpContext.GetUserID();
            long? deletedby = HttpContext.GetUserID();
            string res = repdocexam.DocExam_delete(docexams, deletedby);
            if (string.IsNullOrEmpty(res)) Json(new { returncode = -1 });
            //lưu mã lỗi 
            ReturnExecute returnExecute = JsonConvert.DeserializeObject<ReturnExecute>(res);
            return Json(new { returncode = returnExecute.returncode, id = returnExecute.id, returnmsg = returnExecute.returnmsg });
        }
        #endregion

        #region Kết quả bài kiểm tra (View)
        public IActionResult ViewResultExercise(long? id)
        {
            long? getby = HttpContext.GetUserID();
            string res_result = rep_DocQuizResult.search(new docquiz_result
            {
                docquizresultid = id,
                posstart = 1,
                numofrow = 1,
                getby = getby,
            });
            docquiz_result docquiz_result = new docquiz_result();
            List<question_bank> lst_qbank = new List<question_bank>();
            if (!string.IsNullOrEmpty(res_result))
            {
                List<docquiz_result> lst = JsonConvert.DeserializeObject<List<docquiz_result>>(res_result);
                if (lst != null && lst.Count > 0)
                {
                    docquiz_result = lst[0];
                    string answer_link = docquiz_result.answer_link;
                    if (!string.IsNullOrEmpty(answer_link))
                    {
                        try
                        {
                            //
                            string link_content = WebConfigs.AppSettings.WebApiFileUrl + answer_link;
                            //tải file về
                            byte[] fileData = null;
                            using (var wc = new System.Net.WebClient())
                                fileData = wc.DownloadData(link_content);
                            if (fileData != null)
                            {
                                string content_question = Encoding.UTF8.GetString(fileData);
                                if (!string.IsNullOrEmpty(content_question))
                                {
                                    lst_qbank = JsonConvert.DeserializeObject<List<question_bank>>(content_question);
                                }
                            }
                        }
                        catch
                        {

                        }
                    }
                }
            }
            ViewBag.Question = lst_qbank;

            return View(docquiz_result);
        }
        #endregion

        #region Danh sách các câu hỏi được thêm vào bằng file (View)
        public IActionResult ImportQuestion()
        {
            return View();
        }

        #endregion

        #region Kiểm tra file được tải lên và lưu file vào trong thư mục
        [HttpPost]
        public async Task<ActionResult> Upload(IFormFile? file,bool? isUser,string? subFolder,string? fileType,bool? isExists, bool? isScaleImage)
        {
            var filePath = Path.Combine(WebConfigs.AppSettings.UploadPathQuiz, file.FileName);

            using (var stream = System.IO.File.Create(filePath))
            {
                await file.CopyToAsync(stream);
            }
            
                //PathFileName = subFolder + newName + fileExt.ToLower(),
                //FullPath = UploadUrl + subFolder + newName + fileExt.ToLower(),
                //TimeUpload = DateTime.Now
            return Json(new { ReturnCode = "0", FileName = file.FileName, TimeUpload = DateTime.Now, FullPath = WebConfigs.AppSettings.WebApiFile + file.FileName}) ;
        }
        #endregion

        #region Chuyển file word về HTML và CSS để trả ra ngoài view
        [HttpPost]
        public string WordToHTML(string? FileName)
        {
            if (string.IsNullOrWhiteSpace(FileName))
            {
                return null;
            }

            try
            {
                //log time 0
                //Log.Write("Begin Using Spire.Doc convert Word2Html: " + DateTime.Now.ToString());
                string path = WebConfigs.AppSettings.UploadPathQuiz + "\\" + FileName;
                string path1 = WebConfigs.AppSettings.UploadPathQuiz + "\\" + FileName + ".html";

                string path_docx2doc = WebConfigs.AppSettings.UploadPathQuiz + "\\" + FileName + ".doc";

                Spire.Doc.Document document = new Spire.Doc.Document();

                //
                FileInfo fi = new FileInfo(path);
                if (fi.Extension.ToLower() == "docx" || fi.Extension.ToLower() == ".docx")
                {
                    //log time 1
                    //Log.Write("Begin LoadFromFile: " + DateTime.Now.ToString());
                    document.LoadFromFile(path);

                    //log time 2
                    //Log.Write("Begin SaveToFile: " + DateTime.Now.ToString());                
                    document.SaveToFile(path_docx2doc, Spire.Doc.FileFormat.Doc);

                    path = path_docx2doc;
                    path1 = path + ".html";
                }
                //

                //log time 1
                //Log.Write("Begin LoadFromFile: " + DateTime.Now.ToString());
                document.LoadFromFile(path);
                document.HtmlExportOptions.ImageEmbedded = true;
                document.HtmlExportOptions.HasHeadersFooters = false;
                //log time 2
                //Log.Write("Begin SaveToFile: " + DateTime.Now.ToString());                
                document.SaveToFile(path1, Spire.Doc.FileFormat.Html);

                //log time 3
                //Log.Write("Begin ReadAllText: " + DateTime.Now.ToString());
                string html = System.IO.File.ReadAllText(path1);
                //chuyển hình ảnh base64 về hình ảnh
                HtmlDocument doc = new HtmlDocument();
                doc.LoadHtml(html);
                doc.DocumentNode.Descendants("img")
                                    .Where(e =>
                                    {
                                        string src = e.GetAttributeValue("src", null) ?? "";
                                        return !string.IsNullOrEmpty(src) && src.StartsWith("data:image");
                                    })
                                    .ToList()
                                    .ForEach(x =>
                                    {
                                        string currentSrcValue = x.GetAttributeValue("src", null);
                                        currentSrcValue = currentSrcValue.Split(',')[1];//Base64 part of string
                                        byte[] imageData = Convert.FromBase64String(currentSrcValue);
                                        string contentId = Guid.NewGuid().ToString();
                                        string folder_image = FileName.ToString().Split('.')[0];
                                        string path_image = WebConfigs.AppSettings.UploadPathQuiz + folder_image;
                                        DirectoryInfo di = Directory.CreateDirectory(path_image);
                                        string image_name = Path.Combine(path_image, contentId + ".png");

                                        using (var imageFile = new FileStream(@image_name, FileMode.Create))
                                        {
                                            imageFile.Write(imageData, 0, imageData.Length);
                                            imageFile.Flush();
                                        }

                                        x.SetAttributeValue("src", "/" + folder_image + "/" + contentId + ".png");
                                    });

                html = doc.DocumentNode.OuterHtml;

                //log time 4
                //Log.Write("End: " + DateTime.Now.ToString());

                return html;
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }
        #endregion

        #region Kết quả chi tiết bài kiểm tra (Function)

        public JsonResult docquiz_search(docquiz_result docquiz_results)
        {
            List<docquiz_result> data = new List<docquiz_result>();
            docquiz_results.getby = HttpContext.GetUserID();
            //data
            string res = rep_DocQuizResult.search(docquiz_results);
            if (!string.IsNullOrWhiteSpace(res)) data = JsonConvert.DeserializeObject<List<docquiz_result>>(res);
            return Json(new { data = data, total = data.Count > 0 ? data[0].total : 0 });
        }

        #endregion
    }
}
