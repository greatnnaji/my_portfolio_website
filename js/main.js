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


// Reviews System
document.addEventListener('DOMContentLoaded', function() {
    const reviewForm = document.getElementById('reviewForm');
    const reviewsContainer = document.getElementById('reviewsContainer');
    const reviewMessage = document.getElementById('reviewMessage');
    const loadingSpinner = document.getElementById('loadingSpinner');

    // Load reviews on page load
    loadReviews();

    // Handle form submission
    reviewForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('reviewName').value.trim();
        const title = document.getElementById('reviewTitle').value.trim();
        const rating = document.querySelector('input[name="rating"]:checked')?.value;
        const text = document.getElementById('reviewText').value.trim();

        // Validation
        if (!name || !rating || !text) {
            showMessage('Please fill in all required fields.', 'error');
            return;
        }

        try {
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, title, rating, text })
            });

            const data = await response.json();

            if (response.ok) {
                showMessage('Thank you! Your review has been submitted successfully.', 'success');
                reviewForm.reset();
                // Uncheck all radio buttons
                document.querySelectorAll('input[name="rating"]').forEach(radio => radio.checked = false);
                // Reload reviews
                loadReviews();
            } else {
                showMessage(data.error || 'Failed to submit review. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            showMessage('Network error. Please check your connection and try again.', 'error');
        }
    });

    // Load and display reviews
    async function loadReviews() {
        try {
            loadingSpinner.style.display = 'block';
            const response = await fetch('/api/reviews'); // GET request to fetch reviews
            const reviews = await response.json();

            loadingSpinner.style.display = 'none';

            if (reviews.length === 0) {
                reviewsContainer.innerHTML = '<div class="no-reviews"><p>No reviews yet. Be the first to leave one!</p></div>';
                return;
            }

            reviewsContainer.innerHTML = reviews.map(review => createReviewCard(review)).join('');
        } catch (error) {
            console.error('Error loading reviews:', error);
            loadingSpinner.style.display = 'none';
            reviewsContainer.innerHTML = '<div class="no-reviews"><p>Failed to load reviews. Please refresh the page.</p></div>';
        }
    }

    // Create review card HTML
    function createReviewCard(review) {
        const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        const date = new Date(review.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        return `
            <div class="review-card" data-wow-delay="0.1s">
                <div class="review-header">
                    <div class="review-author">
                        <h4>${escapeHtml(review.name)}</h4>
                        <div class="review-date">${date}</div>
                    </div>
                    <div class="review-stars">${stars}</div>
                </div>
                ${review.title ? `<div class="review-title">${escapeHtml(review.title)}</div>` : ''}
                <div class="review-text">${escapeHtml(review.text)}</div>
            </div>
        `;
    }

    // Show message to user
    function showMessage(message, type) {
        reviewMessage.textContent = message;
        reviewMessage.className = `review-message ${type}`;
        reviewMessage.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            reviewMessage.style.display = 'none';
        }, 5000);
    }

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});