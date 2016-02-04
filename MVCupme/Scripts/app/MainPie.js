Highcharts.getOptions().colors = Highcharts.map(Highcharts.getOptions().colors, function (color) {
    return {
        radialGradient: {
            cx: 0.5,
            cy: 0.3,
            r: 0.7
        },
        stops: [
            [0, color],
            [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
        ]
    };
});
function pie(arrayJsonFondos, idContainer, nombre) {
    
    var confPie = {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: nombre,
            style: { "color": "#333333", "fontSize": "16px" }
        },
        subtitle: {
            text: 'En Pesos por Millon($M)'
        },
        credits: {
            text: 'FONDOS-UPME',
            href: 'http://www.upme.gov.co'
        },
        tooltip: {
            pointFormat: '<b>${point.y}</b><br><b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: false,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            }
        },
        exporting: {
            filename: 'Fondos ' + nombre
        },
        series: [{
            colorByPoint: true,
            data: arrayJsonFondos
        }]
    };
    if (idContainer == 'containerConcepto') {
        confPie.drilldown = new Object();
        //confPie.drilldown.drillUpButton = 'Regresar al CONCEPTO';
        confPie.drilldown.series = glo.pieEstado;
        confPie.subtitle.text = 'Concepto/Estado En Pesos Por Millon($M)';
        
        console.log(confPie);
    }
    if (arrayJsonFondos.length > 0) {
        $("#panel_superDerecho").show();
    } else {
        $("#panel_superDerecho").hide();
    }
    $('#' + idContainer).highcharts(confPie);

}

function getFondos(cod_dept, cod_mpio,nombre) {
    
    var datemin = $('#date_ini').data("DateTimePicker").date().format('YYYY-MM-DD');
    var datemax = $('#date_fin').data("DateTimePicker").date().format('YYYY-MM-DD');
    var where = whereParametros;
    if (cod_mpio == '') {
        where = "D ='" + cod_dept + "' and  " + where;
    } else {
        where = "D ='" + cod_dept + "' and M='" + cod_mpio + "' and  "+where;
    }

    getFondoDataPie(where, 'FO', arrayFondos,nombre);
    getFondoDataPie(where, 'SEC', arraySectores,nombre);
    getFondoDataPie(where, 'ES', arrayEstado,nombre);
    
}

function getFondoDataPie(where, idGrupo, array, nombre) {
    var arrayJsonFondos = [];
    var queryDataPie = L.esri.Tasks.query({
        url: config.dominio + config.urlHostDataFO + 'MapServer/' + config.INDI
    });
    var fields;
    if (idGrupo == 'ES') {
        fields = [glo.VarMapeo,'CON', idGrupo]
    } else {
        fields = [glo.VarMapeo, idGrupo]
    }
    queryDataPie
       .fields(fields)
       .orderBy([idGrupo])
       .returnGeometry(false);
       queryDataPie.where(where).run(function (error, featureCollection, response) {
           
            if (idGrupo == 'FO') {
                arrayJsonFondos = GetArrayPie(featureCollection, idGrupo, array);
                pie(arrayJsonFondos, 'containerFondos', nombre);
            } else if (idGrupo == 'SEC') {
                arrayJsonFondos = GetArrayPie(featureCollection, idGrupo, array);
                pie(arrayJsonFondos, 'containerSectores', nombre);
            } else if (idGrupo == 'ES') {
                arrayJsonFondos = GetArrayPieES(featureCollection, idGrupo, array);
                glo.pieEstado = arrayJsonFondos;
                getFondoDataPie(where, 'CON', arrayConcepto, nombre);
            } else if (idGrupo == 'CON') {
                arrayJsonFondos = GetArrayPieCON(featureCollection, idGrupo, array);
                pie(arrayJsonFondos, 'containerConcepto', nombre);
            }
    });
}


