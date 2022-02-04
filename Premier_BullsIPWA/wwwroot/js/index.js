/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        //var parentElement = document.getElementById(id);
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');

        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');

        //console.log('Received Event: ' + id);
        if (window.localStorage.getItem('ssp_project_installed')) {
            if (window.localStorage.getItem("ssp_TechID")) {
                ssp.webdb.open();
                if (window.localStorage.getItem('ssp_initial_sync')) {
                    ssp.webdb.loadHome();
                } else {
                    ssp.webdb.loadHome();
                    ssp.webdb.loadSync();
                }
            } else {
                ssp.webdb.loadLogin();
            }
        } else {
            //	        alert('Need to Install Database.');
            window.localStorage.setItem('ssp_project_dbsize', 5);
            window.localStorage.setItem('ssp_project_dbname', randomString());
            ssp.webdb.open();
            ssp.webdb.createTables();
            window.localStorage.setItem('ssp_project_installed', 1);
            window.localStorage.setItem('ssp_project_version', '1.1');
            window.localStorage.setItem('ssp_urldata', 'http://199.224.124.157/SSPweb/SSPweb');
            window.localStorage.setItem('ssp_orderpdf', '/mnt/sdcard/external_sd/');
            window.localStorage.setItem('ssp_nitroprice', '25');
            window.localStorage.setItem('ssp_armprice', '10');
            window.localStorage.setItem('ssp_thankyou', 'Thank you for your order.');
            window.localStorage.setItem('ssp_techfunc', 0);
            window.localStorage.setItem('ssp_addrsearch', 1);
            window.localStorage.setItem('ssp_custsalesbubble', 1);
            window.localStorage.setItem('ssp_lastmileage', 0);
            window.localStorage.setItem('ssp_autobackup', 1);
            window.localStorage.setItem('ssp_lastbackup', 0);
            window.localStorage.setItem('ssp_nitrodays', 30);
            //	        alert('database installed - need to sync');
            ssp.webdb.loadLogin();
        }
    }
};
