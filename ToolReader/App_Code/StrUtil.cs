using System;
using System.Data;
using System.Configuration;
//using System.Web;
//using System.Web.Security;
//using System.Web.UI;
//using System.Web.UI.WebControls;
//using System.Web.UI.WebControls.WebParts;
//using System.Web.UI.HtmlControls;
//using DCS.ComLib.Language;
using System.Collections;
using System.Text;
using System.Text.RegularExpressions;
using System.Linq;
using System.Xml.Linq;
using System.Collections.Generic;

namespace WebApi.App_Code
{
    public class StrUtil
    {
        public StrUtil()
        {
        }

        public static string ToValidXml(string strValue)
        {
            return strValue.Replace("<", "&lt;").Replace(">", "&gt;").Replace("&", "&amp;");
        }

        public static string ReplaceQuote(string strValue)
        {
            if (string.IsNullOrEmpty(strValue)) return "";
            return strValue.Replace("'", "''");
        }

        public static string ReplaceInvalidFileNameChar(string strFileName)
        {
            if (string.IsNullOrEmpty(strFileName)) return "";
            strFileName = strFileName.Replace("\\", "%5C");
            strFileName = strFileName.Replace("/", "%2F");
            strFileName = strFileName.Replace(":", "%3A");
            strFileName = strFileName.Replace("*", "%2A");
            strFileName = strFileName.Replace("?", "%3F");
            strFileName = strFileName.Replace("\"", "%22");
            strFileName = strFileName.Replace("<", "%3C");
            strFileName = strFileName.Replace(">", "%3E");
            strFileName = strFileName.Replace("|", "%7C");
            return strFileName;
        }

        public static string ReplaceInvalidFileNameCharByUnderline(string strFileName)
        {
            if (string.IsNullOrEmpty(strFileName)) return "";
            strFileName = strFileName.Replace("\\", "_");
            strFileName = strFileName.Replace("/", "_");
            strFileName = strFileName.Replace(":", "_");
            strFileName = strFileName.Replace("*", "_");
            strFileName = strFileName.Replace("?", "_");
            strFileName = strFileName.Replace("\"", "_");
            strFileName = strFileName.Replace("<", "_");
            strFileName = strFileName.Replace(">", "_");
            strFileName = strFileName.Replace("|", "_");
            strFileName = strFileName.Replace("&", "_");
            return strFileName;
        }

        //public static string ReplaceHtmlSpecialChar(string str)
        //{
        //    str = str.Replace("%20", " ");
        //    str = str.Replace("%28", "(");
        //    str = str.Replace("%29", ")");
        //    str = str.Replace("%5B", "[");
        //    str = str.Replace("%5D", "]");
        //    str = str.Replace("%7B", "{");
        //    str = str.Replace("%7D", "}");
        //    //str.Replace("?", "_");
        //    return str;
        //}

        public static string ReplaceHtmlSpecialChar(string str)
        {
            str = str.Replace("%20", " ");
            str = str.Replace("%28", "(");
            str = str.Replace("%29", ")");
            str = str.Replace("%5B", "[");
            str = str.Replace("%5D", "]");
            str = str.Replace("%7B", "{");
            str = str.Replace("%7D", "}");
            //str.Replace("?", "_");
            str = str.Replace("&amp;", "&");
            str = str.Replace("&nbsp;", " ");

            int iPos = 0, iFound = -1;
            ArrayList arrFindWhat = new ArrayList(), arrReplaceWith = new ArrayList();
            while ((iFound = str.IndexOf("&#", iPos)) >= 0)
            {
                int iEnd = str.IndexOf(";", iFound + 2);
                if (iEnd >= 0)
                {
                    string strHtmlCode = str.Substring(iFound, iEnd - iFound + 1);
                    string strCode = strHtmlCode;
                    strCode = strCode.TrimStart("&#".ToCharArray()).TrimEnd(";".ToCharArray());
                    char ch = (char)int.Parse(strCode);
                    arrFindWhat.Add(strHtmlCode);
                    arrReplaceWith.Add(ch.ToString());
                }
                else iPos = iFound + 2;
            }
            for (int i = 0; i < arrFindWhat.Count; i++)
                str = str.Replace((string)arrFindWhat[i], (string)arrReplaceWith[i]);
            return str;
        }

