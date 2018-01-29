// var URL = 'http://redi.uady.mx/rest/';
// var BITSTREAM_URL = 'http://redi.uady.mx'; //Sin slash

var URL = 'http://192.168.230.108:8080/rest/';
var BITSTREAM_URL = 'http://192.168.230.108:8080'; //Sin slash
var BITSTREAM_VIEWER = 'http://192.168.230.108:8080/xmlui/bitstream/handle/'

//Demo url: https://demo.dspace.org/rest/

var METADATOS_BUSQUEDA = [
    "dc.title",
    "dc.creator",
    "dc.description.abstract",
    "dc.subject"
];

/* Va sin slash final, dado que si lo tiene sale como GET */
//var URL_SOLR = "http://redi.uady.mx:8080/busqueda-movil";
var URL_SOLR = "http://192.168.230.108/patrimonios-search/busqueda.php";

/*Si se quiere la carga dinamica con Scroll activar la variable y cambiar el maximo*/
var MAXIMO = 10000;
var CARGA_DINAMICA = false;

/** Cache **/
var COLECCIONES = [];
var COMUNIDADES = [];
var ITEMS_COLECCION = [];
var COLECCION_ANT = "";
var ITEMS_COLECCION_ANT = "";
var ITEM_DETALLE = "";
var INFORMACION = {};
var FACULTADES = [];

var NOMBRE_COLEC = "";
var NOMBRE_COMUN = "";

// --- CORDOVA

var app = {

    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.initEvent();
        INFORMACION["modelo"] = device.model;
        INFORMACION["plataforma"] = device.platform;
        INFORMACION["facultad"] = localStorage.facultad;
    },
    
    initEvent: function () { 
        
    }
};

app.initialize();

// --- CORDOVA

$(document).on("mobileinit", function () {
    $.mobile.linkBindingEnabled = true;
    $.mobile.hashListeningEnabled  = true;
    $.mobile.ajaxEnabled = true;
    $.mobile.defaultPageTransition = 'none';
    
    agregarListeners();
    configurarHeader();
    //cargarFacultades();

    window.location.hash = 'pagBuscar';
});

function configurarHeader(){
    $("[data-role='header'], [data-role='footer']").toolbar({ theme: "a" });
}

function agregarListeners() {

    $(document).on("pagecontainershow", function (event, ui) {
        var idPag = ui.toPage.prop("id");
        switch(idPag){
            case "pagBuscar":
                //resetMap();
                colocarComunidadesMini();
            break;
            case "pagComunidades":
                //resetMap();
                cargarComunidades();
            break;
            case "pagColecciones":
                var uuid = localStorage.comunidadUUID;
                mostrarColecciones(uuid);
            break;
            case "pagItems":
                var uuid = localStorage.coleccionUUID;
                mostrarItemsColeccion(uuid);
            break;
            case "pagDetalleItem":
                var uuid = localStorage.itemUUID;
                mostrarMetadatosItem(uuid);
            break;
            case "pagMapa":
                initMapa();
            break;
        }
    });

    $(document).on('pagecontainerbeforeshow', function(event, ui){
        var idPag = ui.toPage.prop("id");
        if (idPag == "pagBuscar") {
            $("a[data-rel='back']").hide();
        }else{
            $("a[data-rel='back']").show();
        }
    });

    $("#formBuscar").on("submit", buscarRecurso);

    if (CARGA_DINAMICA) {
        $(document).on("scrollstop", verificarScroll);  
    }

    /*$("#btnBorrarCache").on('click', function () {
        COLECCIONES = [];
        COMUNIDADES = [];
        ITEMS_COLECCION = [];
        COLECCION_ANT = "";
        ITEMS_COLECCION_ANT = "";
        ITEM_DETALLE = "";
        mostrarMensaje('Éxito', 'Se ha borrado exitosamente el caché');
    })*/
}

function resetMap(){

    localStorage.removeItem("itemLat");
    localStorage.removeItem("itemLng");
}

// Aquí estaba la función mostrarColecciones

// Aquí estaba previamente el código de items.js

function mostrarError(error) {
    console.log(error.source);
    console.log(error.target);
    console.log(error.code);
}

function mostrarCargando() {
    $.mobile.loading('show');
}

function mostrarCargandoMensaje(mensaje) {
    $.mobile.loading('show', {text: mensaje, textVisible: true});
}

function ocultarCargando() {
    $.mobile.loading('hide');
}

function mostrarMensaje(titulo, mensaje) {
    $("#dlgMensajeTitulo").text(titulo);
    $("#dlgMensajeTexto").text(mensaje);
    $("#popupMensaje").popup();
    $("#popupMensaje").popup("open");
}


/**
 * Verifica si al momento de detenerse el evento de scroll se ha llegado al fondo
 * de la vista.
 * 
 * @param {type} idPag Si se necesita una pagina diferente a pagItems
 * @url https://jqmtricks.wordpress.com/2014/07/15/infinite-scrolling/
 * @returns null
 */
function verificarScroll(idPag) {

    var activePage =
            $.mobile.pageContainer.pagecontainer("getActivePage"),
            screenHeight = $.mobile.getScreenHeight(),
            contentHeight = $(".ui-content", activePage).outerHeight(),
            scrolled = $(window).scrollTop(),
            header = $(".ui-header", activePage).outerHeight() - 1,
            footer = $(".ui-footer", activePage).outerHeight() - 1,
            scrollEnd = contentHeight - screenHeight + header + footer;

    if (activePage[0].id === "pagItems" && scrolled >= scrollEnd) {
        agregarMasItems();
        //callback();
    }
}