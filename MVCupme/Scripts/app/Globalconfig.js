
var dominio = "http://arcgis.simec.gov.co:6080"; //Dominio del arcgis server  "http://localhost:6080" //


//Servicios Informacion Fondos.
var urlHostDataFO = "/arcgis/rest/services/UPME_FO/UPME_FO_Indicadores_Proyecto/";
//var urlHostDataFO = "/arcgis/rest/services/UPME/UPME_FO_INDICADORES_PROYECTO/";

//Servicio de Divicion politica de Arcgis
var urlHostDP = "/arcgis/rest/services/UPME_BC/UPME_BC_Sitios_UPME_Division_Politica/";



var geojsonMarkerSinAprobar = { icon: L.AwesomeMarkers.icon({ icon: 'home', prefix: 'fa', markerColor: 'orange' }), riseOnHover: true };
var geojsonMarkerSubEstacion = { icon: L.AwesomeMarkers.icon({ icon: 'bolt', prefix: 'fa', markerColor: 'cadetblue' }), riseOnHover: true };
var geojsonMarkerSubEstacionEdit = { icon: L.AwesomeMarkers.icon({ icon: 'bolt', prefix: 'fa', markerColor: 'orange' }), riseOnHover: true };

var arrayclases = [], arrayTension = [];



/***********************************
 // CONFIGURACION DE MAPA
 ***********************************/
var southWest = L.latLng(-15, -90),
    northEast = L.latLng(30, -60),
    bounds = L.latLngBounds(southWest, northEast);

var map = L.map('map', {
    center: [4.12521648, -74.5020],
    zoom: 5,
    minZoom: 5,
    maxZoom:11,
    maxBounds: bounds,
    zoomControl: false
});

new L.Control.Zoom({ position: 'topright' }).addTo(map);

/*********************************
//CONFIGURACION DE FORMATO
**********************************/
var legend = L.control({ position: 'bottomright' });
var pagina = document.URL.split("/");
var Nombrepagina = pagina[pagina.length - 1];
Nombrepagina = Nombrepagina.replace("#", "");
var prefijo = "";
if (Nombrepagina == "") {
    prefijo = "./";
}else{
    prefijo = "../";
}

var Limitesleyenda = [
    0,
    1,
    1000000000,
    2000000000,
    5000000000,
    10000000000,
    20000000000,
    50000000000,
    100000000000];

function getColor(d) {
    return d >= Limitesleyenda[8] ? '#800026' :
            d >= Limitesleyenda[7] ? '#BD0026' :
            d >= Limitesleyenda[6] ? '#E31A1C' :
            d >= Limitesleyenda[5] ? '#FC4E2A' :
            d >= Limitesleyenda[4] ? '#FD8D3C' :
            d >= Limitesleyenda[3] ? '#FEB24C' :
            d >= Limitesleyenda[2] ? '#FED976' :
            d >= Limitesleyenda[1] ? '#FFEDA0' :
              'rgba(255,255,255,0.8)';
}

legend.onAdd = function (map) {
  
    var div = L.DomUtil.create('div', 'info legend'),
       
       labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    div.innerHTML += '<b>Valor Total </b><br>';

    for (var i = 0; i < Limitesleyenda.length; i++) {
        if (i == 0) {
            div.innerHTML +=
            '<i style="background:' + getColor(Limitesleyenda[i] + 1) + '"></i> ' +
            numeral(Limitesleyenda[i]).format('$0,0')  +'&ndash;' + '<br>' ;
        } else {
            div.innerHTML +=
            '<i style="background:' + getColor(Limitesleyenda[i] + 1) + '"></i> ' +
            numeral(Limitesleyenda[i]).format('$0,0') + (numeral(Limitesleyenda[i + 1]).format('$0,0') ? '&ndash;' + numeral(Limitesleyenda[i + 1]).format('$0,0') + '<br>' : '+');
        }
    }
    div.innerHTML += '<b>Convenciones </b><br>';

    div.innerHTML += '<i ><img src="' + prefijo + 'images/leyend/municipioSelecionado.png"  height="17px"></i>Municipio Seleccionado<br>';
    return div;
};

$("#BtnMonstrarConven").click(function () {
    if ($(".legend").is(":visible")) {
        $(".legend").hide("slow", function () {
            $("#textlegend").empty().append("Mostrar");
        });
    } else {
        $(".legend").show("slow", function () {
            $("#textlegend").empty().append("Ocultar");
        });
    }
    
});






/*********************************
//CAPAS BASE 
**********************************/

// Activacion de carousel
$('.carousel').carousel({
    interval: 7000
});

var OpenMapSurfer_Roads = L.tileLayer('http://openmapsurfer.uni-hd.de/tiles/roads/x={x}&y={y}&z={z}', {
    minZoom: 0,
    maxZoom: 20,
    attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

var LyrBase = L.esri.basemapLayer('Imagery').addTo(map);;
var LyrLabels;

function setBasemap(basemap) {
    if (map.hasLayer(LyrBase)) {
        map.removeLayer(LyrBase);
    }
    if (basemap != "OSM") {
        LyrBase = L.esri.basemapLayer(basemap);
    } else {
        LyrBase = OpenMapSurfer_Roads;
    }
    map.addLayer(LyrBase);
    $(".esri-leaflet-logo").hide();
    $(".leaflet-control-attribution").hide();
}

$("#BaseESRIStreets, #BaseESRISatellite, #BaseESRITopo, #BaseOSM").click(function () {
    setBasemap($(this).attr('value'));
})

$(".esri-leaflet-logo").hide();
$(".leaflet-control-attribution").hide();

var osm2 = L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
    minZoom: 2,
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'examples.map-i875mjb7'
});

