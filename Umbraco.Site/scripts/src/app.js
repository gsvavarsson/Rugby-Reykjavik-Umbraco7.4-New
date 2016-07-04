"use strict";

var app = {
	init: function () {
		//in here are calls for all the init functions for the different modules of the app object
		app.windowBlur.init();
		app.navigation.init();
		app.equalHeights.init();
		app.instagram.init();
		app.resizer.init();
		app.pageUpdate.init();
		app.scroll.init();
		app.numbersgame.init();
	}
};

// document ready method
$(document).on('ready', app.init);