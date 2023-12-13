using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using PdfToSvg;
using WebApi.App_Code;
using WebApi.Databases.PostgreSQL;
using WebApi.Models;
using System.IO;
using iTextSharp.text;
using iTextSharp.text.pdf;
using System.Xml;
using System.Text;
//using System.Drawing;
using System.Drawing.Imaging;
using iTextSharp.text.pdf.parser;
using System.Data;
using System.Net;
using WebApi.Databases.PostgreSQL;

namespace WebApi.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]

    public class docController : Controller
    {
        private readonly DocDbPostgres _dbPostgres;

        public docController()
        {
            try
            {
                _dbPostgres = new DocDbPostgres();
            }
            catch (Exception) { }
        }
        // POST: api/doc/addupdate
        [Authorize]
        [HttpPost]
        public returnval addupdate([FromBody] docinfo mod)
        {
            try
            {
                //new Log(_config).LogParam(Request.Path.Value, mod);
                Log.LogParam(Request.Path.Value, mod);

                if (mod == null)
                {
                    // Invalid params
                    return new returnval { returncode = ReturnCode.GENERAL_INVALIDPARAM, returnmsg = "Lỗi hệ thống. Thiếu thông tin để hoàn thành chức năng.", id = null };
                }

                //if (mod != null)
                //{
                // Tom tat/Mo ta sach
                mod.abstracttxt = HtmlExts.HtmlToText(mod.abstractcontent);

                // Tom tat/Mo ta sach
                mod.descttxt = HtmlExts.HtmlToText(mod.desct);
                //}

                returnval ret = _dbPostgres == null ? null : _dbPostgres.DocInfo_AddUpdate(mod);

                /////////////////////////////////
                if (ret != null && ret.returncode == ReturnCode.DO_OK)
                {
                    try
                    {
                        // call API gen read online data
                        // POST "api/doc/gendoconline"

                        Dictionary<string, object> param = new Dictionary<string, object>();
                        param.Add("userid", mod.createdby);
                        param.Add("docid", ret.id);
                        param.Add("docattachid", null);
                        param.Add("overwrite", true);
                        param.Add("appfuncid", mod.appfuncid);
                        param.Add("routing", mod.routing);
                        //var apiResponse = new APICaller(_config).GenDocOnline(param);
                        doccontent doccontents = new doccontent();
                        doccontents.userid = mod.createdby;
                        doccontents.docid = ret.id;
                        doccontents.docattachid = null;
                        doccontents.overwrite = true;
                        doccontents.appfuncid = mod.appfuncid;
                        doccontents.routing = mod.routing;
                        var apiResponse = gendoconline(doccontents);
                        if (apiResponse == null)
                        {
                            // Call API khong thanh cong
                            //(new Log(_config)).Write("docinfoController.addupdate(). Call API generate book online UNsuccess and not responding.");
                            Log.Write("docinfoController.addupdate(). Call API generate book online UNsuccess and not responding.");
                        }
                        else
                        {
                            //var apiRet = JsonConvert.DeserializeObject<returnval>(apiResponse);
                            if (apiResponse.returncode != ReturnCode.DO_OK)
                            {
                                // Call API khong thanh cong
                                //(new Log(_config)).Write("docinfoController.addupdate(). Call API generate book online UNsuccess. returncode=" + apiRet.returncode.ToString() + ", returnmsg='" + apiRet.returnmsg + "'");
                                Log.Write("docinfoController.addupdate(). Call API generate book online UNsuccess. returncode=" + apiResponse.returncode.ToString() + ", returnmsg='" + apiResponse.returnmsg + "'");
                            }
                        }
                        //Console.WriteLine();
                    }
                    catch (Exception excallapi)
                    {
                        //(new Log(_config)).Write("docinfoController.addupdate(). Call API generate book online exception. Msg: ''" + excallapi.Message + "''");
                        Log.Write("docinfoController.addupdate(). Call API generate book online exception. Msg: ''" + excallapi.Message + "''");
                    }

                    // Table of Contents - Muc luc
                    try
                    {
                        // Chi generate Muc luc neu upload file dinh kem moi, Khong tu dong reset va load Muc luc truong hop cap nhat file sach dinh kem
                        //if (mod != null && mod.docattachid == null)
                        if (mod.docid == null
                            && (!string.IsNullOrEmpty(mod.attachfile) || !string.IsNullOrEmpty(mod.attachlink))
                            )
                        {
                            // call API get bookmark/table of content from file import to database
                            // POST "api/doc/gentoc"

                            Dictionary<string, object> param = new Dictionary<string, object>();
                            param.Add("userid", mod.createdby);
                            param.Add("docid", ret.id);
                            //param.Add("docattachid", ret.id);
                            //param.Add("overwrite", true);
                            param.Add("appfuncid", mod.appfuncid);
                            param.Add("routing", mod.routing);

                            //var apiResponse = new APICaller(_config).GenTOC(param);
                            doccontent doccontents = new doccontent();
                            doccontents.docid = ret.id;
                            doccontents.userid = mod.createdby;
                            doccontents.appfuncid = mod.appfuncid;
                            doccontents.routing = mod.routing;
                            var apiResponse = gentoc(doccontents);
                            if (apiResponse == null)
                            {
                                // Call API khong thanh cong
                                //(new Log(_config)).Write("docinfoController.addupdate(). Call API get bookmark and import table of content UNsuccess and not responding.");
                                Log.Write("docinfoController.addupdate(). Call API get bookmark and import table of content UNsuccess and not responding.");
                            }
                            else
                            {
                                //var apiRet = JsonConvert.DeserializeObject<returnval>(apiResponse);
                                if (apiResponse.returncode != ReturnCode.DO_OK)
                                {
                                    // Call API khong thanh cong
                                    //(new Log(_config)).Write("docinfoController.addupdate(). Call API get bookmark and import table of content UNsuccess. returncode=" + apiRet.returncode.ToString() + ", returnmsg='" + apiRet.returnmsg + "'");
                                    Log.Write("docinfoController.addupdate(). Call API get bookmark and import table of content UNsuccess. returncode=" + apiResponse.returncode.ToString() + ", returnmsg='" + apiResponse.returnmsg + "'");
                                }
                            }
                        }
                    }
                    catch (Exception excallapi)
                    {
                        //(new Log(_config)).Write("docinfoController.addupdate(). Call API generate Table of Contents exception. Msg: ''" + excallapi.Message + "''");
                        Log.Write("docinfoController.addupdate(). Call API generate Table of Contents exception. Msg: ''" + excallapi.Message + "''");
                    }
                }
                /////////////////////////////////

                return ret;
            }
            catch (Exception ex)
            {
                //(new Log(_config)).Write("docinfoController.addupdate() exception. Msg: ''" + ex.Message + "''");
                Log.Write("docinfoController.addupdate() exception. Msg: ''" + ex.Message + "''");
            }
            return new returnval { returncode = ReturnCode.GENERAL_SYSTEM_ERR, returnmsg = "Lỗi hệ thống", id = null };
        }
        // POST: api/doc/gendoconline
        [Authorize]
        [HttpPost]
        public returnval? gendoconline([FromBody] doccontent mod)
        {
            // tag, .azw3, .prc, mobi
            // Function nay generate du lieu doc sach
            try
            {
                if (mod == null)
                {
                    // Khong co tham so
                    //(new Log(_config)).Write("docController.gendoconline(). Params is null.");
                    Log.Write("docController.gendoconline(). Params is null.");
                    return new returnval { returncode = ReturnCode.GENERAL_INVALIDPARAM, returnmsg = "Sai tham số.", id = null };
                }

                //new Log(_config).LogParam(Request.Path.Value, mod);
                Dictionary<string, object> prs = new Dictionary<string, object>();
                prs.Add("userid", mod.userid);
                prs.Add("docid", mod.docid);
                prs.Add("docattachid", mod.docattachid);
                prs.Add("ignorestatus", mod.ignorestatus);
                prs.Add("overwrite", mod.overwrite);
                prs.Add("appfuncid", mod.appfuncid);
                prs.Add("routing", mod.routing);
                //new Log(_config).LogParam(Request.Path.Value, prs);

                Log.LogParam(Request.Path.Value, prs);

                if (_dbPostgres == null)
                {
                    // Ket noi DB khong thanh cong
                    //(new Log(_config)).Write("docController.gendoconline(). Error connect to database.");
                    Log.Write("docController.gendoconline(). Error connect to database.");
                    return new returnval { returncode = ReturnCode.GENERAL_DATABASE_ERR, returnmsg = "Lỗi hệ thống. Không thể kết nối cơ sở dữ liệu.", id = null };
                }

                // Kiem tra tai khoan co quyen cap nhat thong tin sach khong
                // Lay cac thong tin can thiet de tao du lieu doc sach

                //var docinfo = _dbPostgres.DocInfo_GetInfo_With_VerifyRole(mod.userid, mod.docattachid, mod.docid, null, null);
                var docattachs = _dbPostgres.DocAttach_GetInfo_With_VerifyRole(mod.userid, mod.docattachid, mod.docid, mod.appfuncid, mod.routing);
                if (docattachs == null)
                {
                    // Lay thong tin sach khong thanh cong
                    //(new Log(_config)).Write("docController.gendoconline(). Can not get docattach info. docattachid=" + (mod.docattachid ?? 0).ToString() + ", docid=" + (mod.docid ?? 0).ToString() + ", userid=" + (mod.userid ?? 0).ToString());
                    Log.Write("docController.gendoconline(). Can not get docattach info. docattachid=" + (mod.docattachid ?? 0).ToString() + ", docid=" + (mod.docid ?? 0).ToString() + ", userid=" + (mod.userid ?? 0).ToString());
                    return new returnval { returncode = ReturnCode.GENERAL_SYSTEM_ERR, returnmsg = "Lỗi hệ thống. Lấy thông tin sách không thành công.", id = null };
                }


                ///////////////////////////////////////////////////
                // Generate SVG files
                //ReadOnlineGenerateData rodata = new ReadOnlineGenerateData(docattachs, mod.overwrite, mod.userid, mod.appfuncid, mod.routing, _config, _dbPostgres);
                //System.Threading.Thread thrGenData = new System.Threading.Thread(new System.Threading.ThreadStart(rodata.GenSVG));
                //thrGenData.Start();
                ///////////////////////////////////////////////////


                ///////////////////////////////////////////////////
                // Generate IMAGE files
                //ReadOnlineGenerateData rodata = new ReadOnlineGenerateData(docattachs, mod.overwrite, mod.ignorestatus, mod.userid, mod.appfuncid, mod.routing, _config, _dbPostgres);
                ReadOnlineGenerateData rodata = new ReadOnlineGenerateData(docattachs, mod.overwrite, mod.ignorestatus, mod.userid, mod.appfuncid, mod.routing, _dbPostgres);
                System.Threading.Thread thrGenData = new System.Threading.Thread(new System.Threading.ThreadStart(rodata.GenImage));
                thrGenData.Start();
                ///////////////////////////////////////////////////

                return new returnval { returncode = ReturnCode.DO_OK, returnmsg = "OK", id = null };
            }
            catch (Exception ex)
            {
                //(new Log(_config)).Write("docController.gendoconline() exception. Msg: ''" + ex.Message + "''");
                Log.Write("docController.gendoconline() exception. Msg: ''" + ex.Message + "''");
            }
            return new returnval { returncode = ReturnCode.GENERAL_SYSTEM_ERR, returnmsg = "Lỗi hệ thống", id = null };
        }

        // POST: api/doc/gentoc
        [Authorize]
        [HttpPost]
        public returnval? gentoc([FromBody] doccontent mod)
        {
            try
            {
                if (mod == null)
                {
                    // Khong co tham so
                    //(new Log(_config)).Write("docController.gentoc(). Params is null.");
                    Log.Write("docController.gentoc(). Params is null.");
                    return new returnval { returncode = ReturnCode.GENERAL_INVALIDPARAM, returnmsg = "Sai tham số.", id = null };
                }

                //new Log(_config).LogParam(Request.Path.Value, mod);
                Dictionary<string, object> prs = new Dictionary<string, object>();
                prs.Add("userid", mod.userid);
                prs.Add("docid", mod.docid);
                prs.Add("docattachid", mod.docattachid);
                prs.Add("overwrite", mod.overwrite);
                prs.Add("appfuncid", mod.appfuncid);
                prs.Add("routing", mod.routing);
                //new Log(_config).LogParam(Request.Path.Value, prs);
                Log.LogParam(Request.Path.Value, prs);

                if (_dbPostgres == null)
                {
                    // Ket noi DB khong thanh cong
                    //(new Log(_config)).Write("docController.gentoc(). Error connect to database.");
                    Log.Write("docController.gentoc(). Error connect to database.");
                    return new returnval { returncode = ReturnCode.GENERAL_DATABASE_ERR, returnmsg = "Lỗi hệ thống. Không thể kết nối cơ sở dữ liệu.", id = null };
                }

                //string strUploadPath = _config.GetSection("AppSettings").GetValue<string>("UploadPath");
                string strUploadPath = WebConfigs.AppSettings.UploadPath;
                strUploadPath = strUploadPath.Replace(@"/", @"\").TrimEnd(@"\".ToCharArray()) + @"\";

                var docattachs = _dbPostgres.DocAttach_GetInfo_With_VerifyRole(mod.userid, mod.docattachid, mod.docid, mod.appfuncid, mod.routing);
                if (docattachs == null)
                {
                    // Lay thong tin sach khong thanh cong
                    //(new Log(_config)).Write("docController.gentoc(). Can not get docattach info. docattachid=" + (mod.docattachid ?? 0).ToString() + ", docid=" + (mod.docid ?? 0).ToString() + ", userid=" + (mod.userid ?? 0).ToString());
                    Log.Write("docController.gentoc(). Can not get docattach info. docattachid=" + (mod.docattachid ?? 0).ToString() + ", docid=" + (mod.docid ?? 0).ToString() + ", userid=" + (mod.userid ?? 0).ToString());
                    return new returnval { returncode = ReturnCode.GENERAL_SYSTEM_ERR, returnmsg = "Lỗi hệ thống. Lấy thông tin sách không thành công.", id = null };
                }

                foreach (docattach attach in docattachs)
                {
                    if (attach == null || attach.returncode == null || attach.returncode != ReturnCode.DO_OK)
                    {
                        //(new Log(_config)).Write("docController.gentoc(). Get docattach failed. returncode=" + ((attach == null || attach.returncode == null) ? "null" : attach.returncode.ToString()) + ": " + attach.returnmsg);
                        Log.Write("docController.gentoc(). Get docattach failed. returncode=" + ((attach == null || attach.returncode == null) ? "null" : attach.returncode.ToString()) + ": " + attach.returnmsg);
                        return new returnval { returncode = attach.returncode, returnmsg = attach.returnmsg, id = null };
                        //continue;
                    }

                    bool bDeleteTempFile = false;
                    string strFullAttachFile = "";
                    if (attach.issync == true)
                    {
                        //strFullAttachFile = attach.syncapi.ToString().TrimEnd("/".ToCharArray()) + "/" + attach.attachlink.ToString().TrimStart("/".ToCharArray());
                        if (string.IsNullOrEmpty(attach.attachlink))
                        {
                            Log.Write("docController.gentoc(). issync=" + attach.issync.ToString() + " but attachlink is null or empty. docid=" + (attach.docid ?? 0).ToString() + ", docattachid=" + attach.docattachid.ToString());
                            // file dinh kem ke tiep
                            continue;
                        }
                        else
                        {
                            strFullAttachFile = attach.attachlink.ToString();

                            // download file
                            string tempFile = System.IO.Path.GetTempPath() + Guid.NewGuid().ToString() + System.IO.Path.GetExtension(attach.attachlink.ToString());

                            HttpWebRequest aRequest = (HttpWebRequest)WebRequest.Create(strFullAttachFile);
                            HttpWebResponse aResponse = (HttpWebResponse)aRequest.GetResponse();
                            Stream rtn = aResponse.GetResponseStream();
                            using (FileStream fs = new FileStream(tempFile, FileMode.Create))
                            {
                                rtn.CopyTo(fs);
                                fs.Close();
                            }

                            strFullAttachFile = tempFile;
                            bDeleteTempFile = true;
                        }
                    }
                    else
                    {
                        string? strAttachFile = attach.attachfile;
                        if (string.IsNullOrEmpty(strAttachFile))
                        {
                            //(new Log(_config)).Write("docController.gentoc(). No attach file. docid=" + (attach.docid ?? 0).ToString() + ", docattachid=" + attach.docattachid.ToString());
                            Log.Write("docController.gentoc(). No attach file. docid=" + (attach.docid ?? 0).ToString() + ", docattachid=" + attach.docattachid.ToString());
                            // file dinh kem ke tiep
                            continue;
                        }

                        strFullAttachFile = strUploadPath + strAttachFile.Replace("/", "\\");
                    }

                    if (string.IsNullOrEmpty(strFullAttachFile) || !System.IO.File.Exists(strFullAttachFile))
                    {
                        // file dinh kem ke tiep
                        //(new Log(_config)).WriteThreadLog("docController.gentoc(). Attach file does not exist. AttachFile='" + strFullAttachFile + "', docid=" + (attach.docid ?? 0).ToString() + ", docattachid=" + attach.docattachid.ToString());
                        Log.WriteThreadLog("docController.gentoc(). Attach file does not exist. AttachFile='" + strFullAttachFile + "', docid=" + (attach.docid ?? 0).ToString() + ", docattachid=" + attach.docattachid.ToString());
                        continue;
                    }

                    //string? pdfFile = @"C:\Websites\EReader\files\fileupload\book\xua-va-nay-537.pdf";

                    var tocs = TOCUtil.GetAndParseTableOfContent(strFullAttachFile);

                    if (bDeleteTempFile == true)
                    {
                        // Delete temp file
                        try
                        {
                            System.IO.File.Delete(strFullAttachFile);
                        }
                        catch (Exception) { }
                    }

                    if (tocs == null)
                    {
                        //(new Log(_config)).WriteThreadLog("docController.gentoc(). Get bookmark from file '" + strFullAttachFile + "' return null. docid=" + (attach.docid ?? 0).ToString() + ", docattachid=" + attach.docattachid.ToString());
                        Log.WriteThreadLog("docController.gentoc(). Get bookmark from file '" + strFullAttachFile + "' return null. docid=" + (attach.docid ?? 0).ToString() + ", docattachid=" + attach.docattachid.ToString());
                        continue;
                    }

                    // Delete and import into DB
                    doctoc_import toc = new doctoc_import();
                    toc.docattachid = attach.docattachid; // mod.docattachid;
                    //toc.doctoc_jss = JsonConvert.SerializeObject(tocs);
                    toc.doctoc_js = tocs;
                    toc.createdby = mod.userid;
                    toc.appfuncid = mod.appfuncid;
                    toc.routing = mod.routing;

                    returnval retVal = _dbPostgres.DocToc_ResetAndImport(toc);
                }

                return new returnval { returncode = ReturnCode.DO_OK, returnmsg = "Ok", id = null };
            }
            catch (Exception ex)
            {
                //(new Log(_config)).Write("docController.gentoc() exception. Msg: ''" + ex.Message + "''");
                Log.Write("docController.gentoc() exception. Msg: ''" + ex.Message + "''");
            }
            return new returnval { returncode = ReturnCode.GENERAL_SYSTEM_ERR, returnmsg = "Lỗi hệ thống", id = null };
        }


        

        // Generate thumbnail file noi dung doc truc tuyen
        // GET: api/doc/gendoconlinethumb
        //[Authorize]
        [HttpGet]
        public string? gendoconlinethumb(
            //[FromQuery] string? doconlineFolder, [FromQuery] string? doconlineFolderEncode
            )
        {
            try
            {
                //Log.LogParam(Request.Path.Value, doconlineFolder);

                if (_dbPostgres == null)
                {
                    return "Database is null.";
                }

                int iCountOK = 0, iCountErr = 0;

                string strQuery = @"select docid,docattachid,attachfile from docattach where attachfile is not null and attachfile!='' and attachfile ilike '%.pdf' order by docid,docattachid;";
                DataTable dt = _dbPostgres.Execute(strQuery);
                if (dt != null)
                {
                    foreach (DataRow dr in dt.Rows)
                    {
                        long? docid = DBUtil.GetLongValue(dr, "docid");
                        long? docattachid = DBUtil.GetLongValue(dr, "docattachid");
                        string attachfile = DBUtil.GetStrValue(dr, "attachfile");

                        if (docid > 0 && docattachid > 0 && !string.IsNullOrEmpty(attachfile))
                        {
                            if (GenImage(docid, docattachid, attachfile) == true)
                            {
                                iCountOK++;
                            }
                            else
                            {
                                iCountErr++;
                            }
                        }
                    }
                    dt.Dispose();
                }
                return iCountOK.ToString() + " file(s) OK. " + iCountErr.ToString() + " file(s) error.";
            }
            catch (Exception ex)
            {
                Log.Write("docController.gendoconlinethumb() exception. Error msg:\r\n" + ex.Message);
                return ex.Message;
            }
        }

        private bool? GenImage(long? docid, long? docattachid, string? attachfile)
        {
            try
            {
                //Log.WriteThreadLog("ReadOnlineGenerateData.GenImage(). Thread START generate read online.");

                //if (m_docattachs == null)
                //{
                //    Log.WriteThreadLog("ReadOnlineGenerateData.GenImage(). Thread STOP generate read online. m_docattachs is null.");
                //    return;
                //}

                ///////////////////////////////////////////////////
                string strUploadPath = WebConfigs.AppSettings.UploadPath;
                strUploadPath = strUploadPath.Replace(@"/", @"\").TrimEnd(@"\".ToCharArray()) + @"\";

                string strDocOnlinePath = WebConfigs.AppSettings.DocOnlinePath;
                strDocOnlinePath = strDocOnlinePath.Replace(@"/", @"\").TrimEnd(@"\".ToCharArray()) + @"\";

                // Encode file hinh anh doc sach truc tuyen
                string strIsEncodeDocOnline = WebConfigs.AppSettings.IsEncodeDocOnline.Trim().ToLower();
                string strDocOnlineEncodePath = WebConfigs.AppSettings.DocOnlineEncodePath.Trim().TrimEnd("\\".ToCharArray()) + "\\";
                string strEncodeFile;

                int iNumOK = 0;
                bool bThumb = true;

               
                long? nDocAttachID = docattachid;
                long? nDocID = docid;
                string? strAttachFile = attachfile;

                

                string strFullAttachFile = strUploadPath + strAttachFile.Replace("/", "\\");
                if (string.IsNullOrEmpty(strFullAttachFile) || !System.IO.File.Exists(strFullAttachFile))
                {
                    //(new Log(m_config)).WriteThreadLog("ReadOnlineGenerateData.GenImage(). Attach file does not exist. AttachFile='" + strFullAttachFile + "', docid=" + (nDocID ?? 0).ToString() + ", docattachid=" + nDocAttachID.ToString());
                    Log.WriteThreadLog("ReadOnlineGenerateData.GenImage(). Attach file does not exist. AttachFile='" + strFullAttachFile + "', docid=" + (nDocID ?? 0).ToString() + ", docattachid=" + nDocAttachID.ToString());
                    //return new returnval { returncode = ReturnCode.DOC_NO_ATTACHFILE, returnmsg = "Không có file sách đính kèm.", id = null };

                    // file dinh kem ke tiep
                    //continue;
                    return false;
                }

                //bool bUpdateStatusIntoDB = false;
                int? numPage = null;
                //long? docSize = null;
                //string? docOnlineFormat = "";
                //int? imgWidth = null, imgHeight = null;
                //int? pagewidth = null, pageheight = null;

                //string strPageFile = "";
                //string strImageFile = "";
                string ext = System.IO.Path.GetExtension(strFullAttachFile).Trim().ToLower();
                if (ext == ".pdf")
                {
                    //string filePdf = @"C:\Websites\EReader\files\fileupload\book\xua-va-nay-537.pdf";
                    //string strImagePath = @"C:\Websites\EReader\files\doconline\1\DtronixPdf\";

                    //string strDocPageFolder = strDocOnlinePath + nDocID.ToString() + @"\" + nDocAttachID.ToString() + @"\";
                    //Directory.CreateDirectory(strDocPageFolder);

                    string strSubFolderDocPage = nDocID.ToString() + @"\" + nDocAttachID.ToString() + @"\";
                    Directory.CreateDirectory(strDocOnlinePath + strSubFolderDocPage);

                    // sub-folder encode
                    string strSubFolderEncode = nDocID.ToString() + @"\" + nDocAttachID.ToString() + @"\";
                    Directory.CreateDirectory(strDocOnlineEncodePath + strSubFolderEncode);

                    string outputFileExt = ".jpg";
                    float fixedScale = 2.0f;

                    //var drawing = DtronixPdf.PdfDocument.Load(filePdf, null);
                    var document = DtronixPdf.PdfDocument.Load(strFullAttachFile, null);
                    numPage = document.Result.Pages;
                    //docSize = (new FileInfo(strFullAttachFile)).Length;

                    var pg = numPage > 1 ? document.Result.GetPage(1) : document.Result.GetPage(0);
                    float pageWidth = (pg != null) ? pg.Result.Size.Width : 0;
                    float pageHeight = (pg != null) ? pg.Result.Size.Height : 0;

                    pageWidth = pageWidth * fixedScale;
                    pageHeight = pageHeight * fixedScale;

                    //float scale = 0f;
                    //float width, height;

                    //string strImageFile = "";
                    string strImageFileName = "", strImageFileFull = "";
                    int iZoomLevel = 0;

                    SixLabors.ImageSharp.Formats.IImageEncoder encoder = null;
                    if (outputFileExt == ".jpg")
                        encoder = new SixLabors.ImageSharp.Formats.Jpeg.JpegEncoder();
                    else if (outputFileExt == ".png")
                        encoder = new SixLabors.ImageSharp.Formats.Png.PngEncoder();

                    for (int pageNo = 0; pageNo < numPage; pageNo++)
                    {
                        var page = document.Result.GetPage(pageNo);

                        if (bThumb == true)
                        {
                            // thumbnail
                            iZoomLevel = 0;

                            //float heightThumb = pageHeight;
                            //float widthThumb = (page.Result.Size.Width * pageHeight) / page.Result.Size.Height;
                            //float heightThumb = 120;
                            //float heightThumb = 420;
                            //float heightThumb = (pg != null) ? pg.Result.Size.Height/2 : 420;
                            float heightThumb = 250;
                            float widthThumb = (page.Result.Size.Width * heightThumb) / page.Result.Size.Height;

                            float scaleThumb = heightThumb / page.Result.Size.Height;

                            SixLabors.ImageSharp.RectangleF viewportThumb = new SixLabors.ImageSharp.RectangleF(0, 0, widthThumb, heightThumb);
                            var resultThumb = page.Result.Render(scaleThumb, SixLabors.ImageSharp.Color.White, viewportThumb);

                            strImageFileName = string.Format("p{0,6}_{1}{2}", pageNo + 1, iZoomLevel, outputFileExt);
                            strImageFileName = strImageFileName.Replace(" ", "0");
                            strImageFileFull = strDocOnlinePath + strSubFolderDocPage + strImageFileName;

                            if (System.IO.File.Exists(strImageFileFull))
                                System.IO.File.Delete(strImageFileFull);

                            using (var fs = new System.IO.FileStream(strImageFileFull, FileMode.Create, FileAccess.Write))
                            {
                                resultThumb.Result.Image.Save(fs, encoder);
                                fs.Close();
                            }

                            //////////////////////////////////////////////
                            // Encode file hinh anh doc sach truc tuyen
                            if (strIsEncodeDocOnline == "true")
                            {
                                strEncodeFile = string.Format("p{0,6}_{1}{2}", pageNo + 1, iZoomLevel, ".lvm");
                                strEncodeFile = strEncodeFile.Replace(" ", "0");
                                strEncodeFile = strDocOnlineEncodePath + strSubFolderEncode + strEncodeFile;

                                if (System.IO.File.Exists(strEncodeFile))
                                    System.IO.File.Delete(strEncodeFile);

                                string strImageFileCopy = strDocOnlineEncodePath + strSubFolderEncode + strImageFileName;
                                System.IO.File.Copy(strImageFileFull, strImageFileCopy, true);
                                FileEncode.EncodeFileBytes(strImageFileCopy, strEncodeFile);
                            }
                        }

                        
                    }
                    document.Dispose();
                    return true;
                }
                else
                {
                    return false;
                }


                
            }
            catch (Exception ex)
            {
                
                return false;
            }
        }
    }
}
