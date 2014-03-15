;(function(){

	function toggleMenu() {
		$('#menuToggle').toggleClass('active');
        $('body').toggleClass('body-push-toleft');
        $('#theMenu').toggleClass('menu-open');
	}

    // Menu settings
    $('#menuToggle, .menu-close').on('click', toggleMenu);

    $('.menu-wrap a').on('click', toggleMenu);

    $('#signup-form').validate({
        submitHandler: function(form) {

            var mappings = {
                 'firstname' : 'fname',
                 'lastname'  : 'lname' ,
                 'city'      : 'atr.563974' ,
                 'country'   : 'atr.563975' ,
                 'email'     : 'email' ,
                 'role'      : 'atr.563976' ,
                 'ticket'    : 'price' ,
                 'otherinfo' : 'atr.563977',
            };

            for (var field in mappings)
                $("*[name*='" + field + "']").attr('name', "$" + mappings[field]);

            if (window.location.hostname == "www.mooseblues.no")
                var redirect = "https://www.deltager.no/moose_blues_2014"
            else
                var redirect = "deltager.html"

            var formData = $(form).serialize().replace(/\+/g, '%20');
            window.location.href = redirect + "#" + formData;
        },
        rules: {
            firstname: {
              required: true
            },
            lastname: {
              required: true
            },
            city: {
              required: true
            },
            country: {
              required: true
            },
            email: {
              required: true,
              email: true
            },
            role: {
              required: true,
            },
            ticket: {
              required: true,
            }
        },
        errorClass: "form-error",
        highlight: function(element) {
            $(element).closest('.form-group').addClass('has-error');
        },
        success: function(element) {
            element.closest('.form-group').removeClass('has-error');
        }
    });

    $("#ticket-selector").change(function() {
        $('#signup-form').valid();
    });

    $("textarea[name='otherinfo']").on('keyup keypress blur change', function() {
       var _0x1ed4=["\x4C\x49\x56\x49\x4E\x54\x48\x45\x42\x4C\x55\x45\x53","\x69\x6E\x64\x65\x78\x4F\x66","\x76\x61\x6C","\x57\x6F\x72\x6B\x73\x68\x6F\x70\x20\x28\x4C\x74\x42\x20\x64\x69\x73\x63\x6F\x75\x6E\x74\x29\x20\x26\x6E\x62\x73\x70\x3B\x20\x4E\x4F\x4B\x20\x38\x35\x35\x2C\x2D","\x68\x74\x6D\x6C","\x6F\x70\x74\x69\x6F\x6E\x5B\x76\x61\x6C\x75\x65\x3D\x27\x32\x35\x39\x32\x32\x37\x27\x5D","\x45\x61\x72\x6C\x79\x20\x42\x69\x72\x64\x20\x28\x4C\x74\x42\x20\x64\x69\x73\x63\x6F\x75\x6E\x74\x29\x20\x26\x6E\x62\x73\x70\x3B\x20\x4E\x4F\x4B\x20\x37\x36\x35\x2C\x2D","\x6F\x70\x74\x69\x6F\x6E\x5B\x76\x61\x6C\x75\x65\x3D\x27\x32\x35\x39\x32\x32\x35\x27\x5D"];if($(this)[_0x1ed4[2]]()[_0x1ed4[1]](_0x1ed4[0])!=-1){$(_0x1ed4[5])[_0x1ed4[2]](263713)[_0x1ed4[4]](_0x1ed4[3]);$(_0x1ed4[7])[_0x1ed4[2]](263714)[_0x1ed4[4]](_0x1ed4[6]);} ;
    });

    $("#signup-form").sisyphus();

    var isDev = window.location.host.indexOf("dev.mooseblues.no") != -1;

    var showSchedule = true;
    if (window.location.hash.indexOf("showschedule") != -1)
        showSchedule = true;

    if (showSchedule) {
        //$("#schedule-soon").remove();

        var calendar_json_url = "http://www.google.com/calendar/feeds/rksrr5n0pri7qd9sfmguqs5moc%40group.calendar.google.com/public/full?alt=json&&orderby=starttime&sortorder=ascending&futureevents=true"
        var events = {};

        $.getJSON(calendar_json_url, function(data) {

            var block;

            var previousStart;
            var previousEnd;

            $.each(data.feed.entry, function(i, item){

                var start = moment(item.gd$when[0].startTime)
                var end = moment(item.gd$when[0].endTime)

                var duration = end.diff(start, 'minutes')
                var isAllDay = duration == (60 * 24);

                // Limit to all day events. Reverse when calendar is ready.
                if (!isAllDay)
                    return true;

                if (isAllDay)
                    duration = 60;

                var day = $("#schedule div.date#" + start.format("YYYY-MM-DD"));

                if (!start.isSame(previousStart) || isAllDay)
                    block = $("<div>").addClass("block");

                var event = $("<div>").addClass("event");

                if (isAllDay)
                    event.addClass("allday");

                // Try to make events look like they have a proportionate duration
                event.css("min-height", duration * 0.5 + "px");

                var content = "";
                if (!isAllDay)
                    content += "<span class='time'>" + start.format("HH:mm") + "-" + end.format("HH:mm") + "</span><br>";
                content += "<span class='title'>" + item.title.$t + "</span>";

                var where = item.gd$where[0].valueString;
                where = where.replace(/, Oslo, Norge$/, "");
                if (where.length > 0)
                    content += "<br><span class='location'>" + where + "</span>";

                var what = item.content.$t
                what = what.replace(/\n/g, "<br>");
                if (what.length > 0)
                    content += "<br><span class='description'>" + what + "</span>";

                event.append(content);

                block.append($("<div>").addClass("event-container").append(event));

                // Possibly re-append of already appended block, but that's okey
                day.append(block);

                if (end.isSame(previousEnd)) {
                    // Make all events same height
                    $(day).find(".block:last .event").css("height", "100%");
                }

                previousStart = start;
                previousEnd = end;
            });
        });
    }

    // Async Google Maps loading
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyC19zE5nFPp669pJnxNQc7lJqZaKybsM8E&sensor=false' +
      '&callback=initializeMap';
    document.body.appendChild(script);

})(jQuery)

