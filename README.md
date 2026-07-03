# StudioNest Architects — Full Stack MERN Website
/*hello world*/
A production-grade, full-stack architectural firm website with admin panel, built with **MongoDB, Express, EJS (server-side rendering), and Node.js**.

---

## 🏛 Features

### Public Website
- **Homepage** — Hero, featured projects grid, about section, blog preview, contact CTA
- **Projects Page** — Filterable project portfolio with category filters
- **Project Detail** — Full project info, BIM tags, related projects
- **Blog Page** — Paginated blog listing with featured post and category filters
- **Blog Post** — Full article with sidebar, share links, related posts, view tracking
- **About Page** — Team, services, stats, client logos
- **Contact Page** — Fully functional contact form

### Admin Panel (`/admin`)
- 🔐 **Secure login** with bcrypt password hashing + session authentication
- 📊 **Dashboard** — Stats overview, quick links, recent content tables
- 🏗 **Projects CRUD** — Create, Read, Update, Delete all projects
- ✍️ **Blog CRUD** — Full post management with publish/draft toggle
- 🖼 **Image URL preview** — Live preview when entering image URLs
- ⚡ **One-click publish/unpublish** — AJAX toggle without page reload

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas)

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/studionest
SESSION_SECRET=your_secret_key_here
```

### 3. Seed the Database
```bash
cd backend
npm run seed
```
This creates:
- Admin user: **admin** / **StudioNest@2024**
- 6 sample projects
- 3 sample blog posts

### 4. Start the Server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

### 5. Open in Browser
- **Website:** http://localhost:5000
- **Admin Login:** http://localhost:5000/admin/login

---

## 📁 Project Structure

```
studionest/
├── backend/
│   ├── models/
│   │   ├── Project.js        # Project schema & model
│   │   ├── Blog.js           # Blog schema with auto-slug
│   │   └── Admin.js          # Admin with bcrypt auth
│   ├── routes/
│   │   ├── main.js           # Home, About, Contact
│   │   ├── projects.js       # Public project routes
│   │   ├── blog.js           # Public blog routes
│   │   └── admin.js          # Admin CRUD routes (protected)
│   ├── middleware/
│   │   └── auth.js           # Session auth middleware
│   ├── server.js             # Main Express app
│   ├── seed.js               # Database seeder
│   ├── .env                  # Environment variables
│   └── package.json
│
└── frontend/
    ├── public/
    │   ├── css/
    │   │   ├── style.css     # Main website styles
    │   │   └── admin.css     # Admin panel styles
    │   └── js/
    │       ├── main.js       # Website JS (scroll, nav, animations)
    │       └── admin.js      # Admin JS (confirm, toggle, preview)
    │
    └── views/
        ├── layouts/
        │   ├── main.ejs      # Public site layout (nav + footer)
        │   └── admin.ejs     # Admin layout (sidebar + topbar)
        ├── index.ejs         # Homepage
        ├── projects.ejs      # Projects listing
        ├── project-single.ejs # Project detail
        ├── blog.ejs          # Blog listing
        ├── blog-single.ejs   # Blog post
        ├── about.ejs         # About page
        ├── contact.ejs       # Contact page
        ├── 404.ejs           # 404 error page
        └── admin/
            ├── login.ejs     # Admin login
            ├── dashboard.ejs # Admin dashboard
            ├── projects.ejs  # Projects CRUD list
            ├── project-form.ejs # Create/Edit project form
            ├── blogs.ejs     # Blogs CRUD list
            └── blog-form.ejs # Create/Edit blog form
```

---

## 🔐 Admin Credentials

| Username | Password |
|----------|----------|
| `admin` | `StudioNest@2024` |

Change these in `backend/.env` and re-run the seed.

---

## 🗄 Data Models

### Project
| Field | Type | Description |
|-------|------|-------------|
| title | String | Project name |
| category | Enum | Residential, Commercial, BIM, etc. |
| year | Number | Year of completion |
| description | String | Short description (card) |
| fullDescription | String | Full HTML content |
| imageUrl | String | Cover image URL |
| location | String | City, State |
| area | String | Floor area (e.g. 12,000 sqm) |
| client | String | Client name |
| tags | [String] | Keywords |
| featured | Boolean | Show on homepage |
| bimEnabled | Boolean | BIM coordinated |
| status | Enum | Completed/In Progress/Upcoming |

### Blog
| Field | Type | Description |
|-------|------|-------------|
| title | String | Post title |
| slug | String | URL slug (auto-generated) |
| excerpt | String | Short summary |
| content | String | Full HTML content |
| author | String | Author name |
| category | Enum | Architecture, BIM, Design, etc. |
| imageUrl | String | Cover image |
| published | Boolean | Live on site |
| featured | Boolean | Featured post slot |
| readTime | Number | Auto-calculated (min) |
| views | Number | View counter |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Templating | EJS + express-ejs-layouts |
| Auth | express-session + bcryptjs + connect-mongo |
| Styling | Custom CSS (CSS variables, responsive) |
| Fonts | Cormorant Garamond + DM Sans + DM Mono |

---

## 🌐 Deployment

### MongoDB Atlas (Cloud)
1. Create cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Update `MONGODB_URI` in `.env` with your connection string

### Render / Railway / Heroku
```bash
# Set environment variables:
MONGODB_URI=mongodb+srv://...
SESSION_SECRET=your_secret
NODE_ENV=production
PORT=5000
```

---

## 📝 License

© 2024 StudioNest Architects. All rights reserved.
