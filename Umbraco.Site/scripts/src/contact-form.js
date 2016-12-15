app.contactForm = {
	init: function() {
		var me = this;

		$('.contact-form a.send-btn').on('click', function(e) {
			e.preventDefault();
			var isValid = true;
			var nameInput = $('#contact_name');
			var emailInput = $('#contact_email');
			var msgInput = $('#contact_msg');
			$(nameInput).removeClass("invalid");
			$(emailInput).removeClass("invalid");
			$(msgInput).removeClass("invalid");


			if ($(nameInput).val() == "") {
				$(nameInput).addClass('invalid');
				isValid = false;
			}
			if ($(emailInput).val() == "") {
				$(emailInput).addClass('invalid');
				isValid = false;
			}
			if ($(msgInput).val() == "") {
				$(msgInput).addClass('invalid');
				isValid = false;
			}

			if (isValid) {
				// Continue
				var api_key = 'key-91fd16ba19c4591bef576ca56f6eb4b1';
				var domain = '/usercontrols/form.handler.aspx';

				var data = {
					from: 'Rugby enthusiast ' + $('#contact_email').val(),
					to: 'gisli@corivo.is',
					subject: $('#contact_name').val(),
					text: $('#contact_msg').val()
				};

				$.ajax('/usercontrols/form.handler.aspx', {
					//url: domain,
					type:"POST",
					data: data,
					success:function(a,b,c){
						console.log( 'mail sent: ', b );
					}.bind(this),
					error:function( xhr, status, errText ){
						console.log( 'mail sent failed: ', xhr.responseText);
					}
				});
			}
		});
	}
}