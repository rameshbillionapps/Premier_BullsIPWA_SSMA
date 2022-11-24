ssp.webdb.loadDocs = function () {

    var divContent = '<section id="login-block">';
    divContent += '<div class="block-border with-margin"><form class="form block-content" name="login-form" id="login-form" >';
    divContent += '<h1>Docs</h1>';
    divContent += '<div id="docs">';
    var currUrl = window.localStorage.getItem('ssp_urldata');
    console.log('currUrl--', currUrl)
    var docUrl = (currUrl.substr(currUrl.length - 7) == 'SSPweb/') ? currUrl.replace('SSPweb/', '') : currUrl.replace('SSPweb', '');
    console.log('docUrl--', docUrl)
    divContent += '<iframe src="' + docUrl + '/Docs/Docs.aspx?type=home" onload="resize_iframe()" frameborder="0" style="overflow:hidden;height:100%;width:100%" height="100%" width="100%"></iframe>';
    divContent += '</div>';
    divContent += '</form></div></section>';


    $('#maincontent').html(divContent);
}




