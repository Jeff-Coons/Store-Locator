Locator.init({
    name: 'options',
    container: 'map',
    geolocate: true,
    provideAddress: false,
    address: 'zip',
    controls: '#controls',
    zoomIn: '#zoom-in',
    zoomOut: '#zoom-out',
    controlsPosition: 'RIGHT_BOTTOM',
    // dataLocation: '/locator.json',
    dataLocation: '/locator-wo-coordinates.json',
    mapOptions: {
        zoom: 13,
        disableDefaultUI: true,
        scaleControl: true,
        zoomControl: false,
        styles: [
            {
                "featureType": "landscape",
                "stylers": [{
                    "saturation": -100
                }, {
                    "lightness": 60
                }]
            },
            {
                "featureType": "road.local",
                "stylers": [{
                    "saturation": -100
                }, {
                    "lightness": 40
                }, {
                    "visibility": "on"
                }]
            },
            {
                "featureType": "transit",
                "stylers": [{
                    "saturation": -100
                }, {
                    "visibility": "simplified"
                }]
            },
            {
                "featureType": "administrative.province",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {
                "featureType": "water",
                "stylers": [{
                    "visibility": "on"
                }, {
                    "lightness": 30
                }]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [{
                    "color": "#ef8c25"
                }, {
                    "lightness": 40
                }]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry.fill",
                "stylers": [{
                    "color": "#b6c54c"
                }, {
                    "lightness": 40
                }, {
                    "saturation": -40
                }]
            }
        ]
    }
});
