
var featuresFondos;
var queryDataFondos = L.esri.Tasks.query({
    url: config.dominio + config.urlHostDataFO + 'MapServer/' + config.INDI
});


var LyrMunicipioSim;

var queryMunSimpli = L.esri.Tasks.query({
    url: config.dominio + config.urlHostDataFO + 'MapServer/' + config.MPIO_GEN
});

var LyrDeptoSim;

var queryDeptoSimpli = L.esri.Tasks.query({
    url: config.dominio + config.urlHostDataFO + 'MapServer/' + config.DEPTO_GEN
});

function agregarparametros(feature){
    for (var i = 0; i < feature.features.length; i++) {
        feature.features[i].properties.U = 0;
        feature.features[i].properties.VPU = 0;
        feature.features[i].properties.VSU = 0;
        feature.features[i].properties.VASU = 0;
        feature.features[i].properties.VPUA = 0;
        feature.features[i].properties.VSUA = 0;
        feature.features[i].properties.VASUA = 0;
        feature.features[i].properties.VT = 0;
        feature.features[i].properties.CANT = 0;
    }
    return feature;

}

function actualizarparametros(feature,row){
    for (var i = 0; i < feature.features.length; i++) {
        if (row.D == feature.features[i].properties.CODIGO_DEP) {
            //console.log(row.D);
            feature.features[i].properties.U = row.U;
            feature.features[i].properties.VPU = row.VPU;
            feature.features[i].properties.VSU = row.VSU;
            feature.features[i].properties.VASU = row.VASU;
            feature.features[i].properties.VPUA = row.VPUA;
            feature.features[i].properties.VSUA = row.VSUA;
            feature.features[i].properties.VASUA = row.VASUA;
            feature.features[i].properties.VT = row.VT;
            feature.features[i].properties.CANT = row.CANT;
            
            return feature;
        }
        
    }
    

}
function calculoDepto(fc, LyrDeptoSim) {
    var getqueryDistFondos = L.esri.Tasks.query({
        url: config.dominio + config.urlHostDataFO + 'MapServer/' + config.INDI
    });
    getqueryDistFondos.fields(['D'])
    .orderBy(['D'])
    .returnGeometry(false);
    getqueryDistFondos.params.returnDistinctValues = true;
    whereParametros = getParametros();
    
    getqueryDistFondos.where(whereParametros).run(function (error, featureCollection, response) {
        if (error == undefined) {
            for (var i = 0; i < featureCollection.features.length; i++) {
                var filDpto=turf.filter(fc, 'D', featureCollection.features[i].properties.D);
                var row = {
                    D: featureCollection.features[i].properties.D,
                    U: sumCampo(filDpto, 'U'),
                    VPU: sumCampo(filDpto, 'VPU'),
                    VSU: sumCampo(filDpto, 'VSU'),
                    VASU: sumCampo(filDpto, 'VASU'),
                    VPUA: sumCampo(filDpto, 'VPUA'),
                    VSUA: sumCampo(filDpto, 'VSUA'),
                    VASUA: sumCampo(filDpto, 'VASUA'),
                    VT: sumCampo(filDpto, 'VT'),
                    CANT: filDpto.features.length
                }
                LyrDeptoSim = actualizarparametros(LyrDeptoSim, row);
            
            }
            Limitesleyenda = getBreaks(LyrDeptoSim);
            legend.addTo(map);
            LyrDeptoSim = AsigData(LyrDeptoSim, glo.fCICEE, glo.parameDpto);
            MapearProyectosTotal(LyrDeptoSim);
        }
    });
    return fc.features.length; 
}
function actualizarparametrosMpio(feature, row) {
    for (var i = 0; i < feature.features.length; i++) {
        //console.log(row.D + "" + row.M);
        if (row.D + "" + row.M == feature.features[i].properties.MPIO_CCNCT) {
            //console.log(row.D + "" + row.M);
            feature.features[i].properties.U = row.U;
            feature.features[i].properties.VPU = row.VPU;
            feature.features[i].properties.VSU = row.VSU;
            feature.features[i].properties.VASU = row.VASU;
            feature.features[i].properties.VPUA = row.VPUA;
            feature.features[i].properties.VSUA = row.VSUA;
            feature.features[i].properties.VASUA = row.VASUA;
            feature.features[i].properties.VT = row.VT;
            feature.features[i].properties.CANT = row.CANT;
            return feature;
        }

    }
    return feature;

}
function calculoMpio(fc, LyrMunicipioSim) {
    var getqueryDistFondos = L.esri.Tasks.query({
        url: config.dominio + config.urlHostDataFO + 'MapServer/' + config.INDI
    });
    getqueryDistFondos.fields(['D', 'M' ])
    .orderBy(['D', 'M'])
    .returnGeometry(false);
    getqueryDistFondos.params.returnDistinctValues = true;
    whereParametros = getParametros();
    
    getqueryDistFondos.where(whereParametros).run(function (error, featureCollection, response) {
        if (error == undefined) {
            for (var i = 0; i < featureCollection.features.length; i++) {
                var filDpto=turf.filter(fc, 'D', featureCollection.features[i].properties.D);
                var filMun=turf.filter(filDpto, 'M', featureCollection.features[i].properties.M);
            
                var row = {
                    D: featureCollection.features[i].properties.D,
                    M: featureCollection.features[i].properties.M,
                    U: sumCampo(filMun, 'U'),
                    VPU: sumCampo(filMun, 'VPU'),
                    VSU: sumCampo(filMun, 'VSU'),
                    VASU: sumCampo(filMun, 'VASU'),
                    VPUA: sumCampo(filMun, 'VPUA'),
                    VSUA: sumCampo(filMun, 'VSUA'),
                    VASUA: sumCampo(filMun, 'VASUA'),
                    VT: sumCampo(filMun, 'VT'),
                    CANT: filMun.features.length
                }
                LyrMunicipioSim = actualizarparametrosMpio(LyrMunicipioSim, row);
            
            }
            Limitesleyenda = getBreaks(LyrMunicipioSim);
            LyrMunicipioSim=AsigData(LyrMunicipioSim, glo.fCICEE, glo.parameMUN);
            legend.addTo(map);
            MapearProyectosTotal(LyrMunicipioSim);
        }
    });
    return fc.features.length; 
}

