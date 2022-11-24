var CUSTPAGING = 25;
var sspversion = '5.00pwa';

/*JKS100219***4.24pwa->CHANGED save sync file name format.  FIXED app Backups.  CHANGED app name and associated functions from SSP to Bulls-I.*/
/*JKS092519***4.23pwa->FIXED save sync items to file button.  CS ONLY - REMOVED "undefined" field from Customer Order PDF.***
/*JKS092419***4.23->CHANGED 9.99 to 0.01 and ADDED +|| ($('.breeddisc.green-keyword').html() == "Special %")+ to allow Cust % and Special % to reset to the original bullprice when selected.*/
/*JKS092419***4.23->ADDED a space before and after PCP to fix the discount button.*/
/*JKS072219 ***4.22 ->Changed "SSP Version" to "Bulls-I Version".  PSS ONLY: Changed Customer Header from SESS to PSS.*/
/*JKS071519***4.22->PSS ONLY: Changed LAST PAYMENT to CURRENT MONTH PAYMENT.*/
/*JKS070719***4.21->SSMA ONLY: Re-Branded Customer heading from PSSS to SSMA.*/
/*JKS061719***4.20->PSSS ONLY: Re-branded Prairie State/Select Sires to Select Sires MidAmerica.  Changed the Name and Logo, and added another address and Phone number.*/
/*JKS050919***4.19->MNSS ONLY: Made Supply tax changes for MN and ND Customers.  SSC ONLY: Changed Invoice and transfer email from: ssci@selectsires.ca to: ssgi@selectgen.com.*/
/*JKS042919***4.18->Changes for CS ONLY: Removed Sales Code, and Previous Items in Tech mode.  Changed invoice address info on the Phone line.*/
/*JKS041819***4.17->IF ELSE to set CS ssp_projectid to ECSS for case values*/
/*JKS041819***4.17->Removed Switch for ECSS/CS on Customer Orders*/
/*JKS041119***4.17->Re-branded East Central Select Sires to CentralStar*/
/*JKS032019***4.16->Re-branded Southeast Select Sires to Premier Select Sires.*/
/*JKS031919***4.15->Re-branded Select Sire Power to Premier Select Sires.*/
/*RP030719***4.14->Modified SSC label to include the note instead of the freeze date.*/
/*JKS030619***4.13->Removed Freeze Date from SSC Labels when Freeze Code is switched off in the Advanced Settings.*/
/*JKS030619***4.12->Fixed PCP button on Bull Orders from display 3 "& nbsp;" before and after "PCP".*/
/*RP030519***4.12->Removed Freeze Date button from Bull Orders when Freeze Code is switched off in the Advanced Settings.*/
/*RP022119***4.11->Placed tech toggle switch and removed PCP on order for mnss...Added Labor and Returned Semen to invoice.*/
/*JKS103118***4.10->ADDED the following to Reports for SESS Semen Sorted Order List: || (window.localStorage.getItem("ssp_projectid") == 'sess')*/
/*RP102318***4.09->Added a check for null before formatting frzyyyymmdd in the orderPDF function*/
/*RP102318***4.09->Changed loadOrderItems function freeze check from ("ssp_projectid") == "ssc" to ("ssp_freeze") == 1*/
/*JKS101518***4.08->CHANGED THIS formatDate(rs[i].FRZYYYYMMDD) TO formatYYYYMMDDtoMDY(rs[i].FRZYYYYMMDD)*/
/*JKS101518***4.08->Added the following to not display FRZ with 0 and NULL values in pending orders: && rs[i].FRZYYYYMMDD != "0" && rs[i].FRZYYYYMMDD != "null"*/
/*RP100918***4.08-> replaced epoch frzdat with FRZYYYYMMDD
/*JKS100418***4.07->Added the following to include pending transfers to the BackUp Items function.*** OR SITYPS = "T"*/
/*JKS100418***4.07->Added Transfer Quantity Total to backupPDF.*/
/*JKS100418***4.07->Added if (rs[i].SITYPS != "T") for pending transfers in the backupPDF*/
/*JKS100418***4.07->Added || rs[i].SITYPS != "T" for pending transfers in the backupPDF*/
/*JKS100418***4.07->Added if (rs[i].SITYPS != "T") {} to include pending transfers to the Backup Items for Grand Total*/
/*JKS100318***4.06->Added Transfer Quantity Total to snycPDF.*/
/*JKS092618***4.06->Added if (rs[i].SITYPS != "T")*/
/*JKS092018***4.06->Added if (rs[i].SITYPS != "T") {} to include pending transfers to the "save sync items to file" Button on the SYNC Page for Grand Total*/
/*JKS091918***4.06->Added the following to include pending transfers to the "save sync items to file" Button on the SYNC Page*** || rs[i].SITYPS != "T"*/
/*JKS091018***4.06->Added the following to include pending transfers to the "save sync items to file" Button on the SYNC Page*** OR SITYPS = "T"*/
/*JKS083018***4.05->Made additional changes to the SQL function for the Sorted Bull Inventory Report for unaccounted ACTIVE=L items or Bulls that appear on a price list but aren't included with Amanda's Semen Order List*/
/*JKS082818***4.04->Made a change to the SQL function for the Sorted Bull Inventory Report to fix sorting error on new list*/
/*JKS080818->4.03***Auto Fill Search switch for all input box code was updated*/
/*JKS080818->4.03***SESS Fall Credit rate changed from .50 to .60*/
/*JKS071918*v4.02->Made a change to the SQL function for the Sorted Bull Inventory Report to fix shortage in list*/
/*JKS051718***v4.01->Added Phone Number edit for ECSS only*/
//JKS040218***v4.00->Addidtional work-on BeefOnBeef or BeefOnDairy or Unknown breedings.***
//JKS032918***v4.00->BeefOnBeef or BeefOnDairy or Unknown breedings.***         
//JKS032818***v4.00->BEGAN Check boxes for Bull on Bull or Bull on Dairy breedings.***
//JKS030718***3.100.41->REMOVED SECTION for line of code below to RESOLVE NaN/NaN/NaN ERROR for TIMESTAMP data after WebAPI and Date function changes.***
//JKS030718***3.100.41->ADDED LINE to RESOLVE NaN/NaN/NaN ERROR for TIMESTAMP data after WebAPI and Date function changes for co-ops now included with SSP.***
//JKS022818***3.100.40->Changed icon link spelling from "modify" to "Modify"***
//JKS022718***3.100.39->Removed Tech Relief button in Settings for SSC***
//JKS022718***3.100.39->Edited Docs icon to center***
//JKS022718***3.100.39->Changed Splashscreen delay from 10 to 3 seconds***
//JKS022618***3.100.39->IF ELSE for SSC to not display Tech switch, Tech Relief button, and Tech Service Price in Settings***
//RP022018***3.100.38->Added functionality for Docs. Still need to work on the URL for the production APK...***
//JKS021218***3.100.37->Removed all 020518 Default Nitro Value code, which was replaced by SQL statement CHANGES in Reports and Home to check for Customer Nitro or Default Nitro values***
//JKS021218***3.100.37->Changed Displayed value from window.localStorage.getItem("ssp_nitrodays") to "" in Customer Info***
//JKS020518***3.100.37->ADDED IF ELSE Get Default Nitro Values to Reports***
//JKS020518***3.100.37->ADDED Get Default Nitro Values to Reports***
//JKS020518***3.100.37->ADDED Default Nitro Transactions to Home***
//JKS020518***3.100.37->ADDED an IF ELSE to check for null or blank Nitro values to Home***
//JKS011818***3.100.37->Added or '' to NitroDays check in Customer***
//JKS011818***3.100.37->Restored NitroDays in db for Settings***
//JKS011718***3.100.37->Restored NitroDays in Settings***
//RP011718***3.100.37->Added quotes around the rep in the analysis if only my sales is checked***
//JKS122117***3.100.36->Fixed Pie-Chart icon for Analysis***
//JKS122117***3.100.36->Added a check for NULL NitroDays***
//JKS122117***3.100.36->Added a check for NULL CustomerNotes***
//RP121917***3.100.36->Made Changes to Analysis***
//RP121917***3.100.36->Created a web db JOIN between SIREP and TRANSFERLISTNAME
//JKS121817***3.100.36->ADDED USERNAME to Transfer List for a From Name***
//JKS121817***3.100.36->ADDED if (type == 'B') else for Beef setSalesItemBull***
//JKS121817***3.100.36->ADDED if (window.localStorage.getItem("type") == 'B') else for Beef resetSalesItemBull***
//JKS121817***3.100.36->ADDED if (window.localStorage.getItem("type") == 'B') else for Beef loadOrderContentBlock***
//JKS111517***3.100.36->Added IfElse statement to ONLY allow for TechIdMaster to Edit.***
//JKS110817***3.100.36->NitroDays Moved to Customer Info, Changes for Nitro Expired Report...Replaced  ' + daysAgo30 + ' with  strftime("%s","now") - (60 * 60 * 24 * tblCustomers.SP7) and Removed  var daysAgo30 in ssp_db.js***
//RP103117***3.100.36->Updated SQL statement on ssp_Home.***
//JKS102517***3.100.36->Moved NitroDays to Customer Info from settings***
//JKS101817***3.100.36->Added SP7=custnitrodays to table values.***
//JKS101817***3.100.36->Customer Nitrogen Days Edit Function***
//JKS101817***3.100.36->Customer Nitrogen Days Save Edit Function***
//JKS101817***3.100.36->Added Nitrogen Days to Customer Accounts.***
//JKS101817***3.100.36->Added Nitrogen Days to Customer Accounts.***
//JKS101817***3.100.36->Added custnitrodays text field to New Customers.***
//JKS081017***3.100.35->Added an IF ELSE to RESOLVE NaN/NaN/NaN ERROR for varied TIMESTAMP data between Co-ops in Sync History Reports***
//JKS080817***3.100.34->Changed Date/Time format to RESOLVE NaN/NaN/NaN ERROR***
//JKS072617***3.100.33->ADDED else if to change Beef breakdown pricing to be Retail/50 QTY/200 QTY***
//JKSRP072517***3.100.33->ADDED Bull Inv Order Sorted in the reports list according to the Semen Order Form***
//JKS071417***3.100.32->PSSS fix: ADDED if statement to remove "undefined" and NULL "call:" results***
//JKS071017***3.100.31->ADDED ( !== "0" ? ' ' : ) to check for FRZDAT values to FIX incorrect FRZDAT in Supply Inventory Info*** in ssp_invorder.js***
//JKS070717***v3.100.31->Fixed Supply Inventory counts, but broke removal of invalid Freeze Dates in previous Supply sales, and previous Bull sales count in the Inventory.***
//JKS070617***3.100.31->FIXED Bull Inventory Info by changing item.FRZDAT to ((!item.FRZDAT) ? 0 : item.FRZDAT)***
//JKS062717***3.100.30->Changed LOTNOT to (item.LOTNOT == null ? '' : item.LOTNOT) and FRZDAT to (item.FRZDAT == null ? '' : item.FRZDAT) TO RESOLVE "undefined" in both old and new db lists***
//JKS062717***3.100.30->ADDED (&& (rs[i].FRZDAT) != "undefined") {} TO REMOVE NaN in Bull List and prevent default date***
//JKS062317***Changed LOTNOT to (item.LOTNOT == 'undefinded' ? '' : item.LOTNOT) and FRZDAT to (item.FRZDAT == 'undefinded' ? '' : item.FRZDAT)***
//JKS062217***Changed LOTNOT to ((item.LOTNOT = 'undefinded' || 'null') ? '' : item.LOTNOT) and FRZDAT to ((item.FRZDAT = 'undefinded' || 'null') ? '' : item.FRZDAT)***
//JKS062017***3.100.29->Fixed VA zipcode error replaced six-digit number with 24151 in Orders and Transfers***
//***3.100.28->Changes to fix Bull Inv Report...Splash screen added...all plugins removed and Installed***
//RP053017***3.100.27->SSC Changes to NOT seperate BullInv Report by Freeze Dates.***
//JKS051117***3.100.26->Changes to getServerDataBulls Function removed tblAS400BullsNoFrz ONLY uses tblAS400Bulls***
//JKS042817***Replaced myYITS with SSP_BullsI to debug on PC***
//JKS033117***3.100.25->Changes made to ssp_db.js to work with SSP new Bulls-I app, SQL db, and web services.*** 
//JKS033117***Removed tblAS400SalesNoFrz***//JKS033017***
//JKS033117***Changed FRZDAT value...Removed ((!item.FRZDAT) ? '0' : item.FRZDAT)***
//JKS033117***Begin...Removed tblSyncInSalesNoFrz***
//JKS033017***3.100.24->Begin...ADDED tblAS400SalesNoFrz to function like v3.100.20 for SSP***
//JKS033017***Changed FRZDAT value to function like v3.100.20 for SSP...added ((!item.FRZDAT) ? '0' : item.FRZDAT)***
//JKS033017***Begin...ADDED tblSyncInSalesNoFrz to function like v3.100.20 for SSP***
//JKS120616***UNDID all changes to restore back to v3.100.23 status next build is v3.100.24***
//JKS112216***Added MNSS to header...Added taxes to PDF***
//RP112216***Fixed taxable Supplies and added Nitro taxable for ND***
//JKS112116***Added a check if MNSS taxable in ssp_ordes.js***
//JKS111716***Changes in ssp_db.js: Removed tblAS400SalesNoFrz...Removed tblSyncInSalesNoFrz...Changed FRZDAT value, Removed ((!item.FRZDAT) ? '0' : item.FRZDAT)***
//RP111716***Fixed leading zeros for bull codes for mnss. Changed the insert of the GetServerDataBull.***
//JKS111616***Added FRZDAT to Debug.***
//RP111516***LOTNOT sync changes for all, except SSP.***
//RP111516 ***Fixed Order Notes syncing for mnss, inventory titles, customer delete only if mod = 1.
//JKS111416***Added LOTNOT to Debug.***
//JKS110916***MNSS changes to Order PDF Phone#, Email, Invoice# to display as Order#, and Bull Code to be Item#...Removed PGA check box for MNSS.***
//JKS110916***Changed MNSS Order PDF Phone# to 320-259-6680 & Email to mnselect@mnss.coop.***
//JKS110916***Begin Added IfElse to MNSS Order PDF for Invoice# to display Order# as Invoice#.***
//JKS110916***Begin Added IfElse to MNSS Order PDF for Bull Code to be Item#.***
//JKS110916***Begin IF Removed PGA check box for MNSS.***