function GetArrayPie(featureCollection, idGrupo, array) {
    var sum_VPU = 0;
    var arrayJsonFondos = [], labelpie='';
    for (var i = 0; i < featureCollection.features.length; i++) {
        if (array[featureCollection.features[i].properties[idGrupo]] === undefined) {
            labelpie = featureCollection.features[i].properties[idGrupo];
        } else {
            labelpie = array[featureCollection.features[i].properties[idGrupo]];
        }
        if (i != featureCollection.features.length - 1) {
            if (featureCollection.features[i].properties[idGrupo] == featureCollection.features[i + 1].properties[idGrupo]) {
                sum_VPU = sum_VPU + featureCollection.features[i].properties[glo.VarMapeo];
            } else {
                sum_VPU = sum_VPU + featureCollection.features[i].properties[glo.VarMapeo];
                var valor = array[featureCollection.features[i].properties[idGrupo]];

                var row = {
                    name: labelpie,
                    y: parseInt(sum_VPU/1000000)
                };
                arrayJsonFondos.push(row);
                var sum_VPU = 0;
            }
        } else {
            sum_VPU = sum_VPU + featureCollection.features[i].properties[glo.VarMapeo];
            var row = {
                name: labelpie,
                y: parseInt(sum_VPU/1000000)
            };
            arrayJsonFondos.push(row);
        }
    }
    return arrayJsonFondos;
}
function GetArrayPieES(featureCollection, idGrupo, array) {
    var sum_VPU = 0;
    var arrayJsonFondos = [], arrayObjet = [];
    for (var i = 0; i < featureCollection.features.length; i++) {
        if (i != featureCollection.features.length - 1) {
            if (featureCollection.features[i].properties[idGrupo] == featureCollection.features[i + 1].properties[idGrupo]) {
                sum_VPU = sum_VPU + featureCollection.features[i].properties[glo.VarMapeo];
            } else {
                sum_VPU = sum_VPU + featureCollection.features[i].properties[glo.VarMapeo];
                var row = [
                   array[featureCollection.features[i].properties[idGrupo]], parseInt(sum_VPU/1000000)
                ];
                arrayJsonFondos.push(row);

                arrayObjet.push({
                    name:featureCollection.features[i].properties['CON'] ,
                    id: featureCollection.features[i].properties['CON'] ,
                    data: arrayJsonFondos
                });
                arrayJsonFondos = [];
                var sum_VPU = 0;
            }
        } else {
            sum_VPU = sum_VPU + featureCollection.features[i].properties[glo.VarMapeo];
            var row = [
                   array[featureCollection.features[i].properties[idGrupo]], parseInt(sum_VPU/1000000)
            ];
            arrayJsonFondos.push(row);
            arrayObjet.push({
                name: featureCollection.features[i].properties['CON'],
                id: featureCollection.features[i].properties['CON'],
                data: arrayJsonFondos
            });
            arrayJsonFondos = [];
        }
    }

    console.log(arrayObjet);
    return arrayObjet;
}

function GetArrayPieCON(featureCollection, idGrupo, array) {
    var sum_VPU = 0;
    var arrayJsonFondos = [];
    for (var i = 0; i < featureCollection.features.length; i++) {
        if (i != featureCollection.features.length - 1) {
            if (featureCollection.features[i].properties[idGrupo] == featureCollection.features[i + 1].properties[idGrupo]) {
                sum_VPU = sum_VPU + featureCollection.features[i].properties[glo.VarMapeo];
            } else {
                sum_VPU = sum_VPU + featureCollection.features[i].properties[glo.VarMapeo];
                var row = {
                    name: array[featureCollection.features[i].properties[idGrupo]],
                    y: parseInt(sum_VPU/1000000),
                    drilldown: array[featureCollection.features[i].properties[idGrupo]]
                };
                arrayJsonFondos.push(row);
                var sum_VPU = 0;
            }
        } else {
            sum_VPU = sum_VPU + featureCollection.features[i].properties[glo.VarMapeo];
            var row = {
                name: array[featureCollection.features[i].properties[idGrupo]],
                y: parseInt(sum_VPU/1000000),
                drilldown: array[featureCollection.features[i].properties[idGrupo]]
            };
            arrayJsonFondos.push(row);
        }
    }
    return arrayJsonFondos;
}