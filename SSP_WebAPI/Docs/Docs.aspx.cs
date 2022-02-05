using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using GleamTech.FileUltimate;
using System.IO;
using System.Configuration;
using SSP_WebAPI.Data;
using GleamTech.FileUltimate.AspNet;
using GleamTech.FileUltimate.AspNet.UI;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using System.Drawing;
using GleamTech.FileSystems.AzureBlob;

namespace SSP_WebAPI
{
    public partial class Docs : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        
        {
            if (!IsPostBack)
            {
                if (!String.IsNullOrEmpty(Page.Request.QueryString["pkid"]) || !String.IsNullOrEmpty(Page.Request.QueryString["type"]))
                {
                    LoadFileManager();
                }
                // LoadAzureFileManager();
            }

        }

        protected void LoadFileManager()
        {
            if (Directory.Exists(ConfigurationManager.AppSettings["SSPFileManagerPath_" + Page.Request.QueryString["type"]] + Page.Request.QueryString["pkid"]) || (Page.Request.QueryString["type"] == "home" && Directory.Exists(ConfigurationManager.AppSettings["SSPFileManagerPath_home"])) )
            {
                btnFileManager.Visible = false;
                fileManager.Visible = true;
                //fileManager.Width = Unit.Percentage(100) ' or new Unit(100, UnitType.Percentage) 
                //fileManager.Height = 600 'Default unit is pixels. 
                fileManager.DisplayLanguage = "en";
                fileManager.ShowFoldersPane = false;

                //Create a root folder and add it to the control 
                dynamic rootFolder1 = new FileManagerRootFolder();
                rootFolder1.Name = (Page.Request.QueryString["type"] == "home") ? "home" : Page.Request.QueryString["pkid"];
                rootFolder1.Location = (Page.Request.QueryString["type"] == "home") ? ConfigurationManager.AppSettings["SSPFileManagerPath_home"] : ConfigurationManager.AppSettings["SSPFileManagerPath_" + Page.Request.QueryString["type"]] + Page.Request.QueryString["pkid"];
                fileManager.RootFolders.Add(rootFolder1);
                dynamic accessControl1 = new FileManagerAccessControl();
                accessControl1.Path = "\\";
                //accessControl1.AllowedPermissions = FileManagerPermissions.Full;
                accessControl1.AllowedPermissions = FileManagerPermissions.ReadOnly | FileManagerPermissions.Upload;
                //accessControl1.DeniedPermissions = FileManagerPermissions.Delete | FileManagerPermissions.Create | FileManagerPermissions.Cut;
                accessControl1.DeniedPermissions = FileManagerPermissions.Copy;
                rootFolder1.AccessControls.Add(accessControl1);

                //Session["CurrentFileManagerType"] = "Item";
                //Session["CurrentFileManagerID"] = this.Page.Request.QueryString["pkid"];
                ////fileManager.Created += FileManagerLogEvents.FileManagerCreated;
                ////fileManager.Deleted += FileManagerLogEvents.FileManagerDeleted;
                ////fileManager.Renamed += FileManagerLogEvents.FileManagerRenamed;
                ////fileManager.Moved += FileManagerLogEvents.FileManagerMoved;
                ////fileManager.Compressed += FileManagerLogEvents.FileManagerCompressed;
                ////fileManager.Extracted += FileManagerLogEvents.FileManagerExtracted;
                ////fileManager.Uploaded += FileManagerLogEvents.FileManagerUploaded;
                ////fileManager.Failed += FileManagerLogEvents.FileManagerFailed;

                //'Create another root folder and add it to the control 
                //'This time use object initializers 
                //Dim rootFolder2 = New FileManagerRootFolder() With {
                //    .Name = "Root Folder 2",
                //    .Location = "~/App_Data/RootFolder2"
                //}
                //rootFolder2.AccessControls.Add(New FileManagerAccessControl() With {
                //    .Path = "\",
                //    .AllowedPermissions = FileManagerPermissions.ListSubfolders Or FileManagerPermissions.ListFiles Or FileManagerPermissions.Download Or FileManagerPermissions.Upload,
                //    .AllowedFileTypes = New FileTypeSet(New String() {"*.jpg", "*.gif"}),
                //    .Quota = New ByteSizeValue(2, ByteSizeUnit.MB)
                //})
                //' or .AllowedFileTypes = FileTypeSet.Parse("*.jpg|*.gif") 
                //' or .Quota = ByteSizeValue.Parse("2 MB") 
                //rootFolder2.AccessControls.Add(New FileManagerAccessControl() With {
                //    .Path = "\Subfolder1",
                //    .AllowedPermissions = FileManagerPermissions.Full,
                //    .DeniedPermissions = FileManagerPermissions.Download,
                //    .DeniedFileTypes = New FileTypeSet(New String() {"*.exe"})
                //})
                //'or .DeniedFileTypes = FileTypeSet.Parse("*.exe") 
                //fileManager.RootFolders.Add(rootFolder2)
            }
            else
            {
                btnFileManager.Visible = true;
                fileManager.Visible = false;
            }
        }

        protected void btnFileManager_Click(object sender, EventArgs e)
        {

            Directory.CreateDirectory(ConfigurationManager.AppSettings["SSPFileManagerPath_" + Page.Request.QueryString["type"]] + Page.Request.QueryString["pkid"]);
            LoadFileManager();
           // LoadAzureFileManager();
        }