var delay = (function () {
    var timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();

var formatDate = function (datenum) {
    var myDate = new Date((datenum) * 1000);
    return (myDate.getMonth() + 1) + '/' + myDate.getDate() + '/' + myDate.getFullYear();
};

var formatDateYYYYMMDD = function (datenum) {
    var myDate = new Date((datenum) * 1000);
    return myDate.getFullYear() + (myDate.getMonth() + 1) + myDate.getDate();
};

var formatEpoch = function (strDate) {
    var dateArray = strDate.split("/");
    var yyyy = dateArray[2].trim();
    if (yyyy.length == 2) yyyy = (yyyy < 90) ? '20' + yyyy : '19' + yyyy;
    var newdate = new Date(yyyy, dateArray[0] - 1, dateArray[1]);
    return newdate.getTime() / 1000;
};

var formatEpochAdjust = function (strDate) {
    var dateArray = strDate.split("/");
    var yyyy = dateArray[2].trim();
    if (yyyy.length == 2) yyyy = (yyyy < 90) ? '20' + yyyy : '19' + yyyy;
    var newdate = new Date(yyyy, dateArray[0] - 1, dateArray[1]);
    return ((newdate.getTime() / 1000) + 68400);
};

var formatEpochAdjustNew = function (strDate) {
    var dateArray = strDate.split("/");
    var yyyy = dateArray[2].trim();
    if (yyyy.length == 2) yyyy = (yyyy < 90) ? '20' + yyyy : '19' + yyyy;
    var newdate = new Date(yyyy, dateArray[0] - 1, dateArray[1]);
    return ((newdate.getTime() / 1000) + 37800);
};

var formatYYYYMMDDtoMDY = function (strYYYYMMDD) {
    return strYYYYMMDD.substring(4, 6) + '/' + strYYYYMMDD.substring(6, 8) + '/' + strYYYYMMDD.substring(0, 4);
}

var formatMDYPad = function (strMDY) {
    return pad(strMDY.split('/')[0], 2) + '/' + pad(strMDY.split('/')[1], 2) + '/' + strMDY.split('/')[2];
}

var isValidDateMDY = function (dateString) {
    // First check for the pattern
    if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString))
        return false;

    // Parse the date parts to integers
    var parts = dateString.split("/");
    var day = parseInt(parts[1], 10);
    var month = parseInt(parts[0], 10);
    var year = parseInt(parts[2], 10);

    // Check the ranges of month and year
    if (year < 1000 || year > 3000 || month == 0 || month > 12)
        return false;

    var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Adjust for leap years
    if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29;

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
};