        public static string TrimMultiSpace(string str)
        {
            if (string.IsNullOrEmpty(str))  return "";
            str = str.Trim();
            while (str.Contains("  "))
                str = str.Replace("  ", " ");
            return str;
        }

        public static string TrimMultiSemiColon(string str)
        {
            if (string.IsNullOrEmpty(str))  return "";
            str = str.Trim();
            while (str.Contains(";;"))
                str = str.Replace(";;", ";");
            return str;
        }

        public static string TrimMultiQuote(string str)
        {
            if (string.IsNullOrEmpty(str))
                return "";
            while (str.Contains("\"\""))
                str = str.Replace("\"\"", "\"");
            return str;
        }

        public static string TrimMultiHyphen(string str)
        {
            if (string.IsNullOrEmpty(str)) return str;
            while (str.Contains("--"))
                str = str.Replace("--", "-");
            return str;
        }

        public static string TrimMultiUnderline(string str)
        {
            if (string.IsNullOrEmpty(str)) return str;
            while (str.Contains("__"))
                str = str.Replace("__", "_");
            return str;
        }

        public static string TrimCDATA(string strString)
        {
            if (string.IsNullOrEmpty(strString)) return "";
            
            strString = strString.Trim();
            if (strString.IndexOf("<![CDATA[") == 0)
                strString = strString.Remove(0, 9);
            if (strString.Length > 2 && strString.LastIndexOf("]]>") == strString.Length - 3)
                strString = strString.Remove(strString.Length - 3, 3);
            return strString;
        }

        public static string ReplaceReturnBySpace(string str)
        {
            if (string.IsNullOrEmpty(str))
                return "";
            str = str.Replace("\r\n", " ");
            return TrimMultiSpace(str);
        }

        public static string ValidFileName(string strFileName)
        {
            try
            {
                if (!string.IsNullOrEmpty(strFileName))
                {
                    strFileName = strFileName.Replace("\\", "");
                    strFileName = strFileName.Replace("/", "");
                    strFileName = strFileName.Replace(":", "");
                    strFileName = strFileName.Replace("*", "");
                    strFileName = strFileName.Replace("?", "");
                    strFileName = strFileName.Replace("\"", "");
                    strFileName = strFileName.Replace("<", "");
                    strFileName = strFileName.Replace(">", "");
                    strFileName = strFileName.Replace("|", "");
                }
                return strFileName;
            }
            catch (Exception) { }
            return strFileName;
        }

        public static string ToValidDateTimeString(DateTime dtDateTime, string strFormat)
        {
            try
            {
                if (dtDateTime == null || dtDateTime == DateTime.MinValue) return "";
                if ((dtDateTime.Year == 1900 && dtDateTime.Month == 1 && dtDateTime.Day == 1) ||
                    (dtDateTime.Year == 1753 && dtDateTime.Month == 1 && dtDateTime.Day == 1))
                    return "";
                return dtDateTime.ToString(strFormat);
            }
            catch (Exception) { }
            return "";
        }

        public static string ReplaceSign(string strString)
        {
            // trim multi space
            // replace ky tu dau truoc va sau (, . ? ! ...)
            // trim space

            if (string.IsNullOrEmpty(strString))    return "";
            strString = strString.Replace(",", " ");
            strString = strString.Replace(".", " ");
            strString = strString.Replace(";", " ");
            strString = strString.Replace(":", " ");
            strString = strString.Replace("!", " ");
            strString = strString.Replace("?", " ");
            strString = strString.Replace("'", " ");
            strString = strString.Replace("\"", " ");
            return TrimMultiSpace(strString);
        }

        public static string TrimSign(string strString)
        {
            // trim multi space
            // trim ky tu dau truoc va sau (, . ? ! ...)
            // trim space

            if (string.IsNullOrEmpty(strString))    return "";
            char[] arrCharTrim = new char[] { ',', '.', ';', ':', '!', '?', '\'', '"' };
            strString = strString.TrimStart();
            strString = strString.TrimStart(arrCharTrim);
            strString = strString.TrimEnd();
            strString = strString.TrimEnd(arrCharTrim);
            return TrimMultiSpace(strString);
        }

