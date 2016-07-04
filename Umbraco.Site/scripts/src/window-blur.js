app.windowBlur = {
	init: function () {
		this.tabSwitch();
	},

	tabSwitch: function() {
		// ORIGINAL TITLE
		var originalTitle = document.title;

		// CHANGE DOCUMENT TITLE (UNFOCUSED STATE)
		$(window).on('blur', function() {
			document.title = 'Hey hvert fórstu?!';
		});

		// CHANGE DOCUMENT TITLE BACK (FOCUSED STATE)
		$(window).on('focus', function() {
			// SET A WELCOME MESSAGE
			document.title = "Ahh þarna ertu!";

			// SET THE ORIGINAL TITLE
			window.setTimeout(function() {
				document.title = originalTitle;
			}, 1000);
		});
	}
}