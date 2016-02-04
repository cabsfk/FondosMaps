

config = {
    dominio: "http://arcgis.simec.gov.co:6080", //Dominio del arcgis server   //
    dominio2: "http://localhost:6080",
    urlHostDataFO: "/arcgis/rest/services/UPME_FO/UPME_FO_Indicadores_Proyecto/",
    urlHostDP: "/arcgis/rest/services/UPME_BC/UPME_BC_Sitios_UPME_Division_Politica/",
    urlHostPIEC: "/arcgis/rest/services/UPME_EN/UPME_EN_PIEC_ICEE/",
    MPIO_GEN: '0',
    DEPTO_GEN: '1',
    INDI: '2',
    FO: '3',
    SEC: '4',
    CON: '5',
    EST: '6',
    ICCE: '2',
    mill: ' ',
    mll: ' '

}

glo = {
    SectoFo: '',
    filtroSectoFo: '',
    ConEst: '',
    filtroConEst: '',
    tituloLeyenda: '',
    VarMapeo: '',
    pieConcepto: '',
    pieEstado: '',
    jsonMun: "",
    jsonDto: "",
    parameMUN: {
        filEsc: 'MPIO_CCNCT',
        filEsc2: 'MPIO_CCNCT',
        filEsc3: 'MPIO_CCNCT'
    },
    parameDpto: {
        filEsc: 'DPTO_CCDGO',
        filEsc2: 'CODIGO_DEP',
        filEsc3: 'COD_DPTO'
    },
    fCICEE: '',
    FeIni:''

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
    div.innerHTML += '<b>Valor ' + glo.tituloLeyenda + '</b> <br>En Pesos por Millon($M) <hr>';

    for (var i = 0; i < Limitesleyenda.length; i++) {
        if (i == 0) {
            div.innerHTML +=
            '<i style="background:rgba(255,255,255,0.8)"></i> ' +
            numeral(Limitesleyenda[i] / 1000000).format('$0,0') + config.mill + '&ndash;' + '<br>';
        } else if ((i+1) == Limitesleyenda.length) {
            div.innerHTML +=
            '<i style="background:' + getColor(Limitesleyenda[i] + 1) + '"></i> ' +  numeral(Limitesleyenda[i]/1000000).format('$0,0')+config.mill +  ' +  <br>';
        } else {
            div.innerHTML +=
            '<i style="background:' + getColor(Limitesleyenda[i] + 1) + '"></i> ' +
            numeral(Limitesleyenda[i]/1000000).format('$0,0') + config.mill + (numeral(Limitesleyenda[i + 1]).format('$0,0') ? '&ndash;' + numeral(Limitesleyenda[i + 1] / 1000000).format('$0,0') + config.mill + '<br>' : '+');
        }
    }
    div.innerHTML += '<b>Convenciones </b><br>';

    div.innerHTML += '<i ><img src="' + prefijo + 'images/leyend/municipioSelecionado.png"  height="17px"></i>Municipio Seleccionado<br>';
    return div;
};

var mousemove = document.getElementById('mousemove');

map.on('mousemove', function (e) {
    window[e.type].innerHTML = 'Long:' + e.latlng.lng.toFixed(6) + '   Lat:' + e.latlng.lat.toFixed(6);
});


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



/*********************************
//CAPAS BASE 
**********************************/

//$('.carousel').hide();
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

var LyrBase = L.esri.basemapLayer('Imagery').addTo(map);
var LyrLabels = L.esri.basemapLayer('ImageryLabels').addTo(map);

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




$('#date_fin').datetimepicker({
    format: 'DD/MM/YYYY',
    locale: 'es',
    defaultDate: moment()
});



var arrayFondos = [],arrayFondosID = [];
var query_fondos = L.esri.Tasks.query({
    url: config.dominio + config.urlHostDataFO + 'MapServer/'+config.FO
});

query_fondos.where("3='3'").returnGeometry(false).run(function (error, featureCollection) {
    var data = [];
    $.each(featureCollection.features.reverse(), function (index, value) {

        arrayFondos[value.properties.ID_FONDO] = value.properties.SIGLA;
        arrayFondosID.push(value.properties.ID_FONDO);
        var array = { label: value.properties.SIGLA+" - "+value.properties.NOMBRE, value: value.properties.ID_FONDO};
        data.push(array);
    });
  
    $('#SelctFondo').multiselect('disable');
});


var arraySectores = [], arraySectoresID=[];
var query_sectores = L.esri.Tasks.query({
    url: config.dominio + config.urlHostDataFO + 'MapServer/'+config.SEC
});

query_sectores.where("1='1'").returnGeometry(false).run(function (error, featureCollection) {
    var data = [];
    $.each(featureCollection.features.reverse(), function (index, value) {
        arraySectores[value.properties.ID_SECTOR] = value.properties.SIGLA;
        arraySectoresID.push(value.properties.ID_SECTOR);
        var array = { label: value.properties.SIGLA + " - " + value.properties.NOMBRE, value: value.properties.ID_SECTOR };
        data.push(array);
    });
    $("#SelctSectores").multiselect('dataprovider', data);
});



