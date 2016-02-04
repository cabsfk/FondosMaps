
var lyrTotalProyectos;
function getDPTO(cod) {
    var dpto = turf.filter(glo.jsonDto, 'CODIGO_DEP', cod);
    //console.log(dpto);
    if (dpto.features.length > 0) {
        return dpto.features[0].properties.NOMBRE;
    } else {
        return '';
    }
    
}

    
    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });
        var textTitle="",nombre,dpto='';
        if ($("#EscalaMap").val() == "Municipio") {
            textTitle = "Municipio";
            nombre = feature.properties.MPIO_CNMBR;
            dpto = getDPTO(feature.properties.DPTO_CCDGO) + ' - ';
            //console.log(dpto.features[0].properties.NOMBRE);
        } else if ($("#EscalaMap").val() == "Departamento")  {
            textTitle = "Departamento";
            nombre = feature.properties.NOMBRE;
        }
       // console.log(feature.geometry);

        htmlpopup =
               '<div class="panel panel-primary">' +
                       '<div class="popupstyle">' +
                            '<center><h6 class="text-success">' + dpto  + nombre + '</h6></center>' +
                            '<span class="text-muted"><i  data-toggle="tooltip" data-placement="top" title="Valor total del proyecto">Valor Proyecto</i></span><small> (<i  data-toggle="tooltip" data-placement="top" title="Valor Corriente en $M por año">Corriente en $M</i>-<i data-toggle="tooltip" data-placement="top" title="Valor indexado con el IPC a 31 de diciembre de cada año">Constante en $M</i>):</small>  <br>' + numeral(feature.properties.VPU / 1000000).format('$0,0') + config.mill + ' - ' + numeral(feature.properties.VPUA / 1000000).format('$0,0') + config.mill + '<br>' +
                            '<span class="text-muted"><i data-toggle="tooltip" data-placement="top" title="Recursos solicitados a los diferentes fondos">Valor Solicitado</i></span><small> (<i  data-toggle="tooltip" data-placement="top" title="Valor Corriente en $M por año">Corriente en $M</i>-<i data-toggle="tooltip" data-placement="top" title="Valor indexado con el IPC a 31 de diciembre de cada año">Constante en $M</i>):</small><br>' + numeral(feature.properties.VSU / 1000000).format('$0,0') + config.mill + ' - ' + numeral(feature.properties.VSUA / 1000000).format('$0,0') + config.mill + '<br>' +
                            '<span class="text-muted"><i data-toggle="tooltip" data-placement="top" title="Recursos aprobados mediante actas o resoluciones para financiar proyectos de inversión con cargo a los recursos de los diferentes fondos">Valor Asignado</i></span><small> (<i  data-toggle="tooltip" data-placement="top" title="Valor Corriente en $M por año">Corriente en $M</i>-<i data-toggle="tooltip" data-placement="top" title="Valor indexado con el IPC a 31 de diciembre de cada año">Constante en $M</i>):</small><br>' + numeral(feature.properties.VASU / 1000000).format('$0,0') + config.mill + ' - ' + numeral(feature.properties.VASUA / 1000000).format('$0,0') + config.mill + '<br>' +
                            '<span class="text-muted">Viviendas Beneficiadas: </span>' + numeral(feature.properties.U).format('0,0') + '<br>' +
                            '<span class="text-muted">Cantidad proyectos: </span>' + numeral(feature.properties.CANT).format('0,0') + '<br>' +
                            '<span class="text-muted"><i data-toggle="tooltip" data-placement="top" title="Cantidad total de viviendas segun ultima vigencia">Viviendas Totales</i>: </span>' + numeral(feature.properties.ICEE_VIVTOT).format('0,0') + '<br>' +
                            '<span class="text-muted"><i data-toggle="tooltip" data-placement="top" title="Indice de. Cobertura del Servicio de Energía Eléctrica">ICEE</i>: </span>' + numeral(feature.properties.ICEE_ICEE_TOT*100).format('0,0.0') + '%<br>' +
                            '<span class="text-muted"><i data-toggle="tooltip" data-placement="top" title="Cantidad Viviendas Sin servicio PIEC ultima Vigencia">Viviendas Sin Servicio (PIEC)</i>: </span>' + numeral(feature.properties.ICEE_VSS_TOT).format('0,0') + '<br>' +
                        '</div>' +
                '</div>' +
            '</div>';
       
        layer.bindPopup(htmlpopup);
        layer.on('popupclose', function (e) {
            resetMapa();
        });
        layer.on('popupopen', function (e) {
            $('[data-toggle="tooltip"]').tooltip();
            
        });
        
        if (feature.properties.VPU != 0) {
          var textlabel = '<h6>' + nombre + '</h6>' +
          '<small class="text-muted">Mapeado por Valor ' + glo.tituloLeyenda + ' Constante en $M</small>.<br>' +
           numeral(feature.properties[glo.VarMapeo]/1000000).format('$0,0')+config.mill + '<br>';

        }else{
            var textlabel = '<h6>' + nombre + '</h6>';
        }
        
        layer.bindLabel( textlabel,{ 'noHide': true });
    }


        function style(feature) {
			return {
				weight: 1,
				opacity: 1,
				color: 'white',
				dashArray: '3',
				fillOpacity: 0.7,
				fillColor: getColor(feature.properties[glo.VarMapeo])
			};
		}

		function highlightFeature(e) {
			var layer = e.target;

			layer.setStyle({
				weight: 4,
				color: '#00FFFF',
				dashArray: '',
				fillOpacity: 0.7
			});

			if (!L.Browser.ie && !L.Browser.opera) {
				layer.bringToFront();
			}

		}

		
		function resetHighlight(e) {
		    lyrTotalProyectos.resetStyle(e.target);
		}
		
		function zoomToFeature(e) {
		    map.fitBounds(e.target.getBounds(), {padding:[150,150]});
		    var layer = e.target;
		  //  console.log("layer");
		    if (layer.feature.properties.C == 0) {
		        $("#panel_superDerecho").hide();
		    } else {
		        //console.log(layer.feature.properties.CODIGO_DEP);
		        if ($("#EscalaMap").val() == "Municipio") {
		            getFondos(layer.feature.properties.DPTO_CCDGO, layer.feature.properties.MPIO_CCDGO,layer.feature.properties.MPIO_CNMBR);
		        } else if ($("#EscalaMap").val() == "Departamento") {
		            getFondos(layer.feature.properties.CODIGO_DEP, '', layer.feature.properties.NOMBRE);
		        }		       
		    }		     
		}
        $("#panel_superDerecho").hide();



function MapearProyectosTotal(featureCollection) {
    if (map.hasLayer(lyrTotalProyectos)) {
        map.removeLayer(lyrTotalProyectos);
    }
    lyrTotalProyectos = L.geoJson(featureCollection, { style: style, onEachFeature: onEachFeature });
    map.addLayer(lyrTotalProyectos);
   
}

//MapearProyectosTotalDepto();



