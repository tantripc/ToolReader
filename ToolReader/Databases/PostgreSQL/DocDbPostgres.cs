using Dapper;
using Microsoft.AspNetCore.StaticFiles;
using Newtonsoft.Json;
using Npgsql;
using WebApi;
using NpgsqlTypes;
//using OfficeOpenXml;
using System.Data;
using WebApi.App_Code;
using WebApi.Models;

namespace WebApi.Databases.PostgreSQL
{
    public class DocDbPostgres
    {
        private readonly string _connectionString;
        public string _uploadString;

        public DocDbPostgres()
		{
			_connectionString = WebConfigs.ConnectionStrings.DataAccessPostgreSqlProvider;
            _uploadString = WebConfigs.AppSettings.UploadPath;
        }

        internal IDbConnection Connection { get { return new NpgsqlConnection(_connectionString); } }

        public DataTable? Execute(string? query)
		{
			if (string.IsNullOrEmpty(query))
				return null;

			try
			{
				using (IDbConnection dbConnection = Connection)
				{
					dbConnection.Open();
					NpgsqlCommand cmd = new NpgsqlCommand(query, (NpgsqlConnection)dbConnection);
					cmd.CommandType = CommandType.Text;
					NpgsqlDataAdapter ad = new NpgsqlDataAdapter(cmd);
					DataTable dt = new DataTable();
					ad.Fill(dt);
					ad.Dispose();
					cmd.Dispose();
					dbConnection.Close();
					return dt;
				}
			}
			catch (Exception ex)
			{
				//(new Log(_config)).Write("DocDbPostgres.Execute() exception. Msg: ''" + ex.Message + "''");
				Log.Write("DocDbPostgres.Execute() exception. Msg: ''" + ex.Message + "''");
				return null;
			}
		}

		public int? ExecuteNonQuery(string? query)
		{
			if (string.IsNullOrEmpty(query))
				return 0;

			try
			{
				using (IDbConnection dbConnection = Connection)
				{
					dbConnection.Open();
					NpgsqlCommand cmd = new NpgsqlCommand(query, (NpgsqlConnection)dbConnection);
					cmd.CommandType = CommandType.Text;
					int iRowAffect = cmd.ExecuteNonQuery();
					cmd.Dispose();
					dbConnection.Close();
					return iRowAffect;
				}
			}
			catch (Exception ex)
			{
				//(new Log(_config)).Write("DocDbPostgres.ExecuteNonQuery() exception. Msg: ''" + ex.Message + "''");
				Log.Write("DocDbPostgres.ExecuteNonQuery() exception. Msg: ''" + ex.Message + "''");
				return 0;
			}
		}

		public object? ExecuteScalar(string? query)
		{
			if (string.IsNullOrEmpty(query))
				return 0;

			try
			{
				using (IDbConnection dbConnection = Connection)
				{
					dbConnection.Open();
					NpgsqlCommand cmd = new NpgsqlCommand(query, (NpgsqlConnection)dbConnection);
					cmd.CommandType = CommandType.Text;
					object? obj = cmd.ExecuteScalar();
					cmd.Dispose();
					dbConnection.Close();
					return obj;
				}
			}
			catch (Exception ex)
			{
				//(new Log(_config)).Write("DocDbPostgres.ExecuteScalar() exception. Msg: ''" + ex.Message + "''");
				Log.Write("DocDbPostgres.ExecuteScalar() exception. Msg: ''" + ex.Message + "''");
				return null;
			}
		}

		//public List<docinfo> DocInfo_GetInfo_With_VerifyRole(long? userid, long? docid, long? appfuncid, string? routing)
		public List<docattach> DocAttach_GetInfo_With_VerifyRole(long? userid, long? docattachid, long? docid, long? appfuncid, string? routing)
		{
			try
			{
				CommandDefinition cmddef = new CommandDefinition(
					commandText: "fn_docattach_getinfo_with_verifyrole"
					, parameters: new
					{
						in_userid = userid,
						in_docattachid=docattachid,
						in_docid = docid,
						in_appfuncid = appfuncid,
						in_routing = routing
					}
					, commandType: CommandType.StoredProcedure
				);
				using (IDbConnection dbConnection = Connection)
				{
					dbConnection.Open();
					var result = dbConnection.Query<docattach>(cmddef).ToList();
					dbConnection.Close();
					return result;
				}
			}
			catch (Exception ex)
			{
				//(new Log(_config)).Write("DocDbPostgres.DocAttach_GetInfo_With_VerifyRole() exception. Msg: ''" + ex.Message + "''");
				Log.Write("DocDbPostgres.DocAttach_GetInfo_With_VerifyRole() exception. Msg: ''" + ex.Message + "''");
				return null;
			}
		}

