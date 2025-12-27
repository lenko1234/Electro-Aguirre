# Announcements System - Technical Documentation

## Overview
The announcements system allows dynamic management of ticker messages displayed in the website header through Sanity CMS.

## Schema Definition
Location: `/electro-aguirre-/schemaTypes/documents/announcement.ts`

### Fields:
- `text` (string, required): Announcement text (max 150 chars recommended)
- `icon` (string, optional): Emoji or icon (max 5 chars)
- `isActive` (boolean): Controls visibility (default: true)
- `order` (number, required): Display order (ascending)

## Frontend Implementation

### HTML Structure
The ticker is present in all pages (index.html, catalogo.html, nosotros.html):
```html
<div class="announcements-ticker">
    <div class="ticker-content">
        <span><!-- Dynamic content loaded from Sanity --></span>
        <span><!-- Duplicate for seamless loop --></span>
    </div>
</div>
```

### JavaScript Integration
Location: `/script.js`

The script:
1. Fetches active announcements from Sanity API
2. Orders them by the `order` field
3. Combines icon + text for each announcement
4. Joins all announcements with " • " separator
5. Duplicates content for seamless infinite scroll

### CSS Animation
Location: `/styles.css`

- Container: `.announcements-ticker` (max-width: 700px on desktop)
- Animation: `scroll-left` (25s linear infinite)
- Responsive: Full width on mobile, positioned below logo/menu

## API Query
```javascript
*[_type == "announcement" && isActive == true] | order(order asc) {text, icon}
```

## Deployment
After schema changes, deploy with:
```bash
cd electro-aguirre-
npm run deploy
```

## Example Announcements Data

```json
[
  {
    "text": "¡Nuevos productos en iluminación LED!",
    "icon": "⚡",
    "isActive": true,
    "order": 1
  },
  {
    "text": "Ofertas especiales en materiales eléctricos",
    "icon": "🏷️",
    "isActive": true,
    "order": 2
  },
  {
    "text": "Entregas rápidas en Concepción del Uruguay",
    "icon": "🚚",
    "isActive": true,
    "order": 3
  }
]
```

## Fallback Behavior
If Sanity fetch fails, the ticker displays default hardcoded content from HTML.