function getDPR() {
  var mediaQuery;
  // Fix fake window.devicePixelRatio on mobile Firefox
  var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  if (window.devicePixelRatio !== undefined && !is_firefox) {
    return window.devicePixelRatio;
  } else if (window.matchMedia) {
      mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),\
            (min--moz-device-pixel-ratio: 1.5),\
            (-o-min-device-pixel-ratio: 3/2),\
            (min-resolution: 1.5dppx)";
    if (window.matchMedia(mediaQuery).matches)
      return 1.5;
      mediaQuery = "(-webkit-min-device-pixel-ratio: 2),\
            (min--moz-device-pixel-ratio: 2),\
            (-o-min-device-pixel-ratio: 2/1),\
            (min-resolution: 2dppx)";
    if (window.matchMedia(mediaQuery).matches)
      return 2;
      mediaQuery = "(-webkit-min-device-pixel-ratio: 0.75),\
            (min--moz-device-pixel-ratio: 0.75),\
            (-o-min-device-pixel-ratio: 3/4),\
            (min-resolution: 0.75dppx)";
    if (window.matchMedia(mediaQuery).matches)
      return 0.7;
  } else
    return 1;
}

var viewportHeight = $(window).height();
var mapwrap = $("#mapwrap");

function mapIsVisible() {
    var bounds = mapwrap[0].getBoundingClientRect();
    if ((bounds.top + (bounds.height / 2)) < viewportHeight)
        return true; // We can see over 50% of the map

    return false;
}

function centerMapInViewport() {
    if (mapIsVisible())
        return false; // No need

    var offset = (viewportHeight - mapwrap.height()) / 2;
    $.scrollTo(mapwrap, 400, { offset: -offset });
    return true;
}

var map;
var markers = []
var markersDone = false;
var openInfoWindow;