        public static string TrimEndSentenceSign(string strString)
        {
            // trim multi space
            // trim ky tu dau truoc va sau (, . ? ! ...)
            // trim space

            if (string.IsNullOrEmpty(strString))    return "";
            char[] arrCharTrim = new char[] { ',', '.', ';', ':', '!', '?' };
            strString = strString.TrimStart();
            strString = strString.TrimStart(arrCharTrim);
            strString = strString.TrimEnd();
            strString = strString.TrimEnd(arrCharTrim);
            return TrimMultiSpace(strString);
        }

        public static string TrimByLen(string strString, int iLen)
        {
            if (string.IsNullOrEmpty(strString) || iLen == 0) return "";
            if (iLen < 0 || strString.Length <= iLen) return strString;

            strString = strString.Substring(0, iLen);

            // trim end
            int i = strString.Length - 1;
            while (i >= 0)
            {
                char ch = strString[i];
                if (!char.IsLetterOrDigit(ch) && ch != '(' && ch != '{' && ch != '[' && ch != '<')
                    break;
                i--;
            }
            int iActualLen = 0;
            if (i >= 0)
            {
                strString = strString.Substring(0, i + 1).Trim();
                iActualLen = strString.Length;
            }
            return (strString.Substring(0, iActualLen) + " ...");
        }

        public static string TrimUTF8SentenceByULen(string strStringUTF8, int iLenUnicode)
        {
            return TrimUnicodeSentenceByULen(ConvertUtil.UTF8ToUnicode(strStringUTF8), iLenUnicode);
        }

        public static string TrimUnicodeSentenceByULen(string strStringUnicode, int iLenUnicode)
        {
            if (string.IsNullOrEmpty(strStringUnicode) || iLenUnicode == 0)
                return "";
            if (iLenUnicode < 0 || strStringUnicode.Length <= iLenUnicode)
                return strStringUnicode;

            // trim by len = iLenUnicode
            strStringUnicode = strStringUnicode.Substring(0, iLenUnicode);
            int iLenStr = strStringUnicode.Length;

            // find finished sentence character
            int iFound = -1;
            string strDauCau = ".?!";
            int i = iLenStr - 1;
            bool bFound = false;
            iFound = -1;
            while (i >= 0)
            {
                if (strDauCau.IndexOf(strStringUnicode[i]) >= 0)
                {
                    // found
                    iFound = i + 1; // lay ca dau ket thuc cau
                    bFound = true;
                    break;
                }
                i--;
            }

            if (bFound == true && iFound < iLenStr / 3)
            {
                int iMaxFound = -1;
                string[] arrStrDauCau = new string[1] { "," };
                for (int k = 0; k < arrStrDauCau.Length; k++)
                {
                    strDauCau = arrStrDauCau[k];
                    if (string.IsNullOrEmpty(strDauCau)) continue;
                    iMaxFound = Math.Max(iMaxFound, strStringUnicode.LastIndexOf(strDauCau));
                    if (iMaxFound == iLenStr - 1) break;
                }
                iFound = Math.Max(iFound, iMaxFound);
            }

            if (!bFound)
            {
                iFound = strStringUnicode.LastIndexOf(' ');
                if (iFound < 0)
                {
                    // trim theo len
                    return strStringUnicode;
                }
            }
            return strStringUnicode.Substring(0, iFound);
        }

