using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Web;

namespace SSP_WebAPI.Data
{
    public class DBUtils
    {
        public class DataParameters
        {
            public string parameter { get; set; }
            public object obj { get; set; }
        }

        public static string GetJSONfromSP(string sp, List<Data.DBUtils.DataParameters> spParams)
        {
            var jsonSettings = new JsonSerializerSettings();
            jsonSettings.DateFormatString = "MM/dd/yyyy";

            string retJSON = "success";
            using (SqlConnection con = new SqlConnection(ConfigurationManager.AppSettings["SSPConnectionString"]))
            {
                using (SqlCommand cmd = new SqlCommand())
                {
                    cmd.CommandText = sp;
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Connection = con;
                    foreach (var spParam in spParams)
                    {
                        cmd.Parameters.AddWithValue(spParam.parameter, spParam.obj);
                    }
                    var adapt = new SqlDataAdapter();
                    adapt.SelectCommand = cmd;
                    var ds = new DataSet();
                    adapt.Fill(ds);

                    if (ds.Tables.Count > 0 ) {
                        retJSON = JsonConvert.SerializeObject(ds.Tables[0], new JsonSerializerSettings() { DateFormatString = "MM/dd/yyyy HH:mm:ss.fff" });
                    }

                    //retJSON = JsonConvert.SerializeObject(ds, new DataSetConverter());
                }
            }
            return retJSON;
        }

        public static DataSet GetDatasetfromSP(string sp, List<DataParameters> spParams)
        {
            var ds = new DataSet();
            using (SqlConnection con = new SqlConnection(ConfigurationManager.AppSettings["SSPConnectionString"]))
            {
                using (SqlCommand cmd = new SqlCommand())
                {
                    cmd.CommandText = sp;
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Connection = con;
                    foreach (var spParam in spParams)
                    {
                        cmd.Parameters.AddWithValue(spParam.parameter, spParam.obj);
                    }
                    var adapt = new SqlDataAdapter();
                    adapt.SelectCommand = cmd;
                    adapt.Fill(ds);
                }
            }
            return ds;
        }


    }
}
