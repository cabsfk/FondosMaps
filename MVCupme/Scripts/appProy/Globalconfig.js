

config = {
    dominio: "http://arcgis.simec.gov.co:6080",
    urlHostDataFO: "/arcgis/rest/services/UPME_FO/UPME_FO_Indicadores_Proyecto/",
    MPIO_GEN: '0',
    DEPTO_GEN: '1',
    INDI: '2',
    FO: '3',
    SEC: '4',
    CON: '5',
    EST: '6',
    urlHostDataProy: "/arcgis/rest/services/UPME_FO/UPME_FO_Proyectos_Sitios/",
    SITIOS_UPME: '0',
    FONDOS: '1',
    PECOR: '2',
    PERS: '3',
    urlHostDP: "/arcgis/rest/services/UPME_BC/UPME_BC_Sitios_UPME_Division_Politica/",
    urlHostPIEC: "/arcgis/rest/services/UPME_EN/UPME_EN_PIEC_ICEE/",
    VSS_SITIOS:'5'
    
}

glo = {
    jsonMun: "",
    jsonDto: "",
    jsonSU: "",
    arrayFondos: [],
    arrayConcepto: [],
    arraySectores:[],
    fcFO: "",
    fcPCR: "",
    fcPERS: "",
    IDSU: [],
    loadProy: [],
    SUProyectos: [],
    FilBusqueda: '',
    html:{
        FO:[],
        PERS:[],
        PERCOR: [],
        INFO: []
    },
    lyrProyCluster: '',
    SuCluster : L.markerClusterGroup({
        disableClusteringAtZoom: 13,
        maxClusterRadius: 50,
        iconCreateFunction: function (cluster) {
            var count = cluster.getChildCount();
            var digits = (count + '').length;
            return new L.DivIcon({
                html: count,
                className: 'cluster digits-' + digits,
                iconSize: null
            });
        }
    }),
    VSS_SITIOS:'',
    styleProy: { icon: L.AwesomeMarkers.icon({ icon: 'fa-file-text-o', prefix: 'fa', markerColor: 'darkred' }), riseOnHover: true }

}
var SumaTotales = { Valor: 0, Beneficiarios: 0 };
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
    0,1,
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

    div.innerHTML += '<b>Convenciones </b><br>';
    div.innerHTML += '<i ><img src="' + prefijo + 'images/leyend/Proyecto.png"  height="17px"></i>Sitio UPME<br>';
    div.innerHTML += '<i ><img src="' + prefijo + 'images/leyend/Cluster.png"  height="17px"></i>Cluster<br>';
    div.innerHTML += '<i ><img src="' + prefijo + 'images/leyend/municipioSelecionado.png"  height="17px"></i>Municipio Seleccionado<br>';

    return div;
};

legend.addTo(map);

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


Array.prototype.unique = function (a) {
    return function () { return this.filter(a) }
}(function (a, b, c) {
    return c.indexOf(a, b + 1) < 0
});

jQuery.fn.exists = function () { return this.length > 0; }

/*********************************
//CAPAS BASE 
**********************************/

// Activacion de carousel
$('.carousel').carousel({
    interval: 7000
});

var OpenMapSurfer_Roads = L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/{type}/{z}/{x}/{y}.{ext}', {
    type: 'map',
    ext: 'jpg',
    attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: '1234'
});

var LyrBase = L.esri.basemapLayer('Topographic').addTo(map);
var LyrLabels = L.esri.basemapLayer('ImageryLabels');

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
    if (map.hasLayer(LyrLabels)) {
        map.removeLayer(LyrLabels);
    }

    if (basemap === 'ShadedRelief' || basemap === 'Oceans' || basemap === 'Gray' || basemap === 'DarkGray' || basemap === 'Imagery' || basemap === 'Terrain') {
        LyrLabels = L.esri.basemapLayer(basemap + 'Labels');
        map.addLayer(LyrLabels);
    }
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




var query_fondos = L.esri.Tasks.query({
    url: config.dominio + config.urlHostDataFO + 'MapServer/'+config.FO
});

query_fondos.where("1='1'").returnGeometry(false).run(function (error, featureCollection) {
    var data = [];
    console.log(featureCollection);
    $.each(featureCollection.features, function (index, value) {
        glo.arrayFondos[value.properties.ID_FONDO] = value.properties.SIGLA;
        var array = { label: value.properties.SIGLA+" - "+value.properties.NOMBRE, value: value.properties.ID_FONDO};
        data.push(array);
    });
    $("#SelctFondo").multiselect('dataprovider', data);
    //$('#SelctFondo').multiselect('disable');
});


var query_Concepto = L.esri.Tasks.query({
    url: config.dominio + config.urlHostDataFO + 'MapServer/' + config.CON
});

query_Concepto.where("1='1'").returnGeometry(false).run(function (error, featureCollection) {
    var data = [];
    $.each(featureCollection.features.reverse(), function (index, value) {
        glo.arrayConcepto[value.properties.ID_CONCEPTO] = value.properties.CONCEPTO;
    });
    
});



var query_sectores = L.esri.Tasks.query({
    url: config.dominio + config.urlHostDataFO + 'MapServer/' + config.SEC
});

query_sectores.where("1='1'").returnGeometry(false).run(function (error, featureCollection) {
    var data = [];
    $.each(featureCollection.features.reverse(), function (index, value) {
        glo.arraySectores[value.properties.ID_SECTOR] = value.properties.SIGLA;

    });
    // $("#SelctSectores").multiselect('dataprovider', data);
});



$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    var idnewtab = ($(e.target).attr('href'));
    $(idnewtab + "Color").addClass("text-primary");

    var idoldtab = ($(e.relatedTarget).attr('href'));
    $(idoldtab + "Color").removeClass("text-primary");

});






$(function () {
    $('[data-toggle="tooltip"]').tooltip();

    $("#SelctFondo").multiselect({
        includeSelectAllOption: true,
        enableFiltering: true,
        selectAllText: 'Todos',
        enableCaseInsensitiveFiltering: true,
        buttonWidth: '150px',
        dropRight: false,
        maxHeight: 250,
        filterPlaceholder: 'Buscar...',
        buttonText: function (options, select) {

            var labels = [], values = [];

            if (options.length === 0) {
                
                return 'No hay Seleccionados';
            }
            else {

                options.each(function () {
                    if ($(this).attr('label') !== undefined) {
                        labels.push($(this).attr('label'));
                        values.push($(this).attr('value'));
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