var pad = function (str, max) {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
}

var format120Date = function (dollardate) {
    if (dollardate == '0') {
        return 'None.'
    } else {
        var strDate = '' + dollardate;
        strDate = (strDate.split('.')[1].length == 1) ? strDate + '0' : strDate;
        return ((strDate.split('.')[0].length == 3) ? '0' + strDate.split('.')[0].substr(0, 1) : strDate.split('.')[0].trim().substr(0, 2)) + '/' + strDate.split('.')[0].substr(-2) + '/' + strDate.split('.')[1].trim();
    }
};

var sspValidateDate = function (datenum) {
    return (datenum < 0 || datenum > 2051286596) ? false : true;
};

var sspNaN = function (num) {
    if (Object.prototype.toString.call(num) != '[object Number]') {
        if (isNaN(num) || parseFloat(num) == "NaN" || num.indexOf('--') != -1) {
            return true;
        }
        else {
            return false;
        }
    } else {
        return false;
    }
};

function resize_iframe() {

    var height = window.innerWidth;//Firefox
    //if (document.body.clientHeight) {
    //    height = document.body.clientHeight;//IE
    //}
    //resize the iframe according to the size of the
    //window (all these should be on the same line)
    document.getElementById("docs").style.height = window.innerHeight - 120 + "px";
    if (document.getElementById("login-form"))
        document.getElementById("login-form").style.height = window.innerHeight - 80 + "px";
}

var pageURL = $(location).attr('href');
ssp.webdb.loadHome = function () {


    var homeHeader = 'Premier Select Sires';
    switch (window.localStorage.getItem("ssp_projectid")) {
        case 'sess':
            homeHeader = 'Premier Select Sires';
            break;
        case 'ssc':
            homeHeader = 'Select Sires Canada';
            break;
        case 'ps':
            homeHeader = 'Select Sires MidAmerica';
            break;
        case 'ecss':
            homeHeader = 'CentralStar';
            break;
        case 'mnss':
            homeHeader = 'MN Select Sires';
            break;
    }

    var divContent = "<header id='mainheader'><h1>" + homeHeader + "</h1></header>";
    divContent += "<a href='javascript:void(0);' onclick='ssp.webdb.loadHome();' id='home'>Home</a>";
    $('#headercontent').html(divContent);

    divContent = "<div id='status-bar'>";
    divContent += "<ul id='status-infos'>";
    divContent += "<li><div id='nitromsg'></div></li>";
    divContent += "<li><a href='#' class='button' title='sync' onclick='ssp.webdb.loadSync();'><img src='img/arrowCircle.png' width='16' height='16'> <strong></strong></a></li>";
    divContent += "</ul>";
    divContent += "</div>";
    divContent += "<div id='header-shadow'></div>";
    divContent += "<article>";
    divContent += "<ul class='shortcuts-list'>";
    divContent += "<li><a href='javascript:void(0);' onClick='ssp.webdb.getCustomersFav();'>";
    divContent += "<img src='img/group.png'  > Customers";
    divContent += "</a></li>";
    divContent += "<li><a href='javascript:void(0);' onClick='ssp.webdb.getBulls(\"%\");'>";
    divContent += "<img src='img/tractor.png' > Bulls";
    divContent += "</a></li>";
    divContent += "<li><a href='javascript:void(0);' onClick='ssp.webdb.getSupplies(\"%\");'>";
    divContent += "<img src='img/eyedropper.png' > Supplies";
    divContent += "</a></li>";/*
    divContent += "<li><a href='javascript:void(0);' onClick='ssp.webdb.getMileage();'>";
    divContent += "<img src='img/dashboard.png' > Mileage";
    divContent += "</a></li>";*/
    divContent += "<li><a href='javascript:void(0);' onClick='ssp.webdb.getTimesheet();'>";
    divContent += "<img src='img/TimeMiles.png' > Time & Miles";
    divContent += "</a></li>";
    divContent += "<li><a href='javascript:void(0);' onclick='ssp.webdb.getTechTransfer();'>";
    divContent += "<img src='img/transfer.png' > Transfers </a></li>";
    divContent += "<li><a href='javascript:void(0);' onclick='ssp.webdb.loadReports();'>";
    divContent += "<img src='img/reports.png' > Reports </a></li>";
    divContent += "<li><a href='javascript:void(0);' onclick='ssp.webdb.loadSettings();'>";
    divContent += "<img src='img/settings.png' > Settings </a></li>";
    divContent += "<li><a href='javascript:void(0);' onclick='ssp.webdb.getAnalysis();'>";
    divContent += "<img src='img/PieChart.png' > Analysis </a></li>";
    divContent += "<li><a href='javascript:void(0);' onclick='ssp.webdb.loadDocs();'>";
    divContent += "<img src='img/Modify.png' > Docs </a></li>";
    divContent += "</ul>";
    var imgLocation = 'img/ssplogotrans.png';
    switch (window.localStorage.getItem("ssp_projectid")) {
        case 'sess':
            imgLocation = 'img/sesslogohome.gif';
            break;
        case 'ssc':
            imgLocation = 'img/selctsrescanadahome.png';
            break;
        case 'ps':
            imgLocation = 'img/pshomelogo.png';
            break;
        case 'ecss':
            imgLocation = 'img/echomelogo.png';
            break;
        case 'mnss':
            imgLocation = 'img/MNSShome.png';   //JKS092016***Resized Home Logo to resolve display issue for MNSS.***
            break;
    }
    divContent += "<p class='message info align-center'><img src='" + imgLocation + "' alt='Bulls-I' /></p>";
    divContent += "</article>";
    $('#maincontent').html(divContent);
    ssp.webdb.backupItems();

    //var daysAgo30 = Math.round(new Date().getTime() / 1000) - (60 * 60 * 24 * window.localStorage.getItem("ssp_nitrodays"));  //JKS020518***3.100.37->ADDED Default Nitro Transactions***//JKS102517***Moved NitroDays to Customer Info***
    ssp.webdb.db.transaction(function (tx) {
        //tx.executeSql('SELECT tblCustomers.ACCT_NO,tblCustomers.NAME,max(tblSales.SIDATO) AS NITROSALE FROM tblCustomers LEFT JOIN tblSales ON tblCustomers.ACCT_NO = tblSales.SIACT WHERE tblSales.SITYPS = "N" GROUP BY tblCustomers.ACCT_NO,tblCustomers.NAME HAVING NITROSALE < strftime("%s","now") - (60 * 60 * 24 * tblCustomers.SP7) ORDER BY tblSales.SIDATO', [],     //RP103117***Updated SQL statement***
        //JKS021218***3.100.37->Removed all 020518 Default Nitro Value code, which was replaced by SQL statement CHANGES in Reports and Home to check for Customer Nitro or Default Nitro values*** 
        /*tx.executeSql('SELECT tblCustomers.ACCT_NO,tblCustomers.NAME,max(tblSales.SIDATO) AS NITROSALE, CASE WHEN tblCustomers.SP7 IS NULL OR tblCustomers.SP7 = "" OR tblCustomers.SP7 = " " \
            THEN strftime("%s", "now") - (60 * 60 * 24 * ' + window.localStorage.getItem("ssp_nitrodays") + ') \
            ELSE strftime("%s","now") - (60 * 60 * 24 * tblCustomers.SP7) END AS tmpDays \
            FROM tblCustomers LEFT JOIN tblSales ON tblCustomers.ACCT_NO = tblSales.SIACT \
            WHERE tblSales.SITYPS = "N" \
            GROUP BY tblCustomers.ACCT_NO, tblCustomers.NAME \
            HAVING NITROSALE < tmpDays \
            ORDER BY tblSales.SIDATO', [],
            function (tx, rs) {
                if (rs.rows.length > 0) {
                    $('#nitromsg').html("<a href='javascript:void(0);' onclick='ssp.webdb.loadReports();ssp.webdb.getNitroFillsOver();' class='button' title='messages'>Nitro <strong>" + rs.rows.length + "</strong></a>");
                }
            },
            ssp.webdb.onError);*/

        /*
         * [alaSQL]
          Issues solve (compared to WebSQL):
            1. HAVING clause is not working as expected. So split the code in two queries.
            2. CASE statement used at both places as aliases don't work
        */
        tx.exec(`Select tblSales.SIACT, Max(tblSales.SIDATO) AS NITROSALE 
            FROM tblSales
            WHERE tblSales.SITYPS = "N" 
            GROUP BY tblSales.SIACT
            ORDER BY Max(tblSales.SIDATO)`, [], sales => {
            //console.log("Max Sales: ",sales)
            var currentTime = Math.floor(new Date().getTime() / 1000);
            var ssp_nitrodays = window.localStorage.getItem("ssp_nitrodays");
            tx.exec(`SELECT tblCustomers.ACCT_NO,tblCustomers.NAME,tblSales.NITROSALE,tblCustomers.SP7, CASE WHEN (tblCustomers.SP7 IS NULL  OR tblCustomers.SP7 = "" OR tblCustomers.SP7 = " ")
              THEN (${currentTime} - (60 * 60 * 24 * ${ssp_nitrodays}))
              ELSE (${currentTime} - (60 * 60 * 24 * tblCustomers.SP7)) END AS tmpDays
              FROM tblCustomers JOIN ? as tblSales ON tblCustomers.ACCT_NO = tblSales.SIACT
              WHERE tblSales.NITROSALE < (CASE WHEN (tblCustomers.SP7 IS NULL  OR tblCustomers.SP7 = "" OR tblCustomers.SP7 = " ")
              THEN (${currentTime} - (60 * 60 * 24 * ${ssp_nitrodays}))
              ELSE (${currentTime} - (60 * 60 * 24 * tblCustomers.SP7)) END)
              ORDER BY tblSales.NITROSALE`, [sales],
                function (rs) {
                    //console.log(rs);
                    if (rs.length)
                        $('#nitromsg').html("<a href='javascript:void(0);' onclick='ssp.webdb.loadReports();ssp.webdb.getNitroFillsOver();' class='button' title='messages'>Nitro <strong>" + rs.length + "</strong></a>");
                }
            )
        });
    });

    $(document).ready(function () {
        $("#settingsSaveButton").click();
    });
    

}



