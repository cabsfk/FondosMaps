
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
            feature.features[i].properties.CANT = row.CANT;
            
            return feature;
        }
        
    }
    

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
            feature.features[i].properties.CANT = row.CANT;
            return feature;
        }

    }
    return feature;

}

function calculoDepto(featureCollection, LyrDeptoSim) {
    var cuentaValores = 0;
    var sum_U = 0, sum_VPU = 0, sum_VSU = 0, sum_VASU = 0,  cont = 0;
    SumaTotales.Valor = 0, SumaTotales.Beneficiarios = 0;
    for (var i = 0; i < featureCollection.features.length; i++) {
        if (i != featureCollection.features.length - 1) {
            if (featureCollection.features[i].properties.D == featureCollection.features[i + 1].properties.D) {
                sum_U = sum_U + featureCollection.features[i].properties.U;
                sum_VPU = sum_VPU + featureCollection.features[i].properties.VPU;
                sum_VSU = sum_VSU + featureCollection.features[i].properties.VSU;
                sum_VASU = sum_VASU + featureCollection.features[i].properties.VASU;
            
            } else {
                cuentaValores++;
                sum_U = sum_U + featureCollection.features[i].properties.U;
                sum_VPU = sum_VPU + featureCollection.features[i].properties.VPU;
                sum_VSU = sum_VSU + featureCollection.features[i].properties.VSU;
                sum_VASU = sum_VASU + featureCollection.features[i].properties.VASU;
                
                var row = {
                    D: featureCollection.features[i].properties.D,
                    U: sum_U,
                    VPU: sum_VPU,
                    VSU: sum_VSU,
                    VASU: sum_VASU
                
                }
                SumaTotales.Valor = SumaTotales.Valor + sum_VPU;
                SumaTotales.Beneficiarios = SumaTotales.Beneficiarios + sum_U;
                LyrDeptoSim = actualizarparametros(LyrDeptoSim, row);
                sum_U = 0; sum_VPU = 0; sum_VSU = 0; sum_VASU = 0; 
            }
        } else {
            cuentaValores++;
            sum_U = sum_U + featureCollection.features[i].properties.U;
            sum_VPU = sum_VPU + featureCollection.features[i].properties.VPU;
            sum_VSU = sum_VSU + featureCollection.features[i].properties.VSU;
            sum_VASU = sum_VASU + featureCollection.features[i].properties.VASU;
            var row = {
                D: featureCollection.features[i].properties.D,
                U: sum_U,
                VPU: sum_VPU,
                VSU: sum_VSU,
                VASU: sum_VASU,
            }
            SumaTotales.Valor = SumaTotales.Valor + sum_VPU;
            SumaTotales.Beneficiarios = SumaTotales.Beneficiarios + sum_U;
            LyrDeptoSim = actualizarparametros(LyrDeptoSim, row);
        }

    }
    $("#ValorConTotal").empty().append(numeral(SumaTotales.Valor).format('$0,0'));
    $("#BeneficiariosConTotal").empty().append(numeral(SumaTotales.Beneficiarios).format('0,0'));
    return cuentaValores;
}