        public static string TrimByWord(string strString, int iLen, string strKeyWord, bool bNosign)
        {
            if (string.IsNullOrEmpty(strString) || iLen <= 0)   return "";

            strKeyWord = strKeyWord.TrimStart(new char[] { '\"', '\'' });
            strKeyWord = strKeyWord.TrimEnd(new char[] { '\"', '\'' });

            int iBeginAt = 0;
            int iActualLen = 0;
            string strStringLower = strString.ToLower();
            strKeyWord = strKeyWord.ToLower();

            if (bNosign)
            {
                strStringLower = ConvertUtil.UnicodeToASCIIWithMap(strStringLower);
                strKeyWord = ConvertUtil.UnicodeToASCIIWithMap(strKeyWord);
            }

            if (!string.IsNullOrEmpty(strKeyWord) && strStringLower.Length > iLen)
            {
                int iFound = -1;
                if ((iFound = strStringLower.IndexOf(strKeyWord)) < 0)
                {
                    string[] arrWord = strKeyWord.Split(" ".ToCharArray());
                    foreach (string strWord in arrWord)
                    {
                        if (!string.IsNullOrEmpty(strWord) && ((iFound = strStringLower.IndexOf(strWord)) >= 0))
                            break;
                    }
                }

                if ((iFound > 0) && ((iFound + strKeyWord.Length) > iLen))
                {
                    int iLeft = Math.Max(0, iFound - Math.Max(0, iLen - strKeyWord.Length));
                    int ii = iLeft;
                    while (ii < iFound)
                    {
                        if (char.IsPunctuation(strStringLower[ii]))
                            break;
                        ii++;
                    }

                    if (iFound + (strKeyWord.Length / 2) - ii < iLen / 3)
                    {
                        ii = iLeft;
                        while (ii < iFound)
                        {
                            if (!char.IsLetterOrDigit(strStringLower[ii]))
                                break;
                            ii++;
                        }
                    }
                    iBeginAt = ii + 1;
                }
            }
            bool bAppendSpace = ((iBeginAt + iLen) > strStringLower.Length);
            iActualLen = Math.Min(strStringLower.Length - iBeginAt, iLen);
            strStringLower = strStringLower.Substring(iBeginAt, iActualLen);
            int iStringLen = strStringLower.Length;
            strStringLower = strStringLower.TrimEnd(new char[] { '\0' });
            iActualLen -= (iStringLen - strStringLower.Length);

            // trim start
            bool bAppendHead = false;
            if (iBeginAt > 0)
            {
                int i = 0;
                while (i < strStringLower.Length)
                {
                    char ch = strStringLower[i];
                    if (!char.IsLetterOrDigit(ch) && ch != ')' && ch != '}' && ch != ']' && ch != '>')
                        break;
                    i++;
                }
                if (i < strStringLower.Length)
                {
                    strStringLower = strStringLower.Substring(i);
                    iBeginAt += i;

                    iStringLen = strStringLower.Length;
                    strStringLower = strStringLower.TrimStart(" ".ToCharArray()).TrimStart("\r\n".ToCharArray());
                    iBeginAt += (iStringLen - strStringLower.Length);
                    strStringLower = strStringLower.Trim();
                    iActualLen = strStringLower.Length;
                }
                strStringLower += (bAppendSpace ? " " : "");
                bAppendHead = true;
                iActualLen += bAppendSpace ? 1 : 0;
            }

            // trim end
            bool bAppendTail = false;
            if (strString.Length > iLen)
            {
                int i = strStringLower.Length - 1;
                while (i >= 0)
                {
                    char ch = strStringLower[i];
                    if (!char.IsLetterOrDigit(ch) && ch != '(' && ch != '{' && ch != '[' && ch != '<')
                        break;
                    i--;
                }
                if (i >= 0)
                {
                    strStringLower = strStringLower.Substring(0, i + 1).Trim();
                    iActualLen = strStringLower.Length;
                }
                bAppendTail = true;
            }
            return ((bAppendHead ? "... " : "") + strString.Substring(iBeginAt, iActualLen) + (bAppendTail ? " ..." : ""));
        }

