// Create Window Object?
// window.Locator = window.Locator || {};
window.Locator = (function () {

    // Declare variables
    var self,
        geocoder,
        map,
        address,
        mobileDevice = false;


    // Set Default Properties
    var defaults = {
        container: '#map',
        geoLocation: null,
        center: {lat: -34.397, lng: 150.644},
        zoom: 8,
        disableDefultUI: true,
        scaleControl: true,
        zoomControl: true
    }


    /**
      *  Extend Function for Merging Defaults and Options
      *  @param      {Object} default options
      *  @param      {Object} options passed through on instantiation
      *  @returns    {Object} new object with the merged values
    **/

    var extend = function ( defaults, options ) {
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
      * Locator Contructor
      * @param      {Object} options passed through on instantiation
      *
      *
    **/

    function Locator() {
        self = this;
        console.log(this);
        var options = options || {};
        var getProps = self.getProps(defaults, options);

    };


    /**
      * Get Defaults and Options
      *
      *
      *
    **/

    Locator.prototype.getProps = function (defaults, options) {

    };


    /**
      * Detect Browser or Mobile Device
      *  @returns   Boolean if true, do not call the createMap method
    **/

    // Locator.prototype.detectBrowser = function () {
    //     var useragent = navigator.userAgent;
    //     // var mapdiv = document.getElementById("map");
    //
    //     if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1 ) {
    //       console.log('iPhone or Android has been detected');
    //       mobileDevice = true;
    //     } else {
    //       console.log('iPhone or Android not detected');
    //     }
    //
    //     return mobileDevice;
    // };
    //


    // /**
    //   *
    //   *
    //   *
    //   *
    // **/
    //
    //  Locator.prototype.getAddress = function ( zip ) {
    //     address = document.getElementById(zip).value
    // };



    //
    // /**
    //   *  Get the Address or Zip Code for GeoLocating
    //   *  @param     'String' address or zip code used for geolocation
    //   *  @returns
    //   *
    // **/
    //
    //  Locator.prototype.geoCode = function ( address ) {
    //     address = address;
    //     var marker;
    //
    //     // Call Google Geocode Object
    //     geocoder.geocode( {'address': address}, function ( results, status ) {
    //
    //         if (status == google.maps.GeocoderStatus.OK) {
    //             map.setCenter(results[0].geometry.location);
    //
    //             marker = new google.maps.Marker({
    //                 map: map,
    //                 position: results[0].geometry.location
    //             });
    //
    //         } else {
    //             console.log('Geocode was not successful because:' + status);
    //         }
    //     });
    // };


    /**
      *  Create the Map
      *  @param      'String' ID of container for the map
      *  @param      {Object} Object containing passed options and defaults
      *  @returns    {Object} new Maps object
    **/

    Locator.prototype.createMap = function ( container, options ) {
        map = new google.maps.Map(container, options)
    };


    var locator = {
        init: function () {
            return new Locator();
        }
    };




    return locator;

}());
