# Glotrex International — Admin Guide & Deployment

## 🚀 Cloudflare Pages Deployment

### Step 1: Push to GitHub
1. Create a GitHub repository (e.g., `glotrex-website`)
2. Upload this entire folder to the repository root
3. Make sure the structure looks like:
   ```
   /
   ├── index.html
   ├── about.html
   ├── products.html
   ├── faq.html
   ├── data/
   │   └── products.json  ← ADMIN EDITS THIS FILE
   └── assets/
       ├── css/style.css
       └── js/main.js
   ```

### Step 2: Connect to Cloudflare Pages
1. Go to https://pages.cloudflare.com
2. Click **"Create a project"** → Connect to Git → Select your GitHub repo
3. Build settings:
   - **Framework preset**: None (Static HTML)
   - **Build command**: *(leave empty)*
   - **Build output directory**: `/` (root)
4. Click **Deploy**

Your site will be live at `https://glotrex.pages.dev` (or your custom domain).

---

## 📝 HOW TO EDIT PRODUCTS (Admin Instructions)

### The products.json file is your control panel.

**File location:** `/data/products.json`

All product content — names, descriptions, images, specifications, certifications — is stored in this single JSON file. **No coding required to update products.**

---

### ✅ How to Update a Product Description

1. Open `data/products.json` in any text editor (Notepad, VS Code, etc.)
2. Find the product by its `"name"` field
3. Edit the `"description"` field:
   ```json
   {
     "id": "red-onion-powder",
     "name": "Red Onion Powder",
     "description": "YOUR NEW DESCRIPTION HERE",
     ...
   }
   ```
4. Save the file
5. Commit and push to GitHub → Cloudflare auto-deploys in ~1 minute

---

### ✅ How to Change a Product Image

**Option A — Use Unsplash or any public image URL:**
```json
"image": "https://images.unsplash.com/photo-YOUR-PHOTO-ID?w=600&q=80"
```

**Option B — Upload your own image (recommended for product photos):**
1. Upload your image to the `/assets/images/products/` folder in GitHub
2. Update the image path in products.json:
   ```json
   "image": "assets/images/products/red-onion-powder.jpg"
   ```

---

### ✅ How to Update Product Specifications

Find the `"specs"` object inside your product and edit the key-value pairs:
```json
"specs": {
  "Moisture": "< 4%",
  "Mesh": "80 Mesh",
  "Color": "Light Pink-Red",
  "Packing": "25kg Kraft Bags",
  "Shelf Life": "24 Months"
}
```
You can add or remove any spec row — they all appear in the product detail popup automatically.

---

### ✅ How to Add a New Product

Copy an existing product object and paste it in the right category array:
```json
{
  "id": "unique-id-here",
  "name": "Product Name",
  "image": "https://image-url.com/photo.jpg",
  "description": "Full product description here.",
  "specs": {
    "Moisture": "< 5%",
    "Packing": "25kg Bags",
    "Shelf Life": "24 Months"
  },
  "certifications": ["APEDA", "FSSAI"]
}
```

---

### ✅ How to Update WhatsApp Number

Search for `919XXXXXXXXX` in:
- `data/products.json` → `company.whatsapp`
- `index.html`, `about.html`, `products.html`, `faq.html` → replace all occurrences

Format: Country code + number, no spaces or symbols.
Example for +91 98765 43210: `919876543210`

---

### ✅ How to Update the Strategy Call Calendar Link

Search for `#schedule` or `CALENDAR_URL` in all HTML files and replace with your Calendly / Google Calendar scheduling link.

---

### ✅ How to Add Mr. Premsagar's Photo

In `about.html`, find the expert avatar `<div class="expert-avatar">👤</div>` and replace with:
```html
<img src="assets/images/premsagar.jpg" alt="Mr. Premsagar Mehetre" style="width:90px;height:90px;border-radius:50%;object-fit:cover;"/>
```

---

## 🌐 Language Support

The site uses **Google Translate** for all 13 languages. No extra setup needed — it works automatically when visitors select a language from the dropdown. Supported languages:
- English, हिंदी, मराठी, Deutsch, العربية, Русский, Português, Español, Italiano, বাংলা, नेपाली, Malay, Indonesian

---

## 📧 Contact Form

The footer inquiry form sends data via WhatsApp (opens WhatsApp with pre-filled message). To switch to email:
1. Set up a free **Formspree** account at https://formspree.io
2. In `assets/js/main.js`, replace the `footerForm` submit handler with Formspree's AJAX endpoint

---

## 🔄 Deployment Workflow Summary

1. Edit `data/products.json` (or any HTML/CSS/JS file)
2. Save and commit to GitHub
3. Cloudflare Pages auto-detects the push and redeploys (~60 seconds)
4. Changes are live on your domain

**No server management. No CMS login. No database.**
