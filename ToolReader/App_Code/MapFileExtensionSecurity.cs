using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace WebApi.App_Code
{
    public class FileExtensionSecurity
    {
        //giá trị KO lớn hơn 100 và KO trùng nhau
        enum FileExtensions
        {
            lvb = 2,
            lvm = 4,
            zip = 5,
            jpg = 1,
            gif = 40,
            png = 41,
            bmp = 10,
            jpe = 9,
            jpeg = 20,
            svg = 3,
            mp3 = 50,
            mp4 = 51,
            wav = 90,
            m4a = 7,
            pdf = 30,
            doc = 70,
            docx = 71,
            xls = 52,
            xlsx = 8,
            ppt = 11,
            pptx = 12,
            htm = 91,
            html = 92,
            json = 31,
            js = 13,
            js1 = 53,
            js2 = 42,
            js3 = 80,
            js4 = 14,
        };

        static Dictionary<string, byte> enumList = ((FileExtensions[])Enum.GetValues(typeof(FileExtensions))).ToDictionary(key => key.ToString(), value => (byte)value);

        public static string MapFileExtension(byte id)
        {
            return Enum.GetName(typeof(FileExtensions), id) ?? "xxx";
        }

        public static byte MapFileExtension(string name)
        {
            return enumList.Where(x => x.Key == name).Select(x => x.Value).FirstOrDefault();
        }
    }
}
