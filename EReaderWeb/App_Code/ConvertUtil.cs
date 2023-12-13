using System.Collections;
using System.Text;

namespace EReaderWeb.App_Code
{
    // cung cap cac ham chuyen doi chuoi ky tu
    class ConvertUtil
    {
        private static int[] Map_UTF8 ={97,226,259,101,234,105,111,244,417,117,432,121,
                           65,194,258,69,202,73,79,212,416,85,431,89,
                           225,7845,7855,233,7871,237,243,7889,7899,250,7913,253,
                           193,7844,7854,201,7870,205,211,7888,7898,218,7912,221,
                           224,7847,7857,232,7873,236,242,7891,7901,249,7915,7923,
                           192,7846,7856,200,7872,204,210,7890,7900,217,7914,7922,
                           7841,7853,7863,7865,7879,7883,7885,7897,7907,7909,7921,7925,
                           7840,7852,7862,7864,7878,7882,7884,7896,7906,7908,7920,7924,
                           7843,7849,7859,7867,7875,7881,7887,7893,7903,7911,7917,7927,
                           7842,7848,7858,7866,7874,7880,7886,7892,7902,7910,7916,7926,
                           227,7851,7861,7869,7877,297,245,7895,7905,361,7919,7929,
                           195,7850,7860,7868,7876,296,213,7894,7904,360,7918,7928,
                           100,273,68,272,8211,2812,8216,8217,8220,8221};

        private static char[] Map_ASCII ={'a','a','a','e','e','i','o','o','o','u','u','y',
                           'A','A','A','E','E','I','O','O','O','U','U','Y',
                           'a','a','a','e','e','i','o','o','o','u','u','y',
                           'A','A','A','E','E','I','O','O','O','U','U','Y',
                           'a','a','a','e','e','i','o','o','o','u','u','y',
                           'A','A','A','E','E','I','O','O','O','U','U','Y',
                           'a','a','a','e','e','i','o','o','o','u','u','y',
                           'A','A','A','E','E','I','O','O','O','U','U','Y',
                           'a','a','a','e','e','i','o','o','o','u','u','y',
                           'A','A','A','E','E','I','O','O','O','U','U','Y',
                           'a','a','a','e','e','i','o','o','o','u','u','y',
                           'A','A','A','E','E','I','O','O','O','U','U','Y',
                           'd','d','D','D','-','-','\'','\'','\"','\"'};

        string[] Map_VIRQ ={"a","a^","a(","e","e^","i","o","o^","o+","u","u+","y",
                           "A","A^","A(","E","E^","I","O","O^","O+","U","U+", "Y",
                           "a'","a^'","a('","e'","e^'","i'","o'","o^'","o+'","u'","u+'","y'",
                           "A'","A^'","A('","E'","E^'","I'","O'","O^'","O+'","U'","U+'","Y'",
                           "a`","a^`","a(`","e`","e^`","i`","o`","o^`","o+`","u`","u+`","y`",
                           "A`","A^`","A(`","E`","E^`","I`","O`","O^`","O+`","U`","U+`","Y`",
                           "a.","a^.","a(.","e.","e^.","i.","o.","o^.","o+.","u.","u+.","y.",
                           "A.","A^.","A(.","E.","E^.","I.","O.","O^.","O+.","U.","U+.","Y.",
                           "a?","a^?","a(?","e?","e^?","i?","o?","o^?","o+?","u?","u+?","y?",
                           "A?","A^?","A(?","E?","E^?","I?","O?","O^?","O+?","U?","U+?","Y?",
                           "a~","a^~","a(~","e~","e^~","i~","o~","o^~","o+~","u~","u+~","y~",
                           "A~","A^~","A(~","E~","E^~","I~","O~","O^~","O+~","U~","U+~","Y~",
                           "d","dd","D","DD"};

