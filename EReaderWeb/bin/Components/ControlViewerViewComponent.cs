using EReaderWeb.Helper;
using EReaderWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ObjectDefine;
using RepositoriesAPI;

namespace EReaderWeb.Components
{
    public class ControlViewerViewComponent: ViewComponent
    {
        Rep_DocToc rep_DocToc = new Rep_DocToc(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        RepDocNote repDocNote = new RepDocNote(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        Rep_Bookmark repBookmark = new Rep_Bookmark(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        Rep_DocExam rep_DocExam = new Rep_DocExam(WebConfigs.AppSettings.WebApiService, WebConfigs.AppSettings.WebApi_clientId, WebConfigs.AppSettings.WebApi_clientSecret);
        public async Task<IViewComponentResult> InvokeAsync(long? id,long? docid)
        {
            long? userid = HttpContext.GetUserID();
            //lấy mục lục
            string res_doc_toc = rep_DocToc.DocToc_Get(new doctoc
            {
                docattachid= id,
                getby=userid,
                posstart=1,
                numofrow=-1
            });
            List<doctoc> lst = new List<doctoc>();
            if (!string.IsNullOrEmpty(res_doc_toc))
            {
                lst = JsonConvert.DeserializeObject<List<doctoc>>(res_doc_toc);
            }
            //lấy danh sách notes
             string res_doc_notes = repDocNote.search(null,docid,null,id,userid,null,null,null,1,20);
            List<docnote> lst_notes = new List<docnote>();
            if (!string.IsNullOrEmpty(res_doc_notes))
            {
                lst_notes = JsonConvert.DeserializeObject<List<docnote>>(res_doc_notes);
            }
            ViewBag.Notes = lst_notes;
            //lấy danh sách bookmark
            string res_bookmark = repBookmark.search(new docbookmark
            {
                userid=userid,
                posstart=1,
                numofrow=20,
                docattachid = id,
            });
            List<docbookmark> lst_bookmark = new List<docbookmark>();
            if (!string.IsNullOrEmpty(res_bookmark))
            {
                lst_bookmark = JsonConvert.DeserializeObject<List<docbookmark>>(res_bookmark);
            }
            ViewBag.Bookmark = lst_bookmark;
            //lấy danh sách bài kiểm tra
            string res_exam = rep_DocExam.DocExam_search(new docexam
            {
                getby=userid,
                posstart=1,
                numofrow=20,
                docid = docid,
                iseffect=true,
                foredit=false
            });
            List<docexam> lst_exam = new List<docexam>();
            if (!string.IsNullOrEmpty(res_exam))
            {
                lst_exam = JsonConvert.DeserializeObject<List<docexam>>(res_exam);
            }
            ViewBag.Exam = lst_exam;
            return View("~/Views/Common/ControlViewer.cshtml",lst);
        }
    }
}
