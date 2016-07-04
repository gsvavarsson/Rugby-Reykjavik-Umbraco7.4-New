/* RESIZER JS
---------------------------------------*/

var vheight = $(window).height();
var headerHeight = $('header').innerHeight();

var titleHeight = 71;
var buttonRowHeight = 188;

app.resizer = {
    init: function() {
		$('.basket-mini .inner').css('height', vheight - titleHeight - buttonRowHeight);
        this.resize();
    },

	resize: function () {
		$(window).resize(function() {
			// RESIZE FOR BASKET MINI
			$('.basket-mini .inner').height($(window).height() - 71 - 188);
		});
		$(window).trigger('resize');
	}
};