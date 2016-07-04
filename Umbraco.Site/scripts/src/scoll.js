/* SCROLL JS
---------------------------------------*/

app.scroll = {
	init: function() {
		this.scrollHeader();
	},

	scrollHeader: function() {
		var scrolled = false;

		$(window).scroll(function(e){
			if ($(window).width() < 767) {return;}
			var cur = $(window).scrollTop();

			if (cur >= 400 && !scrolled ){
				$('body').addClass("scrolled");
				scrolled = true;
			}

			if (cur < 400 && scrolled){
				$('body').removeClass("scrolled");
				scrolled = false;
			}
		});
	}
};