const { z } = require('zod');

// Contact form validation schema
const contactSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  botField: z.string().optional(),
  recaptchaToken: z.string().min(1, 'reCAPTCHA verification required')
});

// reCAPTCHA v3 verification function
async function verifyRecaptcha(token) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    console.warn('RECAPTCHA_SECRET_KEY not set, skipping verification');
    return { success: true, score: 1.0 };
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`
    });

    const data = await response.json();
    
    // For reCAPTCHA v3, we check both success and score
    if (data.success && data.score >= 0.5) {
      return { success: true, score: data.score };
    } else {
      return { success: false, score: data.score || 0 };
    }
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return { success: false, score: 0 };
  }
}

// WhatsApp API configuration
const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL || 'https://api.whatsapp.com/send';
const WHATSAPP_PHONE = process.env.WHATSAPP_PHONE || '+1234567890'; // Replace with your WhatsApp number

// Telegram Bot configuration
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the form data
    const formData = JSON.parse(event.body);
    
    // Validate the form data
    const validatedData = contactSchema.parse(formData);
    
    // Check for bot field (honeypot)
    if (validatedData.botField) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Form submitted successfully' })
      };
    }

    // Verify reCAPTCHA v3
    const recaptchaResult = await verifyRecaptcha(validatedData.recaptchaToken);
    if (!recaptchaResult.success) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
          success: false,
          error: `reCAPTCHA verification failed (score: ${recaptchaResult.score.toFixed(2)}). Please try again.`
        })
      };
    }

    // Prepare the message for WhatsApp/Telegram
    const message = `📧 *New Contact Form Submission*

👤 *Name:* ${validatedData.fullName}
📧 *Email:* ${validatedData.email}
📞 *Phone:* ${validatedData.phone || 'Not provided'}
💬 *Message:* ${validatedData.message}

🕐 *Submitted at:* ${new Date().toLocaleString()}`;

    // Send to WhatsApp
    const whatsappUrl = `${WHATSAPP_API_URL}?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(message)}`;
    
    // Send to Telegram if configured
    let telegramResponse = null;
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      try {
        const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        const telegramData = {
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown'
        };

        telegramResponse = await fetch(telegramUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(telegramData)
        });
      } catch (error) {
        console.error('Telegram error:', error);
      }
    }

    // Return success response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        success: true,
        message: 'Contact form submitted successfully!',
        whatsappUrl: whatsappUrl,
        telegramSent: telegramResponse?.ok || false
      })
    };

  } catch (error) {
    console.error('Contact form error:', error);
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
          success: false,
          error: 'Validation failed',
          details: error.errors
        })
      };
    }

    // Handle other errors
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        success: false,
        error: 'Internal server error'
      })
    };
  }
}; 