        private static int[] Map_VNOrigin = {194,226,258,259,202,234,212,244,431,432,416,417,272,
                                273,7840,7841,7842,7843,7844,7845,7846,7847,7848,7849,7850,7851,
                                7852,7853,7854,7855,7856,7857,7858,7859,7860,7861,7862,7863,7864,
                                7865,7866,7867,7868,7869,7870,7871,7872,7873,7874,7875,7876,7877,
                                7878,7879,7880,7881,7882,7883,7884,7885,7886,7887,7888,7889,7890,
                                7891,7892,7893,7894,7895,7896,7897,7898,7899,7900,7901,7902,7903,
                                7904,7905,7906,7907,7908,7909,7910,7911,7912,7913,7914,7915,7916,
                                7917,7918,7919,7920,7921,7922,7923,7924,7925,7926,7927,7928,7929,
                                192,193,195,200,201,204,205,210,211,213,217,218,221,224,225,227,
                                232,233,236,237,242,243,245,249,250,253,360,361,296,297};

        private static int[] Map_VN1258 = {194,226,258,259,202,234,212,244,431,432,416,417,272,273,
                                65,803,97,803,65,777,97,777,194,769,226,769,194,768,226,768,194,777,
                                226,777,194,771,226,771,194,803,226,803,258,769,259,769,258,768,259,
                                768,258,777,259,777,258,771,259,771,258,803,259,803,69,803,101,803,
                                69,777,101,777,69,771,101,771,202,769,234,769,202,768,234,768,202,
                                777,234,777,202,771,234,771,202,803,234,803,73,777,105,777,73,803,
                                105,803,79,803,111,803,79,777,111,777,212,769,244,769,212,768,244,
                                768,212,777,244,777,212,771,244,771,212,803,244,803,416,769,417,769,
                                416,768,417,768,416,777,417,777,416,771,417,771,416,803,417,803,85,
                                803,117,803,85,777,117,777,431,769,432,769,431,768,432,768,431,777,
                                432,777,431,771,432,771,431,803,432,803,89,768,121,768,89,803,121,
                                803,89,777,121,777,89,771,121,771,65,768,65,769,65,771,69,768,69,
                                769,73,768,73,769,79,768,79,769,79,771,85,768,85,769,89,769,97,768,
                                97,769,97,771,101,768,101,769,105,768,105,769,111,768,111,769,111,
                                771,117,768,117,769,121,769,85,771,117,771,73,771,105,771};
        #region TCVN3 -> unicode and unicode -> TCVN3
        ///
        /// add by vdhoang
        ///
        private static char[] tcvnchars = {
        'µ', '¸', '¶', '·', '¹',
        '¨', '»', '¾', '¼', '½', 'Æ',
        '©', 'Ç', 'Ê', 'È', 'É', 'Ë',
        '®', 'Ì', 'Ð', 'Î', 'Ï', 'Ñ',
        'ª', 'Ò', 'Õ', 'Ó', 'Ô', 'Ö',
        '×', 'Ý', 'Ø', 'Ü', 'Þ',
        'ß', 'ã', 'á', 'â', 'ä',
        '«', 'å', 'è', 'æ', 'ç', 'é',
        '¬', 'ê', 'í', 'ë', 'ì', 'î',
        'ï', 'ó', 'ñ', 'ò', 'ô',
        '­', 'õ', 'ø', 'ö', '÷', 'ù',
        'ú', 'ý', 'û', 'ü', 'þ',
        '¡', '¢', '§', '£', '¤', '¥', '¦'
                                          };

        private static char[] unichars = {
        'à', 'á', 'ả', 'ã', 'ạ',
        'ă', 'ằ', 'ắ', 'ẳ', 'ẵ', 'ặ',
        'â', 'ầ', 'ấ', 'ẩ', 'ẫ', 'ậ',
        'đ', 'è', 'é', 'ẻ', 'ẽ', 'ẹ',
        'ê', 'ề', 'ế', 'ể', 'ễ', 'ệ',
        'ì', 'í', 'ỉ', 'ĩ', 'ị',
        'ò', 'ó', 'ỏ', 'õ', 'ọ',
        'ô', 'ồ', 'ố', 'ổ', 'ỗ', 'ộ',
        'ơ', 'ờ', 'ớ', 'ở', 'ỡ', 'ợ',
        'ù', 'ú', 'ủ', 'ũ', 'ụ',
        'ư', 'ừ', 'ứ', 'ử', 'ữ', 'ự',
        'ỳ', 'ý', 'ỷ', 'ỹ', 'ỵ',
        'Ă', 'Â', 'Đ', 'Ê', 'Ô', 'Ơ', 'Ư'
                                         };