var miniMap = new L.Control.MiniMap(osm2, { toggleDisplay: true, width: 190, height: 90, zoomLevelOffset: -6 });

//miniMap.addTo(map);

var promptIcon = ['glyphicon-fullscreen'];
var hoverText = ['Extensión Total'];
var functions = [function () {
    map.setView([4.12521648, -74.5020], 5);
}];


$(function () {
    for (i = 0; i < promptIcon.length ; i++) {
        var funk = 'L.easyButton(\'' + promptIcon[i] + '\', <br/>              ' + functions[i] + ',<br/>             \'' + hoverText[i] + '\'<br/>            )'
        $('#para' + i).append('<pre>' + funk + '</pre>')
        explaination = $('<p>').attr({ 'style': 'text-align:right;' }).append('This created the <i class="' + promptIcon[i] + (promptIcon[i].lastIndexOf('fa', 0) === 0 ? ' fa fa-lg' : ' glyphicon') + '"></i> button.')
        $('#para' + i).append(explaination)
        L.easyButton(promptIcon[i], functions[i], hoverText[i])
    } (i);
});
/*var MapLayerLimitesDane = L.esri.dynamicMapLayer(dominio +urlHostDP+ 'MapServer', {
    layers: [2, 3]
}).addTo(map);

MapLayerLimitesDane.on('load', function (e) {
    MapLayerLimitesDane.bringToBack();
});*/


$('#date_ini').datetimepicker({
    format: 'DD/MM/YYYY',
    locale: 'es',
    defaultDate: '01/01/' + moment().format('YYYY')
});
$('#date_fin').datetimepicker({
    format: 'DD/MM/YYYY',
    locale: 'es',
    defaultDate: moment()
});



var arrayFondos = [];
var query_fondos = L.esri.Tasks.query({
    url: dominio + urlHostDataFO + 'MapServer/3'
});

query_fondos.where("1='1'").returnGeometry(false).run(function (error, featureCollection) {
    var data = [];
    $.each(featureCollection.features.reverse(), function (index, value) {
        arrayFondos[value.properties.ID_FONDO] = value.properties.SIGLA;
        var array = { label: value.properties.SIGLA+" - "+value.properties.NOMBRE, value: value.properties.ID_FONDO};
        data.push(array);
    });
    $("#SelctFondo").multiselect('dataprovider', data);
});


var arraySectores = [];
var query_sectores = L.esri.Tasks.query({
    url: dominio + urlHostDataFO + 'MapServer/4'
});

query_sectores.where("1='1'").returnGeometry(false).run(function (error, featureCollection) {
    var data = [];
    $.each(featureCollection.features.reverse(), function (index, value) {
        arraySectores[value.properties.ID_SECTOR] = value.properties.SIGLA;
        var array = { label: value.properties.SIGLA + " - " + value.properties.NOMBRE, value: value.properties.ID_SECTOR };
        data.push(array);
    });
    $("#SelctSectores").multiselect('dataprovider', data);
});



var arrayConcepto = [];
var query_Concepto = L.esri.Tasks.query({
    url: dominio + urlHostDataFO + 'MapServer/5'
});

query_Concepto.where("1='1'").returnGeometry(false).run(function (error, featureCollection) {
    var data = [];
    $.each(featureCollection.features.reverse(), function (index, value) {
        arrayConcepto[value.properties.ID_CONCEPTO] = value.properties.CONCEPTO;
        var array = { label: value.properties.CONCEPTO, value: value.properties.ID_CONCEPTO  };
        data.push(array);
    });
    $("#SelctConcepto").multiselect('dataprovider', data);
});


var arrayEstado = [];



var query_Estado = L.esri.Tasks.query({
    url: dominio + urlHostDataFO + 'MapServer/6'
});

query_Estado.where("1='1'").returnGeometry(false).run(function (error, featureCollection) {
    var data = [];
    $.each(featureCollection.features.reverse(), function (index, value) {
        arrayEstado[value.properties.ID_ESTADO] = value.properties.ESTADO;
        var array = {label: value.properties.ESTADO , value: value.properties.ID_ESTADO};
        data.push(array);
    });
    $("#SelctEstado").multiselect('dataprovider', data);
});


var query_ = L.esri.Tasks.query({
    url: 'http://arcgis.simec.gov.co:6080/arcgis/rest/services/UPME_FO/UPME_FO_Indicadores_Proyecto/MapServer/2'
});

query_.where("1='1'").returnGeometry(false).run(function (error, featureCollection) {
    console.log(featureCollection);
});

$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    var idnewtab = ($(e.target).attr('href'));
    $(idnewtab + "Color").addClass("text-primary");

    var idoldtab = ($(e.relatedTarget).attr('href'));
    $(idoldtab + "Color").removeClass("text-primary");

});

$(function () {
    $('[data-toggle="tooltip"]').tooltip();
    $("#SelctFondo,#SelctSectores,#SelctEstado,#SelctConcepto").multiselect({
        includeSelectAllOption: true,
        enableFiltering: true,
        selectAllText: 'Todos',
        enableCaseInsensitiveFiltering: true,
        buttonWidth: '150px',
        dropRight: false,
        maxHeight: 250,
        filterPlaceholder: 'Buscar...',
        buttonText: function (options, select) {
            if (options.length === 0) {
                return 'No hay Seleccionados';
            }
            else if (options.length > 3) {
                return 'Mas de 3 Seleccionados';
            }
            else {
                var labels = [];
                options.each(function () {
                    if ($(this).attr('label') !== undefined) {
                        labels.push($(this).attr('label'));
                    }
                    else {
                        labels.push($(this).html());
                    }
                });
                return labels.join(', ') + '';
            }
        }
    });
});
var SumaTotales = { Valor: 0, Beneficiarios: 0};