        //public async void BtnFileUpload_Click(object sender, EventArgs e)
        //{
        //    try
        //    {
        //        if (AzureFileUpload.HasFile)
        //        {
        //            Stream fs = AzureFileUpload.PostedFile.InputStream;
        //            BinaryReader br = new BinaryReader(fs);
        //            byte[] bytes = br.ReadBytes((Int32)fs.Length);
        //            string fileName = AzureFileUpload.FileName;

        //            //Upload file in azure 
        //            string storageConnectionString = ConfigurationManager.AppSettings["AzureConnectionString"];

        //            CloudStorageAccount storageAccount;
        //            if (CloudStorageAccount.TryParse(storageConnectionString, out storageAccount))
        //            {
        //                // Create the CloudBlobClient that represents the 
        //                // Blob storage endpoint for the storage account.
        //                CloudBlobClient cloudBlobClient = storageAccount.CreateCloudBlobClient();

        //                // Create a container called 'quickstartblobs' and 
        //                // append a GUID value to it to make the name unique.
        //                CloudBlobContainer cloudBlobContainer =
        //                 cloudBlobClient.GetContainerReference("premierimages");

        //                if (await cloudBlobContainer.CreateIfNotExistsAsync())
        //                {
        //                    await cloudBlobContainer.SetPermissionsAsync(new BlobContainerPermissions { PublicAccess = BlobContainerPublicAccessType.Blob });
        //                }

        //                string guidFileName = Guid.NewGuid().ToString() + "_" + fileName;

        //                // Get a reference to the blob address, then upload the file to the blob.
        //                CloudBlockBlob cloudBlockBlob = cloudBlobContainer.GetBlockBlobReference(guidFileName);
        //                await cloudBlockBlob.UploadFromByteArrayAsync(bytes, 0, bytes.Count());

        //                LblMessage.Visible = true;
        //                LblMessage.ForeColor = Color.Green;
        //                LblMessage.Text = "File successfully uploaded in azure blob.";

        //            }
        //            else
        //            {
        //                LblMessage.Visible = true;
        //                LblMessage.ForeColor = Color.Red;
        //                LblMessage.Text = "Azure connection is not valid";
        //            }

        //        }
        //        else
        //        {
        //            LblMessage.Visible = true;
        //            LblMessage.ForeColor = Color.Red;
        //            LblMessage.Text = "Please upload file";
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        LblMessage.Visible = true;
        //        LblMessage.ForeColor = Color.Red;
        //        LblMessage.Text = ex.Message;
        //    }

        //}



        /// <summary>
        /// This LoadAzureFileManager will load the azure blob storage file manager.
        /// </summary>
        protected void LoadAzureFileManager()
        {

            btnFileManager.Visible = false;
            fileManager.Visible = true;
            //fileManager.Width = Unit.Percentage(100) ' or new Unit(100, UnitType.Percentage) 
            //fileManager.Height = 600 'Default unit is pixels. 
            fileManager.DisplayLanguage = "en";
            fileManager.ShowFoldersPane = false;

            string storageConnectionString = ConfigurationManager.AppSettings["AzureConnectionString"];

            //Create a root folder and add it to the control 
            //dynamic rootFolder1 = new FileManagerRootFolder();
            //rootFolder1.Name = (Page.Request.QueryString["type"] == "home") ? "home" : Page.Request.QueryString["pkid"];
            //rootFolder1.Location = (Page.Request.QueryString["type"] == "home") ? ConfigurationManager.AppSettings["SSPFileManagerPath_home"] : ConfigurationManager.AppSettings["SSPFileManagerPath_" + Page.Request.QueryString["type"]] + Page.Request.QueryString["pkid"];
            dynamic rootFolder1 = new FileManagerRootFolder
            {
                Name = ConfigurationManager.AppSettings["FileManagerRootFolderName"],

                Location = new AzureBlobLocation
                {
                    //Leave path empty to connect to the root of the container. 
                    //For subfolders, path should be specified as a relative path
                    //without leading slash (eg. "some/folder")
                    Path = "",

                    //Get these values from your Azure Portal (Storage Account -> Access Keys -> Connection String)

                    Container = ConfigurationManager.AppSettings["FileManagerRootContainerName"],
                    AccountName = ConfigurationManager.AppSettings["FileManagerRootAccountName"],
                    AccountKey = ConfigurationManager.AppSettings["FileManagerRootAccountKey"],

                    //Optional:
                    //These are the default values, usually you don't need to set/change them
                    UseHttps = true,
                    // DefaultEndpointsProtocol= "https",
                    EndpointSuffix = ConfigurationManager.AppSettings["FileManagerRootEndpointSuffix"],
                    Type = "Physical"
                }
            };
            fileManager.RootFolders.Add(rootFolder1);
            dynamic accessControl1 = new FileManagerAccessControl();
            accessControl1.Path = "\\";
            //accessControl1.AllowedPermissions = FileManagerPermissions.Full;
            accessControl1.AllowedPermissions = FileManagerPermissions.ReadOnly | FileManagerPermissions.Upload;
            //accessControl1.DeniedPermissions = FileManagerPermissions.Delete | FileManagerPermissions.Create | FileManagerPermissions.Cut;
            accessControl1.DeniedPermissions = FileManagerPermissions.Copy;
            rootFolder1.AccessControls.Add(accessControl1);

        }





    }
}