        public static string TrimByListWord(string strString, int iLen, ArrayList arrKeyWord, bool bNosign)
        {
            if (string.IsNullOrEmpty(strString) || iLen <= 0)   return "";

            string strStringLower = "";
            if (bNosign)
            {
                strStringLower = (strString.Length <= 5000) ? strString : strString.Substring(0, 5000);
                strStringLower = ConvertUtil.UnicodeToASCIIWithMap(strStringLower);
            }
            else
            {
                strStringLower = strString.ToLower();
            }

            int iBeginAt = 0;
            int iActualLen = 0;
            if ((arrKeyWord != null) && (arrKeyWord.Count > 0) && (strStringLower.Length > iLen))
            {
                int iFound = -1;
                string strKeyWord = "";
                for (int w = 0; ((w < arrKeyWord.Count) && (iFound == -1)); w++)
                {
                    strKeyWord = ((string)arrKeyWord[w]).ToLower();
                    if (bNosign)
                        strKeyWord = ConvertUtil.UnicodeToASCIIWithMap(strKeyWord);
                    iFound = strStringLower.IndexOf(strKeyWord);
                }

                if ((iFound > 0) && ((iFound + strKeyWord.Length) > iLen))
                {
                    int iLeft = Math.Max(0, iFound - Math.Max(0, iLen - strKeyWord.Length));
                    int ii = iLeft;
                    while (ii < iFound)
                    {
                        if (char.IsPunctuation(strStringLower[ii]))
                            break;
                        ii++;
                    }

                    if (iFound + (strKeyWord.Length / 2) - ii < iLen / 3)
                    {
                        ii = iLeft;
                        while (ii < iFound)
                        {
                            if (!char.IsLetterOrDigit(strStringLower[ii]))
                                break;
                            ii++;
                        }
                    }
                    iBeginAt = ii + 1;
                }
            }

            bool bAppendSpace = ((iBeginAt + iLen) > strStringLower.Length);
            iActualLen = Math.Min(strStringLower.Length - iBeginAt, iLen);
            strStringLower = strStringLower.Substring(iBeginAt, iActualLen);
            int iStringLen = strStringLower.Length;
            strStringLower = strStringLower.TrimEnd(new char[] { '\0' });
            iActualLen -= (iStringLen - strStringLower.Length);

            // trim start
            bool bAppendHead = false;
            if (iBeginAt > 0)
            {
                int i = 0;
                while (i < strStringLower.Length)
                {
                    char ch = strStringLower[i];
                    if (!char.IsLetterOrDigit(ch) && ch != ')' && ch != '}' && ch != ']' && ch != '>')
                        break;
                    i++;
                }
                if (i < strStringLower.Length)
                {
                    strStringLower = strStringLower.Substring(i);
                    iBeginAt += i;

                    iStringLen = strStringLower.Length;
                    strStringLower = strStringLower.TrimStart(" ".ToCharArray()).TrimStart("\r\n".ToCharArray());
                    iBeginAt += (iStringLen - strStringLower.Length);
                    strStringLower = strStringLower.Trim();
                    iActualLen = strStringLower.Length;
                }
                strStringLower += (bAppendSpace ? " " : "");
                bAppendHead = true;
                iActualLen += bAppendSpace ? 1 : 0;
            }

            // trim end
            bool bAppendTail = false;
            if (strString.Length > iLen)
            {
                int i = strStringLower.Length - 1;
                while (i >= 0)
                {
                    char ch = strStringLower[i];
                    if (!char.IsLetterOrDigit(ch) && ch != '(' && ch != '{' && ch != '[' && ch != '<')
                        break;
                    i--;
                }
                if (i >= 0)
                {
                    strStringLower = strStringLower.Substring(0, i + 1).Trim();
                    iActualLen = strStringLower.Length;
                }
                bAppendTail = true;
            }
            return ((bAppendHead ? "... " : "") + strString.Substring(iBeginAt, iActualLen) + (bAppendTail ? " ..." : ""));
        }

