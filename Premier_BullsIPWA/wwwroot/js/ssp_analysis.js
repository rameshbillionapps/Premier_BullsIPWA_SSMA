var thisYearValue = "";
var lastYearValue = "";
var currentActiveTab = "customer";
//var currentSelectedDate;
var firstDay;
var lastDay;

var formatEpochAdjustNew = function (strDate) {
    var dateArray = strDate.split("/");
    var yyyy = dateArray[2].trim();
    if (yyyy.length == 2) yyyy = yyyy < 90 ? "20" + yyyy : "19" + yyyy;
    var newdate = new Date(yyyy, dateArray[0] - 1, dateArray[1]);
    return newdate.getTime() / 1000 + 37800;
};

var formatMDYtoYMD = function (strDate) {
    var dateArray = strDate.split("/");
    var yyyy = dateArray[2].trim();
    if (yyyy.length == 2) yyyy = yyyy < 90 ? "20" + yyyy : "19" + yyyy;
    return yyyy + zeroPad(dateArray[0], 2) + zeroPad(dateArray[1], 2);
}

var formatYYYYMMDDtoMMDDYYYY = function (strDate) {
    return strDate.substring(4, 6) + '/' + strDate.substring(6, 8) + '/' + strDate.substring(0, 4)
}

var formatMMDDYYYY = function (dtDate) {
    var year = dtDate.getFullYear();
    var month = zeroPad((1 + dtDate.getMonth()).toString());
    var day = zeroPad(dtDate.getDate().toString(), 2);
    return month + '/' + day + '/' + year;
}

function zeroPad(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}

var typeValueDomain = [
    { title: "Bulls", value: "B", color: "red" },
    { title: "Paid on Account", value: "Z", color: "orange" },
    { title: "Supply", value: "S", color: "green" },
    { title: "Nitrogen", value: "N", color: "cyan" }
];

var typeSalesValueDomain = [
    { title: "Breeding", value: "B" },
    { title: "Bulls", value: "D" },
    { title: "Paid on Account", value: "Z" },
    { title: "Supply", value: "S" },
    { title: "Nitrogen", value: "N" }
];

var bullTypeValueDomain = [
    { title: "POA", value: "POA" },
    { title: "Nitrogen", value: "N2Fill" },
    { title: "Supply", value: "Supply" }
];

ssp.webdb.AnalysisDisplay = function () {
    populateFromAndToDateFields();
};

ssp.webdb.getAnalysis = function () {
    thisYearValue = $.fullCalendar.formatDate(new Date(), "yyyy");
    lastYearValue = (parseInt(thisYearValue) - 1).toString();

    firstDay = formatMDYtoYMD(formatToDisplayDate(getFirstLastDayOfTodaysMonth("first")));
    lastDay = formatMDYtoYMD(formatToDisplayDate(getFirstLastDayOfTodaysMonth("last")));

    ssp.webdb.db.transaction(function (tx) {
        //var initialQuery =
        //"SELECT * FROM (SELECT DISTINCT(SITYPS), COUNT(*) AS TOTAL, SIDATOYYYYMMDD FROM tblSales WHERE SIDATOYYYYMMDD >= " +
        //firstDay +
        //" AND SIDATOYYYYMMDD <= " +
        //lastDay +
        //" AND SITYPS NOT IN ('D', 'B') GROUP BY SIDATOYYYYMMDD, SITYPS UNION SELECT 'B', COUNT(*) AS TOTAL, SIDATOYYYYMMDD FROM tblSales WHERE SIDATOYYYYMMDD >= " +
        //firstDay +
        //  " AND SIDATOYYYYMMDD <= " +
        //lastDay +
        //    " AND SITYPS IN ('D', 'B') GROUP BY SIDATOYYYYMMDD) ORDER BY SIDATOYYYYMMDD";
        var initialQuery =
            "SELECT SUM((SIQTY * SIPRC) + CASE WHEN SIARM IS NULL THEN 0 ELSE SIARM END) AS TOTAL, SIDATOYYYYMMDD, 'S' AS SITYPS FROM tblSales WHERE " +
            "SIDATOYYYYMMDD >= " +
            firstDay +
            " AND SIDATOYYYYMMDD <= " +
            lastDay +
            " GROUP BY SIDATOYYYYMMDD ORDER BY SIDATOYYYYMMDD";
        tx.exec(initialQuery, [], loadAnalysis, ssp.webdb.onError);
    });
};

