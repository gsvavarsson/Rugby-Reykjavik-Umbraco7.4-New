app.contactForm = {
	init: function() {
		var me = this;

		$('.contact-form a.send-btn').on('click', function(e) {
			e.preventDefault();
			var nameInput = $('#contact_name');
			var emailInput = $('#contact_email');
			var msgInput = $('#contact_msg');
			$(nameInput).removeClass("invalid");
			$(emailInput).removeClass("invalid");
			$(msgInput).removeClass("invalid");

			if ($(nameInput).val() == "") {
				$(nameInput).addClass('invalid');
				return false;
			}
			if ($(emailInput).val() == "") {
				$(emailInput).addClass('invalid');
				return false;
			}
			if ($(msgInput).val() == "") {
				$(msgInput).addClass('invalid');
				return false;
			}
		});
	}
}