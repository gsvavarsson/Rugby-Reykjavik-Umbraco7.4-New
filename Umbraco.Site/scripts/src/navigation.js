/* NAVIGATION JS
---------------------------------------*/

app.navigation = {
    init: function() {
        this.mobileNav();
        this.mobileCatNav();
    },

    mobileCatNav: function() {
    	$('.mobile-cat-nav select').on('change', function() {
    		var catLocation = $('.mobile-cat-nav select option:selected').data('url');
    		window.location = catLocation;
    	});
    },

    mobileNav: function() {
        var burgerCtr = document.querySelector(".burger");
        var isAnimating = false;

        burgerCtr.addEventListener("click", function (e) {
            e.preventDefault();
            isAnimating = true;
            this.classList.toggle("active");
            $('body').toggleClass('nav-open');
        });
    }
};