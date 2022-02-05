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
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using System.Drawing;

namespace SSP_WebAPI
{
    public partial class DocsFrame : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }
        /// <summary>
        /// BtnFileUpload_Click is a click button of button which upload the file in the azure blob storage.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public async void BtnFileUpload_Click(object sender, EventArgs e)
        {
            try
            {
                if (AzureFileUpload.HasFile)
                {
                    Stream fs = AzureFileUpload.PostedFile.InputStream;
                    BinaryReader br = new BinaryReader(fs);
                    byte[] bytes = br.ReadBytes((Int32)fs.Length);
                    string fileName = AzureFileUpload.FileName;

                    //Upload file in azure 
                    string storageConnectionString = ConfigurationManager.AppSettings["AzureConnectionString"]; 

                    CloudStorageAccount storageAccount;
                    if (CloudStorageAccount.TryParse(storageConnectionString, out storageAccount))
                    {
                        // Create the CloudBlobClient that represents the 
                        // Blob storage endpoint for the storage account.
                        CloudBlobClient cloudBlobClient = storageAccount.CreateCloudBlobClient();

                        // Create a container called 'quickstartblobs' and 
                        // append a GUID value to it to make the name unique.
                        CloudBlobContainer cloudBlobContainer =
                         cloudBlobClient.GetContainerReference("premierimages");
                       
                        if (await cloudBlobContainer.CreateIfNotExistsAsync())
                        {
                            await cloudBlobContainer.SetPermissionsAsync(new BlobContainerPermissions { PublicAccess = BlobContainerPublicAccessType.Blob });
                        }

                        string guidFileName = Guid.NewGuid().ToString() + "_" + fileName;

                        // Get a reference to the blob address, then upload the file to the blob.
                        CloudBlockBlob cloudBlockBlob = cloudBlobContainer.GetBlockBlobReference(guidFileName);
                        await cloudBlockBlob.UploadFromByteArrayAsync(bytes, 0, bytes.Count());

                        LblMessage.Visible = true;
                        LblMessage.ForeColor = Color.Green;
                        LblMessage.Text = "File successfully uploaded in azure blob.";

                    }
                    else
                    {
                        LblMessage.Visible = true;
                        LblMessage.ForeColor = Color.Red;
                        LblMessage.Text = "Azure connection is not valid";
                    }
                                               
                }
                else
                {
                    LblMessage.Visible = true;
                    LblMessage.ForeColor = Color.Red;
                    LblMessage.Text = "Please upload file";
                }
            }
            catch (Exception ex)
            {
                LblMessage.Visible = true;
                LblMessage.ForeColor = Color.Red;
                LblMessage.Text = ex.Message;
            }
           
        }
    }
}