using System.Text.RegularExpressions;

//using Dapper;
//using FileManager;
////using MediaFolderResource;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.Extensions.Configuration;
//using Newtonsoft.Json;
//using Npgsql;
//using NpgsqlTypes;
////using ObjectDefine;
////using ObjectModel;
////using ObjectResult;
//using System;
//using System.Collections.Generic;
//using System.Data;
//using System.Linq;
//using System.Text;
//using System.Text.RegularExpressions;
////using WebApi.General;

namespace WebApi.App_Code
{
    public class FileEncode
    {
        public static void EncodeFileBytes(string filePath, string filePathEncode)
        {
            //
            byte[] fileBytes = System.IO.File.ReadAllBytes(filePath);

            //
            byte bytePrefix = FileExtensionSecurity.MapFileExtension(filePath.Split('.').LastOrDefault());

            //log
            //System.IO.File.WriteAllText(filePath + $".1.{fileBytes.Length + 1}.log", string.Join('\n', fileBytes.Concat(new byte[] { bytePrefix }).ToArray()));

            //thay đổi các byte
            for (int i = 0, len = fileBytes.Length; i < len; i++)
            {
                //hệ số của prefix thì đảo byte
                if (i % bytePrefix == 0)
                {
                    fileBytes[i] = (byte)Math.Abs(255 - fileBytes[i]);
                }
            }

            //log
            //System.IO.File.WriteAllText(filePath + $".2.{fileBytes.Length + 1}.log", string.Join('\n', fileBytes.Concat(new byte[] { bytePrefix }).ToArray()));

            //bổ sung byte cuối, xác định extension file gốc
            System.IO.File.WriteAllBytes(filePath, fileBytes.Concat(new byte[] { bytePrefix }).ToArray());

            //
            System.IO.File.Move(filePath, filePathEncode, true);
        }

        public static void DecodeFileBytes(string filePath, out string filePathDecode)
        {
            //
            byte[] fileBytes = System.IO.File.ReadAllBytes(filePath);

            //
            byte bytePrefix = fileBytes.LastOrDefault();

            //log
            //System.IO.File.WriteAllText(filePath + ".3.log", string.Join('\n', fileBytes.Concat(new byte[] { bytePrefix }).ToArray()));

            //thay đổi các byte
            for (int i = 0, len = fileBytes.Length - 1; i < len; i++)
            {
                //hệ số của prefix thì đảo byte
                if (i % bytePrefix == 0)
                {
                    fileBytes[i] = (byte)Math.Abs(255 - fileBytes[i]);
                }
            }

            //log
            //System.IO.File.WriteAllText(filePath + ".4.log", string.Join('\n', fileBytes.Concat(new byte[] { bytePrefix }).ToArray()));

            //
            System.IO.File.WriteAllBytes(filePath, fileBytes.SkipLast(1).ToArray());

            //
            filePathDecode = new Regex($".{filePath.Split('.').LastOrDefault()}$").Replace(filePath, $".{FileExtensionSecurity.MapFileExtension(bytePrefix)}");

            //đổi lại tên gốc của file
            System.IO.File.Move(filePath, filePathDecode, true);
        }
    }
}