function getMultiSelect(id) {
    var brands = $('#' + id + ' option:selected');
    var selection = [];
    $(brands).each(function (index, brand) {
        selection.push("'"+brand.value+"'");
    });
    return selection;
}

var whereParametros = "";
function getParametros() {
    var datemin = $('#date_ini').data("DateTimePicker").date().format('YYYY-MM-DD');
    var datemax = $('#date_fin').data("DateTimePicker").date().format('YYYY-MM-DD');
    var SelctFondo = getMultiSelect('SelctFondo');
    var SelctSectores = getMultiSelect('SelctSectores');
    var SelctEstado = getMultiSelect('SelctEstado');
    var SelctConcepto = getMultiSelect('SelctConcepto');
   // console.log(SelctEstado[0]);
    if (SelctConcepto[0] == "'Favorable'") {
        if (SelctEstado[0] == "'Con asignación de recursos'") {
            glo.tituloLeyenda = 'Asignado';
            glo.VarMapeo = 'VASUA';
            
        } else {
            glo.tituloLeyenda = 'Solicitado';
            glo.VarMapeo = 'VSUA';            
        }
    } else {
        glo.tituloLeyenda = 'Proyecto';
        glo.VarMapeo = 'VPUA';
    }
    var params = "";
    params = SelctFondo.length == 0 ? params : params + ' and  FO IN (' + SelctFondo.join(',') + ")";
    params = SelctSectores.length == 0 ? params : params + ' and  SEC IN (' + SelctSectores.join(',') + ")";
    params = SelctEstado.length == 0 ? params : params + ' and  ES IN (' + SelctEstado.join(',') + ")";
    params = SelctConcepto.length == 0 ? params : params + ' and  CON IN (' + SelctConcepto.join(',') + ")";
    
    var where = "fe >  date '" + datemin +
    "' and fe< date '" + datemax +
    "' "+ params;
    return where;
}

function resetMapa() {
    $("#panel_superDerecho").hide();
   /* if (glo.layerStyle != "") {
        glo.lyrMate.resetStyle(glo.layerStyle);
    }*/
}
$("#closePanelDem").click(function () {
    resetMapa();
});


