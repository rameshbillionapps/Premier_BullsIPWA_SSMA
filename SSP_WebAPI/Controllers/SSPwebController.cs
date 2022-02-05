using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;

namespace SSP_WebAPI.Controllers
{
    //[Route("api/[controller]")]
    [System.Web.Script.Services.ScriptService]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    [RoutePrefix("sspweb")]
    public class SSPwebController : ApiController
    {
        ////JKS041917 Not StoredProc        
        ////[HttpGet]
        ////[Route("tblAS400Customers")]
        ////public string tblAS400Customers(string id, string epochtime)
        ////{
        ////    string strProcName = "tblAS400Customers";
        ////    List<Data.DBUtils.DataParameters> spParams = new List<Data.DBUtils.DataParameters>()
        ////    {
        ////        new Data.DBUtils.DataParameters(){ parameter = "@TechNo", obj = id }
        ////    };
        ////    return Data.DBUtils.GetJSONfromSP(strProcName, spParams);
        ////}

        [HttpGet]
        [Route("tblTechTransfers/{epochtime}")]
        public string tblTechTransfers(string epochtime)    //JKS042717***Removed string id, ***
        {
            string strProcName = "spGetTblTechsTransfer";
            List<Data.DBUtils.DataParameters> spParams = new List<Data.DBUtils.DataParameters>()
            {
                //JKS042717*** new Data.DBUtils.DataParameters(){ parameter = "@TechNo", obj = id } ***
            };
            return Data.DBUtils.GetJSONfromSP(strProcName, spParams);
        }

        [HttpGet]
        [Route("tblAS400Customers/{id}/{epochtime}")]
        public string tblAS400Customers(string id, string epochtime)
        {
            string strProcName = "spGetTblAS400CustomersByTech";
            List<Data.DBUtils.DataParameters> spParams = new List<Data.DBUtils.DataParameters>()
            {
                new Data.DBUtils.DataParameters(){ parameter = "@TechNo", obj = id }
            };
            return Data.DBUtils.GetJSONfromSP(strProcName, spParams);
        }

        [HttpGet]
        [Route("tblAS400CustomersAR/{id}/{epochtime}")]
        public string tblAS400CustomersAR(string id, string epochtime)
        {
            string strProcName = "spGetTblAS400CustomersARByTech";
            List<Data.DBUtils.DataParameters> spParams = new List<Data.DBUtils.DataParameters>()
            {
                new Data.DBUtils.DataParameters(){ parameter = "@TechNo", obj = id }
            };
            return Data.DBUtils.GetJSONfromSP(strProcName, spParams);
        }

        [HttpGet]
        [Route("tblAS400CustomerNotes/{id}/{epochtime}")]
        public string tblAS400CustomerNotes(string id, string epochtime)
        {
            string strProcName = "spGetTblAS400CustomerNotesByTech";
            List<Data.DBUtils.DataParameters> spParams = new List<Data.DBUtils.DataParameters>()
            {
                new Data.DBUtils.DataParameters(){ parameter = "@TechNo", obj = id }
            };
            return Data.DBUtils.GetJSONfromSP(strProcName, spParams);
        }

        [HttpGet]
        [Route("tblAS400Bulls/{id}/{epochtime}")]
        public string tblAS400Bulls(string id, string epochtime)
        {
            string strProcName = "spGetTblAS400BullsByTech";
            List<Data.DBUtils.DataParameters> spParams = new List<Data.DBUtils.DataParameters>()
            {
                new Data.DBUtils.DataParameters(){ parameter = "@TechNo", obj = id }
            };
            return Data.DBUtils.GetJSONfromSP(strProcName, spParams);
        }

        //JKS051117***Not StoredProc redirect for BullsNoFrz to Bulls***
        [HttpGet]
        [Route("tblAS400BullsNoFrz/{id}/{epochtime}")]
        public string tblAS400BullsNoFrz(string id, string epochtime)
        {
            string strProcName = "spGetTblAS400BullsByTech";
            List<Data.DBUtils.DataParameters> spParams = new List<Data.DBUtils.DataParameters>()
            {
                new Data.DBUtils.DataParameters(){ parameter = "@TechNo", obj = id }
            };
            return Data.DBUtils.GetJSONfromSP(strProcName, spParams);
        }

        [HttpGet]
        [Route("tblAS400Supplies/{id}/{epochtime}")]
        public string tblAS400Supplies(string id, string epochtime)
        {
            string strProcName = "spGetTblAS400SuppliesByTech";
            List<Data.DBUtils.DataParameters> spParams = new List<Data.DBUtils.DataParameters>()
            {
                new Data.DBUtils.DataParameters(){ parameter = "@TechNo", obj = id }
            };
            return Data.DBUtils.GetJSONfromSP(strProcName, spParams);
        }
                
        [HttpGet]   
        [Route("tblAS400Sales/{id}/{epochtime}")]
        public string tblAS400Sales(string id, string epochtime)
        {


            string strProcName = "spGetTblAS400SalesByTech";
            List<Data.DBUtils.DataParameters> spParams = new List<Data.DBUtils.DataParameters>()
            {
                new Data.DBUtils.DataParameters(){ parameter = "@TechNo", obj = id }
            };
            return Data.DBUtils.GetJSONfromSP(strProcName, spParams);
        }

        //JKS051117***Not StoredProc redirect for SalesNoFrz to Sales***
        [HttpGet]
        [Route("tblAS400SalesNoFrz/{id}/{epochtime}")]
        public string tblAS400SalesNoFrz(string id, string epochtime)
        {
            string strProcName = "spGetTblAS400SalesByTech";
            List<Data.DBUtils.DataParameters> spParams = new List<Data.DBUtils.DataParameters>()
            {
                new Data.DBUtils.DataParameters(){ parameter = "@TechNo", obj = id }
            };
            return Data.DBUtils.GetJSONfromSP(strProcName, spParams);
        }

        [HttpGet]
        [Route("tblAS400Timesheet/{id}/{epochtime}")]
        public string tblAS400Timesheet(string id, string epochtime)
        {
            string strProcName = "spGetTblAS400TimesheetsByTech";
            List<Data.DBUtils.DataParameters> spParams = new List<Data.DBUtils.DataParameters>()
            {
                new Data.DBUtils.DataParameters(){ parameter = "@TechNo", obj = id }
            };
            return Data.DBUtils.GetJSONfromSP(strProcName, spParams);
        }

        [HttpGet]
        [Route("tblTechRelief/{id}/{epochtime}")]
        public string tblTechRelief(string id, string epochtime)
        {
            string strProcName = "spGetTblTechReliefByTech";
            List<Data.DBUtils.DataParameters> spParams = new List<Data.DBUtils.DataParameters>()
            {
                new Data.DBUtils.DataParameters(){ parameter = "@TechNo", obj = id }
            };
            return Data.DBUtils.GetJSONfromSP(strProcName, spParams);
        }

        //JKS042717***No SSP_db Ajax...It's in SSP_reports***
        [HttpGet]
        [Route("syncInCounts/{id}/{epochtime}")]
        public string syncInCounts(string id, string epochtime)
        {
            string strProcName = "spGetSyncInCounts";
            List<Data.DBUtils.DataParameters> spParams = new List<Data.DBUtils.DataParameters>()
            {
                new Data.DBUtils.DataParameters(){ parameter = "@TechGUID", obj = id }
            };
            return Data.DBUtils.GetJSONfromSP(strProcName, spParams);
        }

        [HttpGet]
        [Route("prepSyncV3/{id}/{strGUID}/{strVer}/{epochtime}")]
        public string prepSync(string id, Guid strGUID, string epochtime, string strVer)
        {
            string strProcName = "spInsertPrepSyncV3";
            List<Data.DBUtils.DataParameters> spParams = new List<Data.DBUtils.DataParameters>()
            {
                new Data.DBUtils.DataParameters(){ parameter = "@GUIDTech", obj = strGUID },
                new Data.DBUtils.DataParameters(){ parameter = "@TECH_NO", obj = id },
                new Data.DBUtils.DataParameters(){ parameter = "@VERSION", obj = strVer }
            };
            DataSet ds = Data.DBUtils.GetDatasetfromSP(strProcName, spParams);
            return ds.Tables[0].Rows[0][0].ToString();
        }

        [HttpGet]
        [Route("setTech/{id}/{pwd}/{epochtime}")]
        public string setTech(string id, string pwd, string epochtime)
        {
            string strProcName = "UserLoginAuthentication";
            List<Data.DBUtils.DataParameters> spParams = new List<Data.DBUtils.DataParameters>()
            {
                new Data.DBUtils.DataParameters(){ parameter = "@Username", obj = id },
                new Data.DBUtils.DataParameters(){ parameter = "@Password", obj = pwd }
            };
            DataSet ds = Data.DBUtils.GetDatasetfromSP(strProcName, spParams);
            if (ds.Tables[0].Rows.Count  > 0)
            {
                return ds.Tables[0].Rows[0]["GUIDTech"] + "|" + ds.Tables[0].Rows[0]["PKIDTech"] + "|" + ds.Tables[0].Rows[0]["TechID"];
            }   else
            {
                return "Failed";
            }
        }

        [HttpPost]
        [Route("tblSyncInCustomers/{syncid}/{epochtime}")]
        public string tblSyncInCustomers(string syncid, string epochtime, [FromBody]JArray jsonData)
        {
            string strProcName = "spInserttblSyncInCustomers";
            List<Data.DBUtils.DataParameters> spParams;
            foreach (JObject j in jsonData)
            {
                spParams = new List<Data.DBUtils.DataParameters>()
                {   //JKS051617***CHANGED Convert.ToDouble and Convert.ToInt32 for FAV to .ToString() to resolve NULL exceptions***
                    new Data.DBUtils.DataParameters(){ parameter = "@PKIDSync", obj = Convert.ToInt32(syncid)},
                    new Data.DBUtils.DataParameters(){ parameter = "@ACTIVE", obj = (j["ACTIVE"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@TYPE_AREA", obj = (j["TYPE_AREA"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@SP1", obj = (j["SP1"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@ACCT_NO", obj = (j["ACCT_NO"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@NAME", obj = (j["NAME"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@ADDR1", obj = (j["ADDR1"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@ADDR2", obj = (j["ADDR2"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@CITY", obj = (j["CITY"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@STATE", obj = (j["STATE"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@SP2", obj = (j["SP2"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@ZIP", obj = (j["ZIP"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@BREED1", obj = (j["BREED1"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@BREED2", obj = (j["BREED2"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@BREED3", obj = (j["BREED3"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@TYPE", obj = (j["TYPE"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@SP3", obj = (j["SP3"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@TECH_NO", obj = (j["TECH_NO"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@MEMBER", obj = (j["MEMBER"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@DISC1", obj = (j["DISC1"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@DISC2", obj = (j["DISC2"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@W_O", obj = (j["W_O"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@SP4", obj = (j["SP4"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@L_PMT_M", obj = (j["L_PMT_M"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@SP5", obj = (j["SP5"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@L_PMT_Y", obj = (j["L_PMT_Y"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@SP6", obj = (j["SP6"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@L_PUR_M", obj = (j["L_PUR_M"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@SP7", obj = (j["SP7"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@L_PUR_Y", obj = (j["L_PUR_Y"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@SP8", obj = (j["SP8"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@SP_ACCT", obj = (j["SP_ACCT"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@SP9", obj = (j["SP9"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@SP_RATE", obj = (j["SP_RATE"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@SL_AREA", obj = (j["SL_AREA"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@SP10", obj = (j["SP10"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@COUNTY", obj = (j["COUNTY"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@TAXABLE", obj = (j["TAXABLE"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@MOD", obj = Convert.ToInt32(j["MOD"])},
                    new Data.DBUtils.DataParameters(){ parameter = "@MODSTAMP", obj = Convert.ToInt32(j["MODSTAMP"])},
                    new Data.DBUtils.DataParameters(){ parameter = "@FAV", obj = (j["FAV"].ToString())}
                };
                Data.DBUtils.GetJSONfromSP(strProcName, spParams);
            }
            return "success";
        }

        [HttpPost]
        [Route("tblSyncInCustomerNotes/{syncid}/{epochtime}")]
        public string tblSyncInCustomerNotes(string syncid, string epochtime, [FromBody]JArray jsonData)
        {
            string strProcName = "spInserttblSyncInCustomerNotes";
            List<Data.DBUtils.DataParameters> spParams;
            foreach (JObject j in jsonData)
            {
                spParams = new List<Data.DBUtils.DataParameters>()
                {
                    new Data.DBUtils.DataParameters(){ parameter = "@PKIDSync", obj = Convert.ToInt32(syncid)},
                    new Data.DBUtils.DataParameters(){ parameter = "@PKIDDroid", obj = (j["PKIDDroid"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@TECH_NO", obj = (j["TECH_NO"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@ACCT_NO", obj = (j["ACCT_NO"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@NOTE", obj = (j["NOTE"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@MOD", obj = Convert.ToInt32(j["MOD"])},
                    new Data.DBUtils.DataParameters(){ parameter = "@MODSTAMP", obj = Convert.ToInt32(j["MODSTAMP"])}
                };
                Data.DBUtils.GetJSONfromSP(strProcName, spParams);
            }
            return "success";
        }

        [HttpPost]
        [Route("tblSyncInSales/{syncid}/{epochtime}")]
        public string tblSyncInSales(string syncid, string epochtime, [FromBody]JArray jsonData)
        {
            string strProcName = "spInserttblSyncInSales";
            List<Data.DBUtils.DataParameters> spParams;
            foreach (JObject j in jsonData)
            {
                spParams = new List<Data.DBUtils.DataParameters>()
                {   //JKS051617***CHANGED Convert.ToDouble to .ToString() to resolve NULL exceptions***
                    new Data.DBUtils.DataParameters() { parameter = "@PKIDSync", obj = Convert.ToInt32(syncid) },
                    new Data.DBUtils.DataParameters() { parameter = "@SIACT", obj = (j["SIACT"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SIINVL", obj = (j["SIINVL"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SIORNM", obj = (j["SIORNM"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SIINVO", obj = (j["SIINVO"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SIDATO", obj = (j["SIDATO"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SITIMO", obj = (j["SITIMO"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SITYPS", obj = (j["SITYPS"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SICOD", obj = (j["SICOD"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SIQTY", obj = (j["SIQTY"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SIMATH", obj = (j["SIMATH"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SINAM", obj = (j["SINAM"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SIPRC", obj = (j["SIPRC"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SITYPI", obj = (j["SITYPI"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SICOW", obj = (j["SICOW"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SIARM", obj = (j["SIARM"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SISTP", obj = (j["SISTP"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SIOTH", obj = (j["SIOTH"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SILIN", obj = (j["SILIN"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SISEM", obj = (j["SISEM"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SIPOA", obj = (j["SIPOA"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SISUP", obj = (j["SISUP"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SICDI", obj = (j["SICDI"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SIPGA", obj = (j["SIPGA"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SIDSC", obj = (j["SIDSC"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SIREP", obj = (j["SIREP"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SIANM", obj = (j["SIANM"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SILVL1", obj = (j["SILVL1"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SILVL2", obj = (j["SILVL2"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SILVL3", obj = (j["SILVL3"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SILVL4", obj = (j["SILVL4"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SILVL5", obj = (j["SILVL5"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SIRETL", obj = (j["SIRETL"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@FRZDAT", obj = (j["FRZDAT"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@LOTNOT", obj = (j["LOTNOT"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@MOD", obj = Convert.ToInt32(j["MOD"]) },
                    new Data.DBUtils.DataParameters() { parameter = "@MODSTAMP", obj = Convert.ToInt32(j["MODSTAMP"]) },
                    new Data.DBUtils.DataParameters() { parameter = "@BREEDTYPE", obj = (j["BREEDTYPE"] == null) ? "" : (j["BREEDTYPE"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@FRZYYYYMMDD", obj = (j["FRZYYYYMMDD"] == null) ? "" : (j["FRZYYYYMMDD"].ToString()) }
                 };
                 Data.DBUtils.GetJSONfromSP(strProcName, spParams);
            }
            return "success";
        }

        [HttpPost]
        [Route("tblSalesBackup/{syncrep}/{epochtime}")]
        public string tblSalesBackup(string epochtime,string syncrep, [FromBody] JArray jsonData)
        {
            string strProcName = "spInserttblSalesBackup";
            List<Data.DBUtils.DataParameters> spParams;
            foreach (JObject j in jsonData)
            {
                spParams = new List<Data.DBUtils.DataParameters>()
                {   //JKS051617***CHANGED Convert.ToDouble to .ToString() to resolve NULL exceptions***
                    new Data.DBUtils.DataParameters() { parameter = "@SYNCREP", obj = syncrep },
                    new Data.DBUtils.DataParameters() { parameter = "@SIACT", obj = (j["SIACT"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SIINVL", obj = (j["SIINVL"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SIORNM", obj = (j["SIORNM"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SIINVO", obj = (j["SIINVO"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SIDATO", obj = (j["SIDATO"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SITIMO", obj = (j["SITIMO"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SITYPS", obj = (j["SITYPS"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SICOD", obj = (j["SICOD"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SIQTY", obj = (j["SIQTY"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SIMATH", obj = (j["SIMATH"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SINAM", obj = (j["SINAM"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SIPRC", obj = (j["SIPRC"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SITYPI", obj = (j["SITYPI"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SICOW", obj = (j["SICOW"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SIARM", obj = (j["SIARM"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SISTP", obj = (j["SISTP"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SIOTH", obj = (j["SIOTH"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SILIN", obj = (j["SILIN"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SISEM", obj = (j["SISEM"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SIPOA", obj = (j["SIPOA"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SISUP", obj = (j["SISUP"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SICDI", obj = (j["SICDI"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SIPGA", obj = (j["SIPGA"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SIDSC", obj = (j["SIDSC"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SIREP", obj = (j["SIREP"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SIANM", obj = (j["SIANM"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SILVL1", obj = (j["SILVL1"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SILVL2", obj = (j["SILVL2"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SILVL3", obj = (j["SILVL3"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SILVL4", obj = (j["SILVL4"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SILVL5", obj = (j["SILVL5"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SIRETL", obj = (j["SIRETL"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@FRZDAT", obj = (j["FRZDAT"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@LOTNOT", obj = (j["LOTNOT"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@MOD", obj = Convert.ToInt32(j["MOD"]) },
                    new Data.DBUtils.DataParameters() { parameter = "@MODSTAMP", obj = Convert.ToInt32(j["MODSTAMP"]) },
                    new Data.DBUtils.DataParameters() { parameter = "@BREEDTYPE", obj = (j["BREEDTYPE"] == null) ? "" : (j["BREEDTYPE"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@FRZYYYYMMDD", obj = (j["FRZYYYYMMDD"] == null) ? "" : (j["FRZYYYYMMDD"].ToString()) }
                 };
                Data.DBUtils.GetJSONfromSP(strProcName, spParams);
            }
            return "success";
        }

        [HttpPost]
        [Route("tblSyncInSalesNoFrz/{syncid}/{epochtime}")]
        public string tblSyncInSalesNoFrz(string syncid, string epochtime, [FromBody]JArray jsonData)
        {
            string strProcName = "spInserttblSyncInSales";
            List<Data.DBUtils.DataParameters> spParams;
            foreach (JObject j in jsonData)
            {
                spParams = new List<Data.DBUtils.DataParameters>()
                {   //JKS051617***CHANGED Convert.ToDouble to .ToString() to resolve NULL exceptions***
                    new Data.DBUtils.DataParameters() { parameter = "@PKIDSync", obj = Convert.ToInt32(syncid) },
                    new Data.DBUtils.DataParameters() { parameter = "@SIACT", obj = (j["SIACT"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SIINVL", obj = (j["SIINVL"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SIORNM", obj = (j["SIORNM"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SIINVO", obj = (j["SIINVO"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SIDATO", obj = (j["SIDATO"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SITIMO", obj = (j["SITIMO"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SITYPS", obj = (j["SITYPS"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SICOD", obj = (j["SICOD"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SIQTY", obj = (j["SIQTY"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SIMATH", obj = (j["SIMATH"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SINAM", obj = (j["SINAM"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SIPRC", obj = (j["SIPRC"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SITYPI", obj = (j["SITYPI"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SICOW", obj = (j["SICOW"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SIARM", obj = (j["SIARM"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SISTP", obj = (j["SISTP"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SIOTH", obj = (j["SIOTH"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SILIN", obj = (j["SILIN"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SISEM", obj = (j["SISEM"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SIPOA", obj = (j["SIPOA"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SISUP", obj = (j["SISUP"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SICDI", obj = (j["SICDI"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SIPGA", obj = (j["SIPGA"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SIDSC", obj = (j["SIDSC"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SIREP", obj = (j["SIREP"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SIANM", obj = (j["SIANM"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SILVL1", obj = (j["SILVL1"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SILVL2", obj = (j["SILVL2"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SILVL3", obj = (j["SILVL3"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SILVL4", obj = (j["SILVL4"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SILVL5", obj = (j["SILVL5"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@SIRETL", obj = (j["SIRETL"].ToString()) },
                    //new Data.DBUtils.DataParameters() { parameter = "@FRZDAT", obj = (j["FRZDAT"].ToString()) },
                    //new Data.DBUtils.DataParameters() { parameter = "@LOTNOT", obj = (j["LOTNOT"].ToString()) },
                    new Data.DBUtils.DataParameters() { parameter = "@MOD", obj = Convert.ToInt32(j["MOD"]) },
                    new Data.DBUtils.DataParameters() { parameter = "@MODSTAMP", obj = Convert.ToInt32(j["MODSTAMP"]) }
                 };
                Data.DBUtils.GetJSONfromSP(strProcName, spParams);
            }
            return "success";
        }


        [HttpPost]
        [Route("tblSyncInTechRelief/{syncid}/{epochtime}")]
        public string tblSyncInTechRelief(string syncid, string epochtime, [FromBody]JArray jsonData)
        {
            string strProcName = "spInserttblSyncInTechRelief";
            string MasterTech = "0";
            List<Data.DBUtils.DataParameters> spParams;
            foreach (JObject j in jsonData)
            {
                spParams = new List<Data.DBUtils.DataParameters>()
                {
                    new Data.DBUtils.DataParameters(){ parameter = "@PKIDSync", obj = Convert.ToInt32(syncid)},
                    new Data.DBUtils.DataParameters(){ parameter = "@TechIDMaster", obj = (j["TechIDMaster"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@TechIDRelief", obj = (j["TechIDRelief"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@MOD", obj = Convert.ToInt32(j["MOD"])},
                    new Data.DBUtils.DataParameters(){ parameter = "@MODSTAMP", obj = Convert.ToInt32(j["MODSTAMP"])}
                };
                Data.DBUtils.GetJSONfromSP(strProcName, spParams);
                MasterTech = j["TechIDMaster"].ToString();
            }
            if (MasterTech != "0") {
                spParams = new List<Data.DBUtils.DataParameters>()
                {
                    new Data.DBUtils.DataParameters(){ parameter = "@TechNo", obj = MasterTech},
                    new Data.DBUtils.DataParameters(){ parameter = "@SyncID", obj = syncid}
                };
                Data.DBUtils.GetJSONfromSP("spInserttblTechReliefByTech", spParams);
            }
            return "success";
        }

        [HttpPost]
        [Route("tblSyncInMileage/{syncid}/{epochtime}")]
        public string tblSyncInMileage(string syncid, string epochtime, [FromBody]JArray jsonData)
        {
            string strProcName = "spInserttblSyncInMileage";
            List<Data.DBUtils.DataParameters> spParams;
            foreach (JObject j in jsonData)
            {
                spParams = new List<Data.DBUtils.DataParameters>()
                {   //JKS052217***CHANGED Convert.ToInt32 to .ToString() to resolve NULL exceptions***
                    new Data.DBUtils.DataParameters(){ parameter = "@PKIDSync", obj = Convert.ToInt32(syncid)},
                    new Data.DBUtils.DataParameters(){ parameter = "@PKIDDroid", obj = (j["PKIDDroid"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@TECH_NO", obj = (j["TECH_NO"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@MILEAGEBEGIN", obj = (j["MILEAGEBEGIN"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@MILEAGEEND", obj = (j["MILEAGEEND"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@MILEAGEDATE", obj = (j["MILEAGEDATE"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@PERSONAL", obj = (j["PERSONAL"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@WORKEDFOR", obj = (j["WORKEDFOR"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@MOD", obj = Convert.ToInt32(j["MOD"])},
                    new Data.DBUtils.DataParameters(){ parameter = "@MODSTAMP", obj = Convert.ToInt32(j["MODSTAMP"])},
                    new Data.DBUtils.DataParameters(){ parameter = "@ROUTEMILES", obj = (j["ROUTEMILES"] == null) ? "" : (j["ROUTEMILES"].ToString())}
                };
                Data.DBUtils.GetJSONfromSP(strProcName, spParams);
            }
            return "success";
        }

        [HttpPost]
        [Route("tblSyncInTimesheet/{syncid}/{epochtime}")]
        public string tblSyncInTimesheet(string syncid, string epochtime, [FromBody]JArray jsonData)
        {
            string strProcName = "spInserttblSyncInTimesheet";
            List<Data.DBUtils.DataParameters> spParams;
            foreach (JObject j in jsonData)
            {
                spParams = new List<Data.DBUtils.DataParameters>()
                {   //JKS051617***CHANGED Convert.ToInt32 to .ToString() to resolve NULL exceptions***
                    new Data.DBUtils.DataParameters(){ parameter = "@PKIDSync", obj = Convert.ToInt32(syncid)},
                    new Data.DBUtils.DataParameters(){ parameter = "@PKIDDroid", obj = (j["PKIDDroid"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@TECH_NO", obj = (j["TECH_NO"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@TIMESHEETDATE", obj = (j["TIMESHEETDATE"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@TIMESHEETHALF", obj = (j["TIMESHEETHALF"].ToString())},
                    new Data.DBUtils.DataParameters(){ parameter = "@TIMESHEETCODE", obj = (j["TIMESHEETCODE"].ToString())},
                    // Date 12/06/2021 
                    // Commented two line below because spInserttblSyncInTimesheet procedure has not exit that parameter and due to this error generating.
                    //new Data.DBUtils.DataParameters(){ parameter = "@WORKEDFOR", obj = (j["WORKEDFOR"] == null) ? "" : (j["WORKEDFOR"].ToString()) },
                  //  new Data.DBUtils.DataParameters(){ parameter = "@SPLIT", obj = (j["SPLIT"] == null) ? "" : (j["SPLIT"].ToString()) },
                    new Data.DBUtils.DataParameters(){ parameter = "@MOD", obj = Convert.ToInt32(j["MOD"])},
                    new Data.DBUtils.DataParameters(){ parameter = "@MODSTAMP", obj = Convert.ToInt32(j["MODSTAMP"])}
                };
                Data.DBUtils.GetJSONfromSP(strProcName, spParams);
            }
            return "success";
        }

        [HttpGet()]
        [Route("TestRoute")]
        public string TestRoute()
        {
            return "Got IT!";
        }

    }
}