ssp.webdb.loadSync = function () {
    var homeHeader = 'Premier Select Sires';
    switch (window.localStorage.getItem("ssp_projectid")) {
        case 'sess':
            homeHeader = 'Premier Select Sires';
            break;
        case 'ssc':
            homeHeader = 'Select Sires Genervations';
            break;
        case 'ps':
            homeHeader = 'Select Sires MidAmerica';
            break;
        case 'ecss':
            homeHeader = 'CentralStar';
            break;
        case 'mnss':
            homeHeader = 'MN Select Sires';
            break;
    }
    var divContent = "<header id='mainheader'><h1>" + homeHeader + "</h1></header>";
    //    if (window.localStorage.getItem('ssp_initial_sync')) {
    divContent += "<a href='javascript:void(0);' onclick='ssp.webdb.loadHome();' id='home'>Home</a>";
    //    } else {
    //    	divContent += "<a href='javascript:void(0);' onclick='ssp.webdb.loadLogin();' id='home'>Login</a>";
    //    }
    $('#headercontent').html(divContent);

    divContent = '<section id="login-block">';
    divContent += '<div class="block-border">';
    divContent += '<div class="block-content">';
    divContent += '<p><button type="button" id="syncbutton" class="full-width" onclick="ssp.webdb.syncDB();">Sync Now!</button></p><div id="loader"><img src="img/loaderDark.gif"></div>';
    divContent += '<ul class="extended-list icon-user">';

    divContent += '<li>';
    divContent += '<a href="#">';
    divContent += '<span class="number float-right"><div style="display: inline;" id="custsynccnt"></div></span>';
    divContent += '<span class="icon"></span>';
    divContent += 'Customers';
    divContent += '</a>';
    divContent += '<ul class="extended-options">';
    divContent += '<li>';
    divContent += 'Names: <strong><div style="display: inline;" id="custcurr"></div>/<div style="display: inline;" id="custtot"></div></strong><br>';
    divContent += '<span class="progress-bar" id="custbar"><span style="width:0%"></span></span>';
    divContent += '</li>';
    divContent += '<li>';
    divContent += 'Notes: <strong><div style="display: inline;" id="cnotecurr"></div>/<div style="display: inline;" id="cnotetot"></div></strong><br>';
    divContent += '<span class="progress-bar" id="cnotebar"><span class="green" style="width:0%"></span></span>';
    divContent += '</li>';
    divContent += '<li>';
    divContent += 'A/R: <strong><div style="display: inline;" id="cuarcurr"></div>/<div style="display: inline;" id="cuartot"></div></strong><br>';
    divContent += '<span class="progress-bar" id="cuarbar"><span class="purple" style="width:0%"></span></span>';
    divContent += '</li>';

    divContent += '</ul>';
    divContent += '</li>';

    divContent += '<li>';
    divContent += '<a href="#">';
    //divContent += '<span class="number float-right"><div style="display: inline;" id="bullsynccnt"></div></span>';
    divContent += '<span class="icon"></span>';
    divContent += 'Bulls';
    divContent += '</a>';
    divContent += '<ul class="extended-options">';
    divContent += '<li>';
    divContent += 'Count: <strong><div style="display: inline;" id="bullcurr"></div>/<div style="display: inline;" id="bulltot"></div></strong><br>';
    divContent += '<span class="progress-bar" id="bullbar"><span class="green" style="width:0%"></span></span>';
    divContent += '</li>';
    divContent += '</ul>';
    divContent += '</li>';

    divContent += '<li>';
    divContent += '<a href="#">';
    //divContent += '<span class="number float-right"><div style="display: inline;" id="suppsynccnt"></div></span>';
    divContent += '<span class="icon"></span>';
    divContent += 'Supplies';
    divContent += '</a>';
    divContent += '<ul class="extended-options">';
    divContent += '<li>';
    divContent += 'Count: <strong><div style="display: inline;" id="suppcurr"></div>/<div style="display: inline;" id="supptot"></div></strong><br>';
    divContent += '<span class="progress-bar" id="suppbar"><span class="orange" style="width:0%"></span></span>';
    divContent += '</li>';
    divContent += '</ul>';
    divContent += '</li>';

    divContent += '<li>';
    divContent += '<a href="#">';
    divContent += '<span class="number float-right"><div style="display: inline;" id="salesynccnt"></div></span>';
    divContent += '<span class="number float-right"><div style="display: inline;" id="salesyncamt"></div></span>';
    divContent += '<span class="icon"></span>';
    divContent += 'Sales';
    divContent += '</a>';
    divContent += '<ul class="extended-options">';
    divContent += '<li>';
    divContent += 'Count: <strong><div style="display: inline;" id="salecurr"></div>/<div style="display: inline;" id="saletot"></div></strong><br>';
    divContent += '<span class="progress-bar" id="salesbar"><span class="purple" style="width:0%"></span></span>';
    divContent += '</li>';
    divContent += '</ul>';
    divContent += '</li>';

    //divContent += '<li>';
    //divContent += '<a href="#">';
    //divContent += '<span class="icon"></span>';
    //divContent += 'Customers AR';
    //divContent += '</a>';
    //divContent += '<ul class="extended-options">';
    //divContent += '<li>';
    //divContent += 'Count: <strong><div style="display: inline;" id="cuarcurr"></div>/<div style="display: inline;" id="cuartot"></div></strong><br>';
    //divContent += '<span class="progress-bar" id="cuarbar"><span style="width:0%"></span></span>';
    //divContent += '</li>';
    //divContent += '</ul>';
    //divContent += '</li>';

    divContent += '<li>';
    divContent += '<a href="#">';
    divContent += '<span class="icon"></span>';
    divContent += 'Techs';
    divContent += '</a>';
    divContent += '<ul class="extended-options">';
    divContent += '<li>';
    divContent += 'Count: <strong><div style="display: inline;" id="techcurr"></div>/<div style="display: inline;" id="techtot"></div></strong><br>';
    divContent += '<span class="progress-bar" id="techbar"><span style="width:0%"></span></span>';
    divContent += '</li>';
    divContent += '</ul>';
    divContent += '</li>';

    divContent += '<li>';
    divContent += '<a href="#">';
    divContent += '<span class="number float-right"><div style="display: inline;" id="timesynccnt"></div></span>';
    divContent += '<span class="icon"></span>';
    divContent += 'Timesheets';
    divContent += '</a>';
    divContent += '<ul class="extended-options">';
    divContent += '<li>';
    divContent += 'Count: <strong><div style="display: inline;" id="timecurr"></div>/<div style="display: inline;" id="timetot"></div></strong><br>';
    divContent += '<span class="progress-bar" id="timebar"><span style="width:0%"></span></span>';
    divContent += '</li>';
    divContent += '</ul>';
    divContent += '</li>';


    divContent += '</ul>';
    divContent += '<ul class="message">';
    divContent += '<li>Last Sync <img src="img/arrowCurveLeft.png" width="16" height="16" class="picto">' + window.localStorage.getItem('ssp_last_sync') + '</li>';
    //	divContent += '<li><button class="small" onclick="ssp.webdb.viewSyncLog();"> view sync log </button></li>';
    divContent += '<li><button class="small"="ssp.webdb.printSyncItems();"> save sync items to file </button></li>';
    divContent += '</ul>';

    divContent += '</div>';

    divContent += '</div>';
    divContent += '</section>';

    $('#maincontent').html(divContent);
    $("#loader").hide();
    ssp.webdb.setSyncCounts();
}