ssp.webdb.AnalysisRefresh = function () {
    var fromDate = formatMDYtoYMD($("#dtpAnalysisFromDate").val());
    var toDate = formatMDYtoYMD($("#dtpAnalysisToDate").val());
    if (!sspValidateDate(fromDate) || !sspValidateDate(toDate)) {
        alert("cannot query - invalid date");
        return false;
    } else {
        ssp.webdb.db.transaction(function (tx) {
            //var selectedSalesType = $("#selSalesType option:selected").val();
            //var selectedBullType = $("#selBullType option:selected").val();
            var appendQuery1 =
                $("#chkOnlyIncludeMySales").is(":checked") == true
                    ? " SIREP = '" + window.localStorage.getItem("ssp_TechID") + "' AND "
                    : "";
            //var appendQuery2 =
            //  selectedSalesType == ""
            //    ? ""
            //    : ' SITYPS = "' + selectedSalesType + '" AND ';
            //var appendQuery3 = "";
            //if (
            //  selectedBullType != bullTypeValueDomain[2].value &&
            //  selectedBullType != ""
            //) {
            //  appendQuery3 = ' SICOD = "' + selectedBullType + '" AND ';
            //} else if (selectedBullType == bullTypeValueDomain[2].value) {
            //  appendQuery3 =
            //    " SICOD != '" +
            //    bullTypeValueDomain[0].value +
            //    "' AND SICOD != '" +
            //    bullTypeValueDomain[1].value +
            //    "' AND ";
            //}

            //var refreshQuery =
            //  "SELECT * FROM (SELECT DISTINCT(SITYPS), COUNT(*) AS TOTAL, SIDATOYYYYMMDD FROM tblSales WHERE " +
            //  appendQuery1 +
            //  //appendQuery2 +
            //  //appendQuery3 +
            //  "SIDATOYYYYMMDD >= " +
            //  fromDate +
            //  " AND SIDATOYYYYMMDD <= " +
            //  toDate +
            //  " AND SITYPS NOT IN ('D', 'B') GROUP BY SIDATOYYYYMMDD, SITYPS UNION SELECT 'B', COUNT(*) AS TOTAL, SIDATOYYYYMMDD FROM tblSales WHERE " +
            //  appendQuery1 +
            //  //appendQuery2 +
            //  //appendQuery3 +
            //  "SIDATOYYYYMMDD >= " +
            //  fromDate +
            //  " AND SIDATOYYYYMMDD <= " 
            //  toDate +
            //    " AND SITYPS IN ('D', 'B') GROUP BY SIDATOYYYYMMDD) ORDER BY SIDATOYYYYMMDD";

            var refreshQuery =
                "SELECT SUM((SIQTY * SIPRC) + CASE WHEN SIARM IS NULL THEN 0 ELSE SIARM END) AS TOTAL, SIDATOYYYYMMDD, 'B' AS SITYPS FROM tblSales WHERE " +
                appendQuery1 +
                //appendQuery2 +
                //appendQuery3 +
                "SIDATOYYYYMMDD >= " +
                fromDate +
                " AND SIDATOYYYYMMDD <= " +
                toDate +
                " GROUP BY SIDATOYYYYMMDD";

            tx.exec(refreshQuery, [], refreshAnalysis, ssp.webdb.onError);
        });
        return false;
    }
};

function refreshAnalysis(rs) {
    var events = new Array();
    for (var i = 0; i < rs.length; i++) {
        events.push({
            title: rs[i].TOTAL.toFixed(0),
            start: formatYYYYMMDDtoMMDDYYYY(rs[i].SIDATOYYYYMMDD),
            end: formatYYYYMMDDtoMMDDYYYY(rs[i].SIDATOYYYYMMDD),
            //backgroundColor: getColorFromValue(rs[i].SITYPS)
            //  ? getColorFromValue(rs[i].SITYPS)[0].color
            //  : "",
            //textColor: "black",
            //className: "cal-event-main-cls"
        });
    }

    $("#calendar").html("");
    var calendar = $("#calendar").fullCalendar({
        height: 1,
        header: {
            left: "prev",
            center: "title",
            right: "next"
        },
        selectable: true,
        selectHelper: true,
        editable: true,
        disableDragging: true,
        events: events,
        dayClick: function (date, allDay, jsEvent, view) {
            $("#dtpAnalysisFromDate").val(formatMMDDYYYY(date));
            $("#dtpAnalysisToDate").val(formatMMDDYYYY(date));
            loadSalesList();
        },
        eventClick: function (calEvent, jsEvent, view) {
            $("#dtpAnalysisFromDate").val(formatMMDDYYYY(calEvent.start));
            $("#dtpAnalysisToDate").val(formatMMDDYYYY(calEvent.start));
            loadSalesList();
        }
    });

    $(".fc-button-prev span").click(function () {
        calendarChangeMonthClicked();
    });

    $(".fc-button-next span").click(function () {
        calendarChangeMonthClicked();
    });

    $(".fc-text-arrow span").click(function () {
        calendarChangeMonthClicked();
    });

    $("#calendar").fullCalendar(
        "gotoDate",
        new Date($("#dtpAnalysisFromDate").val())
    );
    clearSalesTabGroup();
}

