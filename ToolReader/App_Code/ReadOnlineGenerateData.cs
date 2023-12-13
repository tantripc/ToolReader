using System;
using System.Collections.Generic;
//using System.Linq;
using System.Web;
using System.IO;
using System.Collections;
using WebApi.Models;
using WebApi.Databases.PostgreSQL;
using System.Net;

namespace WebApi.App_Code
{
    public class ReadOnlineGenerateData
    {
        private List<docattach> m_docattachs;
        private bool? m_overwrite;
        private bool? m_ignorestatus;
        private long? m_userid;
        private long? m_appfuncid;
        private string? m_routing;

        //private readonly IConfiguration m_config;
        private readonly DocDbPostgres m_dbPostgres;


        //public ReadOnlineGenerateData(List<docattach> docattachs, bool? overwrite, bool? ignorestatus, long? userid, long? appfuncid, string? routing, IConfiguration config, DocDbPostgres dbPostgres)
        public ReadOnlineGenerateData(List<docattach> docattachs, bool? overwrite, bool? ignorestatus, long? userid, long? appfuncid, string? routing, DocDbPostgres dbPostgres)
        {
            m_docattachs = docattachs;
            m_overwrite = overwrite;
            m_ignorestatus = ignorestatus;
            m_userid = userid;
            m_appfuncid = appfuncid;
            m_routing = routing;
            //m_config = config;
            m_dbPostgres = dbPostgres;
        }