ssp.webdb.loadSettings = function () {

    var homeHeader = 'Premier Select Sires';
    switch (window.localStorage.getItem("ssp_projectid")) {
        case 'sess':
            homeHeader = 'Premier Select Sires';
            break;
        case 'ssc':
            homeHeader = 'Select Sires Genvervations';
            break;
        case 'ps':
            homeHeader = 'Select Sires MidAmerica';
            break;
        case 'ecss':
            homeHeader = 'CentralStar';
            break;
        case 'mnss':
            homeHeader = 'MN Select Sires';
            break;
    }

    if (window.localStorage.getItem("ssp_projectid") != 'ssc') {        /*JKS022618***3.100.39->BEGIN IF ELSE for SSC to not display Tech Relief button****/
        var divContent = "<header id='mainheader'><h1>" + homeHeader + "</h1></header>";
        divContent += "<a href='javascript:void(0);' onclick='location.reload();' id='home'>Home</a>";
        $('#headercontent').html(divContent);

        //if(!(navigator.onLine)) {
        //    divContent = '<p class="message warning">Unable to login. You are not connected to the internet.</p>';
        //}
        //else {
        divContent = '<p><button type="button" class="big full-width" onclick="ssp.webdb.loadLogin();">Login</button></p>';

        divContent += '<section id="login-block">';
        divContent += '<div class="block-border"><form class="form block-content" name="login-form" id="login-form" onsubmit="return ssp.webdb.saveSettings()" action="">';
        divContent += '<h1>Settings</h1>';

        divContent += '<div class="block-border medium-margin"><h3>Tech ID</h3>';
        divContent += '<h4>' + window.localStorage.getItem("ssp_TechID") + '</h4></div>';

        divContent += '<p class="inline-mini-label">';
        divContent += '<label for="name">Data URL</label>';


        if (pageURL.includes("pss")) {
            divContent += '<input type="text" autocomplete="https://pss.s-webapi.premierselect.com/sspweb" name="urldata" id="urldata" class="full-width" value="https://pss.s-webapi.premierselect.com/sspweb">';
        }
        else if (pageURL.includes("cs")) {
            divContent += '<input type="text" autocomplete="https://cs.s-webapi.premierselect.com/sspweb" name="urldata" id="urldata" class="full-width" value="https://cs.s-webapi.premierselect.com/sspweb">';
        }
        else if (pageURL.includes("mnss")) {
            divContent += '<input type="text" autocomplete="https://mnss.s-webapi.premierselect.com/sspweb" name="urldata" id="urldata" class="full-width" value="https://mnss.s-webapi.premierselect.com/sspweb">';
        }
        else if (pageURL.includes("ssc")) {
            divContent += '<input type="text" autocomplete="https://ssc.s-webapi.premierselect.com/sspweb" name="urldata" id="urldata" class="full-width" value="https://ssc.s-webapi.premierselect.com/sspweb">';
        }
        else if (pageURL.includes("ssma")) {
            divContent += '<input type="text" autocomplete="https://ssma.s-webapi.premierselect.com/sspweb" name="urldata" id="urldata" class="full-width" value="https://ssma.s-webapi.premierselect.com/sspweb">';
        }
        else {
            divContent += '<input type="text" autocomplete="https://ssma.s-webapi.premierselect.com/sspweb" name="urldata" id="urldata" class="full-width" value="https://ssma.s-webapi.premierselect.com/sspweb">';
            //divContent += '<input type="text" autocomplete="https://ssp.selectsirepower.com/SSPweb" name="urldata" id="urldata" class="full-width" value="https://ssp.selectsirepower.com/SSPweb">';
        }


        // divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="urldata" id="urldata" class="full-width" value="' + window.localStorage.getItem("ssp_urldata") + '">';     /*JKS080818->4.03***Auto Fill Search switch*/


        divContent += '</p>';
        divContent += '<p class="inline-mini-label">';
        divContent += '<label for="mail">Order PDFs</label>';
        divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="orderpdf" id="orderpdf" class="full-width" value="' + window.localStorage.getItem("ssp_orderpdf") + '">';      /*JKS080818->4.03***Auto Fill Search switch*/
        divContent += '</p>';
        divContent += '<p class="inline-mini-label">';
        divContent += '<label for="mail">Nitrogen Price</label>';
        divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="nitroprice" id="nitroprice" class="full-width" value="' + window.localStorage.getItem("ssp_nitroprice") + '">';    /*JKS080818->4.03***Auto Fill Search switch*/
        divContent += '</p>';
        //JKS011718***Begin Restored NitroDays in Settings***//JKS102517***Begin Moved NitroDays to Customer Info***
        divContent += '<p class="inline-mini-label">';
        divContent += '<label for="mail">Nitrogen Days</label>';
        divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="nitrodays" id="nitrodays" class="full-width" value="' + window.localStorage.getItem("ssp_nitrodays") + '">';   /*JKS080818->4.03***Auto Fill Search switch*/
        divContent += '</p>';
        //JKS011718***End Restored NitroDays in Settings***//JKS102517***End Moved NitroDays to Customer Info***
        divContent += '<p class="inline-mini-label">';
        divContent += '<label for="thankyou">Thank You on Order</label>';
        divContent += '<textarea rows="3" name="thankyou" id="thankyou" class="full-width" >' + window.localStorage.getItem("ssp_thankyou") + '</textarea>';
        divContent += '</p>';

        //JKS021716 ***YouSavedSwitch Begin***
        divContent += '<p class="inline-mini-label">';
        divContent += '<label for="savedswitch">You Saved</label>';
        divContent += '<input type="checkbox" name="savedswitch" id="chkYouSaved" class="switch" title="YouSavedSwitch"' + ((window.localStorage.getItem("ssp_yousaved") == 1) ? 'checked="checked"' : '') + '>';
        divContent += '</p>';
        //JKS021716 ***YouSavedSwitch End***        

        divContent += '<p class="inline-mini-label">';
        divContent += '<label for="addresssearch">Address Search</label>';
        divContent += '<input type="checkbox" name="addresssearch" id="chkAddrSearch" class="switch" title="Search Address"' + ((window.localStorage.getItem("ssp_addrsearch") == 1) ? 'checked="checked"' : '') + '>';
        divContent += '</p>';

        divContent += '<p class="inline-mini-label">';
        divContent += '<label for="techfunc">Tech</label>';
        divContent += '<input type="checkbox" name="techfunc" id="chkTechfunc" class="switch" title="Tech"' + ((window.localStorage.getItem("ssp_techfunc") == 1) ? 'checked="checked"' : '') + '>';
        divContent += '<button type="button" class="small float-right" onclick="ssp.webdb.getTechRelief();">Tech Relief List</button>';
        divContent += '</p>';

        divContent += '<p class="inline-mini-label">';
        divContent += '<label for="arm">Tech Service Price</label>';
        divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="armprice" id="armprice" class="full-width" value="' + window.localStorage.getItem("ssp_armprice") + '">';      /*JKS080818->4.03***Auto Fill Search switch*/
        divContent += '</p>';


        divContent += '<fieldset class="grey-bg collapse" id="advoptions">';
        divContent += '<legend><a href="javascript:void(0)" id="btnAdvOptions">Advanced</a></legend>';
        //JKS103116***Begin Auto Fill Switch***
        divContent += '<p class="inline-mini-label">';
        divContent += '<label for="autofillsearch">Auto Fill Search</label>';
        divContent += '<input type="checkbox" name="autofillsearch" id="chkAutoFillSearch" class="switch" title="AutoFillSearch"' + ((window.localStorage.getItem("ssp_autofillsearch") == "on") ? 'checked="checked"' : '') + '>';     /*JKS080818->4.03***Auto Fill Search switch*/
        divContent += '</p>';
        //JKS103116***End Auto Fill Switch***
        divContent += '<p class="inline-mini-label">';
        divContent += '<label for="custsalesbubble">Customer Sales Bubble</label>';
        divContent += '<input type="checkbox" name="custsalesbubble" id="chkCustSalesBubble" class="switch" title="CustomerSalesBubble"' + ((window.localStorage.getItem("ssp_custsalesbubble") == 1) ? 'checked="checked"' : '') + '>';
        divContent += '</p>';
        divContent += '<p class="inline-mini-label">';
        divContent += '<label for="numberpad">Numeric Key Pad</label>';
        divContent += '<input type="checkbox" name="numberpad" id="chkNumberPad" class="switch" title="NumericKeypad"' + ((window.localStorage.getItem("ssp_numberpad") == 1) ? 'checked="checked"' : '') + '>';
        divContent += '</p>';
        divContent += '<p class="inline-mini-label">';
        divContent += '<label for="autobackup">Auto Backup</label>';
        divContent += '<input type="checkbox" name="autobackup" id="chkAutoBackup" class="switch" title="AutoBackup"' + ((window.localStorage.getItem("ssp_autobackup") == 1) ? 'checked="checked"' : '') + '>';
        divContent += '</p>';
        divContent += '<p class="inline-mini-label">';
        divContent += '<label for="freezecode">Freeze Code</label>';
        divContent += '<input type="checkbox" name="freezecode" id="chkFreezeCode" class="switch" title="FreezeCode"' + ((window.localStorage.getItem("ssp_freeze") == 1) ? 'checked="checked"' : '') + '>';
        divContent += '</p>';
        divContent += '<p class="inline-mini-label">';
        divContent += '<button type="button" class="small" onclick="ssp.webdb.getDebug();">Debug</button>';
        divContent += '</p>';
        divContent += '<p class="inline-mini-label">';
        divContent += '<button type="button" class="small" id="btnClearTables" onclick="ssp.webdb.clearTables();">Empty and Recreate Tables</button>';
        divContent += '</p>';
        divContent += '</fieldset>';

        divContent += '<p><button id="settingsSaveButton" type="submit" class="full-width">Save</button></p>';
        divContent += '<p>Bulls-I Version: ' + sspversion + '</p></form></div></section>';
        divContent += '<div id="debug"></div>';
        //	}	


        $('#maincontent').html(divContent);
        $(document.body).applyTemplateSetup();

    }
    else {

        var divContent = "<header id='mainheader'><h1>" + homeHeader + "</h1></header>";
        divContent += "<a href='javascript:void(0);' onclick='location.reload();' id='home'>Home</a>";
        $('#headercontent').html(divContent);

        //if(!(navigator.onLine)) {
        //    divContent = '<p class="message warning">Unable to login. You are not connected to the internet.</p>';
        //}
        //else {
        divContent = '<p><button type="button" class="big full-width" onclick="ssp.webdb.loadLogin();">Login</button></p>';

        divContent += '<section id="login-block">';
        divContent += '<div class="block-border"><form class="form block-content" name="login-form" id="login-form" onsubmit="return ssp.webdb.saveSettings()" action="">';
        divContent += '<h1>Settings</h1>';

        divContent += '<div class="block-border medium-margin"><h3>Tech ID</h3>';
        divContent += '<h4>' + window.localStorage.getItem("ssp_TechID") + '</h4></div>';

        divContent += '<p class="inline-mini-label">';
        divContent += '<label for="name">Data URL</label>';


        if (pageURL.includes("pss")) {
            divContent += '<input type="text" autocomplete="https://pss.s-webapi.premierselect.com/sspweb" name="urldata" id="urldata" class="full-width" value="https://pss.s-webapi.premierselect.com/sspweb">';
        }
        else if (pageURL.includes("cs")) {
            divContent += '<input type="text" autocomplete="https://cs.s-webapi.premierselect.com/sspweb" name="urldata" id="urldata" class="full-width" value="https://cs.s-webapi.premierselect.com/sspweb">';
        }
        else if (pageURL.includes("mnss")) {
            divContent += '<input type="text" autocomplete="https://mnss.s-webapi.premierselect.com/sspweb" name="urldata" id="urldata" class="full-width" value="https://mnss.s-webapi.premierselect.com/sspweb">';
        }
        else if (pageURL.includes("ssc")) {
            divContent += '<input type="text" autocomplete="https://ssc.s-webapi.premierselect.com/sspweb" name="urldata" id="urldata" class="full-width" value="https://ssc.s-webapi.premierselect.com/sspweb">';
        }
        else if (pageURL.includes("ssma")) {
            divContent += '<input type="text" autocomplete="https://ssma.s-webapi.premierselect.com/sspweb" name="urldata" id="urldata" class="full-width" value="https://ssma.s-webapi.premierselect.com/sspweb">';
        }
        else {
            divContent += '<input type="text" autocomplete="https://ssma.s-webapi.premierselect.com/sspweb" name="urldata" id="urldata" class="full-width" value="https://ssma.s-webapi.premierselect.com/sspweb">';
            //divContent += '<input type="text" autocomplete="https://ssp.selectsirepower.com/SSPweb" name="urldata" id="urldata" class="full-width" value="https://ssp.selectsirepower.com/SSPweb">';
        }


        divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="urldata" id="urldata" class="full-width" value="' + window.localStorage.getItem("ssp_urldata") + '">';     /*JKS080818->4.03***Auto Fill Search switch*/
        divContent += '</p>';
        divContent += '<p class="inline-mini-label">';
        divContent += '<label for="mail">Order PDFs</label>';
        divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="orderpdf" id="orderpdf" class="full-width" value="' + window.localStorage.getItem("ssp_orderpdf") + '">';      /*JKS080818->4.03***Auto Fill Search switch*/
        divContent += '</p>';
        divContent += '<p class="inline-mini-label">';
        divContent += '<label for="mail">Nitrogen Price</label>';
        divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="nitroprice" id="nitroprice" class="full-width" value="' + window.localStorage.getItem("ssp_nitroprice") + '">';        /*JKS080818->4.03***Auto Fill Search switch*/
        divContent += '</p>';
        //JKS011718***Begin Restored NitroDays in Settings***//JKS102517***Begin Moved NitroDays to Customer Info***
        divContent += '<p class="inline-mini-label">';
        divContent += '<label for="mail">Nitrogen Days</label>';
        divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="nitrodays" id="nitrodays" class="full-width" value="' + window.localStorage.getItem("ssp_nitrodays") + '">';       /*JKS080818->4.03***Auto Fill Search switch*/
        divContent += '</p>';
        //JKS011718***End Restored NitroDays in Settings***//JKS102517***End Moved NitroDays to Customer Info***
        divContent += '<p class="inline-mini-label">';
        divContent += '<label for="thankyou">Thank You on Order</label>';
        divContent += '<textarea rows="3" name="thankyou" id="thankyou" class="full-width" >' + window.localStorage.getItem("ssp_thankyou") + '</textarea>';
        divContent += '</p>';

        //JKS021716 ***YouSavedSwitch Begin***
        divContent += '<p class="inline-mini-label">';
        divContent += '<label for="savedswitch">You Saved</label>';
        divContent += '<input type="checkbox" name="savedswitch" id="chkYouSaved" class="switch" title="YouSavedSwitch"' + ((window.localStorage.getItem("ssp_yousaved") == 1) ? 'checked="checked"' : '') + '>';
        divContent += '</p>';
        //JKS021716 ***YouSavedSwitch End***        

        divContent += '<p class="inline-mini-label">';
        divContent += '<label for="addresssearch">Address Search</label>';
        divContent += '<input type="checkbox" name="addresssearch" id="chkAddrSearch" class="switch" title="Search Address"' + ((window.localStorage.getItem("ssp_addrsearch") == 1) ? 'checked="checked"' : '') + '>';
        divContent += '</p>';


        divContent += '<p class="inline-mini-label">';
        divContent += '<label for="techfunc">Tech</label>';
        divContent += '<input type="checkbox" name="techfunc" id="chkTechfunc" class="switch" title="Tech"' + ((window.localStorage.getItem("ssp_techfunc") == 1) ? 'checked="checked"' : '') + '>';
        //JKS022718***3.100.39->Removed Tech Relief button in Settings for SSC***//divContent += '<button type="button" class="small float-right" onclick="ssp.webdb.getTechRelief();">Tech Relief List</button>';
        divContent += '</p>';

        divContent += '<p class="inline-mini-label">';
        divContent += '<label for="arm">Tech Service Price</label>';
        divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="armprice" id="armprice" class="full-width" value="' + window.localStorage.getItem("ssp_armprice") + '">';      /*JKS080818->4.03***Auto Fill Search switch*/
        divContent += '</p>';


        divContent += '<fieldset class="grey-bg collapse" id="advoptions">';
        divContent += '<legend><a href="javascript:void(0)" id="btnAdvOptions">Advanced</a></legend>';
        //JKS103116***Begin Auto Fill Switch***
        divContent += '<p class="inline-mini-label">';
        divContent += '<label for="autofillsearch">Auto Fill Search</label>';
        divContent += '<input type="checkbox" name="autofillsearch" id="chkAutoFillSearch" class="switch" title="AutoFillSearch"' + ((window.localStorage.getItem("ssp_autofillsearch") == "on") ? 'checked="checked"' : '') + '>';     /*JKS080818->4.03***Auto Fill Search switch*/
        divContent += '</p>';
        //JKS103116***End Auto Fill Switch***
        divContent += '<p class="inline-mini-label">';
        divContent += '<label for="custsalesbubble">Customer Sales Bubble</label>';
        divContent += '<input type="checkbox" name="custsalesbubble" id="chkCustSalesBubble" class="switch" title="CustomerSalesBubble"' + ((window.localStorage.getItem("ssp_custsalesbubble") == 1) ? 'checked="checked"' : '') + '>';
        divContent += '</p>';
        divContent += '<p class="inline-mini-label">';
        divContent += '<label for="numberpad">Numeric Key Pad</label>';
        divContent += '<input type="checkbox" name="numberpad" id="chkNumberPad" class="switch" title="NumericKeypad"' + ((window.localStorage.getItem("ssp_numberpad") == 1) ? 'checked="checked"' : '') + '>';
        divContent += '</p>';
        divContent += '<p class="inline-mini-label">';
        divContent += '<label for="autobackup">Auto Backup</label>';
        divContent += '<input type="checkbox" name="autobackup" id="chkAutoBackup" class="switch" title="AutoBackup"' + ((window.localStorage.getItem("ssp_autobackup") == 1) ? 'checked="checked"' : '') + '>';
        divContent += '</p>';
        divContent += '<p class="inline-mini-label">';
        divContent += '<label for="freezecode">Freeze Code</label>';
        divContent += '<input type="checkbox" name="freezecode" id="chkFreezeCode" class="switch" title="FreezeCode"' + ((window.localStorage.getItem("ssp_freeze") == 1) ? 'checked="checked"' : '') + '>';
        divContent += '</p>';
        divContent += '<p class="inline-mini-label">';
        divContent += '<button type="button" class="small" onclick="ssp.webdb.getDebug();">Debug</button>';
        divContent += '</p>';
        divContent += '<p class="inline-mini-label">';
        divContent += '<button type="button" class="small" id="btnClearTables" onclick="ssp.webdb.clearTables();">Empty and Recreate Tables</button>';
        divContent += '</p>';
        divContent += '</fieldset>';
        divContent += '<p><button id="settingsSaveButton" type="submit" class="full-width">Save</button></p>';
        divContent += '<p>Bulls-I Version: ' + sspversion + '</p></form></div></section>';
        divContent += '<div id="debug"></div>';
        //	}	


        $('#maincontent').html(divContent);
        $(document.body).applyTemplateSetup();


    }          /*JKS022618***3.100.39->END IF ELSE for SSC to not display Tech Relief button****/
}