function loadSalesList() {
    var listQuery = "";
    var totalSales = 0
    ssp.webdb.db.transaction(function (tx) {
        //var currDateEpoch = $.fullCalendar.formatDate(
        //  new Date(currentSelectedDate),
        //  "yyyyMMdd"
        //);
        //var selectedSalesType = $("#selSalesType option:selected").val();

        //if (selectedSalesType == "N" && currentActiveTab == "bull") {
        //  $("#analysis_list_container").html("");
        //  return false;
        //}

        //var selectedBullType = $("#selBullType option:selected").val();
        var appendQuery1 =
            $("#chkOnlyIncludeMySales").is(":checked") == true
                ? " SIREP = '" + window.localStorage.getItem("ssp_TechID") + "' AND "
                : "";
        //var appendQuery2 =
        //  selectedSalesType == ""
        //    ? ""
        //    : ' SITYPS = "' + selectedSalesType + '" AND ';
        //var appendQuery3 = "";
        //if (
        //  selectedBullType != bullTypeValueDomain[2].value &&
        //  selectedBullType != ""
        //) {
        //  appendQuery3 = ' SICOD = "' + selectedBullType + '" AND ';
        //} else if (selectedBullType == bullTypeValueDomain[2].value) {
        //  appendQuery3 =
        //    " SICOD != '" +
        //    bullTypeValueDomain[0].value +
        //    "' AND SICOD != '" +
        //    bullTypeValueDomain[1].value +
        //    "' AND ";
        //}

        if (currentActiveTab == "customer") {
            listQuery =
                "SELECT SIACT, SIANM, SUM((SIQTY * SIPRC) + CASE WHEN SIARM IS NULL THEN 0 ELSE SIARM END) AS LineAmount FROM tblSales WHERE " +
                appendQuery1 +
                //appendQuery2 +
                //appendQuery3 +
                "SIDATOYYYYMMDD >= " +
                formatMDYtoYMD($("#dtpAnalysisFromDate").val()) +
                " AND SIDATOYYYYMMDD <= " +
                formatMDYtoYMD($("#dtpAnalysisToDate").val()) +
                " GROUP BY SIACT, SIANM ORDER BY LineAmount DESC, SIACT"; //[alaSQL: Added ORDER BY SIACT]
        } else if (currentActiveTab == "bull") {
            listQuery =
                "SELECT MAX(SICOD) as SICOD, SINAM, SUM((SIQTY * SIPRC) + CASE WHEN SIARM IS NULL THEN 0 ELSE SIARM END) AS LineAmount FROM tblSales WHERE (SITYPS = 'B' OR SITYPS = 'D') AND " +
                appendQuery1 +
                //appendQuery2 +
                //appendQuery3 +
                "SIDATOYYYYMMDD >= " +
                formatMDYtoYMD($("#dtpAnalysisFromDate").val()) +
                " AND SIDATOYYYYMMDD <= " +
                formatMDYtoYMD($("#dtpAnalysisToDate").val()) +
                " GROUP BY SINAM ORDER BY LineAmount DESC,SINAM DESC"; //[alaSQL: MAX(SICOD) as SICOD and ORDER BY SINAM DESC]
        } else if (currentActiveTab == "type") {
            listQuery =
                "SELECT SITYPS, SUM((SIQTY * SIPRC) + CASE WHEN SIARM IS NULL THEN 0 ELSE SIARM END) AS LineAmount FROM tblSales WHERE " +
                appendQuery1 +
                //appendQuery2 +
                //appendQuery3 +
                "SIDATOYYYYMMDD >= " +
                formatMDYtoYMD($("#dtpAnalysisFromDate").val()) +
                " AND SIDATOYYYYMMDD <= " +
                formatMDYtoYMD($("#dtpAnalysisToDate").val()) +
                " GROUP BY SITYPS ORDER BY LineAmount DESC";
        }

        tx.exec(
            listQuery,
            [],
            function (rs) {
                if (rs.length > 0) {
                    $("#analysis_list_container").html("");
                    var rowOutput =
                        '<div class="no-margin"><table class="table" cellspacing="0" width="100%">';
                    rowOutput += "<thead><tr>";
                    if (currentActiveTab == "customer") {
                        rowOutput +=
                            '<th scope="col">Cust Num</th><th scope="col">Cust Name</th><th scope="col">Sales</th>';
                    } else if (currentActiveTab == "bull") {
                        rowOutput +=
                            '<th scope="col">Code</th><th scope="col">Name</th><th scope="col">Sales</th>';
                    } else if (currentActiveTab == "type") {
                        rowOutput += '<th scope="col">Type</th><th scope="col">Sales</th>';
                    }
                    rowOutput += "</tr></thead>";
                    rowOutput += '<tfoot><tr>';
                    rowOutput += '<td colspan="5"><img src="img/arrowCurveLeft.png" width="16" height="16" class="picto"> <b>Total:</b><div id="totalsales"></div></td>';
                    rowOutput += '</tr></tfoot><tbody>';
                    rowOutput += "<tbody>";
                    for (var i = 0; i < rs.length; i++) {
                        totalSales += rs[i].LineAmount;
                        rowOutput += "<tr>";
                        if (currentActiveTab == "customer") {
                            rowOutput += "<td>" + rs[i].SIACT + "</td>";
                            rowOutput += "<td>" + rs[i].SIANM + "</td>";
                            rowOutput += "<td>" + rs[i].LineAmount.toFixed(2) + "</td>";
                        } else if (currentActiveTab == "bull") {
                            rowOutput += "<td>" + rs[i].SICOD + "</td>";
                            rowOutput += "<td>" + rs[i].SINAM + "</td>";
                            rowOutput += "<td>" + rs[i].LineAmount.toFixed(2) + "</td>";
                        } else if (currentActiveTab == "type") {
                            //if (rs[i].SITYPS != "D") {
                            rowOutput +=
                                "<td>" +
                                //typeSalesValueDomain[rs[i].SITYPS]["title"];
                                getSalesTitleFromValue(rs[i].SITYPS)[0]["title"] +
                                //rs[i].SITYPS
                                "</td>";
                            rowOutput += "<td>" + ((rs[i].LineAmount) ? rs[i].LineAmount.toFixed(2) : "0.00") + "</td>";
                            //}
                        }
                        rowOutput += "</tr>";
                    }
                    rowOutput += "</tbody></table></div>";
                    $("#analysis_list_container").html(rowOutput);
                    toggleSalesTabGroup("show");
                    toggleSalesList("show");
                    window.location.hash = "#analysis_list_container";
                    $('#totalsales').html(totalSales.toFixed(2));
                } else {
                    clearSalesTabGroup();
                }
            },
            ssp.webdb.onError
        );
    });
}

