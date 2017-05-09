app.location = {
	init: function() {
		this.loading();
	},

	loading: function () {
		$.ajax({
			dataType: 'json',
			url: 'http://ip-api.com/json?fields=country,countryCode',
			data: 'data',
			crossDomain: true,
			success: function(data) {
				if (data.countryCode != 'IS') {
					window.location.href = "http://www.rfr.is/en";
				}
			},
			error: function () {
			}
		});
	}
};