app.numbersgame = {
	init: function() {
		var me = this;
		var hasCountend = false;
		// init controller


			var controller = new ScrollMagic.Controller({globalSceneOptions: {duration: 100}});
			
			// build scenes
			new ScrollMagic.Scene({triggerElement: ".FP-numberss"})
				.addTo(controller)
				.on("end", function (e) {
					if (!hasCountend) {
						$('.numbers-games .numberr').each(function(indx, item) {
							var unit = '';
							var separator = '.';
							if ($(item).data('isyear') == "isYear") {
								separator = '';
							}
							if ($(item).data('unit') != '') {
								unit = $(item).data('unit');
							}
							var options = {
								useEasing : true, 
								useGrouping : true, 
								separator : separator, 
								decimal : ',', 
								prefix : '', 
								suffix : ' ' + unit 
							}
							var count = $(this).data('number'),
								numAnim = new CountUp(this, 0, count, 0, 2.5, options);

							numAnim.start();
							//me.countup($(item).find('#number-input').val(), $(item).find('#number-unit').val());
						});
						hasCountend = true;
					}
				});
	},

	countup: function(numm, unit) {
		var options = {
			useEasing : true, 
			useGrouping : true, 
			separator : '.', 
			decimal : ',', 
			prefix : '', 
			suffix : unit 
		};
		var demo = new CountUp("numberr", 0, numm, 0, 4, options);
		demo.start();
	}
}