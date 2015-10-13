// var geocoder,
//     map;
//
// function initMap() {
//
//     geocoder = new google.maps.Geocoder()
//     var mapOptions = {
//         center: codeAddress(),
//         zoom: 12,
//         disableDefultUI: true,
//         scaleControl: true,
//         zoomControl: true
//     }
//
//     map = new google.maps.Map(document.getElementById('map'), mapOptions);
//     console.log(map);
//     var centerControlDiv = document.getElementById('controls');
//     map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(centerControlDiv);
// }
//
//
// // Geocode Zip Address
// function codeAddress() {
//
//     var address = document.getElementById('zip').value;
//
//     geocoder.geocode({'address': address}, function (results, status) {
//
//         if (status == google.maps.GeocoderStatus.OK) {
//
//             map.setCenter(results[0].geometry.location);
//
//             var marker = new google.maps.Marker({
//                 map: map,
//                 position: results[0].geometry.location
//             });
//
//         } else {
//
//             console.log('Geocode was not successful for the following reason: ' + status);
//
//         }
//
//     });
// }


// var cool = new Locator({container: 'map'});

Locator.init({
    name: 'options',
    container: 'map',
    geolocate: true,
    provideAddress: true,
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
