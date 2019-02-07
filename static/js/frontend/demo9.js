// Scripts for demo 9 / Home Parallax
function demo_9() {
    (function ($) {

        // video popup
        $('.popup-video').magnificPopup({
			disableOn: 700,
            type: 'iframe',
            mainClass: 'mfp-fade my-media',
			preloader: false
        });

        // modify some scrollreveal parameters
        sr.reveal('.foo', {
            duration: 700,
            delay: 300,
            distance: '50px',
            viewFactor: 0.5,
            easing: 'ease-in-out'
        });
        //modify on scroll reveal animation
        sr.reveal('.content-block-16 .foo', 100);
        sr.reveal('.content-block-11 .foo', 100);
        sr.reveal('.content-block-3 .foo', 100);
        sr.reveal('.content-block-7 .foo', 100);
        sr.reveal('.contact-1 .foo', 100);

    })(jQuery);
}