
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


        if(SumaTotales.Beneficiarios!=0){
            var textlabel = '<h4> <p class="text-info">' + nombre + '</p></h4>' +
          '<h5><small>Beneficiados: </small>' + numeral(feature.properties.U).format('0,0') + ' (' + numeral((feature.properties.U / SumaTotales.Beneficiarios) * 100).format('0,0') + '%)</h5>' +
          '<h5><small>Valor: </small>' + numeral(feature.properties.VPU).format('$0,0') + ' (' + numeral((feature.properties.VPU / SumaTotales.Valor) * 100).format('0,0') + '%)</h5>' +
          '<hr>' +
          '<h5><small>Valor Solicitado: </small>' + numeral(feature.properties.VSU ).format('$0,0') +'</h5>' +
          '<h5><small>Valor Terceros: </small>' + numeral(feature.properties.VTU ).format('$0,0') +'</h5>';

        }else{
            var textlabel = '<h4> <p class="text-info">' + nombre + '</p></h4>';
        }
        
        layer.bindLabel(
            textlabel,
            { 'noHide': true });
    }


        function style(feature) {
			return {
				weight: 1,
				opacity: 1,
				color: 'white',
				dashArray: '3',
				fillOpacity: 0.7,
				fillColor: getColor(feature.properties.VPU)
			};
		}

		function highlightFeature(e) {
			var layer = e.target;

			layer.setStyle({
				weight: 5,
				color: '#666',
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