function calculoMpio(featureCollection, LyrMunicipioSim) {
    var sum_U = 0,  sum_VPU = 0, sum_VSU = 0, sum_VASU = 0,cont = 0, cuentaValores = 0;
    SumaTotales.Valor = 0, SumaTotales.Beneficiarios = 0;
    for (var i = 0; i < featureCollection.features.length; i++) {
        if (i != featureCollection.features.length - 1) {
            if (featureCollection.features[i].properties.D == featureCollection.features[i + 1].properties.D && featureCollection.features[i].properties.M == featureCollection.features[i + 1].properties.M) {
                sum_U = sum_U + featureCollection.features[i].properties.U;
                sum_VPU = sum_VPU + featureCollection.features[i].properties.VPU;
                sum_VSU = sum_VSU + featureCollection.features[i].properties.VSU;
                sum_VASU = sum_VASU + featureCollection.features[i].properties.VASU;
            
            } else {
                cuentaValores++;
                sum_U = sum_U + featureCollection.features[i].properties.U;
                sum_VPU = sum_VPU + featureCollection.features[i].properties.VPU;
                sum_VSU = sum_VSU + featureCollection.features[i].properties.VSU;
                sum_VASU = sum_VASU + featureCollection.features[i].properties.VASU;
                var row = {
                    D: featureCollection.features[i].properties.D,
                    M: featureCollection.features[i].properties.M,
                    U: sum_U,
                    VPU: sum_VPU,
                    VSU: sum_VSU,
                    VASU: sum_VASU
                }
                SumaTotales.Valor = SumaTotales.Valor + sum_VPU;
                SumaTotales.Beneficiarios = SumaTotales.Beneficiarios + sum_U;
                LyrMunicipioSim = actualizarparametrosMpio(LyrMunicipioSim, row);
                sum_U = 0;  sum_VPU = 0; sum_VSU = 0; sum_VASU = 0; 
            }
        } else {
            cuentaValores++;
            sum_U = sum_U + featureCollection.features[i].properties.U;
            sum_VPU = sum_VPU + featureCollection.features[i].properties.VPU;
            sum_VSU = sum_VSU + featureCollection.features[i].properties.VSU;
            sum_VASU = sum_VASU + featureCollection.features[i].properties.VASU;
            var row = {
                D: featureCollection.features[i].properties.D,
                M: featureCollection.features[i].properties.M,
                U: sum_U,
                VPU: sum_VPU,
                VSU: sum_VSU,
                VASU: sum_VASU
            
            }
            SumaTotales.Valor = SumaTotales.Valor + sum_VPU;
            SumaTotales.Beneficiarios = SumaTotales.Beneficiarios + sum_U;
            LyrMunicipioSim = actualizarparametrosMpio(LyrMunicipioSim, row);
        }

    }
    $("#ValorConTotal").empty().append(numeral(SumaTotales.Valor).format('$0,0'));
    $("#BeneficiariosConTotal").empty().append(numeral(SumaTotales.Beneficiarios).format('0,0'));
    return cuentaValores;
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

function getBreaks(cuentaValores,Lyr) {
    var breaks;
    var lyrTemp = turf.remove(Lyr, 'VPU', 0);
    if (cuentaValores > 8) {
        breaks = turf.jenks(lyrTemp, 'VPU', 8);
    } else {
        breaks = turf.jenks(lyrTemp, 'VPU', cuentaValores);
    }

    var breaks=breaks.unique();
    if (breaks[0] != 0) {
        breaks.unshift(0);
    }
    
    return breaks;
}
function sumCampo(fc, campo) {
    var sum_U = 0;
    for (var i = 0; i < fc.features.length; i++) {
        sum_U = sum_U + fc.features[i].properties[campo];
    }
    return sum_U;
}

function CuentaTbs(featureCollection) {
    $('#CantProyConTotal').empty().append(numeral(featureCollection.features.length).format('0,0'));
    var fcFavorable = turf.filter(featureCollection, 'CON', 'Favorable');
    var TotalFavorable = sumCampo(fcFavorable, 'VSU');
    $('#lbValorFav').empty().append(numeral(TotalFavorable).format('$0,0'));
    var BeneFavorable = sumCampo(fcFavorable, 'U');
    $('#lbBeneficiariosFav').empty().append(numeral(BeneFavorable).format('0,0'));
    $('#lbCantProyFav').empty().append(numeral(fcFavorable.features.length).format('0,0'));
    var fcAsig = turf.filter(fcFavorable, 'ES', 'Con asignación de recursos');
    var TotalAsig = sumCampo(fcAsig, 'VPU');
    $('#lbValorAsig').empty().append(numeral(TotalAsig).format('$0,0'));
    var BeneAsig = sumCampo(fcAsig, 'U');
    $('#lbBeneficiarioAsig').empty().append(numeral(BeneAsig).format('0,0'));
    $('#lbCantProyoAsig').empty().append(numeral(fcAsig.features.length).format('0,0'));
}
function getFondosData() {
    waitingDialog.show();
    if ($("#EscalaMap").val() == "Municipio") {
        agregarparametros(LyrMunicipioSim);
    } else {
        agregarparametros(LyrDeptoSim);
    }
    $("#panel_superDerecho").hide();
    queryDataFondos
        .fields(['D', 'M', 'U', 'VPU', 'VSU', 'VASU', 'CON','ES'])
        .orderBy(['D', 'M'])
        .returnGeometry(false);
    whereParametros = getParametros();
    
    queryDataFondos.where(whereParametros).run(function (error, featureCollection, response) {
        
           if (error == undefined) {
                CuentaTbs(featureCollection);
                if ($("#EscalaMap").val() == "Municipio") {
                    var cuentaValores = calculoMpio(featureCollection, LyrMunicipioSim);
                    Limitesleyenda = getBreaks(cuentaValores, LyrMunicipioSim);
                    legend.addTo(map);
                    MapearProyectosTotal(LyrMunicipioSim);

                } else {
                    var cuentaValores = calculoDepto(featureCollection, LyrDeptoSim);
                    
                    Limitesleyenda = getBreaks(cuentaValores, LyrDeptoSim);
                    legend.addTo(map);
                    MapearProyectosTotal(LyrDeptoSim);
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
            waitingDialog.hide();
            
    });
}


function getDeptoSimp() {
    waitingDialog.show();
    queryDeptoSimpli
        .fields(['CODIGO_DEP', 'NOMBRE'])
        .orderBy(['CODIGO_DEP']);
    queryDeptoSimpli.where("1=1").run(function (error, geojson, response) {
        LyrDeptoSim = geojson;
        
        queryMunSimpli
          .fields(['DPTO_CCDGO', 'MPIO_CCDGO', 'MPIO_CCNCT', 'MPIO_CNMBR'])
          .orderBy(['MPIO_CCNCT']);
        queryMunSimpli.where("1=1").run(function (error, geojson, response) {
            LyrMunicipioSim = geojson;
            getFondosData();
        });
    });
}


getDeptoSimp();

$("#BuscarMapa").click(function () {
    console.log("Busco");
    legend.removeFrom(map);
    getFondosData();
})