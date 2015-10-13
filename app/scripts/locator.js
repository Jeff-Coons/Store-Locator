(function (window) {
    'use strict';

    /**
     *  List of resources from Google Maps
     *
     *  Controls - //developers.google.com/maps/documentation/javascript/controls
     *  Events - //developers.google.com/maps/documentation/javascript/events
     *  Geo Location - //developers.google.com/maps/articles/geolocation?hl=en
     *
     */


    /* ==================================================
        Utility Functions
    ================================================== */

    /**
     * Create a new object by extending the passed in objects.
     * @param {Object} - A defined set of properties to be overwritten by the user.
     * @param {Object} - A defined set of properties overwritting the default properties.
     * @return {Object} - New object with user set properties and any defaults that weren't overwritten.
     */
    function extend( defaults, options ) {
        var extended = {},
            prop;

        for (prop in defaults) {
            if (Object.prototype.hasOwnProperty.call( defaults, prop )) {
                extended[prop] = defaults[prop];
            }
        }

        for (prop in options) {
            if (Object.prototype.hasOwnProperty.call( options, prop )) {
                extended[prop] = options[prop];
            }
        }

        return extended;
    }


    /**
     * Check to see if the object is array like.
     * @param {Object} - List populated by selecting all elements with a certain class name.
     * @return {Boolean} - if it's an array like object return true,
     * else console log the type of object returned and then return false.
     */
    function arrayLike( obj ) {
        var list = Object.prototype.toString.call(obj);

        if (list === '[object NodeList]' || list === '[object Object]' || list === '[object Array]' ) {
            return true;
        } else {
            console.log('this is not an array like object, it\'s an: ' + list);
            return false;
        }
    }


    /**
     * Loop through an array like object and handle the callback
     * @param {String} - ID or Class of dom element
     * @param {Callback} - function that will handle all user options
     * @return {Object} - Object containing the modified data
     */
    function each(selector, callback) {
        var obj = document.querySelectorAll(selector),
            length,
            i = 0;

        if ( arrayLike(obj) ) {
            length = obj.length;

            for (; i < length; i++) {
                if ( callback.call(obj[i], i, obj[i]) === false ) {
                    break;
                }
            }
        } else {
            for (i in obj) {
                if ( callback.call(obj[i], i, obj[i]) === false ) {
                    break;
                }
            }
        }

        return obj;
    }


    /* ==================================================
        Locator Library Methods
    ================================================== */

    /**
     * Wrapper function to ensure no confilcts occur in the global scope
     * @return {Object} - The constructor object is returned to be accessed
     */
    function define_locator() {

        /**
         * Represents the Store Locator
         * @constructor
         */
        var Locator = {};


        /** Global variables to used across multiple methods. */
        var self,
            userSettings = userSettings || {},
            map,
            geocoder = new google.maps.Geocoder(),
            getRequest = new XMLHttpRequest(),
            callEventInit = false,
            locations,
            userLocation,
            browserSupport = new Boolean();


        /**
         * Default settings and map options needed to create the map.
         * @type {{a: string, b: boolean, c: number, d}} defaults
         */
        var defaults = {
            name: 'defaults', // Name of object
            container: 'map', // ID of map container
            geolocate: false, // Boolean for getting the user's location through the browser
            provideAddress: true, // Boolean for geocoding to get coordinates
            address: 'null', // ID of input
            controls: null, // ID or Classs of container for custom controls
            zoomIn: null, // ID or Classs of zoom in button
            zoomOut: null, // ID or Classs of zoom in button
            controlsPosition: null, // Positon of the controls based on Google Maps APIv3
            dataLocation: null, // Url of the data from the server
            mapOptions: {
                center: {lat: 38.8833, lng: 77.0167}, // Object with coordinates of The United States
                zoom: 4, // Zoom of map on load
                disableDefultUI: false, // Boolean for map ui
                scaleControl: true, // Boolean for scale
                zoomControl: true, // Boolean for zoom,
                styles: [] // Array of objects containing custom styles
            }
        }


        /**
         * Default object that is needed for Geo Location.
         * @type {Object} - Defualt location to be used for geolocation.
         */
        var geoCodeProps = {
            address: 'United States'
        }


        /**
         * Init the Constructor and build out the map
         * @param {Object} - Settings and map options set by the user that will overwrite the defaults.
         * @return {Methods} - check browser support for request, set the options provided, and
         * center the map depending on the option provide by the user.
         */
        Locator.init = function (opts) {
            self = this;

            self.createRequestInstance();
            self.setOptions(opts);
            self.getMapCenter();

        };


        /**
         * Change the type of request depending if were in IE
         */
        Locator.createRequestInstance = function () {
            if (window.ActiveXObject) {
                 try {
                     getRequest = new ActiveXObject('Msxml2.XMLHTTP');
                 }

                 catch (e) {
                     try {
                         getRequest = new ActiveXObject('Microsoft.XMLHTTP');
                     }
                     catch (e) {}
                 }
            }
        };


        /**
         * Call to method, extending the passed in object with the defaults object.
         * @param {Object} - object containing settings and map options
         * @return {Object} - extended object containing settings and map options
         */
        Locator.setOptions = function (opts) {
            userSettings = extend(defaults, opts);
            if (userSettings.geocode === false) {
                userSettings.mapOptions.zoom = 4;
            }
        };


        /**
         * Get user's location based on Navigator object or
         * Get the address and then get the coordinates for map centering
         */
        Locator.getMapCenter = function () {
            var geoLocate = userSettings.geolocate,
                addressProvided = userSettings.provideAddress;

            if ( geoLocate === true && addressProvided === true ) {

                var warning = 'WARNING: You chose to Geolocate and provide an address. For best results please choose one or the other'
                console.log(warning);

                self.geoLocate();

            } else if ( geoLocate === true ) {

                self.geoLocate();

            } else if ( addressProvided === true ) {

                self.getAddrAndGeoCode(opts.address);
            }
        };


        /**
         * Get the user's location based on the browser's Navigator object
         */
        Locator.geoLocate = function () {
            if ( navigator.geolocation ) {
                browserSupport = true;

                navigator.geolocation.getCurrentPosition(function (position) {
                    console.log( position.coords );

                    new google.maps.LatLng( position.coords.latitude, position.coords.latitude );

                    self.ajaxRequest(userSettings.dataLocation);
                    // self.setCenter(userLocation);

                }, function () {
                    console.log(this);
                    self.handleNoGeoLocate(browserSupport);
                })
            }
        };


        /**
         * Get the user's location based on the browser's Navigator object
         */
        Locator.handleNoGeoLocate = function (error) {
            if ( error === true ) {
                console.log('Geolocation Service Failed')
                userLocation = 'United States'
            }
        };


        /**
         *  Get the address and set the geocode properties
         *  @param {String} - ID of the input to get the value
         *  @return {String} - The value of the input
         */
        Locator.getAddr = function (addr) {
            var address = document.getElementById(addr).value;

            geoCodeProps.address = address;

            return address;
        };


        /**
         *  Geocode the address provided, or the default
         *  @param {Object} - Object with a prop of Address
         *  @return
         */
        Locator.geoCode = function (address) {
            geocoder.geocode(address, function (results, status) {

                if (status == google.maps.GeocoderStatus.OK) {

                    /** Set property values for the geocode object based on the returned results. */
                    self.setProps(results[0]);

                    /** Get the locations from the server */
                    // self.ajaxRequest(userSettings.dataLocation);

                } else {
                    console.log('Geocode was not successful for the following reason: ' + status);
                }
            });
        };


        /**
         *  Call to methods if address input is provided else use default methods
         *  @param {String} - ID of the input to get the value
         *  @return Call to methods for address and geolocation
         */
        Locator.getAddrAndGeoCode = function (addr) {
            self.getAddr(addr);
            self.geoCode(geoCodeProps);
        };


        /**
         *  Set Property Values for the Address Returned From Geocoding Results
         *  @param {Object} Returned object from geocoding results
         *  @return {Object} Geocoding Properties replaced with results
        **/
        Locator.setProps = function (results) {
            var components =    results.address_components,
                address =       results.formatted_address,
                placeID =       results.place_id,
                bounds =        results.geometry.bounds,
                location =      {
                    lat: results.geometry.viewport.Pa.j,
                    lng: results.geometry.viewport.La.j
                };

            geoCodeProps = {
                address_components: components,
                address: address,
                location: location,
                placeId: placeID,
                bounds: bounds,
            }

            // Set the userSettings center to the location returned by results
            userSettings.mapOptions.center = location;
        };


        /**
         * Ajax request to get data from the server
         * @param {String} - Location of the data to make the request
         * @return {Request|Event} - Open and send the request and listen for state change
         */
        Locator.ajaxRequest = function (url) {
            // self.createRequestInstance();
            console.log(getRequest);
            getRequest.open('GET', url);
            getRequest.send(null);
        };


        /**
         * Get the data on state change after the request
         * @return {Object} - Get the response back from the server
         */
        Locator.stateChange = getRequest.onreadystatechange = function () {
            var DONE = 4,
                OK = 200;

            if ( getRequest.readyState === DONE ) {
                console.log('cool coool coool coool');
                if ( getRequest.status === OK ) {

                    locations = JSON.parse(getRequest.responseText);
                    Locator.createMap(userSettings);

                } else {
                    console.log('Error: ' + getRequest.status);
                }
            }
        };


        /**
         * Create the Map Object
         * @param {Object} - Map Options and Settings
         * @returns Create the map and call the method to center it on the location provided.
         */
        Locator.createMap = function (options) {
            map = new google.maps.Map(
                document.getElementById(options.container),
                options.mapOptions
            )

            // self.createMarker(userSettings.mapOptions.center);
            // self.setCenter(map);
            self.checkForCoordinates(locations);
        };


        /**
         * Check for coordinates of the locations
         * @param {Object} - Data returned by the statechange
         * @return Geocode to get the coordinates or Create the markers
         */
        Locator.checkForCoordinates = function (locations) {
            if ( locations !== undefined ) {
                locations.forEach(function (location) {

                    var coordinates = {
                        lat: location.lat,
                        lng: location.lng,
                    }

                    if ( location.lat === undefined || location.lng === undefined ) {
                        var addr = {
                            address: location.address + ' ' + location.city + ',' + location.state + ' ' + location.postal
                        }

                        self.getCoordinates(addr)
                    } else {

                        self.createMarker(coordinates);
                    }
                });
            }
        };


        /**
         * Get the Lat and Lng values for the locations if not provided
         * @param {Object} - One property of address, with the value being the full street address.
         * @return Geocode to get coordinates, then call to create the markers
         */
        Locator.getCoordinates = function (address) {
            geocoder.geocode(address, function (results, status) {

                if (status == google.maps.GeocoderStatus.OK) {

                    var coordinates = {
                        lat: results[0].geometry.viewport.Pa.j,
                        lng: results[0].geometry.viewport.La.j
                    }

                    self.createMarker(coordinates);
                }
            });
        };


        /**
         * Create Marker on the map for the locations
         * @param {Object} - Lat and Lng coordinates for the marker
         * @return New Marker for the location
         */
        Locator.createMarker = function (coordinates) {
            var marker = new google.maps.Marker({
                map: map,
                position: coordinates
            });
        }


        /**
         * Set Center of the Map
         * @param - {Object} the map object created after calling Google Maps
         * @return Center the map and create the controls
         */
        Locator.setCenter = function (map) {
            console.log('center center center');
            console.log(geoCodeProps.location);
            map.setCenter(userLocation);

            self.controlsPosition(userSettings.controlsPosition);
        };


        /**
         * Access the Control Position Object to Position the Controls
         * @param {String} - Positon Location based on Google Maps APIv3
         * @return {Number} - Value used to position the Controls, and
         * call to the events for the map.
         */
        Locator.controlsPosition = function (ctrlPosition) {
            var control = document.querySelectorAll(userSettings.controls);

            map.controls[
                google.maps.ControlPosition[ctrlPosition]
            ].push( control[0] );

            self.callEvents();
        };


        /**
         *  Bind an event to the zoom out button
         *  @param {String} - ID or Class of the zoom out button.
         *  @return Value of Current Zoom
         */
        Locator.bindZoomOut = function (el) {
            var zoomBtn = document.querySelectorAll(el);

            if (window.addEventListener) {
                zoomBtn[0].addEventListener('click', function () {
                    var zoomLevel = map.getZoom();
                    map.setZoom( zoomLevel - 1 );
                });

            } else if (window.attachEvent) {

                zoomBtn[0].attachEvent('click', function (e) {
                    var zoomLevel = map.getZoom();
                    map.setZoom( zoomLevel - 1 );
                });

            } else if (window.onClick) {

                zoomBtn[0].onclick = function (e) {
                    var zoomLevel = map.getZoom();
                    map.setZoom( zoomLevel - 1 );
                };

            }
        };


        /**
         *  Bind an event to the zoom in button
         *  @param {String} - ID or Class of the zoom in button.
         *  @return Value of Current Zoom
         */
        Locator.bindZoomIn = function (el) {
            var zoomBtn = document.querySelectorAll(el);

            if (window.addEventListener) {
                zoomBtn[0].addEventListener('click', function () {
                    var zoomLevel = map.getZoom();
                    map.setZoom( zoomLevel + 1 )
                });

            } else if (window.attachEvent) {

                zoomBtn[0].attachEvent('click', function (e) {
                    var zoomLevel = map.getZoom();
                    map.setZoom( zoomLevel + 1 )
                });

            } else if (window.onClick) {

                zoomBtn[0].onclick = function (e) {
                    var zoomLevel = map.getZoom();
                    map.setZoom( zoomLevel + 1 )
                };

            }
        };


        /**
         *  Call the events of map
         *  @return {Event} - Multiple events that handle the functionality of the map.
         */
        Locator.callEvents = function () {

            /** Check to see if events have already been bound to the elements */
            if ( !(callEventInit) ) {
                self.bindZoomIn(userSettings.zoomIn);
                self.bindZoomOut(userSettings.zoomOut);
            }

            callEventInit = true;
        };

        return Locator;
    }



    /**
     * If statement declaring the constructor globally
     * @return {Object|Error} - The constructor object or Console Log of the error
     */
    if ( typeof(Locator) === 'undefined' ) {
        window.Locator = define_locator();
    } else  {
        console.log('Locator has already been defined');
    }

}(window));