        private static char[] ConverterTCVN3ToUnicodeTable;
        public static void ConverterTCVN3ToUnicode()
        {
            ConverterTCVN3ToUnicodeTable = new char[256];
            for (int i = 0; i < 256; i++)
                ConverterTCVN3ToUnicodeTable[i] = (char)i;
            for (int i = 0; i < tcvnchars.Length; i++)
            {
                ConverterTCVN3ToUnicodeTable[tcvnchars[i]] = unichars[i];
            }
        }
        public static string ConvertStringTCVN3ToUnicode(string value)
        {
            ConverterTCVN3ToUnicode();
            char[] chars = value.ToCharArray();
            for (int i = 0; i < chars.Length; i++)
                if (chars[i] < (char)256)
                    chars[i] = ConverterTCVN3ToUnicodeTable[chars[i]];
            return new string(chars);
        }
        public static string ConvertStringUnicodeToTCVN3(string value)
        {
            char[] chars = value.ToCharArray();
            for (int i = 0; i < chars.Length; i++)
            {
                for (int k = 0; k < unichars.Length; k++)
                {
                    if (chars[i] == unichars[k])
                        chars[i] = tcvnchars[k];
                }
            }
            return new string(chars);
        }
        #endregion



        /** check if it's in order */
        public static bool Between(int nStart, int nVal, int nEnd)
        {
            return (nVal >= nStart && nVal <= nEnd);
        }

        /** convert from utf8 to plain text ascii */
        public static string UTF8ToASCII(byte[] buf)
        {
            // Vinh sua
            if ((buf == null) || (buf.Length <= 0))
                return "";

            // net core required
            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);

            int nLen = buf.Length;
            StringBuilder strResult = new StringBuilder();
            byte[] sixbytes = new byte[6];
            int nCharCode = 0;
            for (int i = 0; i < nLen; i++)
            {
                for (int j = 0; j < 6; j++)
                {
                    if ((i + j) < nLen)
                        sixbytes[j] = buf[i + j];
                }
                if (Between(0, sixbytes[0], 127))
                {
                    nCharCode = sixbytes[0];
                }
                else if (Between(192, sixbytes[0], 223))
                {
                    nCharCode = (sixbytes[0] - 192) * 64 + (sixbytes[1] - 128);
                    i++;
                }
                else if (Between(224, sixbytes[0], 239))
                {
                    nCharCode = (sixbytes[0] - 224) * 4096 + (sixbytes[1] - 128) * 64 + (sixbytes[2] - 128);
                    i += 2;
                }
                else if (Between(240, sixbytes[0], 247))
                {
                    nCharCode = (sixbytes[0] - 240) * 262144 + (sixbytes[1] - 128) * 4096 + (sixbytes[2] - 128) * 64 + (sixbytes[3] - 128);
                    i += 3;
                }
                else if (Between(248, sixbytes[0], 251))
                {
                    nCharCode = (sixbytes[0] - 248) * 16777216 + (sixbytes[1] - 128) * 262144 + (sixbytes[2] - 128) * 4096 + (sixbytes[3] - 128) * 64 + (sixbytes[4] - 128);
                    i += 4;
                }
                else if (Between(252, sixbytes[0], 253))
                {
                    nCharCode = (sixbytes[0] - 252) * 1073741824 + (sixbytes[1] - 128) * 16777216 + (sixbytes[2] - 128) * 262144 + (sixbytes[3] - 128) * 4096 + (sixbytes[4] - 128) * 64 + (sixbytes[5] - 128);
                    i += 5;
                }
                else if (Between(254, sixbytes[0], 255))
                {//error
                    nCharCode = 0;
                }

                if (nCharCode > 127)
                {
                    for (int ii = 0; ii < Map_UTF8.Length; ii++)
                        if (nCharCode == Map_UTF8[ii])
                        {
                            strResult.Append(Map_ASCII[ii].ToString());
                            break;
                        }
                }
                else
                {
                    byte[] bCharCode = { (byte)nCharCode };
                    strResult.Append(Encoding.GetEncoding(1258).GetString(bCharCode));
                }
            }
            return strResult.ToString();
        }

        public static string UTF8ToASCII(string strUTF8)
        {   // Vinh them
            if (string.IsNullOrEmpty(strUTF8)) return "";
            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
            return UTF8ToASCII(Encoding.GetEncoding(1258).GetBytes(strUTF8));
        }

