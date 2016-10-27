/* Popup for social share
---------------------------------------*/

app.popup = {
	init: function() {
		$(".popup").on("click",function(e){
			e.preventDefault();
			window.open($(this).attr("href"),"popupWindow","width=600,height=600,scrollbars=yes")
		});
	}
}