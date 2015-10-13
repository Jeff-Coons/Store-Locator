(function (window) {
    'use strict';

    /**
     *  List of resources from Google Maps
     *
     *  @see Controls - //developers.google.com/maps/documentation/javascript/controls
     *  @see Events - //developers.google.com/maps/documentation/javascript/events
     *  @see Geo Location - //developers.google.com/maps/articles/geolocation?hl=en
     *  @see Geo Location Properties - //developer.mozilla.org/en-US/docs/Web/API/Geolocation/Using_geolocation
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
        Store Locator
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


        /** Global variables to be used across multiple methods. */
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
            address: null, // ID of input
            controls: null, // ID or Class of container for custom controls
            zoomIn: null, // ID or Class of zoom in button
            zoomOut: null, // ID or Class of zoom in button
            controlsPosition: null, // Positon of the controls based on Google Maps APIv3
            dataLocation: null, // Url of the data from the server
            listResults: true, // Boolean to show the results in a list
            listContainer: null, // ID or Class of the container that will hold the results list
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
         * Default object that is needed for Geolocation or Geocoding.
         * @type {Object} - Defualt location for geolocation or geocoding.
         */
        var geoCodeProps = {
            address: 'United States'
        }


        /**
         * Init the Constructor and build out the map
         * @param {Object} - Settings and map options set by the user that will overwrite the defaults.
         * @return {Methods} - check browser support for request, set the options provided, and
         * call the correct method for centering the map.
         */
        Locator.init = function (opts) {
            self = this;

            self.createRequestInstance();
            self.setOptions(opts);
            self.callMethodForMapCentering();

        };


        /**
         * Change the type of request if in IE
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
         * Geocode or Geolocate if user hasn't provided an address
         * @return {Method} - call the correct method depending on user options
         */
        Locator.callMethodForMapCentering = function () {
            var geoLocate = userSettings.geolocate,
                addressProvided = userSettings.provideAddress;

            if ( addressProvided === true ) {

                self.getAddrAndGeoCode(userSettings.address);

                /** Provide warning if both options are set to true */
                if ( geoLocate === true ) {
                    console.log('WARNING: You chose to Geolocate and provide an address. The address provided takes precedence over Geolocation, if you desire different results please adjust the options provided');
                }

            } else if ( geoLocate === true ) {

                self.geoLocate();

            }
        };


        /**
         * Get the user's location based on the browser's Navigator object
         */
        Locator.geoLocate = function () {
            navigator.geolocation.getCurrentPosition(function (position) {

                geoCodeProps.location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                self.ajaxRequest(userSettings.dataLocation);

            }, self.geoLocateUsingIPAddr(browserSupport))
        };


        /**
         * Get the user's location based on the IP Address
         * @param {Boolean} - indication if geolocation has failed
         * @return Coordinates of the location found using the user's IP Address
         */
        Locator.geoLocateUsingIPAddr = function (error) {
            if ( error === true ) {
                console.log('Geolocation Service Failed')
                // use the user's ip address to get the coordinates for map centering
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
                    self.ajaxRequest(userSettings.dataLocation);

                } else {
                    console.log('Geocode was not successful for the following reason: ' + status);
                }
            });
        };


        /**
         *  If the address isn't coordinates, get the address provided and geocode for coordinates
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
         */
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
         * @return {Request} - Open and send the request
         */
        Locator.ajaxRequest = function (url) {
            getRequest.open('GET', url);
            getRequest.send(null);
        };


        /**
         * Listen for the response of the ajax request
         * @return {Object} - Get the data and begin the creation of the map using those results
         */
        Locator.stateChange = getRequest.onreadystatechange = function () {
            var DONE = 4,
                OK = 200;

            if ( getRequest.readyState === DONE ) {
                if ( getRequest.status === OK ) {

                    locations = JSON.parse(getRequest.responseText);

                    /** If the map has already been created then check the data for coordinates */
                    if (map === undefined) {
                        Locator.createMap(userSettings);
                    } else {
                        self.checkForCoordinates(locations);
                    }

                    if ( userSettings.listResults ) {
                        self.createList(locations);
                    }

                } else {
                    console.log('Error: ' + getRequest.status);
                }
            }
        };


        /**
         * Create the Map Object
         * @param {Object} - Map Options and Settings
         * @return Create the map and call the method to center it on the location provided.
         */
        Locator.createMap = function (options) {
            map = new google.maps.Map(
                document.getElementById(options.container),
                options.mapOptions
            )

            self.setCenter(map);
            self.controlsPosition(userSettings.controlsPosition);
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
         * @return Center the map using the coordinates from geolocation or geocoding
         */
        Locator.setCenter = function (map) {
            map.setCenter(geoCodeProps.location);
        };


        /**
         * Create a list showing the results received from the ajax request
         * @param {Object} - Details of the item
         * @return {String} - Markup to pass to the render method
         */
        Locator.createList = function (results) {
            if ( results !== undefined ) {
                results.forEach(function (result) {

                    var name = '<h2>' + result.name + '</h2>',
                        addr1 = '<p>' + result.address + '</p>',
                        addr2 = '<p>' + result.city + ',' + result.state + ' ' + result.postal + '/<p>',
                        phone = '<p>' + result.phone + '</p>',
                        listItem = name + '<br />' + addr1 + '<br />' + addr2 + '<br />' + phone,
                        div = '<div>' + listItem + '</div>';

                    console.log(userSettings.listContainer);
                    self.renderItem(div);
                });
            }
        };


        /**
         * Append or Prepend the markup to the container passed
         * @param {String} - Markup of the element that will be rendered to the dom
         * @return {Node} — Node element rendered to the dom
         */
        Locator.renderItem = function (item) {
            // render the list item here
            var parent = document.querySelector('#' + userSettings.listContainer);
            console.log(parent);
            console.log(item);
            parent.appendChild(item);

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
