document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contactForm');
    
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(form);
        fetch('/mail', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json(); // Only parse if response is OK
        })
        .then(data => {
            document.getElementById('success').innerText = 'Message sent successfully!';
            form.reset();
        })
        .catch(error => {
            document.getElementById('success').innerText = 'There was an error sending the message.';
            console.error('Error:', error);
        });
    });
  });