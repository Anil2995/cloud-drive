# ☁️ Cloud Drive - Full-Stack Cloud Storage Application

A production-ready Google Drive clone with file upload, folder management, search, and sharing capabilities.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22-green)](https://nodejs.org/)
[![Status](https://img.shields.io/badge/Status-Live-brightgreen)](https://cloud-drive-three.vercel.app/)

---

## 🌐 Live Demo

**🔗 Live Application:** https://cloud-drive-three.vercel.app/

**📡 Backend API:** https://cloud-drive-api-tthh.onrender.com

**💻 Source Code:** https://github.com/Anil2995/cloud-drive

---

## ✨ Features

### Core Functionality
- 📤 **File Upload & Download** - Direct uploads to cloud storage with progress tracking
- 📁 **Folder Management** - Create, rename, delete, and organize folders hierarchically
- 🔍 **Real-time Search** - Instantly find files and folders across your entire drive
- 👥 **Advanced Sharing** - Share files with specific users or generate public links
- 🗑️ **Trash System** - Soft delete with ability to restore (UI ready)
- ⭐ **Favorites** - Star important files for quick access (UI ready)

### User Experience
- 🔐 **Secure Authentication** - JWT-based login system with password hashing
- 🎨 **Modern UI** - Clean, responsive design with dark mode support
- 📊 **Breadcrumb Navigation** - Easy navigation through folder hierarchy
- 🖱️ **Context Menus** - Right-click actions for quick file operations
- ⚡ **Fast Performance** - Optimized for speed with Next.js and PostgreSQL

### Technical Features
- 🔒 **Security** - Row-level security, parameterized queries, CORS protection
- 📱 **Responsive** - Works seamlessly on desktop, tablet, and mobile
- 🌐 **Production Ready** - Deployed on Vercel (frontend) and Render (backend)
- 🗄️ **Scalable Database** - PostgreSQL with Supabase
- ☁️ **Cloud Storage** - Supabase Storage for file management

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Context API
- **HTTP Client:** Axios
- **Storage SDK:** Supabase JS Client

### Backend
- **Runtime:** Node.js 22
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL (Supabase)
- **Storage:** Supabase Storage
- **Authentication:** JWT + bcrypt
- **Database Driver:** pg (node-postgres)

### Infrastructure
- **Frontend Hosting:** Vercel
- **Backend Hosting:** Render
- **Database:** Supabase (PostgreSQL)
- **File Storage:** Supabase Storage
- **Version Control:** GitHub

---

## 📂 Project Structure

```
cloud-drive/
├── client/                    # Frontend Application
│   ├── src/
│   │   ├── app/              # Next.js App Router Pages
│   │   │   ├── page.tsx      # Landing page
│   │   │   ├── login/        # Login page
│   │   │   ├── register/     # Registration page
│   │   │   └── dashboard/    # Main dashboard
│   │   ├── components/       # React Components
│   │   │   ├── Sidebar.tsx           # Left navigation
│   │   │   ├── FileExplorer.tsx      # File/folder display
│   │   │   ├── Breadcrumb.tsx        # Navigation path
│   │   │   ├── CreateFolderModal.tsx # Folder creation
│   │   │   ├── UploadModal.tsx       # File upload
│   │   │   ├── RenameModal.tsx       # Rename interface
│   │   │   ├── ShareModal.tsx        # Sharing interface
│   │   │   └── FileContextMenu.tsx   # Right-click menu
│   │   ├── context/          # State Management
│   │   │   └── AuthContext.tsx       # User authentication
│   │   └── lib/              # Utilities
│   │       └── api.ts                # Axios HTTP client
│   ├── public/               # Static assets
│   ├── .env.local            # Environment variables
│   ├── package.json          # Dependencies
│   ├── tailwind.config.ts    # Tailwind configuration
│   └── tsconfig.json         # TypeScript config
│
├── server/                    # Backend API
│   ├── src/
│   │   ├── config/           # Configuration
│   │   │   ├── db.ts                # PostgreSQL connection
│   │   │   └── supabaseClient.ts    # Supabase client
│   │   ├── controllers/      # Business Logic
│   │   │   ├── authController.ts    # Authentication
│   │   │   ├── fileController.ts    # File operations
│   │   │   ├── folderController.ts  # Folder operations
│   │   │   ├── searchController.ts  # Search functionality
│   │   │   └── shareController.ts   # Sharing features
│   │   ├── middleware/       # Custom Middleware
│   │   │   └── authorize.ts         # JWT verification
│   │   ├── routes/           # API Routes
│   │   │   ├── authRoutes.ts
│   │   │   ├── fileRoutes.ts
│   │   │   ├── folderRoutes.ts
│   │   │   ├── searchRoutes.ts
│   │   │   └── shareRoutes.ts
│   │   ├── utils/            # Helper Functions
│   │   │   └── jwtGenerator.ts      # Token generation
│   │   └── index.ts          # Express app entry
│   ├── .env                  # Environment variables
│   ├── package.json          # Dependencies
│   ├── tsconfig.json         # TypeScript config
│   └── schema.sql            # Database schema
│
├── .gitignore                # Git ignore rules
└── README.md                 # This file
```

---

## 🚀 Local Development Setup

### Prerequisites
- **Node.js** 18+ installed
- **npm** or **yarn** package manager
- **Supabase** account (free tier)
- **Git** for version control

### Step 1: Clone Repository

```bash
git clone https://github.com/Anil2995/cloud-drive.git
cd cloud-drive
```

### Step 2: Supabase Setup

1. **Create Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Name: `cloud-drive`
   - Database Password: (save this securely)
   - Region: Choose closest to you
   - Wait 2 minutes for provisioning

2. **Get API Credentials:**
   - Click **Settings** → **API**
   - Copy:
     - `Project URL`
     - `anon public` key
     - `service_role` key

3. **Setup Database Schema:**
   - Click **SQL Editor** → **New Query**
   - Open `server/schema.sql` from this project
   - Copy ALL SQL code
   - Paste into Supabase SQL Editor
   - Click **Run** (or press Ctrl+Enter)
   - Should see: "Success. No rows returned"

4. **Create Storage Bucket:**
   - Click **Storage** → **New bucket**
   - Name: `drive` (exactly this name)
   - Visibility: **Private**
   - Click **Create bucket**

5. **Add Storage Policies:**
   - Go to **SQL Editor** → **New Query**
   - Paste and run:
   ```sql
   -- Allow authenticated uploads
   CREATE POLICY "Allow authenticated uploads" 
   ON storage.objects FOR INSERT 
   TO authenticated 
   WITH CHECK (bucket_id = 'drive');

   -- Allow authenticated reads
   CREATE POLICY "Allow authenticated reads" 
   ON storage.objects FOR SELECT 
   TO authenticated 
   USING (bucket_id = 'drive');

   -- Allow authenticated updates
   CREATE POLICY "Allow authenticated updates" 
   ON storage.objects FOR UPDATE 
   TO authenticated 
   USING (bucket_id = 'drive');

   -- Allow authenticated deletes
   CREATE POLICY "Allow authenticated deletes" 
   ON storage.objects FOR DELETE 
   TO authenticated 
   USING (bucket_id = 'drive');
   ```

6. **Get Database Connection String:**
   - Click **Connect** button
   - Select **Session pooler**
   - Copy the URI
   - Format: `postgresql://postgres.xxx:[PASSWORD]@aws-region.pooler.supabase.com:5432/postgres`
   - **Important:** URL-encode special characters in password:
     - `!` → `%21`
     - `@` → `%40`
     - `#` → `%23`

### Step 3: Backend Configuration

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=8000
NODE_ENV=development
DATABASE_URL=postgresql://postgres.xxx:password%21@aws-region.pooler.supabase.com:5432/postgres
JWT_SECRET=your_random_secret_at_least_32_characters_long
REFRESH_SECRET=another_random_secret_at_least_32_characters
CORS_ORIGIN=http://localhost:3000
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key
SUPABASE_STORAGE_BUCKET=drive
```

**Generate JWT Secrets:**
```bash
# Run in terminal
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Start backend:
```bash
npm run dev
```

Should see: `✓ Server is running on port 8000`

### Step 4: Frontend Configuration

```bash
cd ../client
npm install
```

Create `client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Start frontend:
```bash
npm run dev
```

Should see: `✓ Ready on http://localhost:3000`

### Step 5: Test Locally

1. Open http://localhost:3000
2. Click **"Get Started"**
3. **Sign Up** with email and password
4. Test features:
   - Create folder
   - Upload file
   - Download file
   - Search
   - Share

---

## 🌐 Deployment Guide

### Deploy Frontend to Vercel

1. **Push to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click **"Import Project"**
   - Select your GitHub repository
   - **Root Directory:** `client`
   - **Framework:** Next.js (auto-detected)
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

3. **Add Environment Variable:**
   - After deployment, go to **Settings** → **Environment Variables**
   - Add:
     - **Name:** `NEXT_PUBLIC_API_URL`
     - **Value:** `https://your-backend-url.onrender.com/api` (add after backend deployment)
     - **Environments:** Production, Preview, Development

4. **Redeploy:**
   - After backend is deployed and env variable is added
   - Go to **Deployments** → Click latest → **Redeploy**

### Deploy Backend to Render

1. **Create Web Service:**
   - Go to [render.com](https://render.com)
   - Click **"New +"** → **"Web Service"**
   - Connect GitHub account
   - Select `cloud-drive` repository

2. **Configure Service:**
   - **Name:** `cloud-drive-api`
   - **Root Directory:** `server`
   - **Environment:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Instance Type:** Free (or paid for better performance)

3. **Add Environment Variables:**
   ```
   PORT=10000
   NODE_ENV=production
   DATABASE_URL=<your-supabase-connection-string>
   JWT_SECRET=<same-as-local>
   REFRESH_SECRET=<same-as-local>
   CORS_ORIGIN=https://your-vercel-app.vercel.app
   SUPABASE_URL=<your-supabase-url>
   SUPABASE_ANON_KEY=<your-anon-key>
   SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
   SUPABASE_STORAGE_BUCKET=drive
   ```

   **Important:**
   - Use same DATABASE_URL from Supabase
   - Set CORS_ORIGIN to your Vercel URL
   - PORT must be 10000 for Render

4. **Deploy:**
   - Click **"Create Web Service"**
   - Wait 5-10 minutes
   - Copy the Render URL

5. **Update Frontend:**
   - Go back to Vercel
   - Add/Update environment variable:
     - `NEXT_PUBLIC_API_URL` = `https://your-render-url.onrender.com/api`
   - Redeploy frontend

---

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Folder Endpoints

#### Get Folder Contents
```http
GET /api/folders/:folderId
Authorization: Bearer <token>

# Root folder
GET /api/folders/root
```

**Response:**
```json
{
  "folders": [
    {
      "id": "uuid",
      "name": "Documents",
      "created_at": "2026-01-13T..."
    }
  ],
  "files": [
    {
      "id": "uuid",
      "name": "report.pdf",
      "size": 1024567,
      "created_at": "2026-01-13T..."
    }
  ]
}
```

#### Create Folder
```http
POST /api/folders
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Folder",
  "parent_id": "uuid" // or null for root
}
```

#### Rename Folder
```http
PATCH /api/folders/:folderId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Renamed Folder"
}
```

#### Delete Folder
```http
DELETE /api/folders/:folderId
Authorization: Bearer <token>
```

### File Endpoints

#### Initialize Upload
```http
POST /api/files/init
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "document.pdf",
  "folder_id": "uuid", // or null for root
  "size": 1024567,
  "type": "application/pdf"
}
```

**Response:**
```json
{
  "fileId": "uuid",
  "uploadUrl": "https://supabase.co/storage/...",
  "path": "user-id/file-path"
}
```

#### Get Download URL
```http
GET /api/files/:fileId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "downloadUrl": "https://supabase.co/storage/...",
  "file": {
    "id": "uuid",
    "name": "document.pdf",
    "size": 1024567
  }
}
```

#### Rename File
```http
PATCH /api/files/:fileId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "new-name.pdf"
}
```

#### Delete File
```http
DELETE /api/files/:fileId
Authorization: Bearer <token>
```

### Search Endpoint

```http
GET /api/search?q=keyword&page=1&limit=20
Authorization: Bearer <token>
```

**Response:**
```json
{
  "results": [
    {
      "id": "uuid",
      "name": "matching-file.pdf",
      "type": "file",
      "size": 1024
    },
    {
      "id": "uuid",
      "name": "matching-folder",
      "type": "folder"
    }
  ],
  "total": 2,
  "page": 1,
  "limit": 20
}
```

### Sharing Endpoints

#### Share with User
```http
POST /api/shares
Authorization: Bearer <token>
Content-Type: application/json

{
  "resource_id": "file-or-folder-uuid",
  "resource_type": "file", // or "folder"
  "shared_with_email": "friend@example.com",
  "permission": "viewer" // or "editor"
}
```

#### Create Public Link
```http
POST /api/shares/link
Authorization: Bearer <token>
Content-Type: application/json

{
  "resource_id": "file-or-folder-uuid",
  "resource_type": "file"
}
```

**Response:**
```json
{
  "link": "https://cloud-drive.app/share/abc123random"
}
```

#### Get Shares
```http
GET /api/shares/:resourceId
Authorization: Bearer <token>
```

#### Remove Share
```http
DELETE /api/shares/:shareId
Authorization: Bearer <token>
```

---

## 🗄️ Database Schema

The application uses PostgreSQL with the following tables:

### users
```sql
- id (UUID, primary key)
- name (VARCHAR)
- email (VARCHAR, unique)
- password (VARCHAR, hashed)
- created_at (TIMESTAMP)
```

### folders
```sql
- id (UUID, primary key)
- name (VARCHAR)
- parent_id (UUID, nullable, references folders)
- owner_id (UUID, references users)
- is_deleted (BOOLEAN, default false)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### files
```sql
- id (UUID, primary key)
- name (VARCHAR)
- size (BIGINT)
- type (VARCHAR)
- storage_path (TEXT)
- folder_id (UUID, nullable, references folders)
- owner_id (UUID, references users)
- is_deleted (BOOLEAN, default false)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### shares
```sql
- id (UUID, primary key)
- resource_id (UUID) -- file or folder id
- resource_type (VARCHAR) -- 'file' or 'folder'
- owner_id (UUID, references users)
- shared_with (UUID, references users)
- permission (VARCHAR) -- 'viewer' or 'editor'
- created_at (TIMESTAMP)
```

### link_shares
```sql
- id (UUID, primary key)
- resource_id (UUID)
- resource_type (VARCHAR)
- owner_id (UUID, references users)
- link_token (VARCHAR, unique)
- created_at (TIMESTAMP)
```

---

## 🔒 Security Features

### Authentication & Authorization
- **JWT Tokens:** Secure, stateless authentication
- **Password Hashing:** bcrypt with salt rounds
- **Token Expiration:** Configurable token lifetimes
- **HTTP-Only Cookies:** Secure token storage (can be implemented)

### Database Security
- **Parameterized Queries:** Prevents SQL injection
- **Row Level Security:** Supabase RLS policies
- **Input Validation:** Server-side validation
- **Error Handling:** No sensitive data in error messages

### API Security
- **CORS Configuration:** Controlled cross-origin requests
- **Rate Limiting:** Can be added with express-rate-limit
- **File Upload Limits:** Size restrictions
- **Signed URLs:** Temporary access to storage

### Infrastructure Security
- **HTTPS:** Encrypted connections
- **Environment Variables:** Secrets not in code
- **Database Connection Pooling:** Secure connections
- **Storage Access Control:** Private bucket with policies

---

## 🧪 Testing

### Manual Testing Checklist

**Authentication:**
- [ ] User can register
- [ ] User can login
- [ ] Invalid credentials rejected
- [ ] Token persists across page refreshes

**File Operations:**
- [ ] Upload file (check progress bar)
- [ ] Download file
- [ ] Rename file
- [ ] Delete file
- [ ] File appears in correct folder

**Folder Operations:**
- [ ] Create folder
- [ ] Navigate into folder
- [ ] Rename folder
- [ ] Delete folder
- [ ] Breadcrumb navigation works

**Search:**
- [ ] Search finds files by name
- [ ] Search finds folders by name
- [ ] Search results clickable
- [ ] Real-time results update

**Sharing:**
- [ ] Share with specific user
- [ ] Generate public link
- [ ] Copy link to clipboard
- [ ] View existing shares

**UI/UX:**
- [ ] Right-click context menu
- [ ] Responsive on mobile
- [ ] Dark mode works
- [ ] Error messages clear
- [ ] Loading states visible

---

## 🐛 Troubleshooting

### Common Issues

#### "Database connection failed"
**Solution:**
- Verify DATABASE_URL is correct
- Check password is URL-encoded (`!` = `%21`, `@` = `%40`)
- Ensure using **Session Pooler** connection string
- Restart backend server after changing .env

#### "SUPABASE_URL is required"
**Solution:**
- Check all Supabase env variables are set
- Restart server after editing .env
- Verify no typos in variable names

#### "Upload failed" / "Download failed"
**Solution:**
- Verify storage bucket named exactly `drive`
- Check storage policies are created
- Confirm SUPABASE_SERVICE_ROLE_KEY is correct
- Check file size limits

#### "Cannot read properties of undefined"
**Solution:**
- Check user is logged in
- Verify JWT token is valid
- Clear browser cache and cookies
- Check browser console for details

#### "CORS error"
**Solution:**
- Verify CORS_ORIGIN matches frontend URL
- Check no trailing slash in CORS_ORIGIN
- Restart backend after changing CORS settings

#### Frontend shows "Failed to fetch"
**Solution:**
- Verify backend is running
- Check NEXT_PUBLIC_API_URL is correct
- Check network tab for actual error
- Verify backend URL is accessible

#### Render backend won't deploy
**Solution:**
- Check Build Command: `npm install && npm run build`
- Check Start Command: `npm start`
- Verify Root Directory: `server`
- Check all env variables are set
- View deployment logs for specific error

---

## 📈 Performance Optimization

### Frontend
- Next.js automatic code splitting
- Image optimization (can add next/image)
- Lazy loading components
- Debounced search
- Optimized re-renders

### Backend
- Database connection pooling
- Efficient SQL queries
- Indexed database columns
- Compressed responses
- Caching (can be added)

### Storage
- Direct client uploads
- Signed URLs
- CDN delivery (Supabase)
- File type restrictions

---

## 🔮 Future Enhancements

### Planned Features
- [ ] **Trash Recovery:** Restore deleted files
- [ ] **Starred Files:** Filter by favorites
- [ ] **Recent Files:** Track access history
- [ ] **Shared with Me:** View files others shared
- [ ] **Folder Upload:** Upload entire folders
- [ ] **File Preview:** View files without downloading
- [ ] **Drag & Drop:** UI for moving files
- [ ] **Bulk Operations:** Select multiple files
- [ ] **Storage Quota:** Show used/available space
- [ ] **Activity Log:** Track file changes
- [ ] **Notifications:** Real-time alerts
- [ ] **Team Workspaces:** Collaborative spaces

### Technical Improvements
- [ ] **Unit Tests:** Jest + React Testing Library
- [ ] **E2E Tests:** Playwright or Cypress
- [ ] **Rate Limiting:** Protect APIs
- [ ] **Redis Caching:** Faster responses
- [ ] **WebSockets:** Real-time updates
- [ ] **File Compression:** Reduce storage
- [ ] **Thumbnail Generation:** Image previews
- [ ] **Advanced Search:** Filters and sorting
- [ ] **Audit Logs:** Security tracking
- [ ] **Analytics:** Usage statistics

---

## 👥 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create feature branch:** `git checkout -b feature/amazing-feature`
3. **Commit changes:** `git commit -m 'Add amazing feature'`
4. **Push to branch:** `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Development Guidelines
- Follow existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 Anil Kumar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

### Built With
- [Next.js](https://nextjs.org/) - React framework
- [Express.js](https://expressjs.com/) - Node.js framework
- [Supabase](https://supabase.com/) - Database and storage
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vercel](https://vercel.com/) - Frontend hosting
- [Render](https://render.com/) - Backend hosting

### Resources
- [Heroicons](https://heroicons.com/) - UI icons
- [Google Fonts](https://fonts.google.com/) - Typography

---

## 📞 Support

### Get Help
- **Create an Issue:** [GitHub Issues](https://github.com/Anil2995/cloud-drive/issues)
- **Documentation:** Check this README
- **Email:** (Add your email if you want)

### Useful Links
- **Live App:** https://cloud-drive-three.vercel.app/
- **API Docs:** See API Documentation section above
- **GitHub:** https://github.com/Anil2995/cloud-drive

---

## 📊 Project Statistics

- **Lines of Code:** ~5,000+
- **Components:** 8 React components
- **API Endpoints:** 15+ endpoints
- **Database Tables:** 5 tables
- **Development Time:** (Add if you want)
- **Status:** ✅ Production Ready

---

<div align="center">

**Made with ❤️ by Anil Kumar**

⭐ Star this repo if you found it helpful!

[Live Demo](https://cloud-drive-three.vercel.app/) • [Report Bug](https://github.com/Anil2995/cloud-drive/issues) • [Request Feature](https://github.com/Anil2995/cloud-drive/issues)

</div>