function loadAnalysis(rs) {
    var rowOutput = '<article class="sales-analysis">';
    rowOutput +=
        '<section class="form"><div class="block-border"><div class="block-content">';
    rowOutput += "<h1>Sales Analysis</h1>";
    rowOutput += '<div id="calendar" class="calendar-sales"></div>';
    rowOutput += "</br>";
    //rowOutput += '<div id="colorLegend" class="color-legend">';
    //rowOutput += "<ul>";
    //for (var k in typeValueDomain) {
    //    rowOutput +=
    //        '<li><span class="color-cnt ' +
    //        typeValueDomain[k]["color"] +
    //        '"></span><span class="color-text-cnt">' +
    //        typeValueDomain[k]["title"] +
    //        "</span></li>";
    //}
    //rowOutput += "</ul>";
    //rowOutput += "</div>";
    //rowOutput += "</br>";
    rowOutput += '<fieldset class="grey-bg ">';
    rowOutput +=
        '<legend><a href="#" id="btnAnalysisDisplay">Criteria</a></legend>';
    rowOutput += '<p class="inline-mini-label">';
    rowOutput += '<label for="analysisFromDate">From Date</label>';
    rowOutput +=
        '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="analysisFromDate" id="dtpAnalysisFromDate" class="full-width" >';    /*JKS080818->4.03***Auto Fill Search switch*/
    rowOutput += "</p>";
    rowOutput += '<p class="inline-mini-label">';
    rowOutput += '<label for="analysisToDate">To Date</label>';
    rowOutput +=
        '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="analysisToDate" id="dtpAnalysisToDate" class="full-width" >';    /*JKS080818->4.03***Auto Fill Search switch*/
    rowOutput += "</p>";
    rowOutput += '<p class="inline-mini-label two-button-set">';
    rowOutput +=
        '<button type="button" class="float-left half-width" onclick="loadThisYear()">This Year</button>';
    rowOutput +=
        '<button type="button" class="float-right half-width" onclick="loadLastYear()">Last Year</button>';
    rowOutput += "</p>";
    //rowOutput += '<p class="inline-mini-label">';
    //rowOutput += '<label for="salesType">Sales Types</label>';
    //rowOutput +=
    //  '<select name="salesType" id="selSalesType" class="full-width" >';
    //rowOutput += '<option value="">All Sales</option>';
    //for (var k in typeValueDomain) {
    //  rowOutput +=
    //    '<option value="' +
    //    typeValueDomain[k]["value"] +
    //    '"><span class="dd-opt"></span>' +
    //    typeValueDomain[k]["title"] +
    //    "</option>";
    //}
    //rowOutput += "</select>";
    //rowOutput += "</p>";
    //rowOutput += '<p class="inline-mini-label">';
    //rowOutput += '<label for="bullType">Bull</label>';
    //rowOutput += '<select name="bullType" id="selBullType" class="full-width" >';
    //rowOutput += '<option value="">All</option>';
    //for (var j in bullTypeValueDomain) {
    //  rowOutput +=
    //    '<option value="' +
    //    bullTypeValueDomain[j]["value"] +
    //    '">' +
    //    bullTypeValueDomain[j]["title"] +
    //    "</option>";
    //}
    //rowOutput += "</select>";
    //rowOutput += "</p>";
    rowOutput += '<p class="inline-mini-label">';
    rowOutput += '<label for="onlyIncludeMySales">Only include my sales</label>';
    rowOutput +=
        '<input type="checkbox" name="onlyIncludeMySales" id="chkOnlyIncludeMySales" onclick="calendarChangeMonthClicked();" class="switch" >';
    rowOutput += "</p>";
    //rowOutput +=
    //  '<p><button id="btnAnalysisRefresh" onclick="ssp.webdb.AnalysisRefresh();" class="full-width">Refresh</button></p>';
    rowOutput += "</fieldset>";
    rowOutput += "</div></div>";
    rowOutput += "</section>";
    rowOutput += "</article>";
    rowOutput +=
        '<div class="block-controls no-margin margin-bottom-0 sales-tab-group" id="sales_tab_group">';
    rowOutput += '<ul class="controls-tabs js-tabs" class="float-right">';
    rowOutput +=
        '<li class="current"><a href="#" id="tab-customer" title="Customer">Customer</a></li>';
    rowOutput += '<li><a href="#" id="tab-bull" title="Bull">Bull</a></li>';
    rowOutput += '<li><a href="#" id="tab-type" title="Type">Type</a></li>';
    rowOutput += "</ul>";
    rowOutput += "</div>";
    rowOutput +=
        '<div id="analysis_list_container" class="analysis-list-container"></div>';
    $("#maincontent").html(rowOutput);
    //loadSalesList();
    $("#tab-customer").click(function () {
        currentActiveTab = "customer";
        loadSalesList();
    });

    $("#tab-bull").click(function () {
        currentActiveTab = "bull";
        loadSalesList();
    });

    $("#tab-type").click(function () {
        currentActiveTab = "type";
        loadSalesList();
    });

    var events = new Array();
    for (var i = 0; i < rs.length; i++) {
        //if (rs[i].SITYPS != "D") {
        events.push({
            title: rs[i].TOTAL.toFixed(0),
            start: formatYYYYMMDDtoMMDDYYYY(rs[i].SIDATOYYYYMMDD),
            end: formatYYYYMMDDtoMMDDYYYY(rs[i].SIDATOYYYYMMDD),
            //backgroundColor: getColorFromValue(rs[i].SITYPS)
            //  ? getColorFromValue(rs[i].SITYPS)[0].color
            //  : "",
            //textColor: "black",
            //className: "cal-event-main-cls"
        });
        //}
    }

    var calendar = $("#calendar").fullCalendar({
        height: 1,
        header: {
            left: "prev",
            center: "title",
            right: "next"
        },
        selectable: true,
        selectHelper: true,
        editable: true,
        disableDragging: true,
        events: events,
        dayClick: function (date, allDay, jsEvent, view) {
            $("#dtpAnalysisFromDate").val(formatMMDDYYYY(date));
            $("#dtpAnalysisToDate").val(formatMMDDYYYY(date));
            loadSalesList();
        },
        eventClick: function (calEvent, jsEvent, view) {
            $("#dtpAnalysisFromDate").val(formatMMDDYYYY(calEvent.start));
            $("#dtpAnalysisToDate").val(formatMMDDYYYY(calEvent.start));
            loadSalesList();
        }
    });

    $(".fc-button-prev span").click(function () {
        calendarChangeMonthClicked();
    });

    $(".fc-button-next span").click(function () {
        calendarChangeMonthClicked();
    });

    $(".fc-text-arrow span").click(function () {
        calendarChangeMonthClicked();
    });

    populateFromAndToDateFields();

    $("#selSalesType").val("");
    $("#selBullType").val("");
    $("#chkOnlyIncludeMySales").attr("checked", false);

    loadSalesList();
    $(document.body).applyTemplateSetup();
}

