function crearhtml(properties) {
    var tabTitle = '<div >' +
                '<ul class="nav nav-tabs" role="tablist">';

    var tabContent = '</ul>' +
          '<div class="tab-content">';
    
    var activacion = "active";

    glo.html.FO = [];
    glo.html.PERCOR = [];
    glo.html.PERS = [];

    /*console.log(glo.fcFO.features.length);
    console.log(glo.loadProy.indexOf("FO"));*/
    if (glo.fcFO.features.length > 0 && glo.loadProy.indexOf("FO") >=0) {
        var ProFO = turf.filter(glo.fcFO, glo.fcFO.features[0].properties.NomISU, properties.ID_CENTRO_POBLADO);
        if (ProFO.features.length > 0) {
            tabTitle = tabTitle + '<li role="presentation" class="' + activacion + '"><a href="#TabFondos" aria-controls="home" role="tab" data-toggle="tab">Fondos (' + ProFO.features.length + ')</a></li>';
            tabContent = tabContent + '<div role="tabpanel" class="tab-pane ' + activacion + '" id="TabFondos">';
            activacion = '';
            for (i = 0; i < ProFO.features.length; i++) {               
                var feature = ProFO.features[i];
                feature.properties.FO = glo.arrayFondos[feature.properties.FO];
                feature.properties.SEC = glo.arraySectores[feature.properties.SEC];
                feature.properties.FE = moment(feature.properties.FE).tz("America/Bogota").add(5, 'hours').format('DD/MM/YYYY');
                htmlpopup =  
                    '<div class="panel panel-default  ">' +
                          '<div class="panel-body">' +
                                       '<h6><strong  class="primary-font">' + feature.properties.PNOM + '</strong><br></h6>' +
                                    '<small>Sitio a Energizar:</small> ' + properties.NOMBRE_SITIO + '<br>' +
                                    '<small>Beneficiarios:</small> ' + numeral(feature.properties.U).format('0,0') + '<br>' +
                                    '<small>Valor proyecto:</small> ' + numeral(feature.properties.VP).format('$0,0') + ' <br>' +
                                    '<small>Fondo:</small> ' + feature.properties.FO + '<br>' +
                                    '<small>Sector:</small> ' + feature.properties.SEC + '<br>' +
                                    '<small>Estado:</small> ' + feature.properties.ES + '<br>' +
                                    '<small>Concepto:</small> ' + feature.properties.CON + '<br>' +
                                    '<small>Fecha Proyecto:</small> ' + feature.properties.FE + '<br>' +
                          '</div>' +
                        '</div>';
                glo.html.FO.push(htmlpopup);
            }

            htmlpopup = '<div id="contentPgFO">' + glo.html.FO[0] + '</div>' +
            '<div id="pageSelFO"></div>';
            

            tabContent = tabContent + htmlpopup +'</div>';
        }        
    }
    if (glo.fcPCR.features.length > 0 && glo.loadProy.indexOf("PCR") >= 0) {
        
        var ProPECOR = turf.filter(glo.fcPCR, glo.fcPCR.features[0].properties.NomISU, properties.ID_CENTRO_POBLADO);
        if (ProPECOR.features.length > 0) {
            tabTitle = tabTitle + '<li role="presentation" class="' + activacion + '"><a href="#TabPECORS" aria-controls="profile" role="tab" data-toggle="tab">PECORS (' + ProPECOR.features.length + ')</a></li>';
            tabContent = tabContent + '<div role="tabpanel" class="tab-pane ' + activacion + '" id="TabPECORS">Sin resultados</div>';
            activacion = '';
        }
    }
    if (glo.fcPERS.features.length > 0 && glo.loadProy.indexOf("PERS") >= 0) {
        var ProPERS = turf.filter(glo.fcPERS, glo.fcPERS.features[0].properties.NomISU, properties.ID_CENTRO_POBLADO);
        console.log(ProPERS);
        if (ProPERS.features.length > 0) {
            tabTitle = tabTitle + '<li role="presentation" class="' + activacion + '"><a href="#TabPERS" aria-controls="messages" role="tab" data-toggle="tab">PERS (' + ProPERS.features.length + ')</a></li>';
            tabContent = tabContent + '<div role="tabpanel" class="tab-pane ' + activacion + '" id="TabPERS">';
            activacion = '';
            
            for (i = 0; i < ProPERS.features.length; i++) { 
                var feature = ProPERS.features[i];
                htmlpopup =
                    '<div class="panel panel-default">' +
                          '<div class="panel-body">' +
                            '<h6><strong  class="primary-font">' + feature.properties.NOM + '</strong><br></h6>' +
                            '<small>Nombre del sitio:</small> ' + properties.NOMBRE_SITIO + '<br>' +
                            '<small>Beneficiarios en todos los tipos de proyectos.</small> ' + numeral(feature.properties.BNF).format('0,0') + '<br>' +
                            '<small>Valor proyecto:</small> ' + numeral(feature.properties.VP).format('$0,0') + ' <br>' +
                            '<small>Valor solicitado:</small> ' + numeral(feature.properties.VS).format('$0,0') + ' <br>' +
                            '<small>Sector:</small> ' + feature.properties.SCT + '<br>' +
                            '<small>Fase:</small> ' + feature.properties.FP + '<br>' +
                            '<small>Fuente de financiación:</small> ' + feature.properties.FF + '<br>' +
                            '<small>Fuente de energía.:</small> ' + feature.properties.FE + '<br>' +
                            '<small>Estado:</small> ' + feature.properties.E + '<br>' +
                          '</div>' +
                        '</div>';
                glo.html.PERS.push(htmlpopup);
            }
            htmlpopup = '<div id="contentPgPERS">' + glo.html.PERS[0] + '</div>' +
             '<div id="pageSelPERS"></div>';
            tabContent = tabContent + htmlpopup +'</div>';
       }   
    }
    var popupContent = tabTitle + tabContent + '</div>' + '</div>';
    
    $('#TabPopup').empty().append(popupContent);
    if (glo.html.FO.length > 0) {
        $('#pageSelFO').bootpag({
            total: glo.html.FO.length,
            page: 1,
            maxVisible: 5
        }).on('page', function (event, num) {
            $("#contentPgFO").html(glo.html.FO[num - 1]); // or some ajax content loading...
        });
    }
    if (glo.html.PERS.length > 0) {
        $('#pageSelPERS').bootpag({
            total: glo.html.PERS.length,
            page: 1,
            maxVisible: 5
        }).on('page', function (event, num) {
            $("#contentPgPERS").html(glo.html.PERS[num - 1]); // or some ajax content loading...
        });
    }
    

}

function MapearProyectos(fc) {
    glo.lyrProyCluster = L.geoJson(fc, {
        pointToLayer: function (feature, latlng) {
            var featureMarket;
            featureMarket = L.marker(latlng, glo.styleProy);
            
            var popupContent = "<div id='TabPopup' >" + '</div>';
            featureMarket.bindPopup(popupContent, {
                closeButton: true,
                minWidth: 250
            });
            featureMarket.on('popupopen', function (e) {
                console.log(feature.properties);
                crearhtml(feature.properties)
                
            });

            
            //featureMarket.bindPopup(htmlpopup);
            return featureMarket;
        }
    });

    if (map.hasLayer(glo.SuCluster)) {
        glo.SuCluster.clearLayers();
        glo.SuCluster.addLayer(glo.lyrProyCluster);
    } else {

        glo.SuCluster.addLayer(glo.lyrProyCluster);
        map.addLayer(glo.SuCluster);
    }
}