ssp.webdb.clearTables = function () {
    if ($("#btnClearTables").attr("class") == "small red button") {
        ssp.webdb.deleteINDBAndClearInMemoryTables()
            .then(res => {
                ssp.webdb.createAndAttachINDB()
                    .then(res => {
                        console.log("Database attached after Deletion: ", res)
                        ssp.webdb.loadHome()
                    })
            }).catch(rejected => {
                console.log("Error while deleting INDB Database and dropping In-memory tables.", rejected)
            })
    } else {
        $("#btnClearTables").removeClass("button").addClass("small red button");
        $("#btnClearTables").html('PLEASE SYNC DATA FIRST. Sure?');
    }
}

ssp.webdb.loadLogin = function () {
    //[ala]//ssp.webdb.createTables(); //RP111016 ***Create tables here to give it time to finish.***
    var homeHeader = 'Premier Select Sires';
    switch (window.localStorage.getItem("ssp_projectid")) {
        case 'sess':
            homeHeader = 'Premier Select Sires';
            break;
        case 'ssc':
            homeHeader = 'Select Sires Genervations';
            break;
        case 'ps':
            homeHeader = 'Select Sires MidAmerica';
            break;
        case 'ecss':
            homeHeader = 'CentralStar';
            break;
        case 'mnss':
            homeHeader = 'MN Select Sires';
            break;

    }
    var divContent = "<header id='mainheader'><h1>" + homeHeader + "</h1></header>";
    //divContent += '<div id="loadingDiv"><img src="img/maskLoader.gif" width="16" height="16"></div></header>';
    divContent += "<div id='menu'><a href='javascript:void(0);' onclick='ssp.webdb.loadSettings();' id='settings'>Settings</a></div>";
    $('#headercontent').html(divContent);

    divContent = "<section id='login-block' class='medium-margin'>";
    divContent += "<div class='block-border'><form class='form block-content' name='login-form' id='login-form' onsubmit='return ssp.webdb.setTech()'>";
    divContent += "<div class='block-header'>Please login</div>";
    divContent += "<input type='hidden' name='a' id='a' value='send'>";
    divContent += "<p class='inline-mini-label small-margin'>";
    divContent += "<label for='login'><span class='big'>User</span></label>";
    divContent += "<input type='text' name='login' id='login' class='full-width' value=''>";
    divContent += "</p>";
    divContent += "<p class='inline-mini-label'>";
    divContent += "<label for='pass'><span class='big'>Pass</span></label>";
    divContent += "<input type='password' name='pass' id='pass' class='full-width' value=''>";
    divContent += "</p>";
    divContent += "<p>";
    divContent += "<button type='submit' class='with-margin float-right'>Login</button>";
    //	divContent += "<p class='input-height'>";
    //	divContent += "<input type='checkbox' name='keep-logged' id='keep-logged' value='1' class='mini-switch' checked='checked'>";
    //	divContent += "<label for='keep-logged' class='inline'>Keep me logged in</label>";
    divContent += "</p>";
    divContent += "</form></div>";
    divContent += "</section>";

    $('#maincontent').html(divContent);


}

