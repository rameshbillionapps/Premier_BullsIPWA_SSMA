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
        if (window.localStorage.getItem("ssp_projectid") == 'ecss') {
            ssp.webdb.db.transaction(function (tx) {
                var currenttime = Math.round(new Date().getTime() / 1000);
                if ($('#chkTimesheetWeek').is(':checked')) {

                    var dateArray = $('#dtpTimesheetDate').val().split("/");
                    var yyyy = dateArray[2].trim();
                    if (yyyy.length == 2) yyyy = (yyyy < 90) ? '20' + yyyy : '19' + yyyy;
                    var weekDate = new Date(yyyy, dateArray[0] - 1, dateArray[1]);


                    //var weekDate = Date($('#dtpTimesheetDate').val());
                    //alert(weekDate.getDate());
                    weekDate.setDate(weekDate.getDate() - (weekDate.getDay() - 1));
                    var saveDate = new Date();
                    for (var i = 0; i < 5; i++) {
                        saveDate.setTime(weekDate.getTime() + (i * 24 * 60 * 60 * 1000));
                        tx.executeSql('INSERT INTO tblTimesheet (PKIDDroid,TECH_NO,TIMESHEETDATE,TIMESHEETCODE,TIMESHEETHALF,WORKEDFOR,MOD,MODSTAMP) VALUES (?,?,?,?,?,?,?,?)', [(currenttime + i + '.' + window.localStorage.getItem("ssp_TechID")), window.localStorage.getItem("ssp_TechID"), (saveDate.getTime() / 1000) | 0, $("#chkTimesheetCode option:selected").text(), (($('#chkTimesheetHalf').is(':checked')) ? 1 : 0), $('#txtWorkedFor').val(), 1, currenttime], ssp.webdb.getTimesheet(), ssp.webdb.onError); //$('#chkTimesheetHalf').attr('checked')
                    }

                }
                else {
                    tx.executeSql('INSERT INTO tblTimesheet (PKIDDroid,TECH_NO,TIMESHEETDATE,TIMESHEETCODE,TIMESHEETHALF,WORKEDFOR,MOD,MODSTAMP) VALUES (?,?,?,?,?,?,?,?)', [(currenttime + '.' + window.localStorage.getItem("ssp_TechID")), window.localStorage.getItem("ssp_TechID"), formatEpoch($('#dtpTimesheetDate').val()), $("#chkTimesheetCode option:selected").text(), (($('#chkTimesheetHalf').is(':checked')) ? 1 : 0), $('#txtWorkedFor').val(), 1, currenttime], ssp.webdb.getTimesheet(), ssp.webdb.onError); //$('#chkTimesheetHalf').attr('checked')
                }
            });
        } else {
            ssp.webdb.db.transaction(function (tx) {
                var currenttime = Math.round(new Date().getTime() / 1000);
                if ($('#chkTimesheetWeek').is(':checked')) {

                    var dateArray = $('#dtpTimesheetDate').val().split("/");
                    var yyyy = dateArray[2].trim();
                    if (yyyy.length == 2) yyyy = (yyyy < 90) ? '20' + yyyy : '19' + yyyy;
                    var weekDate = new Date(yyyy, dateArray[0] - 1, dateArray[1]);


                    //var weekDate = Date($('#dtpTimesheetDate').val());
                    //alert(weekDate.getDate());
                    weekDate.setDate(weekDate.getDate() - (weekDate.getDay() - 1));
                    var saveDate = new Date();
                    for (var i = 0; i < 5; i++) {
                        saveDate.setTime(weekDate.getTime() + (i * 24 * 60 * 60 * 1000));
                        tx.executeSql('INSERT INTO tblTimesheet (PKIDDroid,TECH_NO,TIMESHEETDATE,TIMESHEETCODE,TIMESHEETHALF,MOD,MODSTAMP) VALUES (?,?,?,?,?,?,?)', [(currenttime + i + '.' + window.localStorage.getItem("ssp_TechID")), window.localStorage.getItem("ssp_TechID"), (saveDate.getTime() / 1000) | 0, $("#chkTimesheetCode option:selected").text(), (($('#chkTimesheetHalf').is(':checked')) ? 1 : 0), 1, currenttime], ssp.webdb.getTimesheet(), ssp.webdb.onError); //$('#chkTimesheetHalf').attr('checked')
                    }

                }
                else {
                    tx.executeSql('INSERT INTO tblTimesheet (PKIDDroid,TECH_NO,TIMESHEETDATE,TIMESHEETCODE,TIMESHEETHALF,MOD,MODSTAMP) VALUES (?,?,?,?,?,?,?)', [(currenttime + '.' + window.localStorage.getItem("ssp_TechID")), window.localStorage.getItem("ssp_TechID"), formatEpoch($('#dtpTimesheetDate').val()), $("#chkTimesheetCode option:selected").text(), (($('#chkTimesheetHalf').is(':checked')) ? 1 : 0), 1, currenttime], ssp.webdb.getTimesheet(), ssp.webdb.onError); //$('#chkTimesheetHalf').attr('checked')
                }
            });
        }

        return false;
    }
}

