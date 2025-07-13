$(document).ready(function() {
  // Global variable to store reCAPTCHA response
  let recaptchaResponse = null;

  // reCAPTCHA v3 success callback
  window.onRecaptchaSuccess = function(token) {
    recaptchaResponse = token;
    // Automatically submit the form after reCAPTCHA success
    submitContactForm();
  };

  // Function to submit the form after reCAPTCHA verification
  function submitContactForm() {
    const $contactForm = $('#contactForm');
    const $submitBtn = $('#submitBtn');
    const $btnText = $submitBtn.find('.btn-text');
    const $btnLoading = $submitBtn.find('.btn-loading');
    const $formMessage = $('#formMessage');

    if (!recaptchaResponse) {
      console.error('reCAPTCHA verification failed');
      showMessage('error', 'reCAPTCHA verification failed. Please try again.');
      resetButtonState();
      return;
    }

    // Get form data
    const formData = {
      fullName: $('#fullName').val().trim(),
      email: $('#email').val().trim(),
      phone: $('#phone').val().trim(),
      message: $('#message').val().trim(),
      botField: $('input[name="bot-field"]').val(),
      recaptchaToken: recaptchaResponse
    };

    // Client-side validation
    if (!validateFormData(formData)) {
      return;
    }

    console.log('Submitting form data:', formData);

    // Submit to Netlify function
    $.ajax({
      url: '/.netlify/functions/contact',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(formData),
      success: function(result) {
        console.log('Form submission successful:', result);
        
        if (result.success) {
          showMessage('success', 'Thank you for your message! We will reach out to you within 24 hours.');
          
          // Reset form and reCAPTCHA
          $contactForm[0].reset();
          grecaptcha.reset();
          recaptchaResponse = null;
          
          // Show additional success details in console
          console.log('✅ Contact form submitted successfully!');
          console.log('📧 Email:', formData.email);
          console.log('📱 WhatsApp URL:', result.whatsappUrl);
          console.log('📨 Telegram sent:', result.telegramSent);
        } else {
          console.error('Form submission failed:', result.error);
          showMessage('error', result.error);
        }
      },
      error: function(xhr, status, error) {
        console.error('AJAX Error:', {
          status: status,
          error: error,
          response: xhr.responseText
        });
        
        let errorMessage = 'Failed to submit form. Please try again.';
        
        try {
          const response = JSON.parse(xhr.responseText);
          if (response.error) {
            errorMessage = response.error;
          }
          if (response.details) {
            console.error('Validation errors:', response.details);
            errorMessage += '\n\nValidation errors:\n' + response.details.map(e => `• ${e.message}`).join('\n');
          }
        } catch (e) {
          console.error('Error parsing response:', e);
        }
        
        showMessage('error', errorMessage);
      },
      complete: function() {
        resetButtonState();
        recaptchaResponse = null;
      }
    });
  }

  // Client-side validation
  function validateFormData(data) {
    const errors = [];

    if (!data.fullName || data.fullName.length < 2) {
      errors.push('Full name must be at least 2 characters');
    }

    if (!data.email || !isValidEmail(data.email)) {
      errors.push('Please enter a valid email address');
    }

    if (!data.message || data.message.length < 10) {
      errors.push('Message must be at least 10 characters');
    }

    if (errors.length > 0) {
      console.error('Validation errors:', errors);
      showMessage('error', 'Please fix the following errors:\n\n' + errors.map(e => `• ${e}`).join('\n'));
      resetButtonState();
      return false;
    }

    return true;
  }

  // Email validation helper
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Show message helper
  function showMessage(type, message) {
    const $formMessage = $('#formMessage');
    const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
    const icon = type === 'success' ? '✅' : '❌';
    
    $formMessage.html(`
      <div class="alert ${alertClass}">
        <strong>${icon} ${type === 'success' ? 'Success!' : 'Error:'}</strong><br>
        ${message.replace(/\n/g, '<br>')}
      </div>
    `);

    // Scroll to message
    $('html, body').animate({
      scrollTop: $formMessage.offset().top - 100
    }, 500);
  }

  // Reset button state helper
  function resetButtonState() {
    const $submitBtn = $('#submitBtn');
    const $btnText = $submitBtn.find('.btn-text');
    const $btnLoading = $submitBtn.find('.btn-loading');
    
    $submitBtn.prop('disabled', false);
    $btnText.removeClass('d-none');
    $btnLoading.addClass('d-none');
  }

  // Form submission handler
  $('#contactForm').on('submit', function(e) {
    e.preventDefault();
    
    console.log('Form submission started...');
    
    // Show loading state
    const $submitBtn = $('#submitBtn');
    const $btnText = $submitBtn.find('.btn-text');
    const $btnLoading = $submitBtn.find('.btn-loading');
    
    $submitBtn.prop('disabled', true);
    $btnText.addClass('d-none');
    $btnLoading.removeClass('d-none');
    
    // Clear previous messages
    $('#formMessage').empty();

    // Execute reCAPTCHA v3
    grecaptcha.execute();
  });

  // Form field validation on blur
  $('#fullName').on('blur', function() {
    const value = $(this).val().trim();
    if (value && value.length < 2) {
      console.warn('Full name too short:', value);
    }
  });

  $('#email').on('blur', function() {
    const value = $(this).val().trim();
    if (value && !isValidEmail(value)) {
      console.warn('Invalid email format:', value);
    }
  });

  $('#message').on('blur', function() {
    const value = $(this).val().trim();
    if (value && value.length < 10) {
      console.warn('Message too short:', value);
    }
  });

  // Console welcome message
  console.log('🎨 Ace Photography Studio - Contact Form Loaded');
  console.log('📝 Form validation and submission ready');
  console.log('🔒 reCAPTCHA v3 protection enabled');
}); 