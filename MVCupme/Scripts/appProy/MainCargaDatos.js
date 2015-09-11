function crearSU() {
    
    for (var i = 0; i < glo.IDSU.length; i++) {
        var temp = turf.filter(glo.jsonSU, 'ID_CENTRO_POBLADO', glo.IDSU[i]);
        glo.SUProyectos.push( JSON.parse(JSON.stringify(temp)));
    }
    var fc = turf.featurecollection(glo.SUProyectos);
    MapearProyectos(fc);
}

function addSitioUpme(fc, origen, isu) {
    var filtered;
    
    for (var i = 0; i < fc.features.length; i++) {
        glo.IDSU.push(fc.features[i].properties[isu]);
    }
    glo.loadProy.push(origen);

    if (glo.loadProy.length > 2) {
        glo.IDSU = glo.IDSU.unique();
        crearSU();
    }
}
function getParametros() {
    var datemin = $('#date_ini').data("DateTimePicker").date().format('YYYY-MM-DD');
    var datemax = $('#date_fin').data("DateTimePicker").date().format('YYYY-MM-DD');
    
    $("#TextFechaIni").empty().append(datemin);
    $("#TextFechaFin").empty().append(datemax);
    var where = "FE >= date '" + datemin + "' and FE<= date '" + datemax + "'";
    return where;
}
function getData() {
    waitingDialog.show();
    glo.IDSU = [];
    glo.loadProy = [];
    glo.SUProyectos = [];
    var where = getParametros();
    if ($('#checkFondos').is(':checked')) {
        var queryDataProyFO = L.esri.Tasks.query({
            url: config.dominio + config.urlHostDataProy + 'MapServer/' + config.FONDOS
        });

        queryDataProyFO.where(where).returnGeometry(false).run(function (error, fcFO, response) {
            glo.fcFO = fcFO;
            addSitioUpme(fcFO, 'FO','ISU');
            
        });
    } else {
        glo.loadProy.push('FO');
    }
    if ($('#checkPCR').is(':checked')) {
        var queryDataProySuPCR = L.esri.Tasks.query({
            url: config.dominio + config.urlHostDataProy + 'MapServer/' + config.PECOR
        });
        queryDataProySuPCR.where(where).returnGeometry(false).run(function (error, fcPCR, response) {
            glo.fcPCR = fcPCR
            addSitioUpme(fcPCR, 'PCR','ISU');
        });
    } else {
        glo.loadProy.push('PCR');
    }
    if ($('#checkPCR').is(':checked')) {
        var queryDataProyPERS = L.esri.Tasks.query({
            url: config.dominio + config.urlHostDataProy + 'MapServer/' + config.PERS
        });
        queryDataProyPERS.where("1 = '1'").returnGeometry(false).run(function (error, fcPERS, response) {
            glo.fcPERS = fcPERS
            addSitioUpme(fcPERS, 'PERS', 'ID_SITIO');
        });
    } else {
        glo.loadProy.push('PERS');
    }
    
}


function getGeoAdmin() {
    waitingDialog.show();
    var queryDeptoSimpli = L.esri.Tasks.query({
        url: config.dominio + config.urlHostDataFO + 'MapServer/' + config.FO
    });
    queryDeptoSimpli
        .fields(['CODIGO_DEP', 'NOMBRE'])
        .orderBy(['CODIGO_DEP']);
    queryDeptoSimpli.where("1=1").run(function (error, geojsonDpto, response) {
        LyrDeptoSim = geojsonDpto;
        glo.jsonDto = JSON.parse(JSON.stringify(geojsonDpto));
    });

    /*var queryMunSimpli = L.esri.Tasks.query({
        url: config.dominio + config.urlHostDataFO + 'MapServer/' + config.MPIO_GEN
    });
    queryMunSimpli
         .fields(['DPTO_CCDGO', 'MPIO_CCDGO', 'MPIO_CCNCT', 'MPIO_CNMBR'])
         .orderBy(['MPIO_CCNCT']);
    queryMunSimpli.where("1=1").run(function (error, geojsonMun, response) {
        LyrMunicipioSim = geojsonMun;
        glo.jsonMun = JSON.parse(JSON.stringify(geojsonMun));
        
        waitingDialog.hide();
    });*/
    var querySU = L.esri.Tasks.query({
        url: config.dominio + config.urlHostDataProy + 'MapServer/' + config.SITIOS_UPME
    });
    querySU
     .fields(['ID_CENTRO_POBLADO', 'COD_DPTO', 'COD_MPIO', 'NOMBRE_SITIO'])
      .orderBy(['ID_CENTRO_POBLADO']);
    querySU.where("1=1").run(function (error, geojson, response) {
        glo.jsonSU = geojson;
        getData();
        waitingDialog.hide();
    });
}


getGeoAdmin();