ssp.webdb.getTimesheet = function () {
    ssp.webdb.db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM tblTimesheet ORDER BY TIMESHEETDATE DESC', [], loadTimesheet, ssp.webdb.onError);
    });
}

ssp.webdb.deleteTimesheet = function (PKID) {
    ssp.webdb.db.transaction(function (tx) {
        tx.executeSql('DELETE FROM tblTimesheet WHERE PKIDDroid = ?', [PKID], ssp.webdb.getTimesheet(), ssp.webdb.onError);
    });
}

ssp.webdb.setTimesheetCount = function () {
    ssp.webdb.db.transaction(function (tx) {
        tx.executeSql('SELECT COUNT(*) AS cntTimesheet FROM tblTimesheet', [],
            function (tx, rs) {
                if (rs.rows.length > 0) {
                    $('#sideTimesheetCount').html(rs.rows.item(0).cntTimesheet);
                }
            }, ssp.webdb.onError);
    });
}

function loadTimesheet(tx, rs) {
    var events = new Array();
    var rowOutput = '<article>';
    rowOutput += '<section id="login-block"><div class="block-border"><div class="block-content">';
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
    if (window.localStorage.getItem("ssp_projectid") !== 'ecss') {
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
        rowOutput += '<option value="B.Vacation">B. Vacation</option>';
        rowOutput += '<option value="C.Team Week Day Off">C.Team Week Day Off</option>';
        rowOutput += '<option value="D.Team Weekend Off">D.Team Weekend Off</option>';
        rowOutput += '<option value="E.Sick">E.Sick</option>';
        rowOutput += '<option value="F.Holiday">F.Holiday</option>';
        rowOutput += '<option value="G.Open">G.Open</option>';
        rowOutput += '<option value="H.Help">H.Help</option>';
        rowOutput += '<option value="I.Day Off No Pay">I.Day Off No Pay</option>';
        rowOutput += '<option value="J.Alternate Service">J.Alternate Service</option>';
        rowOutput += '<option value="K.Personal">K.Personal</option>';
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
    if (window.localStorage.getItem("ssp_projectid") == 'ecss') {
        rowOutput += '<p class="inline-mini-label">';
        rowOutput += '<label for="workedfor">Worked For - %</label>';
        rowOutput += '<input type="text" autocomplete="' + window.localStorage.getItem("ssp_autofillsearch") + '" name="workedfor" id="txtWorkedFor" class="full-width" >';
        rowOutput += '</p>';
    }
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
    if (window.localStorage.getItem("ssp_projectid") == 'ecss') {
        rowOutput += '<th scope="col">Worked For</th>';
    } else {
        rowOutput += '<th scope="col">Half Day</th>';
    }
    rowOutput += '<th scope="col" style="width:35px"></th>';
    rowOutput += '</tr></thead><tbody>';
    for (var i = 0; i < rs.rows.length; i++) {
        var eventDesc = ((rs.rows.item(i).TIMESHEETHALF == 1) ? '.5' : '');
        var eventBackColor = ((rs.rows.item(i).MOD == 1) ? '' : 'green');
        if (window.localStorage.getItem("ssp_projectid") == 'ecss') {
            eventDesc = rs.rows.item(i).TIMESHEETCODE.substring(0, 6);
        } else {
            switch (rs.rows.item(i).TIMESHEETCODE) {
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
        event.start = formatDate(rs.rows.item(i).TIMESHEETDATE);
        event.backgroundColor = eventBackColor;
        events.push(event);
        rowOutput += '<tr><td>' + formatDate(rs.rows.item(i).TIMESHEETDATE) + '</td>';
        rowOutput += '<td>' + rs.rows.item(i).TIMESHEETCODE + '</td>';
        if (window.localStorage.getItem("ssp_projectid") == 'ecss') {
            rowOutput += '<td>' + rs.rows.item(i).WORKEDFOR + '</td>';
        } else {
            rowOutput += '<td>' + ((rs.rows.item(i).TIMESHEETHALF == 1) ? 'yes' : 'no') + '</td>';
        }
        rowOutput += '<td>';
        if (rs.rows.item(i).MOD == 1) {
            rowOutput += '<a href="#" class="button" title="delete" onclick="ssp.webdb.deleteTimesheet(' + "'" + rs.rows.item(i).PKIDDroid + "'" + ')"><img src="img/bin.png" width="16" height="16"></a>';
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

        },
        editable: true,
        events: events
    });

    $(document.body).applyTemplateSetup();

}

