// Global variable to store reCAPTCHA response
let recaptchaResponse = null;

// reCAPTCHA v3 success callback
function onRecaptchaSuccess(token) {
  recaptchaResponse = token;
  // Automatically submit the form after reCAPTCHA success
  submitContactForm();
}

// Function to submit the form after reCAPTCHA verification
async function submitContactForm() {
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');
  const formMessage = document.getElementById('formMessage');

  if (!recaptchaResponse) {
    formMessage.innerHTML = `
      <div class="alert alert-danger">
        <strong>Error:</strong> reCAPTCHA verification failed. Please try again.
      </div>
    `;
    submitBtn.disabled = false;
    btnText.classList.remove('d-none');
    btnLoading.classList.add('d-none');
    return;
  }

  // Get form data
  const formData = {
    fullName: document.getElementById('fullName').value.trim(),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    message: document.getElementById('message').value.trim(),
    botField: document.querySelector('input[name="bot-field"]').value,
    recaptchaToken: recaptchaResponse
  };

  try {
    // Submit to Netlify function
    const response = await fetch('/.netlify/functions/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (result.success) {
      // Show success message
      formMessage.innerHTML = `
        <div class="alert alert-success">
          <strong>Success!</strong> ${result.message}
          ${result.whatsappUrl ? `<br><a href="${result.whatsappUrl}" target="_blank" class="btn btn-sm btn-success mt-2">View on WhatsApp</a>` : ''}
        </div>
      `;
      
      // Reset form and reCAPTCHA
      contactForm.reset();
      grecaptcha.reset();
      recaptchaResponse = null;
    } else {
      // Show validation errors
      let errorMessage = result.error;
      if (result.details) {
        errorMessage += '<ul>';
        result.details.forEach(error => {
          errorMessage += `<li>${error.message}</li>`;
        });
        errorMessage += '</ul>';
      }
      
      formMessage.innerHTML = `
        <div class="alert alert-danger">
          <strong>Error:</strong> ${errorMessage}
        </div>
      `;
    }
  } catch (error) {
    console.error('Form submission error:', error);
    formMessage.innerHTML = `
      <div class="alert alert-danger">
        <strong>Error:</strong> Failed to submit form. Please try again.
      </div>
    `;
  } finally {
    // Reset button state
    submitBtn.disabled = false;
    btnText.classList.remove('d-none');
    btnLoading.classList.add('d-none');
    recaptchaResponse = null;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Show loading state
      submitBtn.disabled = true;
      const btnText = submitBtn.querySelector('.btn-text');
      const btnLoading = submitBtn.querySelector('.btn-loading');
      btnText.classList.add('d-none');
      btnLoading.classList.remove('d-none');

      // Execute reCAPTCHA v3
      grecaptcha.execute();
    });
  }
}); 