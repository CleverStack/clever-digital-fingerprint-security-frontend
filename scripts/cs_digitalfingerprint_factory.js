define(['angular', '../module'], function (ng) {
  'use strict';

  ng.module('cs_digitalfingerprint.services')
  .factory('CSDigitalFingerprintFactory', [
    function () {

     var digitalFingerprint = {

        settings: {

            //prints will run if they are active == 1;
            "prints": [
                {

                    "name"  : "Browser Plugins",
                    "check" : true //(false = turn off checking)

                },
                {

                    "name"  : "User Agent",
                    "check" : true

                },
                {

                    "name"  : "Time Zone",
                    "check" : true

                },
                {

                    "name"  : "Screen Properties",
                    "check" : true

                },
                {

                    "name"  : "Cookies Enabled",
                    "check" : true

                },
                {

                    "name"  : "Supercookies",
                    "check" : true

                },
                {

                    "name"  : "Fonts",
                    "check" : false,  //fonts needs to be only done when logging in (as it adds overhead of delay for flash object to return fonts)
                    "delay" : "200"

                }
            ]
        },

        /**
         * @ngdoc function
         * @name init
         * @methodOf ngSeed.services:$digitalFingerprint
         * @description
         * Initializes the properties and error messages.
         *
         * @return {Boolean} True if no errors. False if errors.
         */
        init: function () {

          this.errors = [];
          this.fingerprint = {};
          this.fingerprint.prints = [];
          this.fingerprint.front = '';

        },

        runPrints: function(callback)
        {
            console.log('$digitalFingerprint: running your prints...');

            var prints = this.settings.prints,
                func, p, delay;

            for (var i=0;i<prints.length;i++) {
                //check to run print or not
                if (prints[i].check) {
                  func = 'get'+(prints[i].name).toLowerCase().replace(' ','');
                  // console.log('$digitalFingerprint: running '+ func + '...');
                  delay = prints[i].delay ? prints[i].delay : 0;
                  //the print
                  p = {
                      name : prints[i].name,
                      value : this[func](delay)
                  };
                  this.fingerprint.prints.push(p);
                }
            };

            //error management
            if(this.errors.length) {
                console.log('$digitalFingerprint: '+this.errors.length+' errors.');
                console.dir(this.errors);
            }

            //build front end fingerprint
            this.fingerprint.front = this.getFrontPrint();

            console.log('$digitalFingerprint: finished your prints...');
            console.log(this.fingerprint);

            callback();

        },

        //creates a string for the front fingerprint of the client
        getFrontPrint: function()
        {
            var _this = this,
                str = "", delay = 0;
            for (var i=0;i<_this.fingerprint.prints.length;i++) {
                delay = _this.fingerprint.prints[i].delay ? _this.fingerprint.prints[i].delay+100 : delay;

                //typcast to string, replace all whitespace and encode special characters
                str += encodeURIComponent(new String(_this.fingerprint.prints[i].value).replace(/ /g,''));
            }
            return str;
        },

        // ---- PRINT TESTS --------------------------------

        //user agent print
        getuseragent: function()
        {
            this.userAgent = window.navigator.userAgent || {};
            if(!this.userAgent) {
                _this.errors.push("Unknown userAgent");
            }
            return this.userAgent;
        },

        //browser plugins print
        //include: https://panopticlick.eff.org/resources/plugin-detect-0.6.3.js
        getbrowserplugins: function()
        {
           // fetch and serialize plugins
            var plugins = "";
            // in Mozilla and in fact most non-IE browsers, this is easy
            if (navigator.plugins) {
              var np = navigator.plugins;
              var plist = new Array();
              // sorting navigator.plugins is a right royal pain
              // but it seems to be necessary because their order
              // is non-constant in some browsers
              for (var i = 0; i < np.length; i++) {
                plist[i] = np[i].name + "; ";
                plist[i] += np[i].description + "; ";
                plist[i] += np[i].filename + ";";
                for (var n = 0; n < np[i].length; n++) {
                  plist[i] += " (" + np[i][n].description +"; "+ np[i][n].type +
                             "; "+ np[i][n].suffixes + ")";
                }
                plist[i] += ". ";
              }
              plist.sort();
              for (i = 0; i < np.length; i++)
                plugins+= "Plugin "+i+": " + plist[i];
            }
            // in IE, things are much harder; we use PluginDetect to get less
            // information (only the plugins listed below & their version numbers)
            if (plugins == "") {
              var pp = new Array();
              pp[0] = "Java"; pp[1] = "QuickTime"; pp[2] = "DevalVR"; pp[3] = "Shockwave";
              pp[4] = "Flash"; pp[5] = "WindowsMediaplayer"; pp[6] = "Silverlight";
              pp[7] = "VLC";
              var version;
              for ( p in pp ) {
                version = PluginDetect.getVersion(pp[p]);
                if (version)
                  plugins += pp[p] + " " + version + "; "
              }
              //todo: add IE Adobe Acrobat version detection
              //https://panopticlick.eff.org/resources/fetch_whorls.js
            }
            return plugins;
        },

        //the clients time zone
        gettimezone: function()
        {
            var tz;
            try {
                tz = new Date().getTimezoneOffset();
            } catch(ex) {
                tz = this.errors.push('Timezone permission denied.');
            }
            return tz;
        },

        //are browser cookies enabled
        getcookiesenabled: function()
        {
            var x;
            try {
                x = navigator.cookieEnabled;
            } catch(ex) {
                x = this.errors.push('Cookies detection permission denied.');
            }
            return x;
        },

        //screen properties of client
        getscreenproperties: function()
        {
            var x;
            try {
                x = screen.width+"x"+screen.height+"x"+screen.colorDepth;
            } catch(ex) {
                x = this.errors.push('Screen properties permission denied.');
            }
            return x;
        },

        // ---- TODO MORE BELOW --------------------------------

        //check some super cookies
        getsupercookies: function()
        {
            var x;

            //IE User data
            try {
                $('body').append('<div id="oPersistDiv" class="userData"></div>');
                var $oPersistDiv = $('#oPersistDiv');
                $oPersistDiv.setAttribute("remember", "remember this value");
                $oPersistDiv.save("oXMLStore");
                $oPersistDiv.setAttribute("remember", "overwritten!");
                $oPersistDiv.load("oXMLStore");
                if ("remember this value" == ($oPersistDiv.getAttribute("remember"))) {
                    x = "IE userData: Yes";
                } else {
                    x = "IE userData: No"
                }
            } catch (ex) {
                x = "IE userData: No";
            }

            //DOM storage (localStorage)
            try {
                localStorage.persistTest = "yea";
                sessionStorage.persistTest = "yea";
            } catch(ex) {}

            try {
                if (sessionStorage.persistTest == "yea") {
                    x += ", DOM localStorage: Yes";
                } else {
                    x += ", DOM localStorage: No";
                }
            } catch (ex) { x += ", DOM localStorage: No"; }

            try {
                if (sessionStorage.persistTest == "yea") {
                    x += ", DOM sessionStorage: Yes";
                } else {
                    x += ", DOM sessionStorage: No";
                }
            } catch (ex) { x += ", DOM sessionStorage: No"; }

            //clean up
            try {
                localStorage.clear('persistTest');
                sessionStorage.clear('persistTest');
            } catch(ex) {}

            return x;
        },

        //what fonts are installed
        getfonts: function(delay)
        {
            var _this = this,
                fonts = "";
            try {
                //adds a swf to the page and reads fonts
                $('body').append('<div id="flashcontent"></div>');
                $('#flashcontent').flash(
                {
                    "src": "resources/FontList.swf",
                    "width": "1",
                    "height": "1",
                    "swliveconnect": "true",
                    "id": "flashfontshelper",
                    "name": "flashfontshelper"
                },
                { update: false });

                //timeout required for swf to settle.
                setTimeout(function()
                {
                    console.log(window.fonts);

                    //replace the prints value
                    for (var i=0;i<_this.fingerprint.prints.length;i++) {
                        if (_this.fingerprint.prints[i].name == 'Fonts')
                        {
                            console.log('found print updating...');
                            _this.fingerprint.prints[i].value = window.fonts;
                            return true;
                        }
                    }

                }, delay);
            }
            catch(ex) {
                _this.errors.push('No fonts detected.');
                return fonts;
            }
            return fonts;
        }

      };

      digitalFingerprint.init();
      return digitalFingerprint;

  }]);

});
