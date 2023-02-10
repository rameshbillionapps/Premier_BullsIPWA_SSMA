
var curUrl_cs = "https://ssma.s-webapi.premierselect.com/sspweb";

ssp.webdb.TimesheetDisplay = function () {
    $('#dtpTimesheetDate').val('');
    $('#chkTimesheetCode').val('');
    $('#chkTimesheetHalf').attr('checked', false);
    $('#chkTimesheetWeek').attr('checked', false);
    //get last mileage and today's date
    $('#dtpTimesheetDate').val(formatDate(Math.round(new Date().getTime() / 1000))); // prettyDate

}

ssp.webdb.TimesheetAdd = function () {
    if (!sspValidateDate(formatEpoch($('#dtpTimesheetDate').val()))) {
        alert('cannot save - invalid date');
        return false;
    } else {
        ssp.webdb.db.transaction(function (tx) {
            var currenttimeinms = new Date().getTime();
            var currenttime = Math.round(currenttimeinms / 1000);

            if ($('#chkTimesheetWeek').is(':checked')) {

                var dateArray = $('#dtpTimesheetDate').val().split("/");
                var yyyy = dateArray[2].trim();
                if (yyyy.length == 2) yyyy = (yyyy < 90) ? '20' + yyyy : '19' + yyyy;
                var weekDate = new Date(yyyy, dateArray[0] - 1, dateArray[1]);


                //var weekDate = Date($('#dtpTimesheetDate').val());
                //alert(weekDate.getDate());
                var weekLength = 5;
                var timeSheetCode = $("#chkTimesheetCode option:selected").text();
                var timeSheetHalf = $('#chkTimesheetHalf').is(':checked') ? 1 : 0;
                var workedFor = $('#txtWorkedFor').val();
                var split = $('#split').val();
                var saveDate = new Date();
                if (window.localStorage.getItem("ssp_projectid") == 'ecss') {
                    weekDate.setDate(weekDate.getDate() - (weekDate.getDay() ? (weekDate.getDay() - 1) : 6)); //If Sunday is the selected Day then book the previous week. Subtracting 6 when getDay() is 0, i.e. Sunday.
                    weekLength = 7;
                } else {
                    weekDate.setDate(weekDate.getDate() - (weekDate.getDay() - 1));
                }
                for (var i = 0; i < weekLength; i++) {
                    saveDate.setTime(weekDate.getTime() + (i * 24 * 60 * 60 * 1000));
                    tx.exec('INSERT INTO tblTimesheet (PKIDDroid,TECH_NO,TIMESHEETDATE,TIMESHEETCODE,TIMESHEETHALF,WORKEDFOR,SPLIT,MOD,MODSTAMP) VALUES (?,?,?,?,?,?,?,?,?)', [(currenttimeinms + i + '.' + window.localStorage.getItem("ssp_TechID")), window.localStorage.getItem("ssp_TechID"), (saveDate.getTime() / 1000) | 0, timeSheetCode, timeSheetHalf, workedFor, split, 1, currenttime], ssp.webdb.getTimesheet, ssp.webdb.onError); //$('#chkTimesheetHalf').attr('checked')
                }

            }
            else {
                tx.exec('INSERT INTO tblTimesheet (PKIDDroid,TECH_NO,TIMESHEETDATE,TIMESHEETCODE,TIMESHEETHALF,WORKEDFOR,SPLIT,MOD,MODSTAMP) VALUES (?,?,?,?,?,?,?,?,?)', [(currenttimeinms + '.' + window.localStorage.getItem("ssp_TechID")), window.localStorage.getItem("ssp_TechID"), formatEpoch($('#dtpTimesheetDate').val()), $("#chkTimesheetCode option:selected").text(), (($('#chkTimesheetHalf').is(':checked')) ? 1 : 0), $('#txtWorkedFor').val(), $('#split').val(), 1, currenttime], ssp.webdb.getTimesheet, ssp.webdb.onError); //$('#chkTimesheetHalf').attr('checked')
            }
        });
        return false;
    }
}

ssp.webdb.getTimesheet = function () {
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('SELECT * FROM tblTimesheet ORDER BY TIMESHEETDATE DESC', [], loadTimesheet, ssp.webdb.onError);
    });
}

ssp.webdb.deleteTimesheet = function (PKID) {
    var pkid = PKID.split('.')[0];
    if (window.localStorage.getItem("ssp_urldata") == curUrl_cs) {
        if ($("#del" + pkid).attr("class") == "button red") {
            ssp.webdb.db.transaction(function (tx) {
                tx.exec('DELETE FROM tblTimesheet WHERE PKIDDroid = ?', [PKID], ssp.webdb.getTimesheet, ssp.webdb.onError);
            });
        } else {
            $("#del" + pkid).removeClass("button").addClass("button red");
            $("#del" + pkid).html($("#del" + pkid).html() + 'sure?');
        }
    }
    else {
        ssp.webdb.db.transaction(function (tx) {
            tx.exec('DELETE FROM tblTimesheet WHERE PKIDDroid = ?', [PKID], ssp.webdb.getTimesheet, ssp.webdb.onError);
        });
    }
}

