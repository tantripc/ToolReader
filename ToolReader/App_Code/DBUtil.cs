using Microsoft.Extensions.Configuration;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using WebApi.Models;

namespace WebApi.App_Code
{
    public class DataCell
    {
        private string strName;
        private string strValue;

        public string Name
        {
            get { return strName; }
            set { strName = value; }
        }

        public string Value
        {
            get { return strValue; }
            set { strValue = value; }
        }

        public DataCell()
        {
            strName = "";
            strValue = "";
        }

        public DataCell(string name, string value)
        {
            strName = name;
            strValue = value;
        }
    }


    public class DBConnect
    {
        public DBConnect()
        {
        }

        public static DataTable ExecuteCmd(string strCmdText)
        {
            try
            {
                if (string.IsNullOrEmpty(strCmdText))
                    return null;

                string strConnectionString = Config.ReadConfig("ConnectionStrings:DataAccessPostgreSqlProvider");
                if (string.IsNullOrEmpty(strConnectionString))
                    return null;

                using (NpgsqlConnection dbConnection = new NpgsqlConnection(strConnectionString))
                {
                    dbConnection.Open();
                    NpgsqlDataAdapter ad = new NpgsqlDataAdapter(strCmdText, dbConnection);
                    DataTable dt = new DataTable();
                    ad.Fill(dt);
                    ad.Dispose();
                    dbConnection.Close();
                    return dt;
                }
            }
            catch (Exception ex)
            {
                //(new Log(new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory()).AddJsonFile("appsettings.json").Build()))
                Log.Write("DBConnect.ExecuteCmd() exception. Msg: '" + ex.Message + "'");
                return null;
            }
        }
    }


    public class DBUtil
    {
        // return string
        public static string GetStrValue(SqlDataReader sqlReader, string strField)
        {
            try
            {
                return GetStrValue(sqlReader, sqlReader.GetOrdinal(strField));
            }
            catch (InvalidCastException) { }
            return "";
        }

        public static string GetStrValue(SqlDataReader sqlReader, int iIndex)
        {
            try
            {
                if (sqlReader == null)
                    return "";
                object obj = sqlReader[iIndex];
                if (obj == null)
                    return "";
                if (obj.GetType().ToString() == "System.DBNull")
                    return "";
                return (string)obj;
            }
            catch (InvalidCastException) { }
            return "";
        }

