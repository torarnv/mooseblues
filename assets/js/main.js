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

    $("#signup-form").sisyphus();

    var isDev = window.location.host.indexOf("dev.mooseblues.no") != -1;

    var showSchedule = isDev;
    if (window.location.hash.indexOf("showschedule") != -1)
        showSchedule = true;

    if (showSchedule) {
        $("#schedule-soon").remove();

        var calendar_json_url = "http://www.google.com/calendar/feeds/rksrr5n0pri7qd9sfmguqs5moc%40group.calendar.google.com/public/full?alt=json&&orderby=starttime&sortorder=ascending&futureevents=true"
        var events = {};

        $.getJSON(calendar_json_url, function(data) {

            var block;

            var previousStart;
            var previousEnd;

            $.each(data.feed.entry, function(i, item){

                var start = moment(item.gd$when[0].startTime)
                var end = moment(item.gd$when[0].endTime)

                if (!start.isSame(previousStart))
                    block = $("<div>").addClass("block");

                var event = $("<div>").addClass("event");

                // Try to make events look like they have a proportionate duration
                event.css("min-height", end.diff(start, 'minutes') * 0.5 + "px");

                var content = "";
                content += "<span class='time'>" + start.format("HH:mm") + "-" + end.format("HH:mm") + "</span><br>";
                content += "<span class='title'>" + item.title.$t + "</span>";

                var where = item.gd$where[0].valueString;
                where = where.replace(/, Oslo, Norge$/, "");
                if (where.length > 0)
                    content += "<br><span class='location'>" + where + "</span>";

                event.append(content);

                block.append($("<div>").addClass("event-container").append(event));

                var day = $("#schedule #day-" + start.date());

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

function initializeMap() {
    var mapOptions = {
        center: new google.maps.LatLng(59.9083175,10.7562774),
        zoom: 11,
        scrollwheel: false,
        backgroundColor: "transparent"
    };

    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
}
