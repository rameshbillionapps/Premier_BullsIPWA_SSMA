<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Docs.aspx.cs" Inherits="SSP_WebAPI.Docs" %>

<%@ Register TagPrefix="GleamTech" Assembly="GleamTech.FileUltimate" Namespace="GleamTech.FileUltimate.AspNet.WebForms" %>
<%@ Register TagPrefix="GleamTech" Assembly="GleamTech.FileUltimate" Namespace="GleamTech.FileUltimate.AspNet.UI" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
        <div>
            <GleamTech:FileManagerControl ID="fileManager" runat="server"
                Width="95%"
                Resizable="True"
                DisplayMode="Viewport">
            </GleamTech:FileManagerControl>
            <asp:Button ID="btnFileManager" runat="server" Text="Add Document" OnClick="btnFileManager_Click" />
            <br />

             <%--<asp:FileUpload ID="AzureFileUpload" runat="server" />
           &nbsp;
            <asp:Button ID="BtnFileUpload" runat="server" OnClick="BtnFileUpload_Click" Text="Upload File" />&nbsp;
           <br /> <asp:Label ID="LblMessage" runat="server" Text="Label" Visible="False"></asp:Label>--%>
        </div>
    </form>
</body>
</html>
