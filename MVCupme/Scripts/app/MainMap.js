
var lyrTotalProyectos;


    
    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });
        var textTitle="",nombre;
        if ($("#EscalaMap").val() == "Municipio") {
            textTitle = "Municipio";
            nombre = feature.properties.MPIO_CNMBR;
        } else if ($("#EscalaMap").val() == "Departamento")  {
            textTitle = "Departamento";
            nombre = feature.properties.NOMBRE;
        }
       // console.log(feature.geometry);

        htmlpopup =
               '<div class="panel panel-primary">' +
                       '<div class="popupstyle">' +
                            '<center><h6 class="text-success">' + nombre + '</h6></center>' +
                            '<span class="text-muted">Valor Proyecto <i class="fa fa-question-circle fa-1x text-info " data-toggle="tooltip" data-placement="top" title="Valor total del proyecto"></i></span><small> (Corriente<i class="fa fa-question-circle fa-1x text-info " data-toggle="tooltip" data-placement="top" title="Valor corriente por año"></i>-Constante<i class="fa fa-question-circle fa-1x text-info " data-toggle="tooltip" data-placement="top" title="Valor indexado con el IPC a 31 de diciembre de cada año"></i>):</small>  <br>' + numeral(feature.properties.VPU).format('$0,0') + ' - ' + numeral(feature.properties.VPUA).format('$0,0') + '<br>' +
                            '<span class="text-muted">Valor Solicitado <i class="fa fa-question-circle fa-1x text-info " data-toggle="tooltip" data-placement="top" title="Recursos solicitados a los diferentes fondos"></i></span><small> (Corriente<i class="fa fa-question-circle fa-1x text-info " data-toggle="tooltip" data-placement="top" title="Valor corriente por año"></i>-Constante<i class="fa fa-question-circle fa-1x text-info " data-toggle="tooltip" data-placement="top" title="Valor indexado con el IPC a 31 de diciembre de cada año"></i>): </small><br>' + numeral(feature.properties.VSU).format('$0,0') + ' - ' + numeral(feature.properties.VSUA).format('$0,0') + '<br>' +
                            '<span class="text-muted">Valor Asignado <i class="fa fa-question-circle fa-1x text-info " data-toggle="tooltip" data-placement="top" title="Recursos aprobados mediante actas o resoluciones para financiar proyectos de inversión con cargo a los recursos de los diferentes fondos"></i></span><small> (Corriente<i class="fa fa-question-circle fa-1x text-info " data-toggle="tooltip" data-placement="top" title="Valor corriente por año"></i>-Constante<i class="fa fa-question-circle fa-1x text-info " data-toggle="tooltip" data-placement="top" title="Valor indexado con el IPC a 31 de diciembre de cada año"></i>): </small><br>' + numeral(feature.properties.VASU).format('$0,0') + ' - ' + numeral(feature.properties.VASUA).format('$0,0') + '<br>' +
                            '<span class="text-muted">Beneficiados: </span>' + numeral(feature.properties.U).format('0,0') + '<br>' +
                            '<span class="text-muted">Cantidad proyectos: </span>' + numeral(feature.properties.CANT).format('0,0') + '<br>' +
                            '<span class="text-muted">Viviendas Totales<i class="fa fa-question-circle fa-1x text-info " data-toggle="tooltip" data-placement="top" title="Cantidad total de viviendas segun ultima vigencia"></i>: </span>' + numeral(feature.properties.ICEE_VIVTOT).format('0,0') + '<br>' +
                            '<span class="text-muted">ICEE<i class="fa fa-question-circle fa-1x text-info " data-toggle="tooltip" data-placement="top" title="Indice de. Cobertura del Servicio de Energía Eléctrica"></i>: </span>' + numeral(feature.properties.ICEE_ICEE_TOT*100).format('0,0.0') + '%<br>' +
                            '<span class="text-muted">Viviendas Sin Servicio<i class="fa fa-question-circle fa-1x text-info " data-toggle="tooltip" data-placement="top" title="Cantidad Viviendas Sin servicio ultima Vigencia"></i>: </span>' + numeral(feature.properties.ICEE_VSS_TOT).format('0,0') + '<br>' +
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
          '<small class="text-muted">Mapeado por Valor ' + glo.tituloLeyenda + ' Constante</small>.<br>' +
           numeral(feature.properties[glo.VarMapeo]).format('$0,0')+ '<br>';

        }else{
            var textlabel = '<h6>' + nombre + '</h6>';
        }
        
        layer.bindLabel( textlabel,
            { 'noHide': true });
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