		//public returnval? DocInfo_Update_DocOnline_Status(long? userid, long? docid, int? numpage, long? docsize, string? doconline_status, string? doconline_format, long? appfuncid, string? routing)
		public returnval? DocAttach_Update_DocOnline_Status(long? userid, long? docattachid, long? docsize, string? doconline_status, 
			string? doconline_format, int? doconline_numpage, int? pagewidth, int? pageheight, long? appfuncid, string? routing)
		{
			try
			{
				using (IDbConnection dbConnection = Connection)
				{
					returnval respond = null;
					dbConnection.Open();
					NpgsqlCommand cmd = new NpgsqlCommand("fn_docattach_update_doconline_status", (NpgsqlConnection)dbConnection);
					cmd.CommandType = CommandType.StoredProcedure;
					cmd.Parameters.AddWithValue(":in_userid", NpgsqlDbType.Bigint, DBParam.Nullable(userid));
					//cmd.Parameters.AddWithValue(":in_docid", NpgsqlDbType.Bigint, DBParam.Nullable(docid));
					cmd.Parameters.AddWithValue(":in_docattachid", NpgsqlDbType.Bigint, DBParam.Nullable(docattachid));
					//cmd.Parameters.AddWithValue(":in_numpage", NpgsqlDbType.Integer, DBParam.Nullable(numpage));
					cmd.Parameters.AddWithValue(":in_docsize", NpgsqlDbType.Bigint, DBParam.Nullable(docsize));
					cmd.Parameters.AddWithValue(":in_doconline_status", NpgsqlDbType.Varchar, DBParam.Nullable(doconline_status));
					cmd.Parameters.AddWithValue(":in_doconline_format", NpgsqlDbType.Varchar, DBParam.Nullable(doconline_format));
					cmd.Parameters.AddWithValue(":in_doconline_numpage", NpgsqlDbType.Integer, DBParam.Nullable(doconline_numpage));
					cmd.Parameters.AddWithValue(":in_pagewidth", NpgsqlDbType.Integer, DBParam.Nullable(pagewidth));
					cmd.Parameters.AddWithValue(":in_pageheight", NpgsqlDbType.Integer, DBParam.Nullable(pageheight));
					cmd.Parameters.AddWithValue(":in_appfuncid", NpgsqlDbType.Bigint, DBParam.Nullable(appfuncid));
					cmd.Parameters.AddWithValue(":in_routing", NpgsqlDbType.Varchar, DBParam.Nullable(routing));
					NpgsqlDataReader reader = cmd.ExecuteReader();
					if (reader != null && reader.Read())
						respond = new returnval { returncode = DBUtil.GetIntValue(reader, "returncode"), returnmsg = DBUtil.GetStrValue(reader, "returnmsg"), id = DBUtil.GetLongValue(reader, "id") };
					else
						respond = new returnval { returncode = ReturnCode.GENERAL_DATABASE_ERR, returnmsg = "Lỗi hệ thống", id = null };
					reader.Close();
					cmd.Dispose();
					dbConnection.Close();
					return respond;
				}
			}
			catch (Exception ex)
			{
				//(new Log(_config)).Write("DocDbPostgres.DocAttach_Update_DocOnline_Status() exception. Msg: ''" + ex.Message + "''");
				Log.Write("DocDbPostgres.DocAttach_Update_DocOnline_Status() exception. Msg: ''" + ex.Message + "''");
				return new returnval { returncode = ReturnCode.GENERAL_SYSTEM_ERR, returnmsg = "Lỗi hệ thống", id = null };
			}
		}