        public static string HighLightWord(string strString, string strKeyWord, bool bNosign)
        {
            if (string.IsNullOrEmpty(strString) || string.IsNullOrEmpty(strKeyWord))
                return strString;

            string strStringLower = strString.ToLower();

            if (bNosign)
                strStringLower = ConvertUtil.UnicodeToASCIIWithMap(strStringLower);

            string strWord = strKeyWord.ToLower();
            if (bNosign)
                strWord = ConvertUtil.UnicodeToASCIIWithMap(strWord);

            if (!string.IsNullOrEmpty(strWord))
            {
                int iStartAt = 0, iFound = -1;
                ArrayList arrOpenTag = new ArrayList();
                while (iStartAt < strStringLower.Length)
                {
                    if ((iFound = strStringLower.IndexOf(strWord, iStartAt)) < 0)
                        break;
                    arrOpenTag.Add(iFound);
                    iStartAt = iFound + 1;
                }

                for (int i = arrOpenTag.Count - 1; i >= 0; i--)
                {
                    int iOpenTag = (int)arrOpenTag[i];
                    if (iOpenTag > 0)
                    {
                        char chPre = strStringLower[iOpenTag - 1];
                        if (chPre != ' ' && chPre != ',' && chPre != '.' && chPre != ';' && chPre != ':' && chPre != '!' && chPre != '?' && chPre != '\'' && chPre != '"' && chPre != '(' && chPre != ')' && chPre != '|' && chPre != '\r' && chPre != '\n')
                            continue;
                    }
                    int iCloseTag = iOpenTag + strWord.Length;
                    if (iCloseTag < strStringLower.Length)
                    {
                        char chNext = strStringLower[iCloseTag];
                        if (chNext != ' ' && chNext != ',' && chNext != '.' && chNext != ';' && chNext != ':' && chNext != '!' && chNext != '?' && chNext != '\'' && chNext != '"' && chNext != '(' && chNext != ')' && chNext != '|' && chNext != '\r' && chNext != '\n')
                            continue;
                    }

                    strStringLower = strStringLower.Insert(iCloseTag, "</b>");
                    strStringLower = strStringLower.Insert(iOpenTag, "<b>");

                    strString = strString.Insert(iCloseTag, "</b>");
                    strString = strString.Insert(iOpenTag, "<b>");
                }
            }
            return strString;
        }

        /*public static string HighLightListWord(string strString, ArrayList arrKeyWord, bool bNosign)
        {
            if (string.IsNullOrEmpty(strString) || arrKeyWord == null || arrKeyWord.Count == 0)
                return strString;

            string strStringLower = strString.ToLower();

            if (bNosign)
                strStringLower = ConvertUtil.UnicodeToASCIIWithMap(strStringLower);

            for (int k = 0; k < arrKeyWord.Count; k++)
            {
                string strWord = ((string)arrKeyWord[k]).ToLower();
                if (bNosign)
                    strWord = ConvertUtil.UnicodeToASCIIWithMap(strWord);

                if (!string.IsNullOrEmpty(strWord))
                {
                    int iStartAt = 0, iFound = -1;
                    ArrayList arrOpenTag = new ArrayList();
                    while (iStartAt < strStringLower.Length)
                    {
                        if ((iFound = strStringLower.IndexOf(strWord, iStartAt)) < 0)
                            break;
                        arrOpenTag.Add(iFound);
                        iStartAt = iFound + 1;
                    }

                    for (int i = arrOpenTag.Count - 1; i >= 0; i--)
                    {
                        int iOpenTag = (int)arrOpenTag[i];
                        if (iOpenTag > 0)
                        {
                            char chPre = strStringLower[iOpenTag - 1];
                            if (chPre != ' ' && chPre != ',' && chPre != '.' && chPre != ';' && chPre != ':' && chPre != '!' && chPre != '?' && chPre != '\'' && chPre != '"' && chPre != '(' && chPre != ')' && chPre != '|' && chPre != '\r' && chPre != '\n')
                                continue;
                        }
                        int iCloseTag = iOpenTag + strWord.Length;
                        if (iCloseTag < strStringLower.Length)
                        {
                            char chNext = strStringLower[iCloseTag];
                            if (chNext != ' ' && chNext != ',' && chNext != '.' && chNext != ';' && chNext != ':' && chNext != '!' && chNext != '?' && chNext != '\'' && chNext != '"' && chNext != '(' && chNext != ')' && chNext != '|' && chNext != '\r' && chNext != '\n')
                                continue;
                        }

                        strStringLower = strStringLower.Insert(iCloseTag, "</b>");
                        strStringLower = strStringLower.Insert(iOpenTag, "<b>");

                        strString = strString.Insert(iCloseTag, "</b>");
                        strString = strString.Insert(iOpenTag, "<b>");
                    }
                }
            }
            return strString;
        }*/

