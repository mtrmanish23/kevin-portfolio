# Contact Form Setup Guide

This guide explains how to set up the contact form with WhatsApp and Telegram integration.

## Features

- ✅ Zod validation for form data
- ✅ Google reCAPTCHA v3 protection (invisible)
- ✅ WhatsApp integration (sends message to your WhatsApp)
- ✅ Telegram Bot integration (sends message to your Telegram)
- ✅ Spam protection (honeypot field)
- ✅ Loading states and user feedback
- ✅ Responsive design

## Environment Variables

Set these environment variables in your Netlify dashboard:

### WhatsApp Configuration
```
WHATSAPP_PHONE=+1234567890
```
Replace with your WhatsApp number (include country code)

### Telegram Configuration (Optional)
```
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
```

### Google reCAPTCHA Configuration
```
RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key_here
```

## Setting up Google reCAPTCHA v3

1. **Create reCAPTCHA Keys:**
   - Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
   - Click "Create" to add a new site
   - Choose "reCAPTCHA v3" → "Score-based"
   - Add your domain(s) to the list
   - Save and note both the **Site Key** and **Secret Key**

2. **Set Environment Variables:**
   - Go to Netlify Dashboard → Site Settings → Environment Variables
   - Add `RECAPTCHA_SITE_KEY` with your site key
   - Add `RECAPTCHA_SECRET_KEY` with your secret key

## Setting up Telegram Bot

1. **Create a Telegram Bot:**
   - Message @BotFather on Telegram
   - Send `/newbot`
   - Follow the instructions to create your bot
   - Save the bot token

2. **Get Chat ID:**
   - Start a chat with your bot
   - Send a message to the bot
   - Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   - Find your chat ID in the response

3. **Set Environment Variables:**
   - Go to Netlify Dashboard → Site Settings → Environment Variables
   - Add `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`

## Form Validation

The form validates:
- **Full Name:** Minimum 2 characters
- **Email:** Valid email format
- **Phone:** Optional
- **Message:** Minimum 10 characters

## How it Works

1. User fills out the contact form
2. JavaScript validates the data client-side
3. Form data is sent to Netlify function `/contact`
4. Server-side validation with Zod
5. If valid, message is sent to WhatsApp and/or Telegram
6. User receives success/error feedback

## Customization

### Changing WhatsApp Message Format
Edit `netlify/functions/contact.js` and modify the `message` variable.

### Adding More Validation
Update the `contactSchema` in the Netlify function.

### Styling
Modify `static/css/contact-form.css` to match your design.

## Testing

1. Deploy to Netlify
2. Fill out the contact form
3. Check your WhatsApp/Telegram for the message
4. Verify validation works by submitting invalid data

## Troubleshooting

### Form not submitting
- Check browser console for JavaScript errors
- Verify Netlify function is deployed
- Check environment variables are set

### WhatsApp not working
- Verify phone number format (include country code)
- Test the WhatsApp URL manually

### Telegram not working
- Verify bot token and chat ID
- Check bot has permission to send messages
- Ensure bot is started in the chat

## Security

- Google reCAPTCHA v3 (invisible) prevents automated submissions with score-based analysis
- Honeypot field prevents basic spam
- Server-side validation prevents bypassing client validation
- Environment variables keep sensitive data secure
- CORS headers configured for security 