# Sam O'Halloran - Jazz Guitarist Website

A clean, minimal single-page website for jazz guitarist Sam O'Halloran, showcasing musical projects and booking information.

## 🎸 Features

- **Single-page scrolling design** with smooth navigation
- **Responsive mobile-first layout** using CSS Grid and Flexbox
- **Minimal, distraction-free styling** with neutral color palette
- **Embedded video showcase** for performances
- **Easy booking inquiries** via email integration
- **Social media links** (YouTube, Instagram)

## 📁 Project Structure

```
samohalloran_github/
├── index.html              # Main page
├── css/
│   └── styles.css          # Stylesheet
├── js/
│   └── script.js           # JavaScript (for future interactivity)
├── assets/
│   └── images/
│       ├── bands/          # Band photos
│       └── social/         # Social media icons
├── CNAME                   # Custom domain configuration
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## 🚀 Getting Started

### Local Development

Simply open `index.html` in your browser, or run a local server:

```bash
python3 -m http.server 8000
```

Then navigate to `http://localhost:8000`

### Deploy to GitHub Pages

1. Push changes to GitHub:
```bash
git add .
git commit -m "Update site"
git push origin main
```

2. Enable GitHub Pages in repo settings (Settings → Pages → Source: main branch)

3. Site will be live at `https://samohalloran.github.io` (or your custom domain if configured)

## 🎯 Sections

- **About** - Introduction and tagline
- **Music** - Featured music videos
- **Videos** - Additional performances
- **Bookings** - Available ensembles and booking inquiry
- **Contact** - Email and social links

## 📝 Customization

### Update Video Embeds

Replace YouTube video IDs in `index.html`:
```html
<iframe src="https://www.youtube.com/embed/YOUR_VIDEO_ID"></iframe>
```

### Add Band Photos

Place images in `assets/images/bands/`:
- `solo-sam.jpg`
- `catfish.jpg`
- `daphne-duet.jpg`
- `very-good-maam-trio.jpg`

### Update Copy

Edit text directly in `index.html` sections (About, Music, Bookings, Contact)

## 🌐 Custom Domain

The `CNAME` file is already configured for `samohalloran.com`. Update DNS settings:

1. Go to your domain registrar
2. Add/update CNAME record pointing to `samohalloran.github.io`
3. Or update the A records to GitHub's IP addresses

## 💡 Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive
- CSS Grid and Flexbox supported

## 📄 License

© 2026 Sam O'Halloran. All rights reserved.