function calendarChangeMonthClicked() {
    setTimeout(function () {
        populateFromAndToDateFields();
        ssp.webdb.AnalysisRefresh();
        loadSalesList();
    }, 100);

}

function getCalendarDisplayFirstDate() {
    return $.fullCalendar.formatDate(
        $("#calendar").fullCalendar("getView").start,
        "M/d/yyyy"
    );
}

function getCalendarDisplayLastDate() {
    var currDisplayLastDate = new Date(
        $("#calendar").fullCalendar("getView").end
    );
    currDisplayLastDate = new Date(
        currDisplayLastDate.setDate(currDisplayLastDate.getDate() - 1)
    );
    currDisplayLastDate = $.fullCalendar.formatDate(
        currDisplayLastDate,
        "M/d/yyyy"
    );
    return currDisplayLastDate;
}

function loadLastYear() {
    var currentMonthValue = $.fullCalendar.formatDate(
        $("#calendar").fullCalendar("getDate"),
        "M"
    );
    currentMonthValue = (parseInt(currentMonthValue) - 1).toString();
    $("#calendar").fullCalendar("gotoDate", lastYearValue, currentMonthValue);
    calendarChangeMonthClicked();
}

function loadThisYear() {
    var currentMonthValue = $.fullCalendar.formatDate(
        $("#calendar").fullCalendar("getDate"),
        "M"
    );
    currentMonthValue = (parseInt(currentMonthValue) - 1).toString();
    $("#calendar").fullCalendar("gotoDate", thisYearValue, currentMonthValue);
    calendarChangeMonthClicked();
}

