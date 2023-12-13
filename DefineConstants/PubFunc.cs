using System.Text;
using System.Text.RegularExpressions;
using XSystem.Security.Cryptography;

namespace DefineConstants
{
    public static class PubFunc
    {

        public static string TextToUrl(string text)
        {
            if (text != null)
            {
                text = RemoveUnicode(text);
                System.Text.RegularExpressions.Regex regex = new System.Text.RegularExpressions.Regex(@"\p{IsCombiningDiacriticalMarks}+");
                string strFormD = text.Normalize(System.Text.NormalizationForm.FormD);
                text = regex.Replace(strFormD, String.Empty).Replace('\u0111', 'd').Replace('\u0110', 'D');

                //đổi tất cả các ký tự không phải từ và số thành -
                text = new System.Text.RegularExpressions.Regex(@"[^a-zA-Z0-9]").Replace(text, "-").ToLower();

                //xóa bớt nếu nhiều hơn 2 - cạnh nhau thì xóa thành 1
                text = new System.Text.RegularExpressions.Regex(@"\-+").Replace(text, "-").Trim('-');

                return text;
            }
            else
            {
                return null;
            }
        }

        public static string GetMD5(string pwd)
        {
            if (pwd != null)
            {
                MD5CryptoServiceProvider md5 = new MD5CryptoServiceProvider();
                byte[] bHash = md5.ComputeHash(Encoding.UTF8.GetBytes(pwd));
                StringBuilder sbHash = new StringBuilder();

                foreach (byte b in bHash)
                {
                    sbHash.Append(String.Format("{0:x2}", b));
                }
                return sbHash.ToString();
            }
            return "";
        }
        public static string RemoveUnicode(string text)
        {
            string[] arr1 = new string[] { "á", "à", "ả", "ã", "ạ", "â", "ấ", "ầ", "ẩ", "ẫ", "ậ", "ă", "ắ", "ằ", "ẳ", "ẵ", "ặ",
            "đ",
            "é","è","ẻ","ẽ","ẹ","ê","ế","ề","ể","ễ","ệ",
            "í","ì","ỉ","ĩ","ị",
            "ó","ò","ỏ","õ","ọ","ô","ố","ồ","ổ","ỗ","ộ","ơ","ớ","ờ","ở","ỡ","ợ",
            "ú","ù","ủ","ũ","ụ","ư","ứ","ừ","ử","ữ","ự",
            "ý","ỳ","ỷ","ỹ","ỵ",};
            string[] arr2 = new string[] { "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a",
            "d",
            "e","e","e","e","e","e","e","e","e","e","e",
            "i","i","i","i","i",
            "o","o","o","o","o","o","o","o","o","o","o","o","o","o","o","o","o",
            "u","u","u","u","u","u","u","u","u","u","u",
            "y","y","y","y","y",};
            for (int i = 0; i < arr1.Length; i++)
            {
                text = text.Replace(arr1[i], arr2[i]);
                text = text.Replace(arr1[i].ToUpper(), arr2[i].ToUpper());
            }
            return text;
        }
        public static string RemoveSpecialcharacters(string text)
        {
            string[] special = new string[] { "~","`","@","#","$","%","^","&","*","(",")","_","+","=","{","[","}","]"
            ,"\\","|",";",":","'","\"","/","?",",","<",">"," ","\n","\r"," ","\n\n"};
            for (int i = 0; i < special.Length; i++)
            {
                text = text.Replace(special[i], " ");
            }
            return text;
        }
        public static string GetUrlText(string title, int maxlength = 255)
        {



            if (title == null)
            {
                return string.Empty;
            }
            title = title.AsStringWithoutAccents().ToLower().Replace(" ", "-");


            //title = RemoveUnicode(title.ToLower());
            //int length = title.Length;
            //bool prevdash = false;
            //StringBuilder stringBuilder = new StringBuilder(length);
            //char c;

            //for (int i = 0; i < length; ++i)
            //{
            //    c = title[i];
            //    if ((c >= 'a' && c <= 'z') || (c >= '0' && c <= '9'))
            //    {
            //        stringBuilder.Append(c);
            //        prevdash = false;
            //    }
            //    else if (c >= 'A' && c <= 'Z')
            //    {
            //        // tricky way to convert to lower-case
            //        stringBuilder.Append((char)(c | 32));
            //        prevdash = false;
            //    }
            //    else if ((c == ' ') || (c == ',') || (c == '.') || (c == '/') ||
            //        (c == '\\') || (c == '-') || (c == '_') || (c == '='))
            //    {
            //        if (!prevdash && (stringBuilder.Length > 0))
            //        {
            //            stringBuilder.Append('-');
            //            prevdash = true;
            //        }
            //    }
            //    else if (c >= 128)
            //    {
            //        int previousLength = stringBuilder.Length;                    
            //        stringBuilder.Append(c);
            //        if (previousLength != stringBuilder.Length)
            //        {
            //            prevdash = false;
            //        }
            //    }

            //    if (i == maxlength)
            //    {
            //        break;
            //    }
            //}

            //if (prevdash)
            //{
            //    return stringBuilder.ToString().Substring(0, stringBuilder.Length - 1);
            //}
            //else
            //{
            //    return stringBuilder.ToString();
            //}
            return title;
        }
        /// <summary>
        /// Ghi log 
        /// </summary>
        /// <param name="pathfile"></param>
        /// <param name="str"></param>
        public static void WriteLog(string pathfile, string str)
        {
            try
            {
                using (System.IO.StreamWriter file =
                new System.IO.StreamWriter(pathfile, true))
                {
                    file.WriteLine(str);
                }
            }
            catch
            {

            }
        }