        //public static string UnicodeToASCII(string strUnicode)
        public static string UnicodeToASCII(object strUnicode)
        {   // Vinh them
            if (strUnicode == null) return null;
            if (string.IsNullOrEmpty((string)strUnicode)) return "";
            return UTF8ToASCII(Encoding.UTF8.GetBytes((string)strUnicode));
        }

        public static string UnicodeToASCII(byte[] bufUnicode)
        {   // Vinh them
            if ((bufUnicode == null) || (bufUnicode.Length <= 0)) return "";
            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
            return UnicodeToASCII(Encoding.GetEncoding(1258).GetString(bufUnicode));
        }

        ////////////////////////////////////////////////////////////
        public static string UnicodeToASCIIWithMap(string strUnicode)
        {   // Vinh them
            if (string.IsNullOrEmpty(strUnicode)) return "";
            return UTF8ToASCIIWithMap(Encoding.UTF8.GetBytes(strUnicode));
        }

        public static string UTF8ToASCIIWithMap(byte[] buf)
        {
            // Vinh sua
            if ((buf == null) || (buf.Length <= 0)) return "";

            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);

            int nLen = buf.Length;
            StringBuilder strResult = new StringBuilder();
            byte[] sixbytes = new byte[6];
            int nCharCode = 0;
            for (int i = 0; i < nLen; i++)
            {
                for (int j = 0; j < 6; j++)
                {
                    if ((i + j) < nLen)
                        sixbytes[j] = buf[i + j];
                }
                if (Between(0, sixbytes[0], 127))
                {
                    nCharCode = sixbytes[0];
                }
                else if (Between(192, sixbytes[0], 223))
                {
                    nCharCode = (sixbytes[0] - 192) * 64 + (sixbytes[1] - 128);
                    i++;
                }
                else if (Between(224, sixbytes[0], 239))
                {
                    nCharCode = (sixbytes[0] - 224) * 4096 + (sixbytes[1] - 128) * 64 + (sixbytes[2] - 128);
                    i += 2;
                }
                else if (Between(240, sixbytes[0], 247))
                {
                    nCharCode = (sixbytes[0] - 240) * 262144 + (sixbytes[1] - 128) * 4096 + (sixbytes[2] - 128) * 64 + (sixbytes[3] - 128);
                    i += 3;
                }
                else if (Between(248, sixbytes[0], 251))
                {
                    nCharCode = (sixbytes[0] - 248) * 16777216 + (sixbytes[1] - 128) * 262144 + (sixbytes[2] - 128) * 4096 + (sixbytes[3] - 128) * 64 + (sixbytes[4] - 128);
                    i += 4;
                }
                else if (Between(252, sixbytes[0], 253))
                {
                    nCharCode = (sixbytes[0] - 252) * 1073741824 + (sixbytes[1] - 128) * 16777216 + (sixbytes[2] - 128) * 262144 + (sixbytes[3] - 128) * 4096 + (sixbytes[4] - 128) * 64 + (sixbytes[5] - 128);
                    i += 5;
                }
                else if (Between(254, sixbytes[0], 255))
                {//error
                    nCharCode = 0;
                }

                if (nCharCode > 127)
                {
                    int ii = 0;
                    for (ii = 0; ii < Map_UTF8.Length; ii++)
                    {
                        if (nCharCode == Map_UTF8[ii])
                        {
                            strResult.Append(Map_ASCII[ii].ToString());
                            break;
                        }
                    }
                    if (ii >= Map_UTF8.Length)
                        strResult.Append(" ");
                }
                else
                {
                    byte[] bCharCode = { (byte)nCharCode };
                    //strResult += Encoding.Default.GetString(bCharCode);
                    strResult.Append(Encoding.GetEncoding(1258).GetString(bCharCode));
                }
                //System.Threading.Thread.Sleep(1);
            }
            return strResult.ToString();
        }
        ////////////////////////////////////////////////////////////

        public static string UTF8ToLowerUTF8(string strUTF8)
        {
            if (string.IsNullOrEmpty(strUTF8)) return "";
            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
            string strUnicode = Encoding.UTF8.GetString(Encoding.GetEncoding(1258).GetBytes(strUTF8));
            strUnicode = strUnicode.ToLower();
            return Encoding.GetEncoding(1258).GetString(Encoding.UTF8.GetBytes(strUnicode));
        }

        public static string UTF8ToNoSign(string strUTF8)
        {
            return UTF8ToASCII(strUTF8);
        }

        //public static string UnicodeToNoSign(string strUnicode)
        public static string UnicodeToNoSign(object strUnicode)
        {
            return UnicodeToASCII(strUnicode);
        }

        public static string UnicodeToLower(string strUnicode)
        {
            return UTF8ToUnicode(UTF8ToLowerUTF8(UnicodeToUTF8(strUnicode)));
        }

        /// <summary>
        /// chuyen doi tu chuoi UTF8 sang chuoi Unicode
        /// </summary>
        /// <param name="strUTF8">chuoi UTF8</param>
        /// <returns>chuoi Unicode</returns>
        public static string UTF8ToUnicode(string strUTF8)
        {
            if (string.IsNullOrEmpty(strUTF8)) return "";
            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
            return Encoding.UTF8.GetString(Encoding.GetEncoding(1258).GetBytes(strUTF8));
        }

        public static string UTF8ToUnicodeEx(string strUTF8)
        {
            if (string.IsNullOrEmpty(strUTF8)) return "";
            byte[] btUni = new byte[strUTF8.Length];
            for (int i = 0; i < strUTF8.Length; i++)
                btUni[i] = (byte)strUTF8[i];
            return Encoding.UTF8.GetString(btUni);
        }

        public static string UTF8ToUnicodeEx(byte[] byteUTF8)
        {
            if (byteUTF8 == null || byteUTF8.Length <= 0) return "";
            return Encoding.UTF8.GetString(byteUTF8);
        }

        public static string UnicodeToUTF8(string strUnicode)
        {
            if (string.IsNullOrEmpty(strUnicode)) return "";
            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
            return Encoding.GetEncoding(1258).GetString(Encoding.UTF8.GetBytes(strUnicode));
        }

        public static string UnicodeToUTF8Ex(string strUnicode)
        {
            if (string.IsNullOrEmpty(strUnicode)) return "";
            byte[] utf8 = Encoding.UTF8.GetBytes(strUnicode);
            StringBuilder stret = new StringBuilder();
            foreach (byte c in utf8)
                stret.Append(((char)c).ToString());
            return stret.ToString();
        }

        /// <summary>
        /// chuyen doi chuoi Unicode to hop sang chuoi Unicode dung san
        /// </summary>
        /// <param name="strUnicode">chuoi Unicode to hop</param>
        /// <returns>chuoi Unicode dung san</returns>
        //public static string UnicodeVN1258ToUnicodeOrigin(string strUnicode)
        public static string UnicodeVN1258ToUnicodeOrigin(object stringUnicode)
        {
            //if (strUnicode == null)
            if (stringUnicode == null)
                return null;
            StringBuilder strOriginDest = new StringBuilder();
            int i = 0;
            //int iLenOrigin = 134;
            int iLen1258 = 254;

            //string stTest0_14 = tu 0 den 14 cua Map_VN1258;
            //string stMapVN1258 = tu 14 den het cua Map_VN1258;
            string stMapVN1258 = "";
            for (i = 0; i < iLen1258; i++)
                stMapVN1258 += (char)Map_VN1258[i];
            string stMapVN1258_a = stMapVN1258.Substring(0, 14);

            string strUnicode = (string)stringUnicode;
            i = 0;
            while (i < strUnicode.Length)
            {
                if (strUnicode[i] == 9)
                {
                    strOriginDest.Append("\t");
                    i++;
                    continue;
                }
                if (strUnicode[i] < 'A')
                {
                    strOriginDest.Append(strUnicode[i]);
                    i++;
                    continue;
                }
                if (strUnicode[i] > 'Z' && strUnicode[i] < 'a')
                {
                    strOriginDest.Append(strUnicode[i]);
                    i++;
                    continue;
                }
                if (strUnicode[i] >= 'A' && strUnicode[i] <= 'Z' && strUnicode[i] != 'A' && strUnicode[i] != 'E' && strUnicode[i] != 'I' && strUnicode[i] != 'O' && strUnicode[i] != 'U' && strUnicode[i] != 'Y')
                {
                    strOriginDest.Append(strUnicode[i]);
                    i++;
                    continue;
                }
                if (strUnicode[i] >= 'a' && strUnicode[i] <= 'z' && strUnicode[i] != 'a' && strUnicode[i] != 'e' && strUnicode[i] != 'i' && strUnicode[i] != 'o' && strUnicode[i] != 'u' && strUnicode[i] != 'y')
                {
                    strOriginDest.Append(strUnicode[i]);
                    i++;
                    continue;
                }
                if (i + 1 < strUnicode.Length)
                {
                    string stFind = strUnicode[i].ToString() + strUnicode[i + 1];
                    int k = stMapVN1258.IndexOf(stFind, 14);
                    if (k != -1)
                    {
                        strOriginDest.Append((char)Map_VNOrigin[14 + (k - 14) / 2]);
                        i += 2;
                    }
                    else
                    {
                        stFind = strUnicode[i].ToString();
                        k = stMapVN1258_a.IndexOf(stFind);
                        if (k != -1)
                        {
                            strOriginDest.Append((char)Map_VNOrigin[k]);
                        }
                        else strOriginDest.Append(strUnicode[i]);
                        i++;
                    }

                    /*
                    for (int k = 14; k < iLen1258; k += 2)
                    {
                        if (strUnicode[i] == Map_VN1258[k] && strUnicode[i + 1] == Map_VN1258[k + 1])
                        {
                            strOriginDest += (char)Map_VNOrigin[14 + (k - 14) / 2];

                            i += 2;
                            b = true;
                            break;
                        }
                    }

                    if (b)
                        continue;
                    b = false;

                    

                    for (int k = 0; k < 14; k += 1)
                    {
                        if ((int)strUnicode[i] == Map_VN1258[k])
                        {
                            strOriginDest += (char)Map_VNOrigin[k];

                            i += 1;
                            b = true;
                            break;
                        }
                    }
                    if (b)
                        continue;
                    strOriginDest += (char)strUnicode[i++];
                     */
                }
                else
                {
                    string stFind = strUnicode[i].ToString();
                    int k = stMapVN1258_a.IndexOf(stFind);
                    if (k != -1)
                    {
                        strOriginDest.Append((char)Map_VNOrigin[k]);
                    }
                    else strOriginDest.Append(strUnicode[i]);
                    i++;
                    /*

                    bool b = false;
                    for (int k = 0; k < 14; k += 1)
                    {
                        if (strUnicode[i] == Map_VN1258[k])
                        {
                            strOriginDest += (char)Map_VNOrigin[k];

                            i += 1;
                            b = true;
                            break;
                        }
                    }
                    if (b)
                        continue;
                    strOriginDest += strUnicode[i++];
                     */
                }
            }
            return strOriginDest.ToString();
        }

        /*        public static string UnicodeVN1258ToUnicodeOrigin_OLD(string strUnicode)
                {
                    string strOriginDest = "";
                    int i = 0;
                    //int iLenOrigin = 134;
                    int iLen1258 = 254;

                    while (i < strUnicode.Length)
                    {
                        if (strUnicode[i] == 9)
                        {
                            strOriginDest += "\t";
                            i++;
                            continue;
                        }
                        if (i + 1 < strUnicode.Length)
                        {
                            bool b = false;
                            for (int k = 14; k < iLen1258; k += 2)
                            {
                                if (strUnicode[i] == Map_VN1258[k] && strUnicode[i + 1] == Map_VN1258[k + 1])
                                {
                                    strOriginDest += (char)Map_VNOrigin[14 + (k - 14) / 2];

                                    i += 2;
                                    b = true;
                                    break;
                                }
                            }
                            if (b)
                                continue;
                            b = false;
                            for (int k = 0; k < 14; k += 1)
                            {
                                if ((int)strUnicode[i] == Map_VN1258[k])
                                {
                                    strOriginDest += (char)Map_VNOrigin[k];

                                    i += 1;
                                    b = true;
                                    break;
                                }
                            }
                            if (b)
                                continue;
                            strOriginDest += (char)strUnicode[i++];
                        }
                        else
                        {
                            bool b = false;
                            for (int k = 0; k < 14; k += 1)
                            {
                                if (strUnicode[i] == Map_VN1258[k])
                                {
                                    strOriginDest += (char)Map_VNOrigin[k];

                                    i += 1;
                                    b = true;
                                    break;
                                }
                            }
                            if (b)
                                continue;
                            strOriginDest += strUnicode[i++];
                        }
                    }
                    return strOriginDest;
                }
        */

        /// <summary>
        /// chuyen doi chuoi Unicode dung san sang Unicode to hop
        /// </summary>
        /// <param name="strUnicode">chuoi Unicode dung san</param>
        /// <returns>chuoi Unicode to hop</returns>
        //public static string UnicodeOriginToUnicodeVN1258(string strUnicode)
        public static string UnicodeOriginToUnicodeVN1258(object stringUnicode)
        {
            //if (strUnicode == null)
            if (stringUnicode == null)
                return null;
            StringBuilder str1258Dest = new StringBuilder();
            int i = 0;
            int lenOrigin = 134;
            //int len1258 = 254;

            string strUnicode = (string)stringUnicode;
            bool b;
            while (i < strUnicode.Length)
            {
                if (strUnicode[i] == 0x2013)
                {
                    str1258Dest.Append((char)150);
                    i++;
                    continue;
                }
                if (strUnicode[i] == 0x2014)
                {
                    str1258Dest.Append((char)151);
                    i++;
                    continue;
                }
                if (strUnicode[i] == 0x2019)
                {
                    str1258Dest.Append((char)146);
                    i++;
                    continue;
                }
                if (strUnicode[i] == 0x2018)
                {
                    str1258Dest.Append((char)145);
                    i++;
                    continue;
                }
                if (strUnicode[i] == 0x201C)
                {
                    str1258Dest.Append((char)147);
                    i++;
                    continue;
                }
                if (strUnicode[i] == 0x201D)
                {
                    str1258Dest.Append((char)148);
                    i++;
                    continue;
                }

                b = false;
                for (int k = 0; k < lenOrigin; k++)
                {
                    if (strUnicode[i] == Map_VNOrigin[k])
                    {
                        if (k >= 14)
                        {
                            str1258Dest.Append((char)Map_VN1258[(k - 14) * 2 + 14]);
                            str1258Dest.Append((char)Map_VN1258[(k - 14) * 2 + 14 + 1]);
                        }
                        else
                        {
                            str1258Dest.Append((char)Map_VN1258[k]);
                        }
                        b = true;
                        i++;
                        break;
                    }
                }
                if (b)
                    continue;
                b = false;
                str1258Dest.Append(strUnicode[i++]);
            }
            return str1258Dest.ToString();
        }

        public static string UTF8ToUTF8Origin(string strUTF8)
        {
            return UnicodeToUTF8(UnicodeVN1258ToUnicodeOrigin(UTF8ToUnicode(strUTF8)));
        }

        public static string UTF8OriginToUTF8(string strUTF8)
        {
            return UnicodeToUTF8(UnicodeOriginToUnicodeVN1258(UTF8ToUnicode(strUTF8)));
        }

        public static string UnicodeToHexUTF8(string strUnicode)
        {
            if (string.IsNullOrEmpty(strUnicode)) return "";

            // to UTF8
            strUnicode = ConvertUtil.UnicodeToUTF8Ex(strUnicode);

            strUnicode = strUnicode.Replace("%", "%25");

            StringBuilder strRet = new StringBuilder();
            for (int i = 0; i < strUnicode.Length; i++)
            {
                if (strUnicode[i] <= 127)
                    strRet.Append(strUnicode[i]);
                else
                    strRet.Append(string.Format("%{0:X2}", (int)strUnicode[i]));
            }
            strRet = strRet.Replace("+", "%2B");
            strRet = strRet.Replace(" ", "+");
            strRet = strRet.Replace("\"", "%22");
            strRet = strRet.Replace("'", "%27");
            strRet = strRet.Replace("(", "%28");
            strRet = strRet.Replace(")", "%29");
            strRet = strRet.Replace("[", "%5B");
            strRet = strRet.Replace("]", "%5D");
            strRet = strRet.Replace("{", "%7B");
            strRet = strRet.Replace("}", "%7D");
            strRet = strRet.Replace("=", "%3D");
            strRet = strRet.Replace("&", "%26");
            strRet = strRet.Replace("\\", "%5C");
            strRet = strRet.Replace("/", "%2F");
            return strRet.ToString();
        }

        public static string HexUTF8ToUnicode(string strHexUTF8)
        {
            if (string.IsNullOrEmpty(strHexUTF8)) return "";

            strHexUTF8 = strHexUTF8.Replace("+", " ");

            StringBuilder strRet = new StringBuilder();
            int iFound = -1;
            int iPos = 0;
            while ((iFound = strHexUTF8.IndexOf("%", iPos)) >= 0)
            {
                if (iFound > iPos)
                    strRet.Append(strHexUTF8.Substring(iPos, iFound - iPos));

                string strHex = strHexUTF8.Substring(iFound, 3);
                if (strHex.Length == 3)
                {
                    try
                    {
                        int iChar = int.Parse(strHex.Substring(1), System.Globalization.NumberStyles.HexNumber);
                        strRet.Append(((char)iChar).ToString());
                    }
                    catch (Exception)
                    {
                        strRet.Append(strHex);
                    }
                }
                else
                    strRet.Append(strHex);
                iPos = iFound + strHex.Length;
            }
            strRet.Append(strHexUTF8.Substring(iPos));

            // to Unicode
            return ConvertUtil.UTF8ToUnicodeEx(strRet.ToString());
        }

        public static byte[] StringToByteArr(string strString)
        {
            if (string.IsNullOrEmpty(strString)) return null;
            byte[] byt = new byte[strString.Length];
            for (int i = 0; i < strString.Length; i++)
                byt[i] = (byte)strString[i];
            return byt;
        }

        public static string ByteArrToString(byte[] lpByte)
        {
            if (lpByte == null || lpByte.Length == 0) return "";
            StringBuilder strRet = new StringBuilder();
            foreach (byte byt in lpByte)
                strRet.Append(((char)byt).ToString());
            return strRet.ToString();
        }

        public static ArrayList UTF8ToUnicode(ArrayList arrUTF8)
        {
            if (arrUTF8 == null) return null;
            ArrayList arr = new ArrayList();
            foreach (string strUTF8 in arrUTF8)
                arr.Add(UTF8ToUnicode(strUTF8));
            return arr;
        }

        public static string FormatDate(string strDate)
        {
            try
            {
                var objx = strDate.Split(" ");
                object obj = objx.FirstOrDefault();
                var y = obj.ToString().Split("/");
                if (y.Count() == 3)
                {
                    int q = y[0].Count();
                    int w = y[1].Count();
                    int e = y[2].Count();
                    string year;
                    string dt;
                    //get max
                    if (q > w)
                    {
                        if (q > e) year = q.ToString();
                        else year = e.ToString();
                    }
                    else if (w > e) year = w.ToString();
                    else year = e.ToString();

                    if (year == e.ToString())
                    {
                        try
                        {
                            dt = "" + y[2] + "/" + y[0] + "/" + y[1] + "";
                            strDate = DateTime.Parse(dt).ToString("yyyy-MM-dd");
                        }
                        catch
                        {
                            dt = "" + y[2] + "/" + y[1] + "/" + y[0] + "";
                            strDate = DateTime.Parse(dt).ToString("yyyy-MM-dd");
                        }
                    }
                    else if (year == w.ToString())
                    {
                        try
                        {
                            dt = "" + y[1] + "/" + y[0] + "/" + y[2] + "";
                            strDate = DateTime.Parse(dt).ToString("yyyy-MM-dd");
                        }
                        catch
                        {
                            dt = "" + y[1] + "/" + y[2] + "/" + y[0] + "";
                            strDate = DateTime.Parse(dt).ToString("yyyy-MM-dd");
                        }
                    }
                    else if (year == q.ToString())
                    {
                        try
                        {
                            dt = "" + y[0] + "/" + y[1] + "/" + y[2] + "";
                            strDate = DateTime.Parse(dt).ToString("yyyy-MM-dd");
                        }
                        catch
                        {
                            dt = "" + y[0] + "/" + y[2] + "/" + y[1] + "";
                            strDate = DateTime.Parse(dt).ToString("yyyy-MM-dd");
                        }
                    }
                }
                return strDate;
            }
            catch
            {
                return null;
            }
        }
        
    }
}