        public static string HighLightListWord(string strString, string[] arrKeyWord, bool bNosign)
        {
            //if (string.IsNullOrEmpty(strString) || arrKeyWord == null || arrKeyWord.Count == 0)
            if (string.IsNullOrEmpty(strString) || arrKeyWord == null || arrKeyWord.Length == 0)
                return strString;

            string strStringLower = strString.ToLower();

            if (bNosign)
                strStringLower = ConvertUtil.UnicodeToASCIIWithMap(strStringLower);

            //for (int k = 0; k < arrKeyWord.Count; k++)
            for (int k = 0; k < arrKeyWord.Length; k++)
            {
                string strWord = ((string)arrKeyWord[k]).ToLower();
                if (bNosign)
                    strWord = ConvertUtil.UnicodeToASCIIWithMap(strWord);

                if (!string.IsNullOrEmpty(strWord))
                {
                    int iStartAt = 0, iFound = -1;
                    ArrayList arrOpenTag = new ArrayList();
                    while (iStartAt < strStringLower.Length)
                    {
                        if ((iFound = strStringLower.IndexOf(strWord, iStartAt)) < 0)
                            break;
                        arrOpenTag.Add(iFound);
                        iStartAt = iFound + 1;
                    }

                    for (int i = arrOpenTag.Count - 1; i >= 0; i--)
                    {
                        int iOpenTag = (int)arrOpenTag[i];
                        if (iOpenTag > 0)
                        {
                            char chPre = strStringLower[iOpenTag - 1];
                            if (chPre != ' ' && chPre != ',' && chPre != '.' && chPre != ';' && chPre != ':' && chPre != '!' && chPre != '?' && chPre != '-' && chPre != '\'' && chPre != '"' && chPre != '(' && chPre != ')' && chPre != '|' && chPre != '\r' && chPre != '\n')
                                continue;
                        }
                        int iCloseTag = iOpenTag + strWord.Length;
                        if (iCloseTag < strStringLower.Length)
                        {
                            char chNext = strStringLower[iCloseTag];
                            if (chNext != ' ' && chNext != ',' && chNext != '.' && chNext != ';' && chNext != ':' && chNext != '!' && chNext != '?' && chNext != '-' && chNext != '\'' && chNext != '"' && chNext != '(' && chNext != ')' && chNext != '|' && chNext != '\r' && chNext != '\n')
                                continue;
                        }

                        strStringLower = strStringLower.Insert(iCloseTag, "</b>");
                        strStringLower = strStringLower.Insert(iOpenTag, "<b>");

                        strString = strString.Insert(iCloseTag, "</b>");
                        strString = strString.Insert(iOpenTag, "<b>");
                    }
                }
            }
            return strString;
        }

        public static bool IsVnUnsignedString(string strString)
        {
            if (string.IsNullOrEmpty(strString)) return true;
            for (int i = 0; i < strString.Length; i++)
            {
                if ((int)strString[i] >= 127)
                    return false;
            }
            return true;
        }

        public static bool IsVnSignedString(string strString)
        {
            if (string.IsNullOrEmpty(strString)) return false;
            for (int i = 0; i < strString.Length; i++)
            {
                if ((int)strString[i] >= 127)
                    return true;
            }
            return false;
        }

        public static string UpperFirstChar(string strUnicode)
        {
            if (string.IsNullOrEmpty(strUnicode)) return strUnicode;
            return strUnicode.Substring(0, 1).ToUpper() + strUnicode.Substring(1);
        }

        public static string UpperFirstCharInWord(string strUnicode)
        {
            if (string.IsNullOrEmpty(strUnicode)) return strUnicode;
            StringBuilder strRet = new StringBuilder();
            string[] arrStrWords = strUnicode.Split(" ".ToCharArray());
            foreach (string strWord in arrStrWords)
                strRet.Append(UpperFirstChar(strWord) + " ");
            return strRet.ToString().TrimEnd(" ".ToCharArray());
        }

        public static string ReplaceInvalidCharForRefName(string strString)
        {
            if (string.IsNullOrEmpty(strString))    return strString;
            return TrimMultiUnderline(TrimMultiHyphen(strString.Trim().Replace(",", "_").Replace(".", "_").Replace(";", "_").Replace(":", "_").Replace("!", "_").Replace("?", "_").Replace("'", "_").Replace("\"", "_").Replace("*", "_").Replace("\\", "_").Replace("/", "_").Replace("<", "_").Replace(">", "_").Replace("|", "_").Replace("&", "_").Replace(" ", "-").Replace("%", "_").Replace("=", "_")));
        }

        public static bool IsNumberString(string strString)
        {
            if (string.IsNullOrEmpty(strString))
                return false;
            for (int i = 0; i < strString.Length; i++)
            {
                if (!char.IsNumber(strString[i]))
                    return false;
            }
            return true;
        }

        //public static string FormatPostgresFTS(string strString)
        //{
        //    if (string.IsNullOrEmpty(strString))
        //        return strString;
        //    strString = strString.Trim();
        //    if (strString.Substring(0,1)=="\"" && strString.Substring(strString.Length-1, 1)=="\"")
        //    {
        //        // tim nguyen cum tu/phase
        //        strString = strString.Replace("\"", "");
        //        strString = strString.Replace(" ", " <-> ");
        //        return strString;
        //    }

        //    strString = strString.Replace("\"", "");
        //    strString = strString.Replace(" ", " & ");
        //    return strString;
        //}

        public static string FormatPostgresFTS(string strString, string label = "", bool b_and = true)
        {
            if (string.IsNullOrEmpty(strString))
                return strString;
            strString = strString.Trim();
            if (strString.Substring(0, 1) == "\"" && strString.Substring(strString.Length - 1, 1) == "\"")
            {
                // tim nguyen cum tu/phase
                strString = strString.Replace("\"", "");
                if (string.IsNullOrEmpty(label))
                    strString = strString.Replace(" ", " <-> ");
                else
                    strString = strString.Replace(" ", ":" + label + " <-> ") + ":" + label;
                return strString;
            }

            char sign;
            if (b_and == true)
                sign = '&';
            else
                sign = '|';

            strString = strString.Replace("\"", "");
            if (string.IsNullOrEmpty(label))
                strString = strString.Replace(" ", " " + sign + " ");
            else
                strString = strString.Replace(" ", ":" + label + " " + sign + " ") + ":" + label;
            return strString;
        }

        public static string ToMD5(string strInput)
        {
            try
            {
                using (System.Security.Cryptography.MD5 md5 = System.Security.Cryptography.MD5.Create())
                {
                    byte[] inputBytes = System.Text.Encoding.ASCII.GetBytes(strInput);
                    byte[] hashBytes = md5.ComputeHash(inputBytes);

                    // Convert the byte array to hexadecimal string
                    StringBuilder sb = new StringBuilder();
                    for (int i = 0; i < hashBytes.Length; i++)
                    {
                        sb.Append(hashBytes[i].ToString("x2"));
                    }
                    return sb.ToString();
                }
            }
            catch (Exception)
            {
                return "";
            }
        }

        public static string DoubleQuote(object str)
        {
            return str == null ? "" : str.ToString().Replace("'", "''");
        }

        public static string ToString(object value)
        {
            return value == null ? "null" : value.ToString();
        }

        public static string FormatNumber(object value)
        {
            return value == null ? "null" : value.ToString();
        }

        public static string FormatString(object value, bool double_quote = true)
        {
            return value == null ? "null" : "'" + (double_quote ? value.ToString().Replace("'", "''") : value.ToString()) + "'";
        }

        public static string FormatDateTime(object value)
        {
            return value == null ? "null" : "'" + ((DateTime)value).ToString("yyyy-MM-dd") + "'";
        }

        //public static string ToString(object value)
        //{
        //    return value == null ? "" : value.ToString();
        //}

        //public static long ToLong(object value)
        //{
        //    return value == null ? 0 : (long)value;
        //}

        //public static int ToInt(object value)
        //{
        //    return value == null ? 0 : (int)value;
        //}

        public static string fn_sort_term(string str, string pattern, bool is_asc = true)
        {
            string[] temp = str.Split(pattern);
            List<string> list = new List<string>(temp);
            list.Sort();
            return String.Join(pattern, list);
        }
    }
}