ssp.webdb.getDebug = function () {
    ssp.webdb.debugIndicator = 'Debug'; //[alaSQL: Added to show the Debug Items (displayDebug) after deleting an order from Debug list on Settings Page. Currently, after deleting an item, the list does not get updated. Used in ssp.webdb.getOrderItems]

    ssp.webdb.db.transaction(function (tx) {
        //        tx.exec('SELECT * FROM tblSales WHERE MOD = 1 AND (SITYPS = "D" OR SITYPS = "N" OR SITYPS = "S" OR SITYPS = "B" OR SITYPS = "Z") ORDER BY SIORNM,SINAM ', [], displayDebug, ssp.webdb.onError); 
        tx.exec('SELECT * FROM tblSales WHERE MOD = 1 ORDER BY SIORNM,SINAM ', [], displayDebug, ssp.webdb.onError);

    });


}

function displayDebug(rs, err) {

    var rowOutput = '<div class="no-margin"><table class="table" cellspacing="0" width="100%">';
    rowOutput += '<thead>';
    rowOutput += '<tr>';
    rowOutput += '<th scope="col">SIACT</th>';
    rowOutput += '<th scope="col">SIINVL</th>';
    rowOutput += '<th scope="col">SIORNM</th>';
    rowOutput += '<th scope="col">SIINVO</th>';
    rowOutput += '<th scope="col">SIDATO</th>';
    rowOutput += '<th scope="col">SITIMO</th>';
    rowOutput += '<th scope="col">SITYPS</th>';
    rowOutput += '<th scope="col">SICOD</th>';
    rowOutput += '<th scope="col">SIQTY</th>';
    rowOutput += '<th scope="col">SIMATH</th>';
    rowOutput += '<th scope="col">SINAM</th>';
    rowOutput += '<th scope="col">SIPRC</th>';
    rowOutput += '<th scope="col">SITYPI</th>';
    rowOutput += '<th scope="col">SICOW</th>';
    rowOutput += '<th scope="col">SIARM</th>';
    rowOutput += '<th scope="col">SISTP</th>';
    rowOutput += '<th scope="col">SIOTH</th>';
    rowOutput += '<th scope="col">SILIN</th>';
    rowOutput += '<th scope="col">SISEM</th>';
    rowOutput += '<th scope="col">SIPOA</th>';
    rowOutput += '<th scope="col">SISUP</th>';
    rowOutput += '<th scope="col">SICDI</th>';
    rowOutput += '<th scope="col">SIPGA</th>';
    rowOutput += '<th scope="col">SIDSC</th>';
    rowOutput += '<th scope="col">SIREP</th>';
    rowOutput += '<th scope="col">SIANM</th>';
    rowOutput += '<th scope="col">SILVL1</th>';
    rowOutput += '<th scope="col">SILVL2</th>';
    rowOutput += '<th scope="col">SILVL3</th>';
    rowOutput += '<th scope="col">SILVL4</th>';
    rowOutput += '<th scope="col">SILVL5</th>';
    rowOutput += '<th scope="col">SIRETL</th>';
    rowOutput += '<th scope="col">FRZDAT</th>';     //JKS111616***Added FRZDAT to Debug.***
    rowOutput += '<th scope="col">LOTNOT</th>';     //JKS111416***Added LOTNOT to Debug.***
    rowOutput += '<th scope="col">FRZYYYYMMDD</th>';
    rowOutput += '<th scope="col">MOD</th>';
    rowOutput += '<th scope="col">MODSTAMP</th>';
    rowOutput += '<th scope="col">Delete?</th>';
    rowOutput += '<tbody>';

    for (var i = 0; i < rs.length; i++) {
        rowOutput += '<tr>';
        rowOutput += '<td>' + rs[i].SIACT + '</td>';
        rowOutput += '<td>' + rs[i].SIINVL + '</td>';
        rowOutput += '<td>' + rs[i].SIORNM + '</td>';
        rowOutput += '<td>' + rs[i].SIINVO + '</td>';
        rowOutput += '<td>' + rs[i].SIDATO + '</td>';
        rowOutput += '<td>' + rs[i].SITIMO + '</td>';
        rowOutput += '<td>' + rs[i].SITYPS + '</td>';
        rowOutput += '<td>' + rs[i].SICOD + '</td>';
        rowOutput += '<td>' + rs[i].SIQTY + '</td>';
        rowOutput += '<td>' + rs[i].SIMATH + '</td>';
        rowOutput += '<td>' + rs[i].SINAM + '</td>';
        rowOutput += '<td>' + rs[i].SIPRC + '</td>';
        rowOutput += '<td>' + rs[i].SITYPI + '</td>';
        rowOutput += '<td>' + rs[i].SICOW + '</td>';
        rowOutput += '<td>' + rs[i].SIARM + '</td>';
        rowOutput += '<td>' + rs[i].SISTP + '</td>';
        rowOutput += '<td>' + rs[i].SIOTH + '</td>';
        rowOutput += '<td>' + rs[i].SILIN + '</td>';
        rowOutput += '<td>' + rs[i].SISEM + '</td>';
        rowOutput += '<td>' + rs[i].SIPOA + '</td>';
        rowOutput += '<td>' + rs[i].SISUP + '</td>';
        rowOutput += '<td>' + rs[i].SICDI + '</td>';
        rowOutput += '<td>' + rs[i].SIPGA + '</td>';
        rowOutput += '<td>' + rs[i].SIDSC + '</td>';
        rowOutput += '<td>' + rs[i].SIREP + '</td>';
        rowOutput += '<td>' + rs[i].SIANM + '</td>';
        rowOutput += '<td>' + rs[i].SILVL1 + '</td>';
        rowOutput += '<td>' + rs[i].SILVL2 + '</td>';
        rowOutput += '<td>' + rs[i].SILVL3 + '</td>';
        rowOutput += '<td>' + rs[i].SILVL4 + '</td>';
        rowOutput += '<td>' + rs[i].SILVL5 + '</td>';
        rowOutput += '<td>' + rs[i].SIRETL + '</td>';
        rowOutput += '<td>' + rs[i].FRZDAT + '</td>';    //JKS111616***Added FRZDAT to Debug.***
        rowOutput += '<td>' + rs[i].LOTNOT + '</td>';    //JKS111416***Added LOTNOT to Debug.***
        rowOutput += '<td>' + rs[i].FRZYYYYMMDD + '</td>';
        rowOutput += '<td>' + rs[i].MOD + '</td>';
        rowOutput += '<td>' + rs[i].MODSTAMP + '</td>';

        rowOutput += '<td><div class="align-right"><a href="javascript:void(0)" class="button" id="' + rs[i].MODSTAMP + '" title="delete" onclick="ssp.webdb.deleteOrderItem(' + "'" + rs[i].SIORNM + "'," + rs[i].MODSTAMP + ')"><img src="img/bin.png" width="16" height="16"></a></td>';

        rowOutput += '</tr>';
    }
    rowOutput += '</tbody></table></div>';

    $('#debug').html(rowOutput);
}

