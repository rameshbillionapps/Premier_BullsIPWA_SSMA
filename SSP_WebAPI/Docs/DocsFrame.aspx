<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="DocsFrame.aspx.cs" Inherits="SSP_WebAPI.DocsFrame" Async="true" %>
<%@ Register TagPrefix="GleamTech" Assembly="GleamTech.FileUltimate" Namespace="GleamTech.FileUltimate.AspNet.WebForms" %>
<%@ Register TagPrefix="GleamTech" Assembly="GleamTech.FileUltimate" Namespace="GleamTech.FileUltimate.AspNet.UI" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<script>
function resize_iframe() {

    var height = window.innerHeight;
    if (document.body.clientHeight) {
        height = document.body.clientHeight;//IE
    }
    //resize the iframe according to the size of the
    //window (all these should be on the same line)
    document.getElementById("docs").style.height = parseInt(height - document.getElementById("docs").offsetTop - 8) + "px";
}
</script>
<body>
    <form id="form1" runat="server">
        <div>
            <%--        <iframe id="docs" src="Docs.aspx?type=home" onload="resize_iframe()" frameborder="0" style="overflow:hidden;height:100%;width:100%" height="100%" width="100%"></iframe>';--%><%--<iframe src="Docs.aspx?type=home" style="position:fixed; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999;">
    Your browser doesn't support iframes
</iframe>--%>
            <asp:FileUpload ID="AzureFileUpload" runat="server" />
           &nbsp;
            <asp:Button ID="BtnFileUpload" runat="server" OnClick="BtnFileUpload_Click" Text="Upload File" />&nbsp;
            <asp:Label ID="LblMessage" runat="server" Text="Label" Visible="False"></asp:Label>
        </div>
        
       &nbsp;
    </form>
</body>
</html>


Search home
