 function crearSU() {
    
    for (var i = 0; i < glo.IDSU.length; i++) {
        var temp = turf.filter(glo.jsonSU, 'ID_CENTRO_POBLADO', glo.IDSU[i]);
        
        for (var j = 0; j < temp.features.length; j++) {
            glo.SUProyectos.push(JSON.parse(JSON.stringify(temp.features[j])));
        }
    }
    var fc = turf.featurecollection(glo.SUProyectos);
    MapearProyectos(fc);
}


$('#BuscarMapa').click(function () {
    getData();
});
function addSitioUpme(fc, origen, isu) {
    if (origen != '') {
        for (var i = 0; i < fc.features.length; i++) {
            glo.IDSU.push(fc.features[i].properties[isu]);
            fc.features[i].properties.origen = origen;
            fc.features[i].properties.NomISU = isu;
        }
    }
    glo.loadProy.push(origen);
    //console.log(glo.loadProy.length + ' paso');
    if (glo.loadProy.length > 2) {
        waitingDialog.hide();
        //console.log(glo.IDSU);
        glo.IDSU = glo.IDSU.unique();
        crearSU();
    }
}
function getMultiSelect(id) {
    var brands = $('#' + id + ' option:selected');
    var selection = [];
    $(brands).each(function (index, brand) {
        selection.push("'" + brand.value + "'");
    });
    return selection;
}
function getParametros(tipo) {
    var datemin = $('#date_ini').data("DateTimePicker").date().format('YYYY-MM-DD');
    var datemax = $('#date_fin').data("DateTimePicker").date().format('YYYY-MM-DD');
    var where = '';
    $("#TextFechaIni").empty().append(datemin);
    $("#TextFechaFin").empty().append(datemax);
    if (tipo == 'FO') {
        where = "FE >= date '" + datemin + "' and FE<= date '" + datemax + "'"
        + ' and  FO IN (' + glo.arrayFondosID.join(',') + ") "
        + ' and  SEC IN (' + glo.arraySectoresID.join(',') + ") "
        + glo.FilBusqueda;
    } else {
        where = "FE >= date '" + datemin + "' and FE<= date '" + datemax + "'"
        + glo.FilBusqueda;
    }
    
    return where;
}

function getData() {
    waitingDialog.show();
    glo.IDSU = [];
    glo.loadProy = [];
    glo.SUProyectos = [];
    
    //var where = '1=1';
    if ($('#checkFondos').is(':checked')) {
        var where = getParametros('FO');
        var queryDataProyFO = L.esri.Tasks.query({
            url: config.dominio + config.urlHostDataProy + 'MapServer/' + config.FONDOS
        });

        queryDataProyFO.where(where).returnGeometry(false).run(function (error, fcFO, response) {
            if (fcFO.features.length > 0) {
                var SelctFondo = getMultiSelect('SelctFondo');
                var temp,fctemp=[];
                if (SelctFondo.length != 0) {
                    $.each(SelctFondo, function (index, value) {
                        value=value.replace(/'/g, "");
                        temp = turf.filter(fcFO, 'FO', parseInt(value));
                        for (var j = 0; j < temp.features.length; j++) {
                            fctemp.push(JSON.parse(JSON.stringify(temp.features[j])));
                        }                        
                    });
                    glo.fcFO = turf.featurecollection(fctemp);
                }else{
                    glo.fcFO = fcFO;
                }
                addSitioUpme(glo.fcFO, 'FO', 'ISU');
            } else {
                addSitioUpme('', '', '');
            }
            
        });
    } else {
        addSitioUpme('', '', '');
    }
    if ($('#checkPCR').is(':checked')) {
        var where = getParametros('PCR');
        var queryDataProySuPCR = L.esri.Tasks.query({
            url: config.dominio + config.urlHostDataProy + 'MapServer/' + config.PECOR
        });
        queryDataProySuPCR.where(where).returnGeometry(false).run(function (error, fcPCR, response) {
            
            if (fcPCR.features.length > 0) {
                glo.fcPCR = fcPCR;
                addSitioUpme(fcPCR, 'PCR', 'ISU');
            } else {
                addSitioUpme('', '', '');
            }
        });
    } else {
        addSitioUpme('', '', '');
    }
    if ($('#checkPERS').is(':checked')) {
        var where = getParametros('PERS');
        var queryDataProyPERS = L.esri.Tasks.query({
            url: config.dominio + config.urlHostDataProy + 'MapServer/' + config.PERS
        });
        queryDataProyPERS.where(where).returnGeometry(false).run(function (error, fcPERS, response) {

            if (fcPERS.features.length > 0) {
                glo.fcPERS = fcPERS;
                addSitioUpme(fcPERS, 'PERS', 'ID_SITIO');
            } else {
                addSitioUpme('', '', '');
            }
        });
    } else {
        addSitioUpme('', '', '');
    }
    
}


function getGeoAdmin() {
    waitingDialog.show();
    var queryDeptoSimpli = L.esri.Tasks.query({
        url: config.dominio + config.urlHostDataFO + 'MapServer/' + config.DEPTO_GEN
    });
    queryDeptoSimpli
        .fields(['CODIGO_DEP', 'NOMBRE'])
        .orderBy(['CODIGO_DEP']);
    queryDeptoSimpli.where("1=1").run(function (error, geojsonDpto, response) {
        LyrDeptoSim = geojsonDpto;
        glo.jsonDto = JSON.parse(JSON.stringify(geojsonDpto));
        
    });

    var queryFechaMin = L.esri.Tasks.query({
        url: config.dominio + config.urlHostDataProy + 'MapServer/' + config.FONDOS
    });

    queryFechaMin.fields(['FE']).where("2=2").orderBy('FE', 'ASC').limit(1);
    queryFechaMin.run(function (error, featureCollection, response) {
        glo.FeIni = moment(featureCollection.features[featureCollection.features.length - 1].properties.FE, 'x').add(5, 'hours').format('DD/MM/YYYY');
        $('#date_ini').datetimepicker({
            format: 'DD/MM/YYYY',
            locale: 'es',
            defaultDate: glo.FeIni
        });
        var querySU = L.esri.Tasks.query({
            url: config.dominio + config.urlHostDataProy + 'MapServer/' + config.SITIOS_UPME
        });
        querySU
        .fields(['ID_CENTRO_POBLADO', 'COD_DPTO', 'COD_MPIO', 'NOMBRE_SITIO'])
        .orderBy(['ID_CENTRO_POBLADO']);
        querySU.where("1=1").run(function (error, geojson, response) {
            glo.jsonSU = geojson;
            var getqueryDatavss = L.esri.Tasks.query({
                url: config.dominio + config.urlHostPIEC + 'MapServer/' + config.VSS_SITIOS
            });
            getqueryDatavss.where("PLA_ANO_BASE ='" + (parseInt(moment().format('YYYY')) - 1) + "'").run(function (error, fc) {
                glo.VSS_SITIOS = fc;
                getData();
            });
            waitingDialog.hide();
        });
    });
}


getGeoAdmin();

