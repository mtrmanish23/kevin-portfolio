# Ace Photography Studio - Hugo Site

A modern photography studio website built with Hugo and Netlify CMS.

## Features

- Responsive design with Bootstrap
- Image sliders with Slick Carousel
- Portfolio gallery
- Contact form
- Netlify CMS for content management
- SEO optimized

## Prerequisites

- Hugo (version 0.80.0 or higher)
- Git
- Node.js (for local development)

## Installation

1. Clone this repository:
```bash
git clone <your-repo-url>
cd ace
```

2. Install Hugo (if not already installed):
```bash
# macOS
brew install hugo

# Windows
choco install hugo

# Linux
sudo apt-get install hugo
```

3. Run the development server:
```bash
hugo server -D
```

The site will be available at `http://localhost:1313`

## Content Management

### Using Netlify CMS

1. Navigate to `/admin` on your site
2. Click "Login with Netlify Identity"
3. You'll be redirected to Netlify to set up authentication
4. Once authenticated, you can edit content through the CMS

### Manual Content Editing

Content files are located in the `content/` directory:

- `content/_index.md` - Home page
- `content/about/_index.md` - About page
- `content/portfolio/_index.md` - Portfolio page
- `content/contact/_index.md` - Contact page

## Deployment

### Netlify (Recommended)

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Connect your repository to Netlify
3. Set build command: `hugo`
4. Set publish directory: `public`
5. Deploy!

### Manual Deployment

1. Build the site:
```bash
hugo
```

2. Upload the `public/` directory to your web server

## Customization

### Theme

The theme is located in `themes/ace-theme/`. You can modify:

- `layouts/` - HTML templates
- `static/` - CSS, JS, images
- `assets/` - Source files (if using asset pipeline)

### Configuration

Edit `config.toml` to change:

- Site title and description
- Menu structure
- Theme settings
- Build options

### Styling

CSS files are in `static/css/`:

- `style.css` - Main styles
- `bootstrap.css` - Bootstrap framework
- `responsive.css` - Responsive styles

## File Structure

```
ace/
├── config.toml              # Hugo configuration
├── content/                 # Content files
│   ├── _index.md           # Home page
│   ├── about/
│   ├── portfolio/
│   └── contact/
├── data/                   # Data files
│   └── settings.json
├── static/                 # Static assets
│   ├── admin/             # Netlify CMS
│   ├── css/
│   ├── js/
│   ├── images/
│   └── fonts/
├── themes/                 # Hugo theme
│   └── ace-theme/
│       ├── layouts/
│       ├── static/
│       └── theme.toml
└── netlify.toml           # Netlify configuration
```

## Support

For issues and questions:

1. Check the [Hugo documentation](https://gohugo.io/documentation/)
2. Check the [Netlify CMS documentation](https://www.netlifycms.org/docs/)
3. Open an issue in this repository

## License

This project is licensed under the MIT License. 