        public static string FormatMoney(string str, char character = '.')
        {
            if (String.IsNullOrWhiteSpace(str) || str == "0") return "0";
            try
            {
                System.Globalization.CultureInfo elGR = System.Globalization.CultureInfo.CreateSpecificCulture("el-GR");
                return String.Format(elGR, "{0:0,0}", Double.Parse(str.Split('.')[0]));
            }
            catch
            {
                return str;
            }
        }
        public static bool CheckURLValid(string source)
        {
            Uri uriResult;
            return Uri.TryCreate(source, UriKind.Absolute, out uriResult)
                && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
        }
        public static string RemoveHTML(string inputHTML)
        {
            if (string.IsNullOrEmpty(inputHTML)) return "";
            return Regex.Replace(inputHTML, @"<[^>]+>|&nbsp;", "").Trim();
        }
        public static string formatNumber(double number)
        {
            return string.Format(new System.Globalization.CultureInfo("en-US"), "{0}", number);
        }
        public static string GetTimeFromLastPost(DateTime StartDate, DateTime EndDate, bool OnProgress = false)
        {
            string strResult = "";
            int totaldays = Convert.ToInt32((EndDate - StartDate).TotalDays);
            if (totaldays >= 1)
            {
                if (totaldays > 30)
                {
                    strResult = StartDate.ToString("dd/MM/yyyy HH:mm");
                }
                else
                {
                    strResult = totaldays + (OnProgress ? " ngày sau" : " ngày trước");
                }
            }
            else if (Convert.ToInt32((EndDate - StartDate).TotalHours) >= 1)
            {
                strResult = Convert.ToInt32((EndDate - StartDate).TotalHours) + (OnProgress ? " giờ sau" : " giờ trước");
            }
            else if (Convert.ToInt32((EndDate - StartDate).TotalMinutes) >= 1)
            {
                strResult = Convert.ToInt32((EndDate - StartDate).TotalMinutes) + (OnProgress ? " phút sau" : " phút trước");
            }
            else if (Convert.ToInt32((EndDate - StartDate).TotalSeconds) >= 1)
            {
                strResult = Convert.ToInt32((EndDate - StartDate).TotalSeconds) + (OnProgress ? " giây sau" : " giây trước");
            }
            else
            {
                strResult = "Vừa xong";
            }
            return strResult;
        }
        /// <summary>
        /// Tiếng Việt không dấu
        /// </summary>
        /// <param name="item"></param>
        /// <param name="defaultString"></param>
        /// <returns></returns>
        public static string AsStringWithoutAccents(this object item, string defaultString = default(string))
        {
            if (item == null || item.Equals(System.DBNull.Value))
                return defaultString;

            string newText = item.ToString();

            //bỏ dấu tiếng việt
            System.Text.RegularExpressions.Regex regex = new System.Text.RegularExpressions.Regex(@"\p{IsCombiningDiacriticalMarks}+");
            string strFormD = newText.Normalize(System.Text.NormalizationForm.FormD);
            newText = regex.Replace(strFormD, String.Empty).Replace('\u0111', 'd').Replace('\u0110', 'D');

            //bỏ tất cả ký tự đặc biệt
            newText = new System.Text.RegularExpressions.Regex(@"[^A-Za-z0-9\-]").Replace(newText, " ");

            //rút ngắn khoảng trắng
            newText = new System.Text.RegularExpressions.Regex(@"[\s]+").Replace(newText, " ");

            return newText.Trim();
        }
        public static string AsNotSpecialCharacter(this string item, string defaultString = default(string))
        {
            if (item == null || item.Equals(System.DBNull.Value))
                return defaultString;

            string newText = item.ToString().ToLower();

            return new System.Text.RegularExpressions.Regex(@"[^A-Za-z0-9]").Replace(newText, "");
        }
        public static string AsEmail(this string item, string defaultString = default(string))
        {
            if (item == null || item.Equals(System.DBNull.Value))
                return defaultString;

            string newText = item.ToString().ToLower();

            return new System.Text.RegularExpressions.Regex(@"[^A-Za-z0-9\@\.]").Replace(newText, "");
        }
        public static string GetStatusOpenCourse(DateTime? startdate = null, DateTime? enddate = null, string lang = "vi")
        {
            string dangdienra = "Đang diễn ra";
            string daketthuc = "Đã kết thúc";
            string ketthucvao = "Kết thúc vào";
            string batdauvao = "Bắt đầu vào";
            if (lang == "en")
            {
                dangdienra = "Current";
                daketthuc = "Expired";
                ketthucvao = "End at";
                batdauvao = "Start at";
            }
            if (startdate == null && enddate == null)
                return dangdienra;
            else if (startdate == null && enddate != null)
            {
                if (((DateTime)enddate).Date < DateTime.Now.Date)
                {
                    return daketthuc;
                }
                return ketthucvao + " " + enddate?.ToString("dd/MM/yyyy");
            }
            else if (startdate != null && enddate == null)
            {
                if (((DateTime)startdate).Date <= DateTime.Now.Date)
                {
                    return dangdienra;
                }
                return batdauvao + " " + startdate?.ToString("dd/MM/yyyy");
            }

            return startdate?.ToString("dd/MM/yyyy") + " - " + enddate?.ToString("dd/MM/yyyy");
        }
        public static DateTime StartOfWeek(this DateTime dt, DayOfWeek startOfWeek)
        {
            int diff = dt.DayOfWeek - startOfWeek;
            if (diff < 0)
            {
                diff += 7;
            }
            return dt.AddDays(-1 * diff).Date;
        }
        public static DateTime EndOfWeek(this DateTime dt, DayOfWeek EndOfWeek)
        {
            int diff = EndOfWeek - dt.DayOfWeek;
            if (diff < 0)
            {
                diff += 7;
            }
            return dt.AddDays(1 * diff).Date;
        }
        public static bool isCheckUrlYoutube(string url)
        {
            Regex r = new Regex(@"youtu(?:\.be|be\.com)/(?:.*v(?:/|=)|(?:.*/)?)([a-zA-Z0-9-_]+)");
            return r.IsMatch(url);
        }
        public static bool isEmbedCode(string html_code)
        {
            Regex r = new Regex("<(?:\"[^\"]*\"['\"]*|'[^']*'['\"]*|[^'\">])+>");
            return r.IsMatch(html_code);
        }

    }
}