function initializeMap() {
    var mapOptions = {
        center: new google.maps.LatLng(59.9133175,10.7562774),
        zoom: 13,
        scrollwheel: false,
        backgroundColor: "#e0e0e0",
        mapTypeControl: false
    };

    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    var mapUrl = "https://mapsengine.google.com/map/edit?mid=z01mYUD2Vnfo.kW22snNl3_zQ"

    var externalButton = $("#open-external-map");
    $(externalButton).on('click', function() { window.open(mapUrl,'_blank'); });
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(externalButton[0]);

    google.maps.event.addListenerOnce(map, 'tilesloaded', function(evt) {
        $("#open-external-map").show();
    });

    // Allow scrolling on mobile devices even if map covers viewport
    var panBlocker = document.createElement("div");
    panBlocker.className = "pan-blocker";
    map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(panBlocker);

    // Fetch markers

    // Route through YQL since Google Mapsengine doesn't do CORS for KML
    $.getJSON("http://query.yahooapis.com/v1/public/yql", {
        q: "select * from xml where url=\"https://mapsengine.google.com/map/kml?" +
            "mid=z01mYUD2Vnfo.kW22snNl3_zQ&lid=z01mYUD2Vnfo.kt6p-FRSwQG8\"",
        format: "json"
    },
    function (data) {
        $.each(data.query.results.kml.Document.Placemark, function(i, place) {

            var coords = place.Point.coordinates.split(',', 2);
            var pos = new google.maps.LatLng(coords[1], coords[0]);

            var dpr = getDPR();
            var marker = new google.maps.Marker({
                position: pos,
                draggable: false,
                animation: google.maps.Animation.DROP,
                title: place.name
            });

            var infowindow = new google.maps.InfoWindow({
                content: "<b>" + place.name + "</b>"
            });

            google.maps.event.addListener(marker, 'click', function() {
                if (openInfoWindow)
                    openInfoWindow.close();

                infowindow.open(map, marker);
                openInfoWindow = infowindow;
            });

            var extendedData = place.ExtendedData;
            if (!$.isArray(extendedData))
                extendedData = [extendedData];

            $.each(extendedData, function(i, data) {
                data = data.Data;

                if (data.value == null)
                    return true; // next

                if (data.displayName == "id") {
                    var item = $("#" + data.value);
                    item.wrap($("<a>").click(function() {
                        if (!marker.getMap())
                            marker.setMap(map);

                        marker.setAnimation(google.maps.Animation.BOUNCE);
                        setTimeout(function() {
                            marker.setAnimation(null);
                        }, 1400 /* bounce twice */);

                        if (map.getZoom() < 15)
                            map.setZoom(15);

                        allowDropMarkers = true; // Just in case

                        if (centerMapInViewport())
                            map.setCenter(marker.getPosition());
                        else
                            map.panTo(marker.getPosition());
                    }));

                    item.css("display", "inline-block");

                } else if (data.displayName == "icon") {
                    var iconSize = 36;
                    var baseurl = "http://mt.google.com/vt/icon/name=icons/spotlight/";
                    if (data.value.indexOf("custom/") == 0) {
                        baseurl = "/assets/img/"
                        data.value = data.value.replace("custom/", "");
                        if (dpr > 1)
                            data.value += "_" + dpr + "x";
                        data.value += ".png"
                    } else {
                        data.value += ".png&scale=" + (1.5 * dpr)
                    }

                    var icon = {
                        url: baseurl + data.value,
                        size: new google.maps.Size(iconSize * dpr , iconSize * dpr),
                        scaledSize: new google.maps.Size(iconSize, iconSize),
                        anchor: new google.maps.Point(iconSize / 2, iconSize / 2)
                    };
                    marker.setIcon(icon);
                }
            });

            markers.push(marker);
        });

        markersDone = true;
        dropMarkersIfPossble();
    });
}

var mapWasInViewport = false;

function dropMarkersIfPossble() {
    if (!mapWasInViewport)
        return;

    if (!markersDone) {
        setTimeout(dropMarkersIfPossble, 250);
        return;
    }

    $.each(markers, function(i, marker) {
        if (marker.getMap())
            return true;

        setTimeout(function() {
            marker.setMap(map);
        }, i * 200);
    });
}

function checkIfMapIsVisible() {
    if (mapIsVisible()) {
        $(window).unbind('scroll', checkIfMapIsVisible);
        mapWasInViewport = true;
        dropMarkersIfPossble();
    }
}

$(window).scroll($.throttle( 100, checkIfMapIsVisible));

