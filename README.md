# ✈️ Travel Bucket List (Trip Wishlist)

A beautiful, modern, and interactive **Travel Bucket List** web application designed to help you curate, visualize, and manage your dream destinations. The application features a stunning responsive grid, smooth animations, detailed description modals, and a seamless backend to persist your travel plans.

---

## ✨ Features

- **🌸 Curated Showcase**: View your dream destinations in a premium card grid layout.
- **🏷️ Characteristics Tags**: Each destination has custom tags (e.g., *Zen, Culture, Romance, Nature*) to capture its unique vibe.
- **📖 In-depth Modals**: Tap on any destination to read more about the place, access notes, or jump to official guide articles.
- **➕ Live Add Form**: Add new destinations via a rich user form with support for:
  - Image URLs
  - Direct local file uploads (saved securely as binary blobs in the database)
  - Customizable destination tags and characteristics
- **✨ Micro-animations**: Fluid transitions and hover effects powered by `Framer Motion` (Motion v12).
- **💾 SQLite Backend**: Automatically initializes and seeds a SQLite database with stunning sample locations if empty.

---

## 🛠️ Tech Stack

### Frontend
- **React 19** – Component-based user interface.
- **Vite** – Fast build tool and hot module replacement (HMR).
- **Tailwind CSS v4** – Modern utility-first CSS styling framework.
- **Motion (Framer Motion v12)** – Fluid animations and layouts.
- **React Router Dom v7** – Declarative routing for page navigation.

### Backend
- **Python & Flask** – Lightweight, robust RESTful API.
- **SQLite 3** – Serverless, persistent relational database.
- **Waitress** – Production-grade WSGI server.

---

## 📁 Project Structure

```text
├── database/            # SQLite database file directory
├── dist/                # Production build output
├── public/              # Static assets
├── src/
│   ├── Components/      # React components (Card, CardDiv, AddMore, About, etc.)
│   ├── App.jsx          # Main application routing and core structure
│   ├── main.css         # Tailwind directives and custom CSS
│   └── main.jsx         # App entry point
├── app.py               # Flask REST API backend
├── package.json         # Frontend dependencies and npm scripts
├── vite.config.js       # Vite bundler configuration
└── README.md            # Project documentation
```

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have **Node.js** and **Python 3** installed on your system.

### 2. Backend Setup
1. Create and activate a Python virtual environment:
   ```bash
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # macOS/Linux:
   source .venv/bin/activate
   ```
2. Install Flask and required dependencies:
   ```bash
   pip install flask flask-cors waitress
   ```
3. Run the backend server:
   ```bash
   python app.py
   ```
   *Note: This will automatically initialize the SQLite database (`database/main.db`) and seed it with default destinations.*

### 3. Frontend Setup
1. Open a new terminal in the project directory and install package dependencies:
   ```bash
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser to view the application!

---

## 🎨 UI Design System

The project implements a minimalist, premium layout inspired by modern editorial designs:
- **Typography**: Uses custom styled fonts like `Barriecito` and high-quality serif/sans combinations.
- **Color Palette**: Off-whites (`#fafafa`), deep charcoal texts, and elegant gradient dividers.
- **Elevated UX**: Input transitions, instant visual feedback on form submissions, and graceful handling of empty states.
