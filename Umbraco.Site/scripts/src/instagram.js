/* INSTAGRAM JS
---------------------------------------*/

app.instagram = {
    init: function () {
        var vid = document.getElementsByClassName("video-hover");

        [].forEach.call(vid, function (item) {
            item.addEventListener('mouseover', hoverVideo, false);
            item.addEventListener('mouseout', hideVideo, false);
        });

        function hoverVideo(e) {
            /*var maxHeight =  $(this).height();
            $(this).css('max-height', maxHeight);*/
            this.play();
        }

        function hideVideo(e) {
            this.pause();
        }
    }
}