ssp.webdb.setTimesheetCount = function () {
    ssp.webdb.db.transaction(function (tx) {
        tx.exec('SELECT COUNT(*) AS cntTimesheet FROM tblTimesheet', [],
            function (rs) {
                if (rs.length > 0) {
                    $('#sideTimesheetCount').html(rs[0].cntTimesheet);
                }
            }, ssp.webdb.onError);
    });
}

function loadTimesheet(rs) {
    var events = new Array();
    var rowOutput = '<article>';
    rowOutput += '<section id="login-block" style="margin-bottom: 0px;"><div class="block-border"><div class="block-content">';
    rowOutput += '<h1>Timesheet List</h1>';
    rowOutput += '<div id="calendar"></div>';
    rowOutput += '</br>';
    rowOutput += '<form class="form" onsubmit="return ssp.webdb.TimesheetAdd();" >';
    rowOutput += '<fieldset class="grey-bg "  >';
    rowOutput += '<legend><a href="#" id="btnTimesheetDisplay">Add Time</a></legend>';
    rowOutput += '<p class="inline-mini-label">';
    rowOutput += '<label for="date">Date</label>';
    rowOutput += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="date" id="dtpTimesheetDate" class="full-width" >';      /*JKS080818->4.03***Auto Fill Search switch*/
    rowOutput += '</p>';
    if (window.localStorage.getItem("ssp_projectid") != 'ecss') {
        rowOutput += '<p class="inline-mini-label">';
        rowOutput += '<label for="halfday">Half Day</label>';
        rowOutput += '<input type="checkbox" name="halfday" id="chkTimesheetHalf" class="switch" >';
        rowOutput += '</p>';
    }
    rowOutput += '<p class="inline-mini-label">';
    rowOutput += '<label for="code">Code</label>';
    rowOutput += '<select name="code" id="chkTimesheetCode" class="full-width" >';
    if (window.localStorage.getItem("ssp_projectid") == 'ecss') {
        rowOutput += '<option value="A.Work">A.Work</option>';
        rowOutput += '<option value="B.Vacation">B.Vacation</option>';
        rowOutput += '<option value="C.Team Wkday">C.Team Wkday</option>';
        rowOutput += '<option value="D.Team Wkend">D.Team Wkend</option>';
        rowOutput += '<option value="E.Charge">E.Charge</option>';
        rowOutput += '<option value="F.Sick">F.Sick</option>';
        rowOutput += '<option value="G.Holiday">G.Holiday</option>';
        rowOutput += '<option value="H.Open">H.Open</option>';
        rowOutput += '<option value="I.Help">I.Help</option>';
        rowOutput += '<option value="J.Off No Pay">J.Off No Pay</option>';
        rowOutput += '<option value="K.Alternate Role">K.Alternate Role</option>';
        rowOutput += '<option value="L.Bereavement">L.Bereavement</option>';
    } else {
        rowOutput += '<option value="work">work</option>';
        rowOutput += '<option value="holiday">holiday</option>';
        rowOutput += '<option value="dayoff">day off</option>';
        rowOutput += '<option value="bereavement">bereavement</option>';
        rowOutput += '<option value="vacation">vacation</option>';
        rowOutput += '<option value="sickday">sick day</option>';
    }
    rowOutput += '</select>';
    rowOutput += '</p>';

    rowOutput += '<p class="inline-mini-label">';
    rowOutput += '<label for="week">Week</label>';
    rowOutput += '<input type="checkbox" name="week" id="chkTimesheetWeek" class="switch" title="Enter time for whole week (Monday-Friday)." >';
    rowOutput += '</p>';
    //if (window.localStorage.getItem("ssp_projectid") == 'ecss') {
    //    rowOutput += '<p class="inline-mini-label">';
    //    rowOutput += '<label for="workedfor">Area(s) Worked</label>';
    //    rowOutput += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="workedfor" id="txtWorkedFor" class="full-width" >';
    //    rowOutput += '<span style="color:red" id="errortxtWorkedFor"></span>';
    //    rowOutput += '</p>';
    //}
    if (window.localStorage.getItem("ssp_urldata") == curUrl_cs) {
        rowOutput += '<p class="inline-mini-label">';
        rowOutput += '<label for="workedfor">Area(s) Worked</label>';
        rowOutput += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="workedfor" id="txtWorkedFor" class="full-width" >';
        rowOutput += '<span style="color:red" id="errortxtWorkedFor"></span>';
        rowOutput += '</p>';

        rowOutput += '<p class="inline-mini-label">';
        rowOutput += '<label for="Split">% Split</label>';
        rowOutput += '<input type="text" name="split" autocomplete="off" id="split" class="full-width"/>';
        rowOutput += '<span style="color:red;display:none;" id="errorSplit">Only number and / or - accepted !</span>';
    }
    rowOutput += '</p>';

    rowOutput += '<p><button id="btnTimesheetAdd" class="full-width">Add Time</button></p>';
    rowOutput += '</fieldset>';
    rowOutput += '</br>';
    rowOutput += '<fieldset class="grey-bg "  >';
    rowOutput += '<legend><a href="#" >Detail</a></legend>';
    rowOutput += '<div class="no-margin"><table class="table" cellspacing="0" width="100%">';
    rowOutput += '<thead>';
    rowOutput += '<tr>';
    rowOutput += '<th scope="col">Date</th>';
    rowOutput += '<th scope="col">Code</th>';

    if (window.localStorage.getItem("ssp_urldata") == curUrl_cs) {
        rowOutput += '<th scope="col">Area(s) Worked</th>';
        rowOutput += '<th scope="col">% Split</th>';
    } else {
        rowOutput += '<th scope="col">Half Day</th>';
    }
    rowOutput += '<th scope="col" style="width:35px"></th>';
    rowOutput += '</tr></thead><tbody>';
    for (var i = 0; i < rs.length; i++) {

        var eventDesc = ((rs[i].TIMESHEETHALF == 1) ? '.6' : '');
        var eventBackColor = ((rs[i].MOD == 1) ? '' : 'green');
        if (window.localStorage.getItem("ssp_projectid") == 'ecss') {
            eventDesc = rs[i].TIMESHEETCODE.substring(0, 6);
        } else {
            switch (rs[i].TIMESHEETCODE) {
                case 'work':
                    eventDesc = 'wrk ' + eventDesc;
                    break;
                case 'holiday':
                    eventDesc = 'hol ' + eventDesc;
                    break;
                case 'day off':
                    eventDesc = 'off ' + eventDesc;
                    break;
                case 'bereavement':
                    eventDesc = 'ber ' + eventDesc;
                    break;
                case 'vacation':
                    eventDesc = 'vac ' + eventDesc;
                    break;
                case 'sick day':
                    eventDesc = 'sck ' + eventDesc;
                    break;
            }
        }

        event = new Object();
        event.title = eventDesc;
        event.start = formatDate(rs[i].TIMESHEETDATE);
        event.backgroundColor = eventBackColor;
        events.push(event);
        rowOutput += '<tr><td>' + formatDate(rs[i].TIMESHEETDATE) + '</td>';
        rowOutput += '<td>' + rs[i].TIMESHEETCODE + '</td>';
        if (window.localStorage.getItem("ssp_urldata") == curUrl_cs) {
            rowOutput += '<td>' + rs[i].WORKEDFOR + '</td>';
            rowOutput += '<td>' + rs[i].SPLIT + '</td>';
        } else {
            rowOutput += '<td>' + ((rs[i].TIMESHEETHALF == 1) ? 'yes' : 'no') + '</td>';
        }
        rowOutput += '<td>';
        if (rs[i].MOD == 1) {
            rowOutput += '<a role="button" class="button" style="cursor:pointer;" title="delete" id="del' + rs[i].PKIDDroid.split('.')[0] + '"  onclick="ssp.webdb.deleteTimesheet(' + "'" + rs[i].PKIDDroid + "'" + ')"><img src="img/bin.png" width="16" height="16"></a>';
        }
        rowOutput += '</td></tr>';
        rowOutput += '</fieldset>';
        rowOutput += '</form>';
    }
    rowOutput += '</tbody></table></div></div></div></section></article>';
    $('#maincontent').html(rowOutput);

    var calendar = $('#calendar').fullCalendar({
        header: {
            left: 'prev',
            center: 'title',
            right: 'next'
        },
        selectable: true,
        selectHelper: true,
        select: function (start, end, allDay) {
            $('#dtpTimesheetDate').val((start.getMonth() + 1) + '/' + start.getDate() + '/' + start.getFullYear());
            $('#dtpMileageDate').val((start.getMonth() + 1) + '/' + start.getDate() + '/' + start.getFullYear());
        },
        editable: true,
        events: events
    });

    //current date for #dtpTimesheetDate input field start
    var today = new Date();
    var resd = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
    $('#dtpTimesheetDate').val(resd);

    //validation for #workedFor input field
    $('#btnTimesheetAdd').click(function () {

        if ($('#txtWorkedFor').val() != '') {
            var regex1 = /^[a-zA-Z0-9 /,.-]+$/;
            if (regex1.test($('#txtWorkedFor').val())) {
                $('#errortxtWorkedFor').css('display', 'none');
            }
            else {
                $('#errortxtWorkedFor').html("Area(s) worked field allows only numbers, letters, spaces and special characters slash(/), hyphen(-), comma(,) and period(.)");
                $('#errortxtWorkedFor').css('display', 'block');
                return false;
            }
            loadTimesheet();
        }

        var isValid = false;
        var regex = /^[0-9-/]*$/;
        isValid = regex.test($('#split').val());
        if (isValid)
            $('#errorSplit').css('display', 'none');
        else {
            $('#errorSplit').css('display', 'block');
            isValid = false;
        }
        return isValid;
    });

    $(document.body).applyTemplateSetup();

    ssp.webdb.getMileage();
}