		// Reset va Import Muc luc sach
		public returnval DocToc_ResetAndImport(doctoc_import mod)
		{
			try
			{
				if (mod.doctoc_js != null && mod.doctoc_js.Count > 0)
				{
					mod.doctoc_jss = JsonConvert.SerializeObject(mod.doctoc_js);
				}

				using (IDbConnection dbConnection = Connection)
				{
					returnval respond = null;
					dbConnection.Open();
					NpgsqlCommand cmd = new NpgsqlCommand("fn_doctoc_resetandimport", (NpgsqlConnection)dbConnection);
					cmd.CommandType = CommandType.StoredProcedure;
					cmd.Parameters.AddWithValue(":in_docattachid", NpgsqlDbType.Bigint, DBParam.Nullable(mod.docattachid));
					cmd.Parameters.AddWithValue(":in_doctoc_jss", NpgsqlDbType.Json, DBParam.Nullable(mod.doctoc_jss));
					cmd.Parameters.AddWithValue(":in_createdby", NpgsqlDbType.Bigint, DBParam.Nullable(mod.createdby));
					cmd.Parameters.AddWithValue(":in_appfuncid", NpgsqlDbType.Bigint, DBParam.Nullable(mod.appfuncid));
					cmd.Parameters.AddWithValue(":in_routing", NpgsqlDbType.Varchar, DBParam.Nullable(mod.routing));
					NpgsqlDataReader reader = cmd.ExecuteReader();
					if (reader != null && reader.Read())
						respond = new returnval { returncode = DBUtil.GetIntValue(reader, "returncode"), returnmsg = DBUtil.GetStrValue(reader, "returnmsg"), rowaffect = DBUtil.GetIntValue(reader, "rowaffect") };
					else
						respond = new returnval { returncode = ReturnCode.GENERAL_DATABASE_ERR, returnmsg = "Lỗi hệ thống", id = null };
					reader.Close();
					cmd.Dispose();
					dbConnection.Close();
					return respond;
				}
			}
			catch (Exception ex)
			{
				//(new Log(_config)).Write("DocDbPostgres.DocToc_ResetAndImport() exception. Msg: ''" + ex.Message + "''");
				Log.Write("DocDbPostgres.DocToc_ResetAndImport() exception. Msg: ''" + ex.Message + "''");
				return new returnval { returncode = ReturnCode.GENERAL_SYSTEM_ERR, returnmsg = "Lỗi hệ thống", id = null };
			}
		}
        public returnval DocInfo_AddUpdate(docinfo mod)
        {
            try
            {
                //string catg_js = "";
                if (mod.catg_js != null && mod.catg_js.Count > 0)
                {
                    mod.catg_jss = JsonConvert.SerializeObject(mod.catg_js);
                }

                //if (mod.docattach_js != null && mod.docattach_js.Count > 0)
                //{
                //    // '{"docattachid":null, "attachfile":"", "attachlink":"", "docsize":null, "isdefault":null }'
                //    mod.docattach_jss = JsonConvert.SerializeObject(mod.docattach_js);
                //}

                using (IDbConnection dbConnection = Connection)
                {
                    returnval respond = null;
                    dbConnection.Open();
                    NpgsqlCommand cmd = new NpgsqlCommand("fn_docinfo_addupdate", (NpgsqlConnection)dbConnection);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue(":in_createdby", NpgsqlDbType.Bigint, DBParam.Nullable(mod.createdby));
                    cmd.Parameters.AddWithValue(":in_doccode", NpgsqlDbType.Varchar, DBParam.Nullable(mod.doccode));
                    cmd.Parameters.AddWithValue(":in_docid", NpgsqlDbType.Bigint, DBParam.Nullable(mod.docid));
                    cmd.Parameters.AddWithValue(":in_topicid", NpgsqlDbType.Bigint, DBParam.Nullable(mod.topicid));
                    cmd.Parameters.AddWithValue(":in_title", NpgsqlDbType.Varchar, DBParam.Nullable(ConvertUtil.UnicodeVN1258ToUnicodeOrigin(mod.title)));
                    cmd.Parameters.AddWithValue(":in_author", NpgsqlDbType.Varchar, DBParam.Nullable(ConvertUtil.UnicodeVN1258ToUnicodeOrigin(mod.author)));
                    cmd.Parameters.AddWithValue(":in_translator", NpgsqlDbType.Varchar, DBParam.Nullable(ConvertUtil.UnicodeVN1258ToUnicodeOrigin(mod.translator)));
                    cmd.Parameters.AddWithValue(":in_collector", NpgsqlDbType.Varchar, DBParam.Nullable(ConvertUtil.UnicodeVN1258ToUnicodeOrigin(mod.collector)));
                    cmd.Parameters.AddWithValue(":in_publisher", NpgsqlDbType.Varchar, DBParam.Nullable(ConvertUtil.UnicodeVN1258ToUnicodeOrigin(mod.publisher)));
                    cmd.Parameters.AddWithValue(":in_publishyear", NpgsqlDbType.Varchar, DBParam.Nullable(mod.publishyear));
                    cmd.Parameters.AddWithValue(":in_originprice", NpgsqlDbType.Numeric, DBParam.Nullable(mod.originprice));
                    cmd.Parameters.AddWithValue(":in_price", NpgsqlDbType.Numeric, DBParam.Nullable(mod.price));
                    cmd.Parameters.AddWithValue(":in_currency", NpgsqlDbType.Varchar, DBParam.Nullable(mod.currency));
                    cmd.Parameters.AddWithValue(":in_publishnum", NpgsqlDbType.Integer, DBParam.Nullable(mod.publishnum));
                    cmd.Parameters.AddWithValue(":in_numpage", NpgsqlDbType.Integer, DBParam.Nullable(mod.numpage));
                    //cmd.Parameters.AddWithValue(":in_docsize", NpgsqlDbType.Bigint, DBParam.Nullable(mod.docsize));
                    cmd.Parameters.AddWithValue(":in_keyword", NpgsqlDbType.Varchar, DBParam.Nullable(mod.keyword));
                    cmd.Parameters.AddWithValue(":in_isbn", NpgsqlDbType.Varchar, DBParam.Nullable(mod.isbn));
                    //cmd.Parameters.AddWithValue(":in_attachfile", NpgsqlDbType.Varchar, DBParam.Nullable(mod.attachfile));
                    //cmd.Parameters.AddWithValue(":in_attachlink", NpgsqlDbType.Varchar, DBParam.Nullable(mod.attachlink));
                    //cmd.Parameters.AddWithValue(":in_pagewidth", NpgsqlDbType.Integer, DBParam.Nullable(mod.pagewidth));
                    //cmd.Parameters.AddWithValue(":in_pageheight", NpgsqlDbType.Integer, DBParam.Nullable(mod.pageheight));
                    cmd.Parameters.AddWithValue(":in_ishide", NpgsqlDbType.Boolean, DBParam.Nullable(mod.ishide));
                    cmd.Parameters.AddWithValue(":in_coverfile", NpgsqlDbType.Varchar, DBParam.Nullable(mod.coverfile));
                    cmd.Parameters.AddWithValue(":in_pagepreview", NpgsqlDbType.Varchar, DBParam.Nullable(mod.pagepreview));
                    cmd.Parameters.AddWithValue(":in_abstractcontent", NpgsqlDbType.Text, DBParam.Nullable(mod.abstractcontent));
                    cmd.Parameters.AddWithValue(":in_abstracttxt", NpgsqlDbType.Text, DBParam.Nullable(ConvertUtil.UnicodeVN1258ToUnicodeOrigin(mod.abstracttxt)));
                    cmd.Parameters.AddWithValue(":in_desct", NpgsqlDbType.Text, DBParam.Nullable(mod.desct));
                    cmd.Parameters.AddWithValue(":in_descttxt", NpgsqlDbType.Text, DBParam.Nullable(ConvertUtil.UnicodeVN1258ToUnicodeOrigin(mod.descttxt)));
                    cmd.Parameters.AddWithValue(":in_cprid", NpgsqlDbType.Bigint, DBParam.Nullable(mod.cprid));
                    //cmd.Parameters.AddWithValue(":in_catg_js", NpgsqlDbType.Varchar, DBParam.Nullable(mod.catg_js));
                    cmd.Parameters.AddWithValue(":in_catg_jss", NpgsqlDbType.Json, DBParam.Nullable(mod.catg_jss));
                    //cmd.Parameters.AddWithValue(":in_toc", NpgsqlDbType.Text, DBParam.Nullable(mod.toc));
                    //cmd.Parameters.AddWithValue(":in_docattach_jss", NpgsqlDbType.Json, DBParam.Nullable(mod.docattach_jss));
                    cmd.Parameters.AddWithValue(":in_attachfile", NpgsqlDbType.Varchar, DBParam.Nullable(mod.attachfile));
                    cmd.Parameters.AddWithValue(":in_attachlink", NpgsqlDbType.Varchar, DBParam.Nullable(mod.attachlink));
                    cmd.Parameters.AddWithValue(":in_appfuncid", NpgsqlDbType.Bigint, DBParam.Nullable(mod.appfuncid));
                    cmd.Parameters.AddWithValue(":in_routing", NpgsqlDbType.Varchar, DBParam.Nullable(mod.routing));
                    NpgsqlDataReader reader = cmd.ExecuteReader();
                    if (reader != null && reader.Read())
                        respond = new returnval { returncode = DBUtil.GetIntValue(reader, "returncode"), returnmsg = DBUtil.GetStrValue(reader, "returnmsg"), id = DBUtil.GetLongValue(reader, "id") };
                    else
                        respond = new returnval { returncode = ReturnCode.GENERAL_DATABASE_ERR, returnmsg = "Lỗi hệ thống", id = null };
                    reader.Close();
                    cmd.Dispose();
                    dbConnection.Close();
                    return respond;
                }
            }
            catch (Exception ex)
            {
                //(new Log(_config)).Write("DocInfoDbPostgres.DocInfo_AddUpdate() exception. Msg: ''" + ex.Message + "''");
                Log.Write("DocInfoDbPostgres.DocInfo_AddUpdate() exception. Msg: ''" + ex.Message + "''");
                return new returnval { returncode = ReturnCode.GENERAL_SYSTEM_ERR, returnmsg = "Lỗi hệ thống", id = null };
            }
        }
    }
}