        public void GenSVG()
        {
            try
            {
                //(new Log(m_config)).WriteThreadLog("ReadOnlineGenerateData.GenSVG(). Thread START generate read online.");
                Log.WriteThreadLog("ReadOnlineGenerateData.GenSVG(). Thread START generate read online.");

                if (m_docattachs == null)
                {
                    //(new Log(m_config)).WriteThreadLog("ReadOnlineGenerateData.GenSVG(). Thread STOP generate read online. m_docattachs is null.");
                    Log.WriteThreadLog("ReadOnlineGenerateData.GenSVG(). Thread STOP generate read online. m_docattachs is null.");
                    return;
                }

                ///////////////////////////////////////////////////
                //string strUploadPath = m_config.GetSection("AppSettings").GetValue<string>("UploadPath");
                string strUploadPath = WebConfigs.AppSettings.UploadPath;
                strUploadPath = strUploadPath.Replace(@"/", @"\").TrimEnd(@"\".ToCharArray()) + @"\";

                //string strDocOnlinePath = m_config.GetSection("AppSettings").GetValue<string>("DocOnlinePath");
                string strDocOnlinePath = WebConfigs.AppSettings.DocOnlinePath;
                strDocOnlinePath = strDocOnlinePath.Replace(@"/", @"\").TrimEnd(@"\".ToCharArray()) + @"\";

                int iNumOK = 0;

                foreach (docattach attach in m_docattachs)
                {
                    //docattach attach = docattach[0];
                    if (attach == null)
                    {
                        // Lay thong tin sach khong thanh cong
                        //(new Log(m_config)).WriteThreadLog("ReadOnlineGenerateData.GenSVG(). Attach info is null.");
                        Log.WriteThreadLog("ReadOnlineGenerateData.GenSVG(). Attach info is null.");
                        //return new returnval { returncode = ReturnCode.GENERAL_SYSTEM_ERR, returnmsg = "Lỗi hệ thống. Lấy thông tin sách không thành công.", id = null };
                        continue;
                    }

                    if (attach.returncode == null || attach.returncode != ReturnCode.DO_OK)
                    {
                        //(new Log(m_config)).WriteThreadLog("ReadOnlineGenerateData.GenSVG(). returncode=" + attach.returncode.ToString() + ": " + attach.returnmsg);
                        Log.WriteThreadLog("ReadOnlineGenerateData.GenSVG(). returncode=" + attach.returncode.ToString() + ": " + attach.returnmsg);
                        //return new returnval { returncode = attach.returncode, returnmsg = attach.returnmsg, id = null };
                        continue;
                    }

                    // int? iNumPage = doc.numpage;
                    long? nDocAttachID = attach.docattachid;
                    long? nDocID = attach.docid;
                    //long? nDocSize = attach.docsize;
                    string? strAttachFile = attach.attachfile;
                    //string? strAttachLink = doc.attachlink;

                    string? strDocOnline_Status = attach.doconline_status;
                    //string? strDocOnline_Format = attach.doconline_format;
                    bool? bIsDefault = attach.isdefault;

                    if (!string.IsNullOrEmpty(strDocOnline_Status) && strDocOnline_Status.ToLower().Trim() == "suc")
                    {
                        // File da duoc tao du lieu doc sach truc tuyen
                        //(new Log(m_config)).WriteThreadLog("ReadOnlineGenerateData.GenSVG(). No working because attach file already 'suc' status. docid=" + (nDocID ?? 0).ToString() + ", docattachid=" + nDocAttachID.ToString() + ", attachfile='" + strAttachFile + "'");
                        Log.WriteThreadLog("ReadOnlineGenerateData.GenSVG(). No working because attach file already 'suc' status. docid=" + (nDocID ?? 0).ToString() + ", docattachid=" + nDocAttachID.ToString() + ", attachfile='" + strAttachFile + "'");
                        continue;
                    }

                    if (string.IsNullOrEmpty(strAttachFile))
                    {
                        //(new Log(m_config)).WriteThreadLog("ReadOnlineGenerateData.GenSVG(). No attach file. docid=" + (nDocID ?? 0).ToString() + ", docattachid=" + nDocAttachID.ToString());
                        Log.WriteThreadLog("ReadOnlineGenerateData.GenSVG(). No attach file. docid=" + (nDocID ?? 0).ToString() + ", docattachid=" + nDocAttachID.ToString());
                        //return new returnval { returncode = ReturnCode.DOC_NO_ATTACHFILE, returnmsg = "Không có file sách đính kèm.", id = null };

                        // file dinh kem ke tiep
                        continue;
                    }

                    string strFullAttachFile = strUploadPath + strAttachFile.Replace("/","\\");
                    if (string.IsNullOrEmpty(strFullAttachFile) || !System.IO.File.Exists(strFullAttachFile))
                    {
                        //(new Log(m_config)).WriteThreadLog("ReadOnlineGenerateData.GenSVG(). Attach file does not exist. AttachFile='" + strFullAttachFile + "', docid="+(nDocID ?? 0).ToString()+", docattachid=" + nDocAttachID.ToString());
                        Log.WriteThreadLog("ReadOnlineGenerateData.GenSVG(). Attach file does not exist. AttachFile='" + strFullAttachFile + "', docid=" + (nDocID ?? 0).ToString() + ", docattachid=" + nDocAttachID.ToString());
                        //return new returnval { returncode = ReturnCode.DOC_NO_ATTACHFILE, returnmsg = "Không có file sách đính kèm.", id = null };

                        // file dinh kem ke tiep
                        continue;
                    }

                    bool bUpdateStatusIntoDB = false;
                    int? numPage = null;
                    long? docSize = null;
                    string? docOnlineFormat = "";

                    string strPageFile = "";
                    string ext = Path.GetExtension(strFullAttachFile).Trim().ToLower();
                    if (ext == ".pdf")
                    {
                        // PDF to SVG using 'PdfToSvg.NET'
                        using (var pdfDoc = PdfToSvg.PdfDocument.Open(strFullAttachFile))
                        {
                            numPage = pdfDoc.Pages.Count;
                            docSize = (new FileInfo(strFullAttachFile)).Length;

                            //string strDocPageFolder = strDocOnlinePath + mod.docid.ToString() + @"\";
                            string strDocPageFolder = strDocOnlinePath + nDocID.ToString() + @"\" + nDocAttachID.ToString() + @"\";
                            Directory.CreateDirectory(strDocPageFolder);

                            int iNumPageGen = 0;
                            var pageNo = 1;
                            foreach (var page in pdfDoc.Pages)
                            {
                                //page.SaveAsSvg(sss + string.Format("p{0,4}.svg", pageNo++));
                                strPageFile = strDocPageFolder + $"{pageNo++}.svg";
                                if (System.IO.File.Exists(strPageFile) && m_overwrite == false)
                                    continue;

                                page.SaveAsSvg(strPageFile);
                                iNumPageGen++;
                            }
                            pdfDoc.Dispose();

                            iNumOK++;

                            // Cap nhat trang thai, so trang, dung luong vao db
                            bUpdateStatusIntoDB = true;
                            docOnlineFormat = "svg";

                            //(new Log(m_config)).WriteThreadLog("ReadOnlineGenerateData.GenSVG(). Gen OK. AttachFile='" + strFullAttachFile + "', docid=" + (nDocID ?? 0).ToString() + ", docattachid=" + nDocAttachID.ToString());
                            Log.WriteThreadLog("ReadOnlineGenerateData.GenSVG(). Gen OK. AttachFile='" + strFullAttachFile + "', docid=" + (nDocID ?? 0).ToString() + ", docattachid=" + nDocAttachID.ToString());
                        }
                    }
                    else
                    {
                        //(new Log(m_config)).WriteThreadLog("ReadOnlineGenerateData.GenSVG(). File ext '" + ext + "' not support generate book online. AttachFile='" + strFullAttachFile + "', docid=" + (nDocID ?? 0).ToString() + ", docattachid=" + nDocAttachID.ToString());
                        Log.WriteThreadLog("ReadOnlineGenerateData.GenSVG(). File ext '" + ext + "' not support generate book online. AttachFile='" + strFullAttachFile + "', docid=" + (nDocID ?? 0).ToString() + ", docattachid=" + nDocAttachID.ToString());
                    }

                    if (bUpdateStatusIntoDB == true)
                    {
                        // Cap nhat so trang, docsize, trang thai
                        var ret = m_dbPostgres.DocAttach_Update_DocOnline_Status(m_userid, nDocAttachID, docSize, "suc", docOnlineFormat, numPage, null, null, m_appfuncid, m_routing);
                    }
                    //return new returnval { returncode = ReturnCode.DO_OK, returnmsg = "OK", id = null };
                }
                //return _dbPostgres == null ? null : _dbPostgres.DocContent_AddUpdate(mod);
                //return null;
                //return new returnval { returncode = ReturnCode.DO_OK, returnmsg = "OK", id = null };

                //(new Log(m_config)).WriteThreadLog("ReadOnlineGenerateData.GenSVG(). Thread FINISH with " + iNumOK.ToString() + " file(s) attach.");
                Log.WriteThreadLog("ReadOnlineGenerateData.GenSVG(). Thread FINISH with " + iNumOK.ToString() + " file(s) attach.");
                ///////////////////////////////////////////////////
            }
            catch (Exception ex)
            {
                //(new Log(m_config)).Write("ReadOnlineGenerateData.GenSVG() exception. Error msg:\r\n" + ex.Message);
                Log.Write("ReadOnlineGenerateData.GenSVG() exception. Error msg:\r\n" + ex.Message);
            }
        }

        public void GenImage()
        {
            try
            {
                //(new Log(m_config)).WriteThreadLog("ReadOnlineGenerateData.GenImage(). Thread START generate read online.");
                Log.WriteThreadLog("ReadOnlineGenerateData.GenImage(). Thread START generate read online.");

                if (m_docattachs == null)
                {
                    //(new Log(m_config)).WriteThreadLog("ReadOnlineGenerateData.GenImage(). Thread STOP generate read online. m_docattachs is null.");
                    Log.WriteThreadLog("ReadOnlineGenerateData.GenImage(). Thread STOP generate read online. m_docattachs is null.");
                    return;
                }

                ///////////////////////////////////////////////////
                //string strUploadPath = m_config.GetSection("AppSettings").GetValue<string>("UploadPath");
                string strUploadPath = WebConfigs.AppSettings.UploadPath;
                strUploadPath = strUploadPath.Replace(@"/", @"\").TrimEnd(@"\".ToCharArray()) + @"\";

                //string strDocOnlinePath = m_config.GetSection("AppSettings").GetValue<string>("DocOnlinePath");
                string strDocOnlinePath = WebConfigs.AppSettings.DocOnlinePath;
                strDocOnlinePath = strDocOnlinePath.Replace(@"/", @"\").TrimEnd(@"\".ToCharArray()) + @"\";

                // Encode file hinh anh doc sach truc tuyen
                string strIsEncodeDocOnline = WebConfigs.AppSettings.IsEncodeDocOnline.Trim().ToLower();
                string strDocOnlineEncodePath = WebConfigs.AppSettings.DocOnlineEncodePath.Trim().TrimEnd("\\".ToCharArray()) + "\\";
                string strEncodeFile;

                int iNumOK = 0;
                bool bThumb = true;

                foreach (docattach attach in m_docattachs)
                {
                    //docattach attach = docattach[0];
                    if (attach == null)
                    {
                        // Lay thong tin sach khong thanh cong
                        //(new Log(m_config)).WriteThreadLog("ReadOnlineGenerateData.GenImage(). Attach info is null.");
                        Log.WriteThreadLog("ReadOnlineGenerateData.GenImage(). Attach info is null.");
                        //return new returnval { returncode = ReturnCode.GENERAL_SYSTEM_ERR, returnmsg = "Lỗi hệ thống. Lấy thông tin sách không thành công.", id = null };
                        continue;
                    }

                    if (attach.returncode == null || attach.returncode != ReturnCode.DO_OK)
                    {
                        //(new Log(m_config)).WriteThreadLog("ReadOnlineGenerateData.GenImage(). returncode=" + attach.returncode.ToString() + ": " + attach.returnmsg);
                        Log.WriteThreadLog("ReadOnlineGenerateData.GenImage(). returncode=" + attach.returncode.ToString() + ": " + attach.returnmsg);
                        //return new returnval { returncode = attach.returncode, returnmsg = attach.returnmsg, id = null };
                        continue;
                    }

                    // int? iNumPage = doc.numpage;
                    long? nDocAttachID = attach.docattachid;
                    long? nDocID = attach.docid;
                    //long? nDocSize = attach.docsize;
                    string? strAttachFile = attach.attachfile;
                    //string? strAttachLink = doc.attachlink;

                    string? strDocOnline_Status = attach.doconline_status;
                    //string? strDocOnline_Format = attach.doconline_format;
                    bool? bIsDefault = attach.isdefault;

                    if (m_ignorestatus != true
                        && !string.IsNullOrEmpty(strDocOnline_Status) && strDocOnline_Status.ToLower().Trim() == "suc")
                    {
                        // File da duoc tao du lieu doc sach truc tuyen
                        //(new Log(m_config)).WriteThreadLog("ReadOnlineGenerateData.GenImage(). No working because attach file already 'suc' status. docid=" + (nDocID ?? 0).ToString() + ", docattachid=" + nDocAttachID.ToString() + ", attachfile='" + strAttachFile + "'");
                        Log.WriteThreadLog("ReadOnlineGenerateData.GenImage(). No working because attach file already 'suc' status. docid=" + (nDocID ?? 0).ToString() + ", docattachid=" + nDocAttachID.ToString() + ", attachfile='" + strAttachFile + "'");
                        continue;
                    }

                    bool bDeleteTempFile = false;
                    string strFullAttachFile = "";
                    if (attach.issync == true)
                    {
                        //strFullAttachFile = attach.syncapi.ToString().TrimEnd("/".ToCharArray()) + "/" + attach.attachlink.ToString().TrimStart("/".ToCharArray());
                        if (string.IsNullOrEmpty(attach.attachlink))
                        {
                            Log.WriteThreadLog("ReadOnlineGenerateData.GenImage(). issync=" + attach.issync.ToString() + " but attachlink is null or empty. docid=" + (nDocID ?? 0).ToString() + ", docattachid=" + nDocAttachID.ToString());

                            // file dinh kem ke tiep
                            continue;
                        }
                        else
                        {
                            strFullAttachFile = attach.attachlink.ToString();

                            // download file
                            string tempFile = Path.GetTempPath() + Guid.NewGuid().ToString() + Path.GetExtension(attach.attachlink.ToString());

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
                        if (string.IsNullOrEmpty(strAttachFile))
                        {
                            //(new Log(m_config)).WriteThreadLog("ReadOnlineGenerateData.GenImage(). No attach file. docid=" + (nDocID ?? 0).ToString() + ", docattachid=" + nDocAttachID.ToString());
                            Log.WriteThreadLog("ReadOnlineGenerateData.GenImage(). No attach file. docid=" + (nDocID ?? 0).ToString() + ", docattachid=" + nDocAttachID.ToString());
                            //return new returnval { returncode = ReturnCode.DOC_NO_ATTACHFILE, returnmsg = "Không có file sách đính kèm.", id = null };

                            // file dinh kem ke tiep
                            continue;
                        }

                        strFullAttachFile = strUploadPath + strAttachFile.Replace("/", "\\");
                        if (string.IsNullOrEmpty(strFullAttachFile) || !System.IO.File.Exists(strFullAttachFile))
                        {
                            //(new Log(m_config)).WriteThreadLog("ReadOnlineGenerateData.GenImage(). Attach file does not exist. AttachFile='" + strFullAttachFile + "', docid=" + (nDocID ?? 0).ToString() + ", docattachid=" + nDocAttachID.ToString());
                            Log.WriteThreadLog("ReadOnlineGenerateData.GenImage(). Attach file does not exist. AttachFile='" + strFullAttachFile + "', docid=" + (nDocID ?? 0).ToString() + ", docattachid=" + nDocAttachID.ToString());
                            //return new returnval { returncode = ReturnCode.DOC_NO_ATTACHFILE, returnmsg = "Không có file sách đính kèm.", id = null };

                            // file dinh kem ke tiep
                            continue;
                        }
                    }

                    bool bUpdateStatusIntoDB = false;
                    int? numPage = null;
                    long? docSize = null;
                    string? docOnlineFormat = "";
                    int? imgWidth = null, imgHeight = null;
                    //int? pagewidth = null, pageheight = null;

                    //string strPageFile = "";
                    //string strImageFile = "";
                    string ext = Path.GetExtension(strFullAttachFile).Trim().ToLower();
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
                        docSize = (new FileInfo(strFullAttachFile)).Length;

                        var pg = numPage > 1 ? document.Result.GetPage(1) : document.Result.GetPage(0);
                        float pageWidth = (pg != null) ? pg.Result.Size.Width : 0;
                        float pageHeight = (pg != null) ? pg.Result.Size.Height : 0;
                        // Dispose
                        pg.Result.DisposeAsync();
                        pg.Dispose();

                        pageWidth = pageWidth * fixedScale;
                        pageHeight = pageHeight * fixedScale;

                        float scale = 0f;
                        float width, height;

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
                                using (var fs = new System.IO.FileStream(strImageFileFull, FileMode.Create, FileAccess.Write))
                                {
                                    resultThumb.Result.Image.Save(fs, encoder);
                                    fs.Close();
                                }
                                resultThumb.Dispose();

                                //////////////////////////////////////////////
                                // Encode file hinh anh doc sach truc tuyen
                                if (strIsEncodeDocOnline == "true")
                                {
                                    strEncodeFile = string.Format("p{0,6}_{1}{2}", pageNo + 1, iZoomLevel, ".lvm");
                                    strEncodeFile = strEncodeFile.Replace(" ", "0");
                                    strEncodeFile = strDocOnlineEncodePath + strSubFolderEncode + strEncodeFile;

                                    string strImageFileCopy = strDocOnlineEncodePath + strSubFolderEncode + strImageFileName;
                                    System.IO.File.Copy(strImageFileFull, strImageFileCopy, true);
                                    FileEncode.EncodeFileBytes(strImageFileCopy, strEncodeFile);
                                }
                                //////////////////////////////////////////////
                            }
                            

                            scale = pageHeight / page.Result.Size.Height;

                            height = pageHeight;
                            width = (page.Result.Size.Width * pageHeight) / page.Result.Size.Height;

                            // width and height of image for save db
                            if (imgWidth == null || imgHeight == null)
                            {
                                imgWidth = (int)width;
                                imgHeight = (int)height;
                            }

                            SixLabors.ImageSharp.RectangleF viewport = new SixLabors.ImageSharp.RectangleF(0, 0, width, height);
                            var result = page.Result.Render(scale, SixLabors.ImageSharp.Color.White, viewport);

                            //string strImageFile = strImagePath + $"{pageNo + 1}" + fileExt;
                            iZoomLevel = 7;
                            strImageFileName = string.Format("p{0,6}_{1}{2}", pageNo + 1, iZoomLevel, outputFileExt);
                            strImageFileName = strImageFileName.Replace(" ", "0");
                            //strImageFile = strDocPageFolder + strImageFile;
                            strImageFileFull = strDocOnlinePath + strSubFolderDocPage + strImageFileName;
                            using (var fs = new System.IO.FileStream(strImageFileFull, FileMode.Create, FileAccess.Write))
                            {
                                result.Result.Image.Save(fs, encoder);
                                fs.Close();
                            }
                            result.Dispose();

                            //////////////////////////////////////////////
                            // Encode file hinh anh doc sach truc tuyen
                            if (strIsEncodeDocOnline == "true")
                            {
                                //strDocOnlineEncodePath
                                strEncodeFile = string.Format("p{0,6}_{1}{2}", pageNo + 1, iZoomLevel, ".lvm");
                                strEncodeFile = strEncodeFile.Replace(" ", "0");
                                strEncodeFile = strDocOnlineEncodePath + strSubFolderEncode + strEncodeFile;

                                string strImageFileCopy = strDocOnlineEncodePath + strSubFolderEncode + strImageFileName;
                                System.IO.File.Copy(strImageFileFull, strImageFileCopy, true);
                                FileEncode.EncodeFileBytes(strImageFileCopy, strEncodeFile);
                            }
                            //////////////////////////////////////////////
                            

                            page.Result.DisposeAsync();
                            page.Dispose();
                        }
                        document.Result.DisposeAsync();
                        document.Dispose();

                        iNumOK++;

                        // Cap nhat trang thai, so trang, dung luong vao db
                        bUpdateStatusIntoDB = true;
                        docOnlineFormat = "jpg";

                        //(new Log(m_config)).WriteThreadLog("ReadOnlineGenerateData.GenImage(). Gen OK. AttachFile='" + strFullAttachFile + "', docid=" + (nDocID ?? 0).ToString() + ", docattachid=" + nDocAttachID.ToString());
                        Log.WriteThreadLog("ReadOnlineGenerateData.GenImage(). Gen OK. AttachFile='" + strFullAttachFile + "', docid=" + (nDocID ?? 0).ToString() + ", docattachid=" + nDocAttachID.ToString());
                        //}
                    }
                    else
                    {
                        //(new Log(m_config)).WriteThreadLog("ReadOnlineGenerateData.GenImage(). File ext '" + ext + "' not support generate book online. AttachFile='" + strFullAttachFile + "', docid=" + (nDocID ?? 0).ToString() + ", docattachid=" + nDocAttachID.ToString());
                        Log.WriteThreadLog("ReadOnlineGenerateData.GenImage(). File ext '" + ext + "' not support generate book online. AttachFile='" + strFullAttachFile + "', docid=" + (nDocID ?? 0).ToString() + ", docattachid=" + nDocAttachID.ToString());
                    }


                    if (bUpdateStatusIntoDB == true)
                    {
                        // Cap nhat so trang, docsize, trang thai
                        var ret = m_dbPostgres.DocAttach_Update_DocOnline_Status(m_userid, nDocAttachID, docSize, "suc", docOnlineFormat, numPage, imgWidth, imgHeight, m_appfuncid, m_routing);
                    }

                    if (bDeleteTempFile == true)
                    {
                        // Xoa temp file
                        try
                        {
                            File.Delete(strFullAttachFile);
                        }
                        catch (Exception) { }
                    }

                    //return new returnval { returncode = ReturnCode.DO_OK, returnmsg = "OK", id = null };
                }
                //return _dbPostgres == null ? null : _dbPostgres.DocContent_AddUpdate(mod);
                //return null;
                //return new returnval { returncode = ReturnCode.DO_OK, returnmsg = "OK", id = null };

                //(new Log(m_config)).WriteThreadLog("ReadOnlineGenerateData.GenImage(). Thread FINISH with " + iNumOK.ToString() + " file(s) attach.");
                Log.WriteThreadLog("ReadOnlineGenerateData.GenImage(). Thread FINISH with " + iNumOK.ToString() + " file(s) attach.");
                ///////////////////////////////////////////////////
            }
            catch (Exception ex)
            {
                //(new Log(m_config)).Write("ReadOnlineGenerateData.GenImage() exception. Error msg:\r\n" + ex.Message);
                Log.Write("ReadOnlineGenerateData.GenImage() exception. Error msg:\r\n" + ex.Message);
            }
        }
    }
}