function formatToDisplayDate(sourceDate) {
    return (
        sourceDate.getMonth() +
        1 +
        "/" +
        sourceDate.getDate() +
        "/" +
        sourceDate.getFullYear()
    );
}

function getFirstLastDayOfTodaysMonth(dayType) {
    var todayDate = new Date();
    return dayType == "first"
        ? new Date(todayDate.getFullYear(), todayDate.getMonth(), 1)
        : new Date(todayDate.getFullYear(), todayDate.getMonth() + 1, 0);
}

function getColorFromValue(curr_val) {
    return curr_val == "D"
        ? false
        : $.grep(typeValueDomain, function (n, i) {
            return n.value === curr_val;
        });
}

function populateFromAndToDateFields() {
    $("#dtpAnalysisFromDate").val(getCalendarDisplayFirstDate());
    $("#dtpAnalysisToDate").val(getCalendarDisplayLastDate());
}

function toggleSalesList(disp) {
    disp == "show"
        ? $("#analysis_list_container").show()
        : $("#analysis_list_container").hide();
}

function toggleSalesTabGroup(disp) {
    disp == "show" ? $("#sales_tab_group").show() : $("#sales_tab_group").hide();
}

function clearSalesTabGroup() {
    $("#analysis_list_container").html("");
    toggleSalesList("hide");
    toggleSalesTabGroup("hide");
}

function getSalesTitleFromValue(curr_val) {
    //return curr_val == "D"
    //    ? $.grep(typeSalesValueDomain, function (n, i) {
    //        return n.value === curr_val;
    //    })
    //    :
    return $.grep(typeSalesValueDomain, function (n, i) {
        return n.value === curr_val;
    });
}