ssp.webdb.loadInitSettings = function () {
    var homeHeader = 'Premier Select Sires';
    var divContent = "<header id='mainheader'><h1>" + homeHeader + "</h1></header>";
    //divContent += "<a href='javascript:void(0);' onclick='location.reload();' id='home'>Home</a>";
    $('#headercontent').html(divContent);

    //if(!(navigator.onLine)) {
    //    divContent = '<p class="message warning">Unable to login. You are not connected to the internet.</p>';
    //}
    //else {
    //divContent = '<p><button type="button" class="big full-width" onclick="ssp.webdb.loadLogin();">Login</button></p>';
    divContent = '';
    divContent += '<section id="login-block">';
    divContent += '<div class="block-border"><form class="form block-content" name="login-form" id="login-form" onsubmit="return ssp.webdb.saveInitSettings()" action="">';
    divContent += '<h1>Settings</h1>';

    divContent += '<p class="inline-mini-label">';
    divContent += '<label for="name">Data URL</label>';

    // Modified for initial settings
    if (pageURL.includes("pss")) {
        divContent += '<input type="text" autocomplete="https://pss.s-webapi.premierselect.com/sspweb" name="urldata" id="urldata" class="full-width" value="https://pss.s-webapi.premierselect.com/sspweb">';
    }
    else if (pageURL.includes("cs")) {
        divContent += '<input type="text" autocomplete="https://cs.s-webapi.premierselect.com/sspweb" name="urldata" id="urldata" class="full-width" value="https://cs.s-webapi.premierselect.com/sspweb">';
    }
    else if (pageURL.includes("mnss")) {
        divContent += '<input type="text" autocomplete="https://mnss.s-webapi.premierselect.com/sspweb" name="urldata" id="urldata" class="full-width" value="https://mnss.s-webapi.premierselect.com/sspweb">';
    }
    else if (pageURL.includes("ssc")) {
        divContent += '<input type="text" autocomplete="https://ssc.s-webapi.premierselect.com/sspweb" name="urldata" id="urldata" class="full-width" value="https://ssc.s-webapi.premierselect.com/sspweb">';
    }
    else if (pageURL.includes("ssma")) {
        divContent += '<input type="text" autocomplete="https://ssma.s-webapi.premierselect.com/sspweb" name="urldata" id="urldata" class="full-width" value="https://ssma.s-webapi.premierselect.com/sspweb">';
    }
    else {
        divContent += '<input type="text" autocomplete="https://ssma.s-webapi.premierselect.com/sspweb" name="urldata" id="urldata" class="full-width" value="https://ssma.s-webapi.premierselect.com/sspweb">';
        //divContent += '<input type="text" autocomplete="https://ssp.selectsirepower.com/SSPweb" name="urldata" id="urldata" class="full-width" value="https://ssp.selectsirepower.com/SSPweb">';
    }

    //divContent += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="urldata" id="urldata" class="full-width" value="' + window.localStorage.getItem("ssp_urldata") + '">';     /*JKS080818->4.03***Auto Fill Search switch*/
    divContent += '</p>';


    divContent += '<p class="inline-mini-label">';
    divContent += '<label for="freezecode">Freeze Code</label>';
    divContent += '<input type="checkbox" name="freezecode" id="chkFreezeCode" class="switch" title="FreezeCode"' + ((window.localStorage.getItem("ssp_freeze") == 1) ? 'checked="checked"' : '') + '>';
    divContent += '</p>';

    divContent += '<p><button type="submit" class="full-width">Continue</button></p>';
    divContent += '<p>Bulls-I Version: ' + sspversion + '</p></form></div></section>';
    divContent += '<div id="debug"></div>';
    //	}	
    $('#maincontent').html(divContent);
    $(document.body).applyTemplateSetup();

}

