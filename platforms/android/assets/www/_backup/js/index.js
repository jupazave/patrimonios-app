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

var URL = 'http://localhost:8080/rest/';
var BITSTREAM_URL = 'http://localhost:8080'; //Sin slash

//Demo url: https://demo.dspace.org/rest/

var SEARCH_METADATA = [
    "dc.title",
    "dc.creator",
    "dc.description.abstract",
    "dc.subject"
];

/* Va sin slash final, dado que si lo tiene sale como GET */
var URL_SOLR = "http://localhost:8080";

/*Si se quiere la carga dinamica con Scroll activar la variable y cambiar el maximo*/
var MAX = 10000;
var DINAMIC_LOAD = false;

/** Cache **/
var COLECTIONS = [];
var COMMUNITIES = [];
var ITEMS_COLECTION = [];
var COLECTION_ANT = "";
var ITEMS_COLECTION_ANT = "";
var ITEM_DETAIL = "";
var INFORMATION = {};

var COLECTION_NAME = "";
var COMMUNITY_NAME = "";

// DEFAULT CORDOVA

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        //this.receivedEvent('deviceready');
        this.initEvent();
        INFORMATION["model"] = device.model;
        INFORMATION["platform"] = device.platform;
    },

    // Update DOM on a Received Event
    /*
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
    */

    initEvent: function () {

    }
};

app.initialize();

// END DEFAULT CORDOVA

$(document).on("mobileinit", function(){

    $.mobile.linkBindingEnabled = true;
    $.mobile.hashListeningEnabled  = true;
    $.mobile.ajaxEnabled = true;
    $.mobile.defaultPageTransition = 'none';

    addHeader();
    addListeners();

    window.location.hash = 'page_Search';
});

function addHeader(){
    $("[data-role='header'], [data-role='footer']").toolbar({ theme: "a" });
}

function addListeners() {

    $(document).on("pagecontainershow", function (event, ui) {
        var idPag = ui.toPage.prop("id");
        switch(idPag){
            case "page_Search":
                showCommunitiesMini();
            break;
            default:
            break;
        }
    });

    $(document).on('pagecontainerbeforeshow', function(event, ui){
        var idPag = ui.toPage.prop("id");
        if (idPag == "page_Search") {
            $("a[data-rel='back']").hide();
        }else{
            $("a[data-rel='back']").show();
        }
    });

    $("#form_Search").on("submit", searchItem);

    if (CARGA_DINAMICA) {
        $(document).on("scrollstop", verificarScroll);  
    }

    $("#btnBorrarCache").on('click', function () {
        COLECCIONES = [];
        COMUNIDADES = [];
        ITEMS_COLECCION = [];
        COLECCION_ANT = "";
        ITEMS_COLECCION_ANT = "";
        ITEM_DETALLE = "";
        mostrarMensaje('Éxito', 'Se ha borrado exitosamente el caché');
    })
}

function showLoading() {
    $.mobile.loading('show');
}

function hideLoading() {
    $.mobile.loading('hide');
}