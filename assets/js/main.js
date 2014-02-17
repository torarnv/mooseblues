;(function(){

			// Menu settings
			$('#menuToggle, .menu-close').on('click', function(){
				$('#menuToggle').toggleClass('active');
				$('body').toggleClass('body-push-toleft');
				$('#theMenu').toggleClass('menu-open');
			});

			$('#signup-form').validate({
				submitHandler: function(form) {

					var mappings = {
						 'firstname' 	: 'fname',
						 'lastname' 	: 'lname' ,
						 'city' 		: 'atr.563974' ,
						 'country' 		: 'atr.563975' ,
						 'email' 		: 'email' ,
						 'role' 		: 'atr.563976' ,
						 'ticket' 		: 'price' ,
					};

					for (var field in mappings)
						$("*[name*='" + field + "']").attr('name', "$" + mappings[field]);
				
					if (window.location.hostname == "www.mooseblues.no")
						var redirect = "https://www.deltager.no/moose_blues_2014"
					else
						var redirect = "deltager.html"

					window.location.href = redirect + "#" + $(form).serialize(); 
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

			var isDev = window.location.host.indexOf("dev.mooseblues.no" != -1);

			if (isDev || window.location.hash.indexOf("testsignup") != -1)
				$("#signup-button").removeAttr("disabled");

			var showSchedule = isDev;
			if (window.location.hash.indexOf("showschedule") != -1)
				showSchedule = true;

			if (showSchedule) {
				$("#schedule-soon").remove();
				
				var calendar_json_url = "http://www.google.com/calendar/feeds/rksrr5n0pri7qd9sfmguqs5moc%40group.calendar.google.com/public/full?alt=json&&orderby=starttime&sortorder=ascending&futureevents=true"
				var events = {};

		   	    $.getJSON(calendar_json_url, function(data) {
		   	    	$.each(data.feed.entry, function(i, item){

				    	var start = moment(item.gd$when[0].startTime)
				      	var end = moment(item.gd$when[0].endTime)

				      	var content = "<div class='event' style='min-height:" + end.diff(start, 'minutes') * 0.5 + "px'>";
				     	 content += "<span class='time'>" + start.format("HH:mm") + "-" + end.format("HH:mm") + "</span> ";
				     	 content += "<span class='title'>" + item.title.$t + "</span>";

				     	 var where = item.gd$where[0].valueString;
				     	 if (where.length > 0)
				     	 	content += "<br><span class='location'>" + where + "</span>";

				      	content += "</div>"
				      	$("#schedule #day-" + start.date()).append(content);
				    });
				});
		   	} 

})(jQuery)
