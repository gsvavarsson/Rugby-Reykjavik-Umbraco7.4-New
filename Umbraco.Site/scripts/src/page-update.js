/* UPDATE IN PROGRESS JS
---------------------------------------*/

app.pageUpdate = {
	init: function() {
		this.readCookie();
		this.registerEvents();
		this.checkIfUpdatingActive();

		if (window.location.href.indexOf("debug=true") > -1) {
			$('body').removeClass('update-in-progress');
			$('a').each(function(indx, item) {
				var linking = $(item).attr('href') + '?debug=true';
				$(item).attr('href', linking);
			});
		}
	},

	registerEvents: function() {
		$('#update-in-progress-button').on('click', this.postCookie);
	},

	readCookie: function(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');

		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length).split(/ (.+)?/)[0];
		}

		return null;
	},

	checkIfUpdatingActive: function() {
		if( $('body').hasClass('update-in-progress') && this.readCookie("DismissUpdateMessage") != "true" ) {
			$('.update-message').fadeIn(300);
		}
		else
		{
			document.cookie = 'DismissUpdateMessage=true expires='+moment().add(1, 'days').format('llll')+'; path=/';
		}
	},

	postCookie: function(e) {
		e.preventDefault();
		document.cookie = 'DismissUpdateMessage=true expires='+moment().add(1, 'days').format('llll')+'; path=/';
		$('.update-message').fadeOut(300);
	}
};