function getBreaks(Lyr) {
    var breaks;
    
    var lyrTemp = turf.remove(Lyr, 'VT', 0);
    var cuentaValores = lyrTemp.features.length;
    
    if (cuentaValores > 8) {
        breaks = turf.jenks(Lyr, 'VT', 7);
    } else {
        breaks = turf.jenks(Lyr, 'VT', cuentaValores);
    }
    
    breaks=breaks.unique();
    if (breaks[0] != 0) {
        breaks.unshift(1);
        breaks.unshift(0);
    } else {
        breaks[0]=1;
        breaks.unshift(0);
    }
     waitingDialog.hide();
    return breaks;
}
function sumCampo(fc, campo) {
    var sum_Campo = 0;
    for (var i = 0; i < fc.features.length; i++) {
        sum_Campo = sum_Campo + fc.features[i].properties[campo];
        
    }
    return sum_Campo;
}

function CuentaTbs(featureCollection) {
    $('#CantProyConTotal').empty().append(numeral(featureCollection.features.length).format('0,0'));
    var ValorTotal = sumCampo(featureCollection, 'VPU');
    $("#ValorConTotal").empty().append(numeral(ValorTotal).format('$0,0'));
    ValorTotal = sumCampo(featureCollection, 'VPUA');
    $("#ValorConTotalCons").empty().append(numeral(ValorTotal).format('$0,0'));
    var BeneficiarioTotal = sumCampo(featureCollection, 'U');
    $("#BeneficiariosConTotal").empty().append(numeral(BeneficiarioTotal).format('0,0'));
    var fcFavorable = turf.filter(featureCollection, 'CON', 'Favorable');
    var TotalFavorable = sumCampo(fcFavorable, 'VSU');
    $('#lbValorFav').empty().append(numeral(TotalFavorable).format('$0,0'));
    TotalFavorable = sumCampo(fcFavorable, 'VSUA');
    $('#lbValorFavCons').empty().append(numeral(TotalFavorable).format('$0,0'));
    var BeneFavorable = sumCampo(fcFavorable, 'U');
    $('#lbBeneficiariosFav').empty().append(numeral(BeneFavorable).format('0,0'));
    $('#lbCantProyFav').empty().append(numeral(fcFavorable.features.length).format('0,0'));
    var fcAsig = turf.filter(fcFavorable, 'ES', 'Con asignación de recursos');
    var TotalAsig = sumCampo(fcAsig, 'VASU');
    $('#lbValorAsig').empty().append(numeral(TotalAsig).format('$0,0'));
    TotalAsig = sumCampo(fcAsig, 'VASUA');
    $('#lbValorAsigCons').empty().append(numeral(TotalAsig).format('$0,0'));
    var BeneAsig = sumCampo(fcAsig, 'U');
    $('#lbBeneficiarioAsig').empty().append(numeral(BeneAsig).format('0,0'));
    $('#lbCantProyoAsig').empty().append(numeral(fcAsig.features.length).format('0,0'));
}
function AsigData(Gjson, fCICEE, parame) {
    //console.log(Gjson);
    var tmpICEE;
    for (i = 0; i < Gjson.features.length; i++) {
        tmpICEE = turf.filter(fCICEE, parame.filEsc, Gjson.features[i].properties[parame.filEsc2]);
        if (tmpICEE.features.length > 0) {
            Gjson.features[i].properties.ICEE_USCAB_TOT = sumCampo(tmpICEE, 'ICEE_USCAB_TOT');
            Gjson.features[i].properties.ICEE_USRES_TOT = sumCampo(tmpICEE, 'ICEE_USRES_TOT');
            Gjson.features[i].properties.ICEE_US_TOT = sumCampo(tmpICEE, 'ICEE_US_TOT');
            Gjson.features[i].properties.ICEE_VIVCAB = sumCampo(tmpICEE, 'ICEE_VIVCAB');
            Gjson.features[i].properties.ICEE_VIVRES = sumCampo(tmpICEE, 'ICEE_VIVRES');
            Gjson.features[i].properties.ICEE_VIVTOT = sumCampo(tmpICEE, 'ICEE_VIVTOT');
            Gjson.features[i].properties.ICEE_VSS_CAB = sumCampo(tmpICEE, 'ICEE_VSS_CAB');
            Gjson.features[i].properties.ICEE_VSS_RES = sumCampo(tmpICEE, 'ICEE_VSS_RES');
            Gjson.features[i].properties.ICEE_VSS_TOT = sumCampo(tmpICEE, 'ICEE_VSS_TOT');
            Gjson.features[i].properties.ICEE_ICEE_TOT = Gjson.features[i].properties.ICEE_US_TOT / Gjson.features[i].properties.ICEE_VIVTOT;
            Gjson.features[i].properties.ICEE_ICEE_TOT_DEF = 1 - Gjson.features[i].properties.ICEE_ICEE_TOT;
        } else {
            Gjson.features[i].properties.ICEE_USCAB_TOT = 0;
            Gjson.features[i].properties.ICEE_USRES_TOT = 0;
            Gjson.features[i].properties.ICEE_US_TOT = 0;
            Gjson.features[i].properties.ICEE_VIVCAB = 0;
            Gjson.features[i].properties.ICEE_VIVRES = 0;
            Gjson.features[i].properties.ICEE_VIVTOT = 0;
            Gjson.features[i].properties.ICEE_VSS_CAB = 0;
            Gjson.features[i].properties.ICEE_VSS_RES = 0;
            Gjson.features[i].properties.ICEE_VSS_TOT = 0;
            Gjson.features[i].properties.ICEE_ICEE_TOT = 0;
            Gjson.features[i].properties.ICEE_ICEE_TOT_DEF = 0;      
        }
    }
    console.log(Gjson);
    return Gjson;
}

