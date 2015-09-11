
function MapearProyectos(fc) {
    glo.lyrProyCluster = L.geoJson(fc, {
        pointToLayer: function (feature, latlng) {
            var featureMarket;
            featureMarket = L.marker(latlng, glo.styleProy);
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