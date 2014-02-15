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

			if (window.location.hash.indexOf("testsignup") != -1)
				$("#signup-button").removeAttr("disabled");
})(jQuery)