function getFondosData() {
    waitingDialog.show();
    if ($("#EscalaMap").val() == "Municipio") {
        agregarparametros(LyrMunicipioSim);
    } else {
        agregarparametros(LyrDeptoSim);
    }
    $("#panel_superDerecho").hide();

   
    whereParametros = getParametros();
    
    var getqueryDataICEE = L.esri.Tasks.query({
        url: config.dominio + config.urlHostPIEC + 'MapServer/' + config.ICCE
    });

    getqueryDataICEE.where("ICEE_AGNO='" + (parseInt(moment().format('YYYY')) - 1) + "'").run(function (error, fc) {
        glo.fCICEE=fc;
        var getqueryDataFondos = L.esri.Tasks.query({
            url: config.dominio + config.urlHostDataFO + 'MapServer/' + config.INDI
        });
        getqueryDataFondos
            .fields(['D', 'M', 'U', 'VPU', 'VPUA', 'VSU', 'VSUA', 'VASU', 'VASUA', 'CON', 'ES', 'FEA', 'FE', 'VT', 'FECHA'])
            .orderBy(['D', 'M'])
            .returnGeometry(false);
        getqueryDataFondos.where(whereParametros).run(function (error, fc, response) {
            if (error == undefined) {
                CuentaTbs(fc);
                if ($("#EscalaMap").val() == "Municipio") {
                    var cuentaValores = calculoMpio(fc, LyrMunicipioSim);
                } else {
                    var cuentaValores = calculoDepto(fc, LyrDeptoSim);
                }
            } else {
                if ($("#EscalaMap").val() == "Municipio") {
                    MapearProyectosTotal(LyrMunicipioSim);
                } else {
                    MapearProyectosTotal(LyrDeptoSim);
                }
            }
            if ($("#textlegend").text() == "Mostrar") {
                $(".legend").hide();
            }
        });
    });
  
}


function getDeptoSimp() {
    waitingDialog.show();
    queryDeptoSimpli
        .fields(['CODIGO_DEP', 'NOMBRE'])
        .orderBy(['CODIGO_DEP']);
    queryDeptoSimpli.where("1=1").run(function (error, geojsonDpto, response) {
        LyrDeptoSim = geojsonDpto;
        glo.jsonDto = JSON.parse(JSON.stringify(geojsonDpto));
    });
    queryMunSimpli
         .fields(['DPTO_CCDGO', 'MPIO_CCDGO', 'MPIO_CCNCT', 'MPIO_CNMBR'])
         .orderBy(['MPIO_CCNCT']);
    queryMunSimpli.where("1=1").run(function (error, geojsonMun, response) {
        LyrMunicipioSim = geojsonMun;
        glo.jsonMun = JSON.parse(JSON.stringify(geojsonMun));
        getFondosData();
    });
}


getDeptoSimp();

$("#BuscarMapa").click(function () {
    legend.removeFrom(map);
    getFondosData();
})