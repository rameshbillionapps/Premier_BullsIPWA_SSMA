using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using GleamTech.FileUltimate;
using System.Text;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using GleamTech.FileUltimate.AspNet.UI;

namespace SSP_WebAPI.Data
{
    public class FileManagerLogEvents
    {
        public static void FileManagerExpanded(object sender, FileManagerExpandedEventArgs e)
        {
            SaveEventInfo(new Dictionary<string, object>
                {
                    {"Event Type", "Expanded"},
                    {"Path", e.Folder.FullPath},
                    {"Is Refresh", e.IsRefresh}
                },"Expanded");
        }

        public static void FileManagerListed(object sender, FileManagerListedEventArgs e)
        {
            SaveEventInfo(new Dictionary<string, object>
                {
                    {"Event Type", "Listed"},
                    {"Path", e.Folder.FullPath},
                    {"Is Refresh", e.IsRefresh}
                },"Listed");
        }

        public static void FileManagerCreated(object sender, FileManagerCreatedEventArgs e)
        {
            SaveEventInfo(new Dictionary<string, object>
                {
                    {"Event Type", "Created"},
                    {"Path", e.Folder.FullPath},
                    {"Created Folder", e.ItemName}
                },"Created");
        }

        public static void FileManagerDeleted(object sender, FileManagerDeletedEventArgs e)
        {
            SaveEventInfo(new Dictionary<string, object>
                {
                    {"Event Type", "Deleted"},
                    {"Path", e.Folder.FullPath},
                    {"Deleted Items", e.ItemNames}
                },"Deleted");
        }

        public static void FileManagerRenamed(object sender, FileManagerRenamedEventArgs e)
        {
            SaveEventInfo(new Dictionary<string, object>
                {
                    {"Event Type", "Renamed"},
                    {"Path", e.Folder.FullPath},
                    {"Item Old Name", e.ItemName},
                    {"Item New Name", e.ItemNewName}
                },"Renamed");
        }

        public static void FileManagerCopied(object sender, FileManagerCopiedEventArgs e)
        {
            SaveEventInfo(new Dictionary<string, object>
                {
                    {"Event Type", "Copied"},
                    {"From Path", e.Folder.FullPath},
                    {"Source Items", e.ItemNames},
                    {"To Path", e.TargetFolder.FullPath},
                    {"Copied Items", e.TargetItemNames}
                },"Copied");
        }

        public static void FileManagerMoved(object sender, FileManagerMovedEventArgs e)
        {
            SaveEventInfo(new Dictionary<string, object>
                {
                    {"Event Type", "Moved"},
                    {"From Path", e.Folder.FullPath},
                    {"Moved Items", e.ItemNames},
                    {"To Path", e.TargetFolder.FullPath},
                },"Moved");
        }

        public static void FileManagerCompressed(object sender, FileManagerCompressedEventArgs e)
        {
            SaveEventInfo(new Dictionary<string, object>
                {
                    {"Event Type", "Compressed"},
                    {"Path", e.Folder.FullPath},
                    {"Compressed Items", e.ItemNames},
                    {"Zip File", e.ZipFileName}
                },"Compressed");
        }

        public static void FileManagerExtracted(object sender, FileManagerExtractedEventArgs e)
        {
            SaveEventInfo(new Dictionary<string, object>
                {
                    {"Event Type", "Extracted"},
                    {"Path", e.Folder.FullPath},
                    {"Extracted to Subfolder", e.ToSubfolder},
                    {"Archive File", e.ArchiveFileName}
                },"Extracted");
        }

        public static void FileManagerUploaded(object sender, FileManagerUploadedEventArgs e)
        {
            SaveEventInfo(new Dictionary<string, object>
                {
                    {"Event Type", "Uploaded"},
                    {"Path", e.Folder.FullPath},
                    {"Upload Method", e.Method},
                    {"Uploading Files", e.Items.Select(item => new Dictionary<string, object>
                        {
                            {"Name", (item.Status == UploadItemStatus.Completed) ? item.ReceivedName : item.ReceivingName},
                            {"Content Type", (item.Status == UploadItemStatus.Completed) ? item.ReceivedContentType : item.ReceivingContentType},
                            {"Size", new ByteSizeValue((item.Status == UploadItemStatus.Completed) ? item.ReceivedSize : item.ReceivingSize).ToFileSize()},
                            {"Status", item.Status},
                            {"Status Message", (!string.IsNullOrEmpty(item.StatusMessage)) ? Regex.Replace(item.StatusMessage, @"\n+", "\n\t\t") : "<none>"}
                        })
                    },
                    {"Total Size", new ByteSizeValue(e.TotalSize).ToFileSize()},
                    {"Elapsed Time", e.ElapsedTime},
                    {"Transfer Rate", e.TransferRate}
                },"Uploaded");
        }

