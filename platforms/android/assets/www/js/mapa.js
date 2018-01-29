var CURRENT_POSITION_MARKER = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
var PATRIMONIO_MARKER = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';

/*$( document ).on( "pageinit", "#pagMapa", function() {
    var defaultLatLng = new google.maps.LatLng(20.9802, -89.7029);  // Default to Mérida when no geolocation support
    if ( navigator.geolocation ) {
        // Find the users current position.  Cache the location for 5 minutes, timeout after 6 seconds
        navigator.geolocation.getCurrentPosition(success, fail, {maximumAge: 500000, enableHighAccuracy:false, timeout: 20000});
    } else {
        drawMap(defaultLatLng);  // No geolocation support, show default map
    }
});*/

function initMapa(){

    mostrarCargando();

    var defaultLatLng = new google.maps.LatLng(20.9802, -89.7029);  // Default to Mérida when no geolocation support
    if ( navigator.geolocation ) {
        // Find the users current position.  Cache the location for 5 minutes, timeout after 20 seconds
        navigator.geolocation.getCurrentPosition(success, fail, {maximumAge: 500000, enableHighAccuracy:false, timeout: 20000});
    } else {
        drawMap(defaultLatLng);  // No geolocation support, show default map
    }
}

function success(pos) {
    // Location found, show map with these coordinates

    var map;
    var currentLatLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
    
    if( localStorage.itemLat && localStorage.itemLng ){

        var itemLatLng = new google.maps.LatLng(localStorage.itemLat, localStorage.itemLng);
        map = drawMap(itemLatLng);
        //drawMarker(itemLatLng, PATRIMONIO_MARKER, map);
    }
    else{
        map = drawMap(currentLatLng);
    }
    
    // Draw current position marker.
    drawMarker(currentLatLng, CURRENT_POSITION_MARKER, map);
    
    // Draw all patrimonios.
    searchPatrimoniosToDraw(map);

    ocultarCargando();
}

function fail(error) {
    //drawMap(defaultLatLng);  // Failed to find location, show default map
    console.warn('ERROR(' + error.code + '): ' + error.message);
}

function drawMap(latLng) {
    var myOptions = {
        zoom: 15,
        center: latLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
    return map;
}

function drawMarker(latLng, icon, map){
    // Add an overlay to the map of current lat/lng
    var marker = new google.maps.Marker({
        position: latLng,
        icon: icon,
        map: map
    });
    return marker;
}

// Accede a todos los items del repositorio.
function searchPatrimoniosToDraw(map){

    $.ajax( datosAjax(URL + 'items') ).done(function (resp) {
        if (resp.length < 1) {
            // nothing.
        }
        searchAllItemsMetadata(resp, map);
    });
}

// Utiliza el uuid de todos los items para acceder al metadata.
function searchAllItemsMetadata(items, map){
    
    for (var i = 0; i < items.length; i++) {

        searchAllItemsLatLng(map, items[i].uuid);
    }
}

// Accede a todo el metadata de todos los items del repositorio.
function searchAllItemsLatLng(map, uuid){
    $.ajax( datosAjax(URL + "items/" + uuid + "/metadata") ).done(function (resp) {
        var lat;
        var lon;
        var contentString;
        for (var i = 0; i < resp.length; i++) {

            var llave = resp[i].key;
            var valor = resp[i].value;

            if(llave == "arq.Latitud" && valor != ""){
                lat = valor;
            }
            if(llave == "arq.Longitud" && valor != ""){
                lon = valor;
            }
            if(llave == "arq.Nombre" && valor != ""){
                contentString = '<div class="hardTest"><h3><a id="'+uuid+'"href="#">'+valor+'</a></h3></div>';
            }
        }
        if(lat != "" && lon != ""){
            
            var latlon = new google.maps.LatLng(lat, lon);
            drawPatrimonio(latlon, contentString, map);
        }
    });
}

function drawPatrimonio(latLng, contentString, map){

    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    var marker = drawMarker(latLng, PATRIMONIO_MARKER, map);
    
    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });

    google.maps.event.addListener(infowindow,'domready',function(){
        
        $('.hardTest a').click(function() {

            console.log("Detalle de item: " + this.id);
            localStorage.itemUUID = this.id;
            $(":mobile-pagecontainer").pagecontainer("change", "#pagDetalleItem");
        });
    });
}