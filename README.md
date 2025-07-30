# QuickCert

A beginner-friendly full-stack web application for extracting and managing birth certificate data using OCR.

## Features
- Admin and Registry Officer authentication (JWT-based)
- Upload birth certificate images and extract data using Google Cloud Vision OCR
- Editable review of extracted fields before saving
- View and manage submitted birth records
- Built with Node.js, Express, MongoDB, React, and Tailwind CSS

---

## Prerequisites
- **Node.js** (v20.19.0 or newer recommended)
- **MongoDB** (local or Atlas)
- **Google Cloud Vision API** credentials (JSON key file)

---

## Backend Setup
1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```
2. **Create a `.env` file** in the project root with:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_key
   GOOGLE_APPLICATION_CREDENTIALS=path/to/your/vision-key.json
   ```
3. **Start the backend server:**
   ```bash
   node app.js
   ```
   The backend runs on `http://localhost:5000` by default.

---

## Frontend Setup
1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```
2. **Start the frontend dev server:**
   ```bash
   npm run dev
   ```
   The frontend runs on `http://localhost:5173` by default (Vite).

---

## Usage
- **Admin** can register and log in, and create Registry Officer accounts.
- **Registry Officers** can log in, upload birth certificate images, review/edit extracted data, and view their submitted records.
- All sensitive routes are protected by JWT.

---

## Notes
- All passwords are hashed with bcrypt.
- Images are processed in-memory and not stored.
- The UI is styled with Tailwind CSS for clarity and simplicity.
- For demo/learning purposes only. Not production-ready.

---

## Troubleshooting
- Ensure your Node.js version is up-to-date (see above).
- If you see errors about `crypto.hash` or Vite, update Node.js and reinstall dependencies.
- Make sure your `.env` variables are correct and the Google Vision API key is valid.

---
