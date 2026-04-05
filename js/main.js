(function ($) {
    "use strict";
    
    // loader
    var loader = function () {
        setTimeout(function () {
            if ($('#loader').length > 0) {
                $('#loader').removeClass('show');
            }
        }, 1);
    };
    loader();
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'swing');
        return false;
    });
    
    
    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 0) {
            $('.navbar').addClass('nav-sticky');
        } else {
            $('.navbar').removeClass('nav-sticky');
        }
    });
    
    
    // Smooth scrolling on the navbar links
    $(".navbar-nav a").on('click', function (event) {
        if (this.hash !== "") {
            event.preventDefault();
            
            $('html, body').animate({
                scrollTop: $(this.hash).offset().top - 45
            }, 1500, 'swing');
            
            if ($(this).parents('.navbar-nav').length) {
                $('.navbar-nav .active').removeClass('active');
                $(this).closest('a').addClass('active');
            }
        }
    });
    
    
    // Typed Initiate
    if ($('.hero .hero-text h2').length == 1) {
        var typed_strings = $('.hero .hero-text .typed-text').text();
        var typed = new Typed('.hero .hero-text h2', {
            strings: typed_strings.split(', '),
            typeSpeed: 100,
            backSpeed: 20,
            smartBackspace: false,
            loop: true
        });
    }
    
})(jQuery);

document.addEventListener('DOMContentLoaded', function() {
    var themeKey = 'portfolio-theme';
    var themeToggle = document.getElementById('themeToggle');

    function getThemeLabel(theme) {
        return theme === 'dark' ? { icon: 'fa-sun', text: 'Light', label: 'Switch to light mode' } : { icon: 'fa-moon', text: 'Dark', label: 'Switch to dark mode' };
    }

    function applyTheme(theme) {
        var nextTheme = theme === 'dark' ? 'dark' : 'light';
        document.documentElement.dataset.theme = nextTheme;
        localStorage.setItem(themeKey, nextTheme);

        if (!themeToggle) {
            return;
        }

        var themeState = getThemeLabel(nextTheme);
        themeToggle.innerHTML = '<i class="fas ' + themeState.icon + '"></i><span>' + themeState.text + '</span>';
        themeToggle.setAttribute('aria-label', themeState.label);
    }

    applyTheme(document.documentElement.dataset.theme || 'light');

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            var currentTheme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
            applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
    }
});


