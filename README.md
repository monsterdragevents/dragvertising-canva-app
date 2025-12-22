# Dragvertising Canva App 🎨

**Import drag show data directly into Canva designs**

This is a Canva Apps SDK plugin that lets Canva users browse their Dragvertising shows and insert show details, performer lineups, and photos directly into their designs.

---

## 🎯 What It Does

- **Browse Shows**: View all your Dragvertising shows in Canva
- **Insert Show Details**: Add title, date, venue with one click
- **Performer Grid**: Create grid layout of all performers
- **Auto-Upload Images**: Uploads show covers and performer photos to Canva
- **Professional Layouts**: Pre-positioned elements for quick design

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Canva Developer Account ([create here](https://www.canva.com/developers/))
- Dragvertising API access

### Installation

```bash
# Navigate to canva-app directory
cd canva-app

# Install dependencies
npm install

# Start development server
npm start
```

Visit http://localhost:8080 to see the app.

### Configure Canva Developer Portal

1. Visit https://www.canva.com/developers/apps
2. Click "Create app"
3. Fill in details:
   - **Name**: Dragvertising
   - **Development URL**: http://localhost:8080
4. Save and note your App ID

### Environment Variables

Create `.env` file:

```bash
DRAGVERTISING_API_URL=https://api.dragvertising.com
CANVA_APP_ID=your_app_id_here
```

---

## 🧪 Testing in Canva

### Method 1: Preview URL
```
https://www.canva.com/design?preview_app_id=YOUR_APP_ID
```

### Method 2: In Canva Editor
1. Open canva.com
2. Create new design
3. Click "Apps" in sidebar
4. Search "Dragvertising" (once published)

---

## 📦 Build & Deploy

### Build for Production

```bash
npm run build
```

Output will be in `dist/` folder.

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Note deployment URL
# Example: https://dragvertising-canva-app.vercel.app
```

### Update Canva Developer Portal

1. Go to https://www.canva.com/developers/apps
2. Click your app
3. Update "App URL" to your Vercel URL
4. Save

---

## 📝 Features

### 1. Show Selector
- Browse all user's shows
- Search by title or venue
- View show details (date, venue, lineup)

### 2. Insert Show Details
Inserts into Canva design:
- Show title (large, bold, centered)
- Date and venue (subtitle)
- Cover image (if available)
- "FEATURING" heading
- Performer names (lineup)

### 3. Insert Performer Grid
Creates a grid layout:
- 3 columns of performer photos
- Names below each photo
- Auto-upload photos to Canva
- Professional spacing

---

## 🎨 Customization

### Change Layout

Edit `src/App.tsx` - `insertShowIntoDesign()` function:

```typescript
// Adjust positioning
await addNativeElement({
  type: "TEXT",
  children: [show.title],
  fontSize: 72,        // Change font size
  top: 100,           // Change Y position
  left: 0,            // Change X position
  width: 1080,        // Change width
  color: "#FF00FF",   // Change color
});
```

### Add New Insert Options

Add new button in detail view:

```typescript
<Button
  variant="secondary"
  onClick={() => insertCustomLayout(selectedShow)}
  stretch
>
  Insert Custom Layout
</Button>
```

Then implement `insertCustomLayout()` function.

---

## 🔐 Authentication

### OAuth Flow

1. User clicks "Connect to Dragvertising"
2. Opens popup: `${API_URL}/auth/canva/authorize`
3. User logs in to Dragvertising
4. Callback sends token via postMessage
5. Token stored in localStorage
6. App loads user's shows

### Token Storage

```typescript
localStorage.setItem("dragvertising_token", token);
```

### API Calls

```typescript
const token = localStorage.getItem("dragvertising_token");
const response = await fetch(`${API_URL}/api/shows`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

---

## 📊 App Structure

```
canva-app/
├── src/
│   ├── App.tsx           # Main app component
│   └── index.tsx         # Entry point
├── canva.json            # App manifest
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── index.html            # HTML template
└── README.md            # This file
```

---

## 🚀 Publishing to Apps Marketplace

### Requirements

Before submitting:

- [ ] App works end-to-end
- [ ] Professional icon (512x512 PNG)
- [ ] Cover image (1280x720 JPG)
- [ ] Clear description
- [ ] Privacy policy URL
- [ ] Terms of service URL
- [ ] 3-5 screenshots
- [ ] Video demo (recommended)
- [ ] Tested on multiple designs
- [ ] Error handling implemented
- [ ] Loading states work

### Submission Process

1. Visit https://www.canva.com/developers/apps
2. Click your app → "Submit for review"
3. Fill in marketplace details:
   - Description
   - Screenshots
   - Video (optional)
   - Categories: Events, Entertainment, Marketing
4. Submit
5. Wait for Canva review (1-2 weeks)
6. Address feedback if any
7. Approval → Live on marketplace! 🎉

---

## 🐛 Troubleshooting

### App not loading in Canva

**Issue**: White screen or "Failed to load"

**Solution**: Check CORS headers

```json
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { 
          "key": "Access-Control-Allow-Origin", 
          "value": "https://www.canva.com" 
        }
      ]
    }
  ]
}
```

### Elements not appearing

**Issue**: Added elements don't show up

**Solution**: Check positioning - ensure within canvas bounds

```typescript
// ❌ BAD - negative position
top: -100

// ✅ GOOD - positive position
top: 100
```

### Images not uploading

**Issue**: Performer photos don't appear

**Solution**: Check image URLs are publicly accessible

```typescript
// Test image URL
console.log("Testing image:", performer.profile_image_url);
```

---

## 📚 Resources

### Official Documentation
- [Canva Apps SDK](https://www.canva.dev/docs/apps)
- [App UI Kit](https://www.canva.dev/docs/apps/app-ui-kit)
- [Design API](https://www.canva.dev/docs/apps/integrating-canva)

### Dragvertising Docs
- [Integration Comparison](../docs/guides/CANVA_INTEGRATION_COMPARISON.md)
- [Apps SDK Guide](../docs/guides/CANVA_APPS_SDK_INTEGRATION.md)
- [Integration Hub](../docs/INTEGRATION_HUB.md)

---

## 💡 Ideas for Enhancement

### Future Features
1. **Template Selection**: Let users choose layout style
2. **Color Picker**: Customize brand colors
3. **Font Selection**: Choose fonts for text elements
4. **Batch Import**: Import multiple shows at once
5. **Design History**: Save/load previous designs
6. **Social Media Sizes**: Auto-size for Instagram, Facebook, etc.
7. **QR Codes**: Add QR codes linking to show pages
8. **Performer Bios**: Insert full bios as text
9. **Venue Maps**: Add venue location maps
10. **Ticket Links**: Add buttons linking to ticket sales

---

## 🎯 Success Metrics

Track in your analytics:

- **Installs**: How many users install the app
- **Active Users**: DAU/MAU
- **Shows Inserted**: How many shows imported
- **Designs Created**: Total designs using app
- **Conversion**: App users → Dragvertising signups

---

## 🤝 Contributing

Want to improve the app? Great!

1. Fork the repository
2. Make your changes
3. Test thoroughly in Canva
4. Submit a pull request

---

## 📞 Support

- **Documentation**: See `/docs/guides/` folder
- **Issues**: Create GitHub issue
- **Community**: [Canva Developer Forum](https://community.canva.dev/)

---

## 📄 License

MIT License - See LICENSE file

---

**Built with ❤️ by Dragvertising**

**Ready to bring drag show marketing to 100M+ Canva users! 🎨🚀**

