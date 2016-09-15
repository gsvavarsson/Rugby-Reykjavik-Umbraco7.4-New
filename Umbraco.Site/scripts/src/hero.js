app.hero = {
	init: function () {
		//this.animateHeadline($('.cd-headline'));

		var animationDelay = 2500;
		 
		animateHeadline($('.cd-headline'));
		 
		function animateHeadline($headlines) {
			$headlines.each(function(){
				var headline = $(this);
				//trigger animation
				setTimeout(function(){ hideWord( headline.find('.is-visible') ) }, animationDelay);
				//other checks here ...
			});
		}

		function hideWord($word) {
			var nextWord = takeNext($word);
			switchWord($word, nextWord);
			setTimeout(function(){ hideWord(nextWord) }, animationDelay);
		}
		 
		function takeNext($word) {
			return (!$word.is(':last-child')) ? $word.next() : $word.parent().children().eq(0);
		}
		 
		function switchWord($oldWord, $newWord) {
			$oldWord.removeClass('is-visible').addClass('is-hidden');
			$newWord.removeClass('is-hidden').addClass('is-visible');
		}
	},
	animateHeadline: function($headlines) {
		var animationDelay = 2500;
		$headlines.each(function(){
			var headline = $(this);
			//trigger animation
			setTimeout(function(){ 
				app.hero.hideWord( headline.find('.is-visible') );
			}, animationDelay);
			//other checks here
		});
	},
	hideWord: function($word) {
		var animationDelay = 2500;
		var nextWord = app.hero.takeNext($word);
		app.hero.switchWord($word, nextWord);
		setTimeout(function(){ 
			app.hero.hideWord(app.hero.nextWord);
		}, animationDelay);
	},
	takeNext: function($word) {
		return (!$word.is(':last-child')) ? $word.next() : $word.parent().children().eq(0);
	},
	switchWord: function($oldWord, $newWord) {
		$oldWord.removeClass('is-visible').addClass('is-hidden');
		$newWord.removeClass('is-hidden').addClass('is-visible');
	}
}