var arrayConcepto = [], arrayConceptoID=[];
var query_Concepto = L.esri.Tasks.query({
    url: config.dominio + config.urlHostDataFO + 'MapServer/'+config.CON
});

query_Concepto.where("1='1'").returnGeometry(false).run(function (error, featureCollection) {
    var data = [];
    $.each(featureCollection.features.reverse(), function (index, value) {
        arrayConcepto[value.properties.ID_CONCEPTO] = value.properties.CONCEPTO;
        arrayConceptoID.push(value.properties.ID_CONCEPTO);
        var array = { label: value.properties.CONCEPTO, value: value.properties.ID_CONCEPTO  };
        data.push(array);
    });
    $("#SelctConcepto").multiselect('dataprovider', data);
});


var arrayEstado = [],arrayEstadoID = [];
var query_Estado = L.esri.Tasks.query({
    url: config.dominio + config.urlHostDataFO + 'MapServer/'+config.EST
});

query_Estado.where("1='1'").returnGeometry(false).run(function (error, featureCollection) {
    var data = [];
    $.each(featureCollection.features.reverse(), function (index, value) {
        arrayEstado[value.properties.ID_ESTADO] = value.properties.ESTADO;
        arrayEstadoID.push(value.properties.ID_ESTADO);
        var array = {label: value.properties.ESTADO , value: value.properties.ID_ESTADO};
        data.push(array);
    });
  
    $('#SelctEstado').multiselect('disable');
});

$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    var idnewtab = ($(e.target).attr('href'));
    $(idnewtab + "Color").addClass("text-primary");

    var idoldtab = ($(e.relatedTarget).attr('href'));
    $(idoldtab + "Color").removeClass("text-primary");

});

var query_SectorFO = L.esri.Tasks.query({
    url: config.dominio + config.urlHostDataFO + 'MapServer/'+config.INDI
}).fields(['SEC ', 'FO'])
.where("1=1")
.returnGeometry(false);
query_SectorFO.params.returnDistinctValues = true;
query_SectorFO.run(function (error, featureCollection) {
    glo.SectoFo = featureCollection.features;
});
var query_ConEst = L.esri.Tasks.query({
    url: config.dominio + config.urlHostDataFO + 'MapServer/' + config.INDI
}).fields(['CON', 'ES'])
.where("1=1")
.returnGeometry(false);

query_ConEst.params.returnDistinctValues = true;
query_ConEst.run(function (error, featureCollection) {
    glo.ConEst = featureCollection.features;
   
});



function getSelectFO(values) {
    
    var data = [];
    if (values.length != 0) {
        $.each(glo.SectoFo, function (index, value) {
            if (values.indexOf(String(value.properties.SEC)) >= 0) {
                if (arrayFondos[value.properties.FO] != undefined) {
                    var array = { label: arrayFondos[value.properties.FO], value: value.properties.FO };
                    data.push(array);
                }                
            }
        });
        $("#SelctFondo").multiselect('dataprovider', data);
        $('#SelctFondo').multiselect('enable');
    } else {
        $("#SelctFondo").multiselect('dataprovider', data);
        $('#SelctFondo').multiselect('disable');
    }
}
function getSelectCon(values) {
    
    var data = [];
    console.log(values);
    if (values.length != 0) {
        $.each(glo.ConEst, function (index, value) {
            console.log(values.indexOf(String(value.properties.CON)));
            if (values.indexOf(String(value.properties.CON)) >= 0) {
                if (arrayEstado[value.properties.ES] != undefined) {
                    var array = { label: arrayEstado[value.properties.ES], value: value.properties.ES };
                    data.push(array);
                }
            }
        });
        $("#SelctEstado").multiselect('dataprovider', data);
        $('#SelctEstado').multiselect('enable');
    } else {
        $("#SelctEstado").multiselect('dataprovider', data);
        $('#SelctEstado').multiselect('disable');
    }
}

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
            
            var labels = [], values = [];
            
            if (options.length === 0) {
                if (select.context.id == 'SelctSectores') {
                    if (glo.filtroSectoFo != '') {
                        glo.filtroSectoFo = [];
                        getSelectFO([]);
                    }                    
                }
                if (select.context.id == 'SelctConcepto') {
                    if (glo.filtroConEst != '') {
                        glo.filtroConEst = [];
                        getSelectCon([]);
                    }
                }
                
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
                
                if (select.context.id == 'SelctSectores') {
                    glo.filtroSectoFo = values;
                    getSelectFO(values);
                }
                if (select.context.id == 'SelctConcepto') {
                    glo.filtroConEst = values;
                    getSelectCon(values);
                }
                return labels.join(', ') + '';
            }
        }
    });
    
});

