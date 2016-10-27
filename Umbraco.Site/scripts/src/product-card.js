app.productCard = {
	init: function() {
		this.showBack();
		this.showFront();

		var carousel;
		// Lift card and show stats on Mouseover
		$('.product-card').hover(function(){
				$(this).addClass('animate');
				$('div.carouselNext, div.carouselPrev').addClass('visible');
			 }, function(){
				$(this).removeClass('animate');
				$('div.carouselNext, div.carouselPrev').removeClass('visible');
		});	
	},
	showBack: function() {
		// Flip card to the back side
		$('.view_details').click(function(){
			var productCard = $(this).parent().parent();
			var cardFront = $(this).parent();
			var cardBack = $(this).parent().next();

			$(productCard).find('.carouselNext').removeClass('visible');
			$(productCard).find('.carouselPrev').removeClass('visible');
			$(productCard).addClass('flip-10');
			setTimeout(function(){
				$(productCard).removeClass('flip-10').addClass('flip90').find('div.shadow').show().fadeTo( 80 , 1, function(){
					$(cardFront).hide();
					$(cardFront).find('div.shadow').hide();
				});
			}, 50);
			
			setTimeout(function(){
				$(productCard).removeClass('flip90').addClass('flip190');
				$(cardBack).show().find('div.shadow').show().fadeTo( 90 , 0);
				setTimeout(function(){
					$(productCard).removeClass('flip190').addClass('flip180').find('div.shadow').hide();
					setTimeout(function(){
						$(productCard).css('transition', '100ms ease-out');
						$(cardBack).find('.cx').addClass('s1');
						$(cardBack).find('.cy').addClass('s1');
						setTimeout(function(){
							$(cardBack).find('.cy').addClass('s2');
							$(cardBack).find('.cx').addClass('s2');
						}, 100);
						setTimeout(function(){
							$(cardBack).find('.cx').addClass('s3');
							$(cardBack).find('.cy').addClass('s3');
						}, 200);
						$(cardBack).find('div.carouselNext').addClass('visible');
						$(cardBack).find('div.carouselPrev').addClass('visible');
					}, 100);
				}, 100);
			}, 150);
			carousel = $(productCard).find('.carousel ul');
			app.productCard.setCarosuel($(carousel));
		});
	},

	showFront: function() {
		// Flip card back to the front side
		$('.flip-back').click(function(){
			var productCard = $(this).parent().parent();
			var cardFront = $(this).parent().prev();
			var cardBack = $(this).parent();
			
			$(productCard).removeClass('flip180').addClass('flip190');
			setTimeout(function(){
				$(productCard).removeClass('flip190').addClass('flip90');
		
				$(cardBack).find('div.shadow').css('opacity', 0).fadeTo( 100 , 1, function(){
					$(cardBack).hide();
					$(cardBack).find('div.shadow').hide();
					$(cardFront).show();
					$(cardFront).find('div.shadow').show();
				});
			}, 50);
			
			setTimeout(function(){
				$(productCard).removeClass('flip90').addClass('flip-10');
				$(cardFront).find('div.shadow').show().fadeTo( 100 , 0);
				setTimeout(function() {
					$(cardFront).find('div.shadow').hide();
					$(productCard).removeClass('flip-10').css('transition', '100ms ease-out');
					$(cardBack).find('.cx').removeClass('s1 s2 s3');
					$(cardBack).find('.cy').removeClass('s1 s2 s3');
				}, 100);
			}, 150);
			$(carousel).removeClass('active-carsousel');
		});	
	},

	setCarosuel: function(carousel) {
		/* ----  Image Gallery Carousel   ---- */
		var carouselSlideWidth = 335;
		var carouselWidth = $(carousel).parent().parent().outerWidth();
		var isAnimating = false;
		$('.active-carousel').removeClass('active-carousel');
		$(carousel).addClass('active-carousel');

		// building the width of the casousel
		$('.active-carousel li').each(function(){
			carouselWidth += carouselSlideWidth;
		});
		$(carousel).css('width', carouselWidth);
		
		// Load Next Image
		$(carousel).next().on('click', 'div.carouselNext', function(){
			var currentLeft = Math.abs(parseInt($(carousel).css("left")));
			var newLeft = currentLeft + carouselSlideWidth;
			if(newLeft == carouselWidth || isAnimating === true){return;}
			$(carousel).css({'left': "-" + newLeft + "px",
								   "transition": "300ms ease-out"
								 });
			isAnimating = true;
			setTimeout(function(){isAnimating = false;}, 300);
		});
		
		// Load Previous Image
		$(carousel).next().on('click', 'div.carouselPrev', function(){
			var currentLeft = Math.abs(parseInt($(carousel).css("left")));
			var newLeft = currentLeft - carouselSlideWidth;
			if(newLeft < 0  || isAnimating === true){return;}
			$(carousel).css({'left': "-" + newLeft + "px",
								   "transition": "300ms ease-out"
								 });
			isAnimating = true;
			setTimeout(function(){isAnimating = false;}, 300);
		});
	}
};