        public static void FileManagerDownloaded(object sender, FileManagerDownloadedEventArgs e)
        {
            SaveEventInfo(new Dictionary<string, object>
                {
                    {"Event Type", "Downloaded"},
                    {"Path", e.Folder.FullPath},
                    {"Downloaded Items", e.ItemNames},
                    {"Downloaded File Name", e.DownloadFileName},
                    {"Opened in browser", e.OpenInBrowser},
                    {"Total Size", new ByteSizeValue(e.TotalSize).ToFileSize()},
                    {"Elapsed Time", e.ElapsedTime},
                    {"Transfer Rate", e.TransferRate}
                },"Downloaded");
        }

        public static void FileManagerPreviewed(object sender, FileManagerPreviewedEventArgs e)
        {
            SaveEventInfo(new Dictionary<string, object>
                {
                    {"Event Type", "Previewed"},
                    {"Path", e.Folder.FullPath},
                    {"Previewed File", e.ItemName},
                    {"Previewer", e.PreviewerType}
                },"Previewed");
        }

        public static void FileManagerFailed(object sender, FileManagerFailedEventArgs e)
        {
            SaveEventInfo(new Dictionary<string, object>
                {
                    {"Event Type", "Failed"},
                    {"Failed Action", e.FailedActionInfo.Name},
                    {"Parameters", e.FailedActionInfo.Parameters},
                    {"Error", e.Exception.ToString().Replace("\n", "\n\t")},
                },"Failed");
        }

        private static void SaveEventInfo(Dictionary<string, object> eventInfo, string strAction)
        {
            var resultText = new StringBuilder();
            foreach (var kvp in eventInfo)
            {
                resultText.Append(kvp.Key);
                resultText.Append(": \n");

                var enumerable = kvp.Value as IEnumerable;
                if (enumerable is string)
                    enumerable = null;
                if (enumerable != null)
                    foreach (var item in enumerable)
                    {
                        var subDictionary = item as Dictionary<string, object>;
                        if (subDictionary != null)
                            foreach (var subKvp in subDictionary)
                            {
                                resultText.Append("\t");
                                resultText.Append(subKvp.Key);
                                resultText.Append(": ");
                                resultText.Append(subKvp.Value);
                                resultText.Append("\n");
                            }
                        else
                        {
                            resultText.Append("\t");
                            resultText.Append(item);
                        }
                        resultText.Append("\n");
                    }
                else
                {
                    resultText.Append("\t");
                    resultText.Append(kvp.Value);
                    resultText.Append("\n");
                }
            }

            List<Data.DBUtils.DataParameters> spParams = new List<Data.DBUtils.DataParameters>()
            {
                new Data.DBUtils.DataParameters(){ parameter = "@Type", obj = HttpContext.Current.Session["FMErrorType"]},
                new Data.DBUtils.DataParameters(){ parameter = "@FileID", obj = HttpContext.Current.Session["FMErrorPKID" + HttpContext.Current.Session["FMErrorType"]]},
                new Data.DBUtils.DataParameters(){ parameter = "@Action", obj = strAction }, 
                new Data.DBUtils.DataParameters(){ parameter = "@LogonID", obj = HttpContext.Current.Session["masterUserName"]},
                new Data.DBUtils.DataParameters(){ parameter = "@EventInfo", obj = resultText.ToString()},
                new Data.DBUtils.DataParameters(){ parameter = "@TIMESTAMP", obj = DateTime.Now},
            };
            Data.DBUtils.GetJSONfromSP("[NomadUser].[splogFileManager]", spParams);
        }

    }
}