        public static string GetStrValue(DataRow dataRow, string strField, string defaultValue = "")
        {
            try
            {
                if (dataRow == null)
                    return defaultValue;
                object obj = dataRow[strField];
                if (obj == null)
                    return defaultValue;
                if (obj.GetType().ToString() == "System.DBNull")
                    return defaultValue;
                return (string)obj;
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static string GetStrValue(DataRow dataRow, int iIndex, string defaultValue = "")
        {
            try
            {
                if (dataRow == null)
                    return defaultValue;
                object obj = dataRow[iIndex];
                if (obj == null)
                    return defaultValue;
                if (obj.GetType().ToString() == "System.DBNull")
                    return defaultValue;
                return (string)obj;
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static string GetStrValue(NpgsqlDataReader reader, string columnName, string defaultValue = "")
        {
            try
            {
                if (reader == null)
                    return defaultValue;
                int index = reader.GetOrdinal(columnName);
                return reader.IsDBNull(index) ? defaultValue : reader.GetString(index);
            }
            catch (Exception)
            {
                return defaultValue;
            }
        }

        public static string GetStrValue(NpgsqlDataReader reader, int columnIdx, string defaultValue = "")
        {
            try
            {
                if (reader == null)
                    return defaultValue;
                return reader.IsDBNull(columnIdx) ? defaultValue : reader.GetString(columnIdx);
            }
            catch (Exception)
            {
                return defaultValue;
            }
        }

        /*// return int
        public static int GetIntValue(SqlDataReader sqlReader, string strField, int defaultValue = 0)
        {
            try
            {
                return GetIntValue(sqlReader, sqlReader.GetOrdinal(strField), defaultValue);
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static int GetIntValue(SqlDataReader sqlReader, int iIndex, int defaultValue = 0)
        {
            try
            {
                if (sqlReader == null)
                    return defaultValue;
                object obj = sqlReader[iIndex];
                if (obj == null)
                    return defaultValue;
                if (obj.GetType().ToString() == "System.DBNull")
                    return defaultValue;
                return (int)obj;
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static int GetIntValue(DataRow dataRow, string strField, int defaultValue = 0)
        {
            try
            {
                if (dataRow == null)
                    return defaultValue;
                object obj = dataRow[strField];
                if (obj == null)
                    return defaultValue;
                if (obj.GetType().ToString() == "System.DBNull")
                    return defaultValue;
                return (int)obj;
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static int GetIntValue(DataRow dataRow, int iIndex, int defaultValue = 0)
        {
            try
            {
                if (dataRow == null)
                    return defaultValue;
                object obj = dataRow[iIndex];
                if (obj == null)
                    return defaultValue;
                if (obj.GetType().ToString() == "System.DBNull")
                    return defaultValue;
                return (int)obj;
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static int GetIntValue(NpgsqlDataReader reader, string columnName, int defaultValue = 0)
        {
            try
            {
                if (reader == null)
                    return defaultValue;
                int index = reader.GetOrdinal(columnName);
                return reader.IsDBNull(index) ? defaultValue : reader.GetInt32(index);
            }
            catch (Exception)
            {
                return defaultValue;
            }
        }

        public static int GetIntValue(NpgsqlDataReader reader, int columnIdx, int defaultValue = 0)
        {
            try
            {
                if (reader == null)
                    return defaultValue;
                return reader.IsDBNull(columnIdx) ? defaultValue : reader.GetInt32(columnIdx);
            }
            catch (Exception)
            {
                return defaultValue;
            }
        }*/

        // return int?
        public static int? GetIntValue(SqlDataReader sqlReader, string strField, int? defaultValue = null)
        {
            try
            {
                return GetIntValue(sqlReader, sqlReader.GetOrdinal(strField), defaultValue);
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static int? GetIntValue(SqlDataReader sqlReader, int iIndex, int? defaultValue = null)
        {
            try
            {
                if (sqlReader == null)
                    return defaultValue;
                object obj = sqlReader[iIndex];
                if (obj == null)
                    return defaultValue;
                if (obj.GetType().ToString() == "System.DBNull")
                    return defaultValue;
                return (int?)obj;
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static int? GetIntValue(DataRow dataRow, string strField, int? defaultValue = null)
        {
            try
            {
                if (dataRow == null)
                    return defaultValue;
                object obj = dataRow[strField];
                if (obj == null)
                    return defaultValue;
                if (obj.GetType().ToString() == "System.DBNull")
                    return defaultValue;
                return (int?)obj;
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static int? GetIntValue(DataRow dataRow, int iIndex, int? defaultValue = null)
        {
            try
            {
                if (dataRow == null)
                    return defaultValue;
                object obj = dataRow[iIndex];
                if (obj == null)
                    return defaultValue;
                if (obj.GetType().ToString() == "System.DBNull")
                    return defaultValue;
                return (int?)obj;
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static int? GetIntValue(NpgsqlDataReader reader, string columnName, int? defaultValue = null)
        {
            try
            {
                if (reader == null)
                    return defaultValue;
                int index = reader.GetOrdinal(columnName);
                return reader.IsDBNull(index) ? defaultValue : (int?)reader.GetInt32(index);
            }
            catch (Exception)
            {
                return defaultValue;
            }
        }

        public static int? GetIntValue(NpgsqlDataReader reader, int columnIdx, int? defaultValue = null)
        {
            try
            {
                if (reader == null)
                    return defaultValue;
                return reader.IsDBNull(columnIdx) ? defaultValue : (int?)reader.GetInt32(columnIdx);
            }
            catch (Exception)
            {
                return defaultValue;
            }
        }

        /*// return long
        public static long GetLongValue(SqlDataReader sqlReader, string strField, long defaultValue = 0)
        {
            try
            {
                return GetLongValue(sqlReader, sqlReader.GetOrdinal(strField), defaultValue);
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static long GetLongValue(SqlDataReader sqlReader, int iIndex, long defaultValue = 0)
        {
            try
            {
                if (sqlReader == null)
                    return defaultValue;
                object obj = sqlReader[iIndex];
                if (obj == null)
                    return defaultValue;
                if (obj.GetType().ToString() == "System.DBNull")
                    return defaultValue;
                return (long)obj;
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static long GetLongValue(DataRow dataRow, string strField, long defaultValue = 0)
        {
            try
            {
                if (dataRow == null)
                    return defaultValue;
                object obj = dataRow[strField];
                if (obj == null)
                    return defaultValue;
                if (obj.GetType().ToString() == "System.DBNull")
                    return defaultValue;
                return (long)obj;
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static long GetLongValue(DataRow dataRow, int iIndex, long defaultValue = 0)
        {
            try
            {
                if (dataRow == null)
                    return defaultValue;
                object obj = dataRow[iIndex];
                if (obj == null)
                    return defaultValue;
                if (obj.GetType().ToString() == "System.DBNull")
                    return defaultValue;
                return (long)obj;
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static long GetLongValue(NpgsqlDataReader reader, string columnName, long defaultValue = 0)
        {
            try
            {
                if (reader == null)
                    return defaultValue;
                int index = reader.GetOrdinal(columnName);
                return reader.IsDBNull(index) ? defaultValue : reader.GetInt64(index);
            }
            catch (Exception)
            {
                return defaultValue;
            }
        }

        public static long GetLongValue(NpgsqlDataReader reader, int columnIdx, long defaultValue = 0)
        {
            try
            {
                if (reader == null)
                    return defaultValue;
                return reader.IsDBNull(columnIdx) ? defaultValue : reader.GetInt64(columnIdx);
            }
            catch (Exception)
            {
                return defaultValue;
            }
        }*/

        // return long?
        public static long? GetLongValue(SqlDataReader sqlReader, string strField, long? defaultValue = null)
        {
            try
            {
                return GetLongValue(sqlReader, sqlReader.GetOrdinal(strField), defaultValue);
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static long? GetLongValue(SqlDataReader sqlReader, int iIndex, long? defaultValue = null)
        {
            try
            {
                if (sqlReader == null)
                    return defaultValue;
                object obj = sqlReader[iIndex];
                if (obj == null)
                    return defaultValue;
                if (obj.GetType().ToString() == "System.DBNull")
                    return defaultValue;
                return (long?)obj;
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static long? GetLongValue(DataRow dataRow, string strField, long? defaultValue = null)
        {
            try
            {
                if (dataRow == null)
                    return defaultValue;
                object obj = dataRow[strField];
                if (obj == null)
                    return defaultValue;
                if (obj.GetType().ToString() == "System.DBNull")
                    return defaultValue;
                return (long?)obj;
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static long? GetLongValue(DataRow dataRow, int iIndex, long? defaultValue = null)
        {
            try
            {
                if (dataRow == null)
                    return defaultValue;
                object obj = dataRow[iIndex];
                if (obj == null)
                    return defaultValue;
                if (obj.GetType().ToString() == "System.DBNull")
                    return defaultValue;
                return (long?)obj;
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static long? GetLongValue(NpgsqlDataReader reader, string columnName, long? defaultValue = null)
        {
            try
            {
                if (reader == null)
                    return defaultValue;
                int index = reader.GetOrdinal(columnName);
                return reader.IsDBNull(index) ? defaultValue : (long?)reader.GetInt64(index);
            }
            catch (Exception)
            {
                return defaultValue;
            }
        }

        public static long? GetLongValue(NpgsqlDataReader reader, int columnIdx, long? defaultValue = null)
        {
            try
            {
                if (reader == null)
                    return defaultValue;
                return reader.IsDBNull(columnIdx) ? defaultValue : (long?)reader.GetInt64(columnIdx);
            }
            catch (Exception)
            {
                return defaultValue;
            }
        }

        // return byte
        public static byte GetByteValue(SqlDataReader sqlReader, string strField)
        {
            try
            {
                return GetByteValue(sqlReader, sqlReader.GetOrdinal(strField));
            }
            catch (InvalidCastException) { }
            return 0;
        }

        public static byte GetByteValue(SqlDataReader sqlReader, int iIndex)
        {
            try
            {
                if (sqlReader == null)
                    return 0;
                object obj = sqlReader[iIndex];
                if (obj == null)
                    return 0;
                if (obj.GetType().ToString() == "System.DBNull")
                    return 0;
                return (byte)obj;
            }
            catch (InvalidCastException) { }
            return 0;
        }

        public static byte GetByteValue(DataRow dataRow, string strField)
        {
            try
            {
                if (dataRow == null)
                    return 0;
                object obj = dataRow[strField];
                if (obj == null)
                    return 0;
                if (obj.GetType().ToString() == "System.DBNull")
                    return 0;
                return (byte)obj;
            }
            catch (InvalidCastException) { }
            return 0;
        }

        public static byte GetByteValue(DataRow dataRow, int iIndex)
        {
            try
            {
                if (dataRow == null)
                    return 0;
                object obj = dataRow[iIndex];
                if (obj == null)
                    return 0;
                if (obj.GetType().ToString() == "System.DBNull")
                    return 0;
                return (byte)obj;
            }
            catch (InvalidCastException) { }
            return 0;
        }

        /*// return bool
        public static bool GetBoolValue(SqlDataReader sqlReader, string strField, bool defaultValue = false)
        {
            try
            {
                return GetBoolValue(sqlReader, sqlReader.GetOrdinal(strField), defaultValue);
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static bool GetBoolValue(SqlDataReader sqlReader, int iIndex, bool defaultValue = false)
        {
            try
            {
                if (sqlReader == null)
                    return defaultValue;
                object obj = sqlReader[iIndex];
                if (obj == null)
                    return defaultValue;
                if (obj.GetType().ToString() == "System.DBNull")
                    return defaultValue;
                return (bool)obj;
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static bool GetBoolValue(DataRow dataRow, string strField, bool defaultValue = false)
        {
            try
            {
                if (dataRow == null)
                    return defaultValue;
                object obj = dataRow[strField];
                if (obj == null)
                    return defaultValue;
                if (obj.GetType().ToString() == "System.DBNull")
                    return defaultValue;
                return (bool)obj;
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static bool GetBoolValue(DataRow dataRow, int iIndex, bool defaultValue = false)
        {
            try
            {
                if (dataRow == null)
                    return defaultValue;
                object obj = dataRow[iIndex];
                if (obj == null)
                    return defaultValue;
                if (obj.GetType().ToString() == "System.DBNull")
                    return defaultValue;
                return (bool)obj;
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static bool GetBoolValue(NpgsqlDataReader reader, string columnName, bool defaultValue = false)
        {
            try
            {
                if (reader == null)
                    return defaultValue;
                int index = reader.GetOrdinal(columnName);
                return reader.IsDBNull(index) ? defaultValue : reader.GetBoolean(index);
            }
            catch (Exception)
            {
                return defaultValue;
            }
        }

        public static bool GetBoolValue(NpgsqlDataReader reader, int columnIdx, bool defaultValue = false)
        {
            try
            {
                if (reader == null)
                    return defaultValue;
                return reader.IsDBNull(columnIdx) ? defaultValue : reader.GetBoolean(columnIdx);
            }
            catch (Exception)
            {
                return defaultValue;
            }
        }*/

        // return bool?
        public static bool? GetBoolValue(SqlDataReader sqlReader, string strField, bool? defaultValue = null)
        {
            try
            {
                return GetBoolValue(sqlReader, sqlReader.GetOrdinal(strField), defaultValue);
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static bool? GetBoolValue(SqlDataReader sqlReader, int iIndex, bool? defaultValue = null)
        {
            try
            {
                if (sqlReader == null)
                    return defaultValue;
                object obj = sqlReader[iIndex];
                if (obj == null)
                    return defaultValue;
                if (obj.GetType().ToString() == "System.DBNull")
                    return defaultValue;
                return (bool?)obj;
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static bool? GetBoolValue(DataRow dataRow, string strField, bool? defaultValue = null)
        {
            try
            {
                if (dataRow == null)
                    return defaultValue;
                object obj = dataRow[strField];
                if (obj == null)
                    return defaultValue;
                if (obj.GetType().ToString() == "System.DBNull")
                    return defaultValue;
                return (bool?)obj;
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static bool? GetBoolValue(DataRow dataRow, int iIndex, bool? defaultValue = null)
        {
            try
            {
                if (dataRow == null)
                    return defaultValue;
                object obj = dataRow[iIndex];
                if (obj == null)
                    return defaultValue;
                if (obj.GetType().ToString() == "System.DBNull")
                    return defaultValue;
                return (bool?)obj;
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static bool? GetBoolValue(NpgsqlDataReader reader, string columnName, bool? defaultValue = null)
        {
            try
            {
                if (reader == null)
                    return defaultValue;
                int index = reader.GetOrdinal(columnName);
                return reader.IsDBNull(index) ? defaultValue : (bool?)reader.GetBoolean(index);
            }
            catch (Exception)
            {
                return defaultValue;
            }
        }

        public static bool? GetBoolValue(NpgsqlDataReader reader, int columnIdx, bool? defaultValue = null)
        {
            try
            {
                if (reader == null)
                    return defaultValue;
                return reader.IsDBNull(columnIdx) ? defaultValue : (bool?)reader.GetBoolean(columnIdx);
            }
            catch (Exception)
            {
                return defaultValue;
            }
        }

        /*// return DateTime
        public static DateTime GetDateTimeValue(SqlDataReader sqlReader, string strField)
        {
            try
            {
                return GetDateTimeValue(sqlReader, sqlReader.GetOrdinal(strField));
            }
            catch (InvalidCastException) { }
            return DateTime.MinValue;
        }

        public static DateTime GetDateTimeValue(SqlDataReader sqlReader, int iIndex)
        {
            try
            {
                if (sqlReader == null)
                    return DateTime.MinValue;
                object obj = sqlReader[iIndex];
                if (obj == null)
                    return DateTime.MinValue;
                if (obj.GetType().ToString() == "System.DBNull")
                    return DateTime.MinValue;
                return (DateTime)obj;
            }
            catch (InvalidCastException) { }
            return DateTime.MinValue;
        }

        public static DateTime GetDateTimeValue(DataRow dataRow, string strField)
        {
            try
            {
                if (dataRow == null)
                    return DateTime.MinValue;
                object obj = dataRow[strField];
                if (obj == null)
                    return DateTime.MinValue;
                if (obj.GetType().ToString() == "System.DBNull")
                    return DateTime.MinValue;
                return (DateTime)obj;
            }
            catch (InvalidCastException) { }
            return DateTime.MinValue;
        }

        public static DateTime GetDateTimeValue(DataRow dataRow, int iIndex)
        {
            try
            {
                if (dataRow == null)
                    return DateTime.MinValue;
                object obj = dataRow[iIndex];
                if (obj == null)
                    return DateTime.MinValue;
                if (obj.GetType().ToString() == "System.DBNull")
                    return DateTime.MinValue;
                return (DateTime)obj;
            }
            catch (InvalidCastException) { }
            return DateTime.MinValue;
        }

        public static DateTime GetDateTimeValue(NpgsqlDataReader reader, string columnName)
        {
            DateTime defaultValue = DateTime.MinValue;
            try
            {
                if (reader == null)
                    return defaultValue;
                int index = reader.GetOrdinal(columnName);
                return reader.IsDBNull(index) ? defaultValue : reader.GetDateTime(index);
            }
            catch (Exception)
            {
                return defaultValue;
            }
        }

        public static DateTime GetDateTimeValue(NpgsqlDataReader reader, int columnIdx)
        {
            DateTime defaultValue = DateTime.MinValue;
            try
            {
                if (reader == null)
                    return defaultValue;
                return reader.IsDBNull(columnIdx) ? defaultValue : reader.GetDateTime(columnIdx);
            }
            catch (Exception)
            {
                return defaultValue;
            }
        }*/

        // return DateTime?
        public static DateTime? GetDateTimeValue(SqlDataReader sqlReader, string strField)
        {
            try
            {
                return GetDateTimeValue(sqlReader, sqlReader.GetOrdinal(strField));
            }
            catch (InvalidCastException) { }
            return null;
        }

        public static DateTime? GetDateTimeValue(SqlDataReader sqlReader, int iIndex)
        {
            try
            {
                if (sqlReader == null)
                    return null;
                object obj = sqlReader[iIndex];
                if (obj == null)
                    return null;
                if (obj.GetType().ToString() == "System.DBNull")
                    return null;
                return (DateTime?)obj;
            }
            catch (InvalidCastException) { }
            return null;
        }

        public static DateTime? GetDateTimeValue(DataRow dataRow, string strField)
        {
            try
            {
                if (dataRow == null)
                    return null;
                object obj = dataRow[strField];
                if (obj == null)
                    return null;
                if (obj.GetType().ToString() == "System.DBNull")
                    return null;
                return (DateTime?)obj;
            }
            catch (InvalidCastException) { }
            return null;
        }

        public static DateTime? GetDateTimeValue(DataRow dataRow, int iIndex)
        {
            try
            {
                if (dataRow == null)
                    return null;
                object obj = dataRow[iIndex];
                if (obj == null)
                    return null;
                if (obj.GetType().ToString() == "System.DBNull")
                    return null;
                return (DateTime?)obj;
            }
            catch (InvalidCastException) { }
            return null;
        }

        public static DateTime? GetDateTimeValue(NpgsqlDataReader reader, string columnName, DateTime? defaultValue = null)
        {
            try
            {
                if (reader == null)
                    return defaultValue;
                int index = reader.GetOrdinal(columnName);
                return reader.IsDBNull(index) ? defaultValue : (DateTime?)reader.GetDateTime(index);
            }
            catch (Exception)
            {
                return defaultValue;
            }
        }

        public static DateTime? GetDateTimeValue(NpgsqlDataReader reader, int columnIdx, DateTime? defaultValue = null)
        {
            try
            {
                if (reader == null)
                    return defaultValue;
                return reader.IsDBNull(columnIdx) ? defaultValue : (DateTime?)reader.GetDateTime(columnIdx);
            }
            catch (Exception)
            {
                return defaultValue;
            }
        }

        // return byte[]
        public static byte[] GetByteArrValue(SqlDataReader sqlReader, string strField)
        {
            byte[] bt = new byte[0];
            try
            {
                if (sqlReader == null)
                    return bt;
                object obj = sqlReader[strField];
                if (obj == null)
                    return bt;
                if (obj.GetType().ToString() == "System.DBNull")
                    return bt;
                return (byte[])obj;
            }
            catch (InvalidCastException) { }
            return bt;
        }

        public static byte[] GetByteArrValue(SqlDataReader sqlReader, int iIndex)
        {
            byte[] bt = new byte[0];
            try
            {
                if (sqlReader == null)
                    return bt;
                object obj = sqlReader[iIndex];
                if (obj == null)
                    return bt;
                if (obj.GetType().ToString() == "System.DBNull")
                    return bt;
                return (byte[])obj;
            }
            catch (InvalidCastException) { }
            return bt;
        }

        public static byte[] GetByteArrValue(DataRow dataRow, string strField)
        {
            byte[] bt = new byte[0];
            try
            {
                if (dataRow == null)
                    return bt;
                object obj = dataRow[strField];
                if (obj == null)
                    return bt;
                if (obj.GetType().ToString() == "System.DBNull")
                    return bt;
                return (byte[])obj;
            }
            catch (InvalidCastException) { }
            return bt;
        }

        public static byte[] GetByteArrValue(DataRow dataRow, int iIndex)
        {
            byte[] bt = new byte[0];
            try
            {
                if (dataRow == null)
                    return bt;
                object obj = dataRow[iIndex];
                if (obj == null)
                    return bt;
                if (obj.GetType().ToString() == "System.DBNull")
                    return bt;
                return (byte[])obj;
            }
            catch (InvalidCastException) { }
            return bt;
        }

        /*// return double
        public static double GetDoubleValue(SqlDataReader sqlReader, string strField, double defaultValue = 0)
        {
            try
            {
                if (sqlReader == null)
                    return defaultValue;
                object obj = sqlReader[strField];
                if (obj == null)
                    return defaultValue;
                if (obj.GetType().ToString() == "System.DBNull")
                    return defaultValue;
                return (double)obj;
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static double GetDoubleValue(SqlDataReader sqlReader, int iIndex, double defaultValue = 0)
        {
            try
            {
                if (sqlReader == null)
                    return defaultValue;
                object obj = sqlReader[iIndex];
                if (obj == null)
                    return defaultValue;
                if (obj.GetType().ToString() == "System.DBNull")
                    return defaultValue;
                return (double)obj;
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static double GetDoubleValue(DataRow row, string strField, double defaultValue = 0)
        {
            try
            {
                if (row == null)
                    return defaultValue;
                object obj = row[strField];
                if (obj == null)
                    return defaultValue;
                if (obj.GetType().ToString() == "System.DBNull")
                    return defaultValue;
                return (double)obj;
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static double GetDoubleValue(DataRow row, int iIndex, double defaultValue = 0)
        {
            try
            {
                if (row == null)
                    return defaultValue;
                object obj = row[iIndex];
                if (obj == null)
                    return defaultValue;
                if (obj.GetType().ToString() == "System.DBNull")
                    return defaultValue;
                return (double)obj;
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }


        public static double GetDoubleValue(NpgsqlDataReader reader, string columnName, double defaultValue = 0)
        {
            try
            {
                if (reader == null)
                    return defaultValue;
                int index = reader.GetOrdinal(columnName);
                return reader.IsDBNull(index) ? defaultValue : reader.GetDouble(index);
            }
            catch (Exception)
            {
                return defaultValue;
            }
        }

        public static double GetDoubleValue(NpgsqlDataReader reader, int columnIdx, double defaultValue = 0)
        {
            try
            {
                if (reader == null)
                    return defaultValue;
                return reader.IsDBNull(columnIdx) ? defaultValue : reader.GetDouble(columnIdx);
            }
            catch (Exception)
            {
                return defaultValue;
            }
        }*/

        // return double?
        public static double? GetDoubleValue(SqlDataReader sqlReader, string strField, double? defaultValue = null)
        {
            try
            {
                if (sqlReader == null)
                    return defaultValue;
                object obj = sqlReader[strField];
                if (obj == null)
                    return defaultValue;
                if (obj.GetType().ToString() == "System.DBNull")
                    return defaultValue;
                return (double?)obj;
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static double? GetDoubleValue(SqlDataReader sqlReader, int iIndex, double? defaultValue = null)
        {
            try
            {
                if (sqlReader == null)
                    return defaultValue;
                object obj = sqlReader[iIndex];
                if (obj == null)
                    return defaultValue;
                if (obj.GetType().ToString() == "System.DBNull")
                    return defaultValue;
                return (double?)obj;
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static double? GetDoubleValue(DataRow row, string strField, double? defaultValue = null)
        {
            try
            {
                if (row == null)
                    return defaultValue;
                object obj = row[strField];
                if (obj == null)
                    return defaultValue;
                if (obj.GetType().ToString() == "System.DBNull")
                    return defaultValue;
                return (double?)obj;
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static double? GetDoubleValue(DataRow row, int iIndex, double? defaultValue = null)
        {
            try
            {
                if (row == null)
                    return defaultValue;
                object obj = row[iIndex];
                if (obj == null)
                    return defaultValue;
                if (obj.GetType().ToString() == "System.DBNull")
                    return defaultValue;
                return (double?)obj;
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }


        public static double? GetDoubleValue(NpgsqlDataReader reader, string columnName, double? defaultValue = null)
        {
            try
            {
                if (reader == null)
                    return defaultValue;
                int index = reader.GetOrdinal(columnName);
                return reader.IsDBNull(index) ? defaultValue : (double?)reader.GetDouble(index);
            }
            catch (Exception)
            {
                return defaultValue;
            }
        }

        public static double? GetDoubleValue(NpgsqlDataReader reader, int columnIdx, double? defaultValue = null)
        {
            try
            {
                if (reader == null)
                    return defaultValue;
                return reader.IsDBNull(columnIdx) ? defaultValue : (double?)reader.GetDouble(columnIdx);
            }
            catch (Exception)
            {
                return defaultValue;
            }
        }

        /*// return float
        public static float GetFloatValue(SqlDataReader sqlReader, string strField, float defaultValue = 0)
        {
            try
            {
                if (sqlReader == null)
                    return defaultValue;
                object obj = sqlReader[strField];
                if (obj == null)
                    return defaultValue;
                if (obj.GetType().ToString() == "System.DBNull")
                    return defaultValue;
                return (float)obj;
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static float GetFloatValue(SqlDataReader sqlReader, int iIndex, float defaultValue = 0)
        {
            try
            {
                if (sqlReader == null)
                    return defaultValue;
                object obj = sqlReader[iIndex];
                if (obj == null)
                    return defaultValue;
                if (obj.GetType().ToString() == "System.DBNull")
                    return defaultValue;
                return (float)obj;
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static float GetFloatValue(DataRow row, string strField, float defaultValue = 0)
        {
            try
            {
                if (row == null)
                    return defaultValue;
                object obj = row[strField];
                if (obj == null)
                    return defaultValue;
                if (obj.GetType().ToString() == "System.DBNull")
                    return defaultValue;
                return (float)obj;
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static float GetFloatValue(DataRow row, int iIndex, float defaultValue = 0)
        {
            try
            {
                if (row == null)
                    return defaultValue;
                object obj = row[iIndex];
                if (obj == null)
                    return defaultValue;
                if (obj.GetType().ToString() == "System.DBNull")
                    return defaultValue;
                return (float)obj;
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static float GetFloatValue(NpgsqlDataReader reader, string columnName, float defaultValue = 0)
        {
            try
            {
                if (reader == null)
                    return defaultValue;
                int index = reader.GetOrdinal(columnName);
                return reader.IsDBNull(index) ? defaultValue : reader.GetFloat(index);
            }
            catch (Exception)
            {
                return defaultValue;
            }
        }

        public static float GetFloatValue(NpgsqlDataReader reader, int columnIdx, float defaultValue = 0)
        {
            try
            {
                if (reader == null)
                    return defaultValue;
                return reader.IsDBNull(columnIdx) ? defaultValue : reader.GetFloat(columnIdx);
            }
            catch (Exception)
            {
                return defaultValue;
            }
        }*/

        // return float?
        public static float? GetFloatValue(SqlDataReader sqlReader, string strField, float? defaultValue = null)
        {
            try
            {
                if (sqlReader == null)
                    return defaultValue;
                object obj = sqlReader[strField];
                if (obj == null)
                    return defaultValue;
                if (obj.GetType().ToString() == "System.DBNull")
                    return defaultValue;
                return (float?)obj;
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static float? GetFloatValue(SqlDataReader sqlReader, int iIndex, float? defaultValue = null)
        {
            try
            {
                if (sqlReader == null)
                    return defaultValue;
                object obj = sqlReader[iIndex];
                if (obj == null)
                    return defaultValue;
                if (obj.GetType().ToString() == "System.DBNull")
                    return defaultValue;
                return (float?)obj;
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static float? GetFloatValue(DataRow row, string strField, float? defaultValue = null)
        {
            try
            {
                if (row == null)
                    return defaultValue;
                object obj = row[strField];
                if (obj == null)
                    return defaultValue;
                if (obj.GetType().ToString() == "System.DBNull")
                    return defaultValue;
                return (float?)obj;
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static float? GetFloatValue(DataRow row, int iIndex, float? defaultValue = null)
        {
            try
            {
                if (row == null)
                    return defaultValue;
                object obj = row[iIndex];
                if (obj == null)
                    return defaultValue;
                if (obj.GetType().ToString() == "System.DBNull")
                    return defaultValue;
                return (float?)obj;
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static float? GetFloatValue(NpgsqlDataReader reader, string columnName, float? defaultValue = null)
        {
            try
            {
                if (reader == null)
                    return defaultValue;
                int index = reader.GetOrdinal(columnName);
                return reader.IsDBNull(index) ? defaultValue : (float?)reader.GetFloat(index);
            }
            catch (Exception)
            {
                return defaultValue;
            }
        }

        public static float? GetFloatValue(NpgsqlDataReader reader, int columnIdx, float? defaultValue = null)
        {
            try
            {
                if (reader == null)
                    return defaultValue;
                return reader.IsDBNull(columnIdx) ? defaultValue : (float?)reader.GetFloat(columnIdx);
            }
            catch (Exception)
            {
                return defaultValue;
            }
        }

        /*// return decimal
        public static decimal GetDecimalValue(SqlDataReader sqlReader, string strField, decimal defaultValue = 0)
        {
            try
            {
                if (sqlReader == null)
                    return defaultValue;
                object obj = sqlReader[strField];
                if (obj == null)
                    return defaultValue;
                if (obj.GetType().ToString() == "System.DBNull")
                    return defaultValue;
                return (decimal)obj;
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static decimal GetDecimalValue(SqlDataReader sqlReader, int iIndex, decimal defaultValue = 0)
        {
            try
            {
                if (sqlReader == null)
                    return defaultValue;
                object obj = sqlReader[iIndex];
                if (obj == null)
                    return defaultValue;
                if (obj.GetType().ToString() == "System.DBNull")
                    return defaultValue;
                return (decimal)obj;
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static decimal GetDecimalValue(DataRow row, string strField, decimal defaultValue = 0)
        {
            try
            {
                if (row == null)
                    return defaultValue;
                object obj = row[strField];
                if (obj == null)
                    return defaultValue;
                if (obj.GetType().ToString() == "System.DBNull")
                    return defaultValue;
                return (decimal)obj;
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static decimal GetDecimalValue(DataRow row, int iIndex, decimal defaultValue = 0)
        {
            try
            {
                if (row == null)
                    return defaultValue;
                object obj = row[iIndex];
                if (obj == null)
                    return defaultValue;
                if (obj.GetType().ToString() == "System.DBNull")
                    return defaultValue;
                return (decimal)obj;
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static decimal GetDecimalValue(NpgsqlDataReader reader, string columnName, decimal defaultValue = 0)
        {
            try
            {
                if (reader == null)
                    return defaultValue;
                int index = reader.GetOrdinal(columnName);
                return reader.IsDBNull(index) ? defaultValue : reader.GetDecimal(index);
            }
            catch (Exception)
            {
                return defaultValue;
            }
        }

        public static decimal GetDecimalValue(NpgsqlDataReader reader, int columnIdx, decimal defaultValue = 0)
        {
            try
            {
                if (reader == null)
                    return defaultValue;
                return reader.IsDBNull(columnIdx) ? defaultValue : reader.GetDecimal(columnIdx);
            }
            catch (Exception)
            {
                return defaultValue;
            }
        }*/

        // return decimal?
        public static decimal? GetDecimalValue(SqlDataReader sqlReader, string strField, decimal? defaultValue = null)
        {
            try
            {
                if (sqlReader == null)
                    return defaultValue;
                object obj = sqlReader[strField];
                if (obj == null)
                    return defaultValue;
                if (obj.GetType().ToString() == "System.DBNull")
                    return defaultValue;
                return (decimal?)obj;
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static decimal? GetDecimalValue(SqlDataReader sqlReader, int iIndex, decimal? defaultValue = null)
        {
            try
            {
                if (sqlReader == null)
                    return defaultValue;
                object obj = sqlReader[iIndex];
                if (obj == null)
                    return defaultValue;
                if (obj.GetType().ToString() == "System.DBNull")
                    return defaultValue;
                return (decimal?)obj;
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static decimal? GetDecimalValue(DataRow row, string strField, decimal? defaultValue = null)
        {
            try
            {
                if (row == null)
                    return defaultValue;
                object obj = row[strField];
                if (obj == null)
                    return defaultValue;
                if (obj.GetType().ToString() == "System.DBNull")
                    return defaultValue;
                return (decimal?)obj;
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static decimal? GetDecimalValue(DataRow row, int iIndex, decimal? defaultValue = null)
        {
            try
            {
                if (row == null)
                    return defaultValue;
                object obj = row[iIndex];
                if (obj == null)
                    return defaultValue;
                if (obj.GetType().ToString() == "System.DBNull")
                    return defaultValue;
                return (decimal?)obj;
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static decimal? GetDecimalValue(NpgsqlDataReader reader, string columnName, decimal? defaultValue = null)
        {
            try
            {
                if (reader == null)
                    return defaultValue;
                int index = reader.GetOrdinal(columnName);
                return reader.IsDBNull(index) ? defaultValue : (decimal?)reader.GetDecimal(index);
            }
            catch (Exception)
            {
                return defaultValue;
            }
        }

        public static decimal? GetDecimalValue(NpgsqlDataReader reader, int columnIdx, decimal? defaultValue = null)
        {
            try
            {
                if (reader == null)
                    return defaultValue;
                return reader.IsDBNull(columnIdx) ? defaultValue : (decimal?)reader.GetDecimal(columnIdx);
            }
            catch (Exception)
            {
                return defaultValue;
            }
        }


        public static int GetValue(DataRow dataRow, string strField, int defaultValue = 0)
        {
            try
            {
                if (dataRow == null)
                    return defaultValue;
                object obj = dataRow[strField];
                if (obj == null)
                    return defaultValue;
                string strType = obj.GetType().ToString();
                if (strType == "System.DBNull") return defaultValue;
                if (strType == "System.Int32") return (int)obj;
                if (strType == "System.Int64") return (int)((long)obj);
                return defaultValue;
            }
            catch (InvalidCastException) { }
            return defaultValue;
        }

        public static DataCell GetValue(DataRow dataRow, DataColumn dataColumn)
        {
            try
            {
                if (dataColumn == null) return new DataCell();
                if (dataRow == null) return new DataCell(dataColumn.ColumnName, "");
                object obj = dataRow[dataColumn];
                if (obj == null) return new DataCell(dataColumn.ColumnName, "");
                string strType = obj.GetType().Name;

                // null
                if (strType == "DBNull" || strType == "System.DBNull") return new DataCell(dataColumn.ColumnName, "");

                // int
                if (strType == "Int32" || strType == "System.Int32") return new DataCell(dataColumn.ColumnName, ((int)obj).ToString());
                if (strType == "Int64" || strType == "System.Int64") return new DataCell(dataColumn.ColumnName, ((int)((long)obj)).ToString());

                // string
                if (strType == "String" || strType == "System.String") return new DataCell(dataColumn.ColumnName, (string)obj);

                // bool
                if (strType == "Boolean" || strType == "System.Boolean") return new DataCell(dataColumn.ColumnName, ((bool)obj).ToString());

                // datetime
                if (strType == "DateTime" || strType == "System.DateTime") return new DataCell(dataColumn.ColumnName, ((DateTime)obj).ToString(Constant.DATETIMEFORMATFULL));

                // byte[]
                // System.Byte
                if (strType == "Byte[]" || strType == "System.Byte[]") return new DataCell(dataColumn.ColumnName, Convert.ToBase64String((byte[])obj));

                // float
                // double
                if (strType == "Double" || strType == "System.Double") return new DataCell(dataColumn.ColumnName, ((double)obj).ToString());

                // decimal
                if (strType == "Decimal" || strType == "System.Decimal") return new DataCell(dataColumn.ColumnName, ((decimal)obj).ToString());

                System.Diagnostics.Debug.Assert(false);
                return new DataCell(dataColumn.ColumnName, "");
            }
            catch (InvalidCastException) { }
            return new DataCell(dataColumn.ColumnName, "");
        }

        public static object GetValueEx(DataRow dataRow, string strField)
        {
            try
            {
                return dataRow == null ? null : dataRow[strField];
            }
            catch (Exception) { }
            return null;
        }

        public static object GetValueEx(NpgsqlDataReader reader, string strField)
        {
            try
            {
                return reader == null ? null : reader[strField];
            }
            catch (Exception) { }
            return null;
        }
    }

    public class DBParam
    {
        public static object Nullable(object value)
        {
            return value == null ? DBNull.Value : value;
        }
    }
}
