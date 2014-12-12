var map = L.map('map').setView([40.718, -73.99],13);
var CAI;
var BB_MSA;	
        
    var greymap = L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
			maxZoom: 18,
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
				'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
				'Imagery © <a href="http://mapbox.com">Mapbox</a>',
			id: 'examples.map-20v6611k'
		});

var geojson_CAI; 

geojson_CAI = L.geoJson(CAI, {
			style: style,
			onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, style);
    }
		});

var geojson_BB_MSA; 

geojson_BB_MSA = L.geoJson(BB_MSA, {
            style: style_BB,
			onEachFeature: onEachFeature_BB,

});


// create layer groups 
var baseMaps = {
    "Grayscale": greymap
};

var overlayMaps = {
     "Broadand Connectivity in MSA": geojson_BB_MSA,
    "Communiity Anchor Institutions": geojson_CAI, 

};


L.control.layers(baseMaps, overlayMaps).addTo(map);

//CAI controls and looks
		
    var info = L.control();

		info.onAdd = function (map) {
			this._div = L.DomUtil.create('div', 'info');
			this.update();
			return this._div;
		};

		info.update = function (props) {
			this._div.innerHTML = '<h4>Community Anchor Institutions</h4>' +  (props ?
				'<b>' + props.ANCHORNAME + '</b><br />' + props.ADDRESS + '<br /><h5>Website:</h5>'+ props.URL +'<sup>2</sup>'
				: 'Hover over a marker');
		};

		info.addTo(map);
        
function style(feature, latlng){
    return{
    radius: 6,
    fillColor: "#ffc400",
    color: "#000",
    weight: 1,
    opacity: 0,
    fillOpacity: 0.5
    }};

function highlightFeature(e) {
        var layer = e.target;
    
    layer.setStyle({
        radius: 10,
        fillColor: "#ff0a00",
        color: "#000",
        weight: 1,
        opacity: 0,
        fillOpacity: 1
    });
    
    if (!L.Browser.ie && !L.Browser.opera){
        layer.bringToFront();
    }
    info.update(layer.feature.properties);
}


function resetHighlight(e) {
    geojson_CAI.resetStyle(e.target),
        info.update();
}
    

function onEachFeature(feature, layer) {
			layer.on({
				mouseover: highlightFeature,
				mouseout: resetHighlight,
			});
            layer.bindPopup();
}

// BB_MSA choropleth features
var info_BB = L.control();
    
    info_BB.onAdd = function (map) {
			this._div = L.DomUtil.create('div', 'info');
			this.update();
			return this._div;
		};

		info_BB.update = function (props_BB) {
			this._div.innerHTML = '<h4>Households with Connectivity Dec 2010</h4>' +  (props_BB ?
				'<b>' + props_BB.TRACTNAME + '</b><br />' + props_BB.BTOP_1210 + ' rank / mi<sup>2</sup>'
				: 'Hover over a tract');
		};

		info_BB.addTo(map);


		// get color depending on the household connectivity
		function getColor_BB(d) {
			return d > 5.000000 ? '#800026' :
			       d > 4.000000  ? '#BD0026' :
			       d > 3.000000  ? '#E31A1C' :
			       d > 2.000000  ? '#FC4E2A' :
			       d > 1.000000   ? '#FD8D3C':
            	                  '#FFEDA0';
		}

		function style_BB(feature) {
			return {
				weight: 2,
				opacity: 1,
				color: 'white',
				dashArray: '3',
				fillOpacity: 0.7,
				fillColor: getColor_BB(feature.properties.BTOP_1210)
			};
		}

        function highlightFeature_BB(e) {
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

                    info_BB.update(layer.feature.properties);
                }
        function resetHighlight_BB(e) {
			BB_MSA.resetStyle(e.target);
			info_BB.update();
		}

		function zoomToFeature_BB(e) {
			map.fitBounds(e.target.getBounds());
		}

		function onEachFeature_BB(feature, layer) {
			layer.on({
				mouseover: highlightFeature_BB,
				mouseout: resetHighlight_BB,
				click: zoomToFeature_BB
			});
		}



		map.attributionControl.addAttribution('Broadband connectivity and Community Anchor Institutions');
