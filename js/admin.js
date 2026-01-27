// Admin Panel JavaScript
const ADMIN_TOKEN_KEY = 'adminToken';

// Check if already logged in
window.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (token) {
        showAdminPanel();
        loadReviews();
    }
});

// Login form handler
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');
    
    try {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
            showAdminPanel();
            loadReviews();
        } else {
            errorDiv.textContent = data.error || 'Invalid password';
            errorDiv.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Login error:', error);
        errorDiv.textContent = 'Login failed. Please try again.';
        errorDiv.classList.remove('hidden');
    }
});

// Logout handler
document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    document.getElementById('adminPanel').classList.add('hidden');
    document.getElementById('loginSection').classList.remove('hidden');
    document.getElementById('password').value = '';
});

// Show admin panel
function showAdminPanel() {
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('adminPanel').classList.remove('hidden');
}

// Load all reviews
async function loadReviews() {
    const container = document.getElementById('reviewsContainer');
    const noReviews = document.getElementById('noReviews');
    
    try {
        const response = await fetch('/api/reviews');
        const reviews = await response.json();
        
        if (reviews.length === 0) {
            container.innerHTML = '';
            noReviews.classList.remove('hidden');
            return;
        }
        
        noReviews.classList.add('hidden');
        container.innerHTML = reviews.map(review => createReviewCard(review)).join('');
        
        // Add delete button listeners
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const reviewId = this.getAttribute('data-id');
                deleteReview(reviewId);
            });
        });
    } catch (error) {
        console.error('Error loading reviews:', error);
        container.innerHTML = '<p class="error-message">Failed to load reviews.</p>';
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
        <div class="review-card">
            <div class="review-header">
                <div>
                    <strong>${escapeHtml(review.name)}</strong>
                    ${review.title ? `<span> - ${escapeHtml(review.title)}</span>` : ''}
                    <div class="review-meta">${date}</div>
                </div>
                <button class="btn btn-danger delete-btn" data-id="${review.id}">Delete</button>
            </div>
            <div class="stars">${stars}</div>
            <p>${escapeHtml(review.text)}</p>
        </div>
    `;
}

// Delete review
async function deleteReview(reviewId) {
    if (!confirm('Are you sure you want to delete this review?')) {
        return;
    }
    
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    
    try {
        const response = await fetch(`/api/reviews/${reviewId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            loadReviews(); // Reload reviews
        } else {
            const data = await response.json();
            alert(data.error || 'Failed to delete review');
            
            // If unauthorized, logout
            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem(ADMIN_TOKEN_KEY);
                location.reload();
            }
        }
    } catch (error) {
        console.error('Error deleting review:', error);
        alert('Failed to delete review. Please try again.');
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
