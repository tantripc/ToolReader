using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;

namespace WebApi.App_Code
{

    public class HtmlExts
    {
        public static bool ContainsHtmlTag(object text, string tag)
        {
            if (text == null || (string)text == "")
                return false;
            var pattern = @"<\s*" + tag + @"\s*\/?>";
            return Regex.IsMatch((string)text, pattern, RegexOptions.IgnoreCase);
        }

        public static bool ContainsHtmlTags(object text, string tags)
        {
            var ba = tags.Split('|').Select(x => new { tag = x, hastag = ContainsHtmlTag(text, x) }).Where(x => x.hastag);
            return ba.Count() > 0;
        }

        public static bool ContainsHtmlTags(object text)
        {
            //return ContainsHtmlTags(text, "a|abbr|acronym|address|area|b|base|bdo|big|blockquote|body|br|button|caption|cite|code|col|colgroup|dd|del|dfn|div|dl|DOCTYPE|dt|em|fieldset|form|h1|h2|h3|h4|h5|h6|head|html|hr|i|img|input|ins|kbd|label|legend|li|link|map|meta|noscript|object|ol|optgroup|option|p|param|pre|q|samp|script|select|small|span|strong|style|sub|sup|table|tbody|td|textarea|tfoot|th|thead|title|tr|tt|ul|var");

            try
            {
                var pattern = @"(<([^>]+)>)";
                return Regex.IsMatch((string)text, pattern, RegexOptions.IgnoreCase)
                    | Regex.IsMatch((string)text, @"&#\d*;", RegexOptions.IgnoreCase)
                    | Regex.IsMatch((string)text, @"&\w*;", RegexOptions.IgnoreCase);
            }
            catch (Exception) { }
            return false;
        }

        public static string SaveHtmlBase64ToFile(string htmlBase64, string savePathName)
        {
            if (string.IsNullOrEmpty(htmlBase64))
                return null;

            try
            {
                // htmlBase64 co dang: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAAX..."
                // ...

                // string fileExt = FileUtil.GetFileExtensionFromContentType(contentType);
                // .png


                string viewPathName = Config.ReadConfig("AppSettings:WebApiFileUrl");
                //// Create forder
                string subdirSave = savePathName + @"Image_Base64\";
                string subdirView = viewPathName + @"Image_Base64\";
                if (!Directory.Exists(subdirSave))
                    Directory.CreateDirectory(subdirSave);

                //read html file
                HtmlAgilityPack.HtmlDocument doc = new HtmlAgilityPack.HtmlDocument();
                doc.DocumentNode.AppendChild(HtmlAgilityPack.HtmlNode.CreateNode("<body>" + htmlBase64 + "</body>"));
                //create html string to store
                HtmlAgilityPack.HtmlDocument docRS = new HtmlAgilityPack.HtmlDocument();
                var node = HtmlAgilityPack.HtmlNode.CreateNode("<html><head><meta http-equiv='Content-Type' content='application/xhtml+xml; charset=utf-8'></head><body></body></html>");
                docRS.DocumentNode.AppendChild(node);
                var bodyRS = docRS.DocumentNode.SelectSingleNode("//body");
                int idx = 0;
                var liP = doc.DocumentNode.SelectNodes("//img");
                while (liP != null && idx < liP.Count)
                {
                    bodyRS.AppendChild(liP[idx]);
                    //Change image source link
                    if (bodyRS.SelectNodes("//img") != null && bodyRS.SelectNodes("//img").Count != 0)
                    {
                        foreach (var item in bodyRS.SelectNodes("//img"))
                        {
                            var _old = "";
                            var _new = "";
                            var srcVal = item.Attributes.Where(x => x.Name == "src").FirstOrDefault().Value;
                            if (srcVal.StartsWith("data:image"))
                            {
                                var spl = srcVal.Split(",");
                                var fir = spl.First();
                                var las = fir + ",";
                                fir = fir.Replace("data:", "");
                                var contenType = fir.Replace(";base64", "");
                                var base64String = srcVal.Replace(las, "");
                                // Get ContentType
                                contenType = FileUtil.GetFileExtensionFromContentType(contenType);

                                string _uuid = Guid.NewGuid().ToString();
                                string savePath = subdirSave + _uuid + contenType;
                                string viewPath = subdirView + _uuid + contenType;
                                _old = item.OuterHtml;
                                _old = _old.Replace(">", " />");

                                item.SetAttributeValue("src", viewPath);
                                _new = item.OuterHtml;

                                // Save file to path
                                byte[] imageBytes = Convert.FromBase64String(base64String);
                                System.IO.File.WriteAllBytes(savePath, imageBytes);

                                // Replace Base64 to Link
                                htmlBase64 = htmlBase64.Replace(_old, _new);
                            }
                        }
                    }
                    idx++;
                }
                return htmlBase64;
            }
            catch (Exception)
            {
            }
            return null;
        }

        public static string HtmlToText(string strHtml)
        {
            if (string.IsNullOrEmpty(strHtml))
                return strHtml;

            string strTxt = "";
            HtmlAgilityPack.HtmlDocument htmlDoc = new HtmlAgilityPack.HtmlDocument();

            try
            {
                htmlDoc.LoadHtml(strHtml);

                strTxt = "";
                strTxt = htmlDoc.DocumentNode.InnerText;

                strTxt = strTxt.Replace("\r\n", " ");
                strTxt = strTxt.Replace("\n", " ");
                strTxt = strTxt.Replace("&nbsp;", " ");
                strTxt = strTxt.Replace((char)160, ' ');
                strTxt = strTxt.Replace("&lt;", "<");
                strTxt = strTxt.Replace("&gt;", ">");
                strTxt = strTxt.Replace("&amp;", "&");
                strTxt = StrUtil.TrimMultiSpace(strTxt);
                strTxt = strTxt.Trim();
            }
            catch (Exception) { }
            return strTxt;
        }
    }
}
