
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


        if (feature.properties.VPU != 0) {
            var textlabel = '<h6>' + nombre + '</h6>' +
          '<small class="text-muted">Valor : </small>' + numeral(feature.properties.VT).format('$0,0') + '<br>' +
          '<small class="text-muted">Valor Total Corriente: </small>' + numeral(feature.properties.VPU).format('$0,0') + '<br>' +
          '<small class="text-muted">Valor Total Costante: </small>' + numeral(feature.properties.VPUA).format('$0,0') + '<br>' +
          '<small class="text-muted">Valor Solicitado Corriente: </small>' + numeral(feature.properties.VSU).format('$0,0') + '<br>' +
          '<small class="text-muted">Valor Solicitado Constante: </small>' + numeral(feature.properties.VSUA).format('$0,0') + '<br>' +
          '<small class="text-muted">Valor Asignado Corriente: </small>' + numeral(feature.properties.VASU).format('$0,0') + '<br>' +
          '<small class="text-muted">Valor Asignado Constante: </small>' + numeral(feature.properties.VASUA).format('$0,0') + '<br>' +
          '<small class="text-muted">Beneficiados: </small>' + numeral(feature.properties.U).format('0,0') + '<br>' +
          '<small class="text-muted">Cantidad proyectos: </small>' + numeral(feature.properties.CANT).format('0,0')
          ;

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
				fillColor: getColor(feature.properties.VT)
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
		    console.log("layer");
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



