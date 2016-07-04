app.numbersgame = {
	init: function() {
		var me = this;
		$('body').on('click', function() {
			console.log('fireworks');
			$('.numbers-games .numberr').each(function(indx, item) {
				var count = $(this).data('number'),
					numAnim = new CountUp(this, 0, count);

				numAnim.start();
				//me.countup($(item).find('#number-input').val(), $(item).find('#number-unit').val());
			});
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