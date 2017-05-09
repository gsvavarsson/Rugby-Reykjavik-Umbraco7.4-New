app.loader = {
	init: function() {
		this.loading();
	},

	loading: function () {
		window.setTimeout(function () {
			$('.loader').fadeOut(500);
			$('body').removeClass('no-scroll');

		}, 900);

		window.setTimeout(function() {
			$('.help-trigger').addClass('start-in');
		}, 1200);
	}
};