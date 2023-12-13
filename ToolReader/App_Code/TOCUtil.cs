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

namespace WebApi.App_Code
{
    public class TOCUtil
    {
        public static List<doctoc> GetAndParseTableOfContent(string strPDFFile)
        {
            try
            {
                if (!System.IO.File.Exists(strPDFFile))
                    return null;

                //string? toc = null;
                List<doctoc> lstToc = new List<doctoc>();
                int iLevel = 0;

                PdfReader reader = new PdfReader(strPDFFile);
                var list = SimpleBookmark.GetBookmark(reader);
                if (list != null)
                {
                    using (MemoryStream ms = new MemoryStream())
                    {
                        //SimpleBookmark.ExportToXML(list, ms, "ISO8859-1", true);
                        SimpleBookmark.ExportToXML(list, ms, "utf-8", false);
                        ms.Position = 0;
                        using (StreamReader sr = new StreamReader(ms))
                        {
                            string toc = sr.ReadToEnd();
                            //Console.WriteLine();
                            XmlDocument doc = new XmlDocument();
                            //doc.Load(xmlFile);
                            doc.LoadXml(toc);
                            var nodes = doc.ChildNodes;
                            if (nodes != null)
                            {
                                foreach (XmlNode node in nodes)
                                {
                                    //if (node.Name.Trim().ToLower() == "bookmark")
                                    if (node.NodeType == XmlNodeType.Element && node.Name.Trim().ToLower() == "bookmark")
                                    {
                                        //iLevel = 1;
                                        iLevel = 0;
                                        if (node.HasChildNodes)
                                        {
                                            lstToc.AddRange(new TOCUtil().ParseChildBookmark_Recursive(node.ChildNodes, iLevel + 1));
                                        }

                                        /*
                                        var bookmarks = node.ChildNodes;
                                        if (bookmarks != null)
                                        {
                                            foreach (XmlNode titleNode in bookmarks)
                                            {
                                                if (titleNode.Name.Trim().ToLower() == "title")
                                                {
                                                    string strTitle = titleNode.InnerText.Trim();

                                                    string strPage = "";
                                                    XmlNode? attPage = titleNode.Attributes.GetNamedItem("Page");
                                                    if (attPage != null)
                                                        strPage = attPage.Value.Split(" ")[0].Trim();

                                                    string strAction = "";
                                                    XmlNode? attAction = titleNode.Attributes.GetNamedItem("Action");
                                                    if (attAction != null)
                                                        strAction = attAction.Value.Trim();

                                                    //ret += title + ": " + page + "\r\n";
                                                    //Console.WriteLine(title + " - " + page);
                                                    lstToc.Add(new doctoc() { title = strTitle, gotoref = strPage, act = (strAction == "GoTo" ? "p" : "") });
                                                }
                                            }
                                        }
                                        */
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                if (reader != null)
                {
                    reader.Close();
                    reader.Dispose();
                }
                return lstToc;
            }
            catch (Exception ex)
            {
                //return Task.FromResult(ex.Message);
                return null;
            }
        }



        public List<doctoc> ParseChildBookmark_Recursive(XmlNodeList nodes, int iLevel)
        {
            try
            {
                if (nodes == null)
                    return null;

                List<doctoc> lstToc = new List<doctoc>();
                foreach (XmlNode titleNode in nodes)
                {
                    if (titleNode.NodeType == XmlNodeType.Element && titleNode.Name.Trim().ToLower() == "title")
                    {
                        //iLevel = 2;
                        string strTitle = titleNode.InnerText.Trim();
                        strTitle = strTitle.Split("\n")[0].Trim().TrimEnd("\r".ToCharArray()).Trim();

                        string strPage = "";
                        XmlNode? attPage = titleNode.Attributes.GetNamedItem("Page");
                        if (attPage != null)
                            strPage = attPage.Value.Split(" ")[0].Trim();

                        string strAction = "";
                        XmlNode? attAction = titleNode.Attributes.GetNamedItem("Action");
                        if (attAction != null)
                            strAction = attAction.Value.Trim();

                        //ret += title + ": " + page + "\r\n";
                        //Console.WriteLine(title + " - " + page);
                        lstToc.Add(new doctoc() { title = strTitle, gotoref = strPage, act = (strAction == "GoTo" ? "p" : ""), level = iLevel });

                        // Node con (neu co)
                        if (titleNode.HasChildNodes)
                        {
                            lstToc.AddRange(ParseChildBookmark_Recursive(titleNode.ChildNodes, iLevel + 1));
                        }
                    }
                }
                return lstToc;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
