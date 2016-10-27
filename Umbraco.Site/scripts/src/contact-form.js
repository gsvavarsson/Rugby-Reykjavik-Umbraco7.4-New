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

			return isValid;

			// Continue
			var api_key = 'key-91fd16ba19c4591bef576ca56f6eb4b1';
			var domain = 'mydomain.mailgun.org';
			var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

			var data = {
				from: 'Excited User <me@samples.mailgun.org>',
				to: 'serobnic@mail.ru',
				subject: 'Hello',
				text: 'Testing some Mailgun awesomness!'
			};

			mailgun.messages().send(data, function (error, body) {
				console.log(body);
			});
		});
	}
}