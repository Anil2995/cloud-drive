# 🚀 Cloud Drive - Google Drive Clone

A full-featured cloud storage application with file upload, folder management, search, and sharing capabilities.

![Next.js](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Status](https://img.shields.io/badge/Status-Complete-brightgreen)

---

## ✨ Features

- 📤 **File Upload & Download** - Direct uploads to cloud storage
- 📁 **Folder Management** - Create, rename, delete folders
- 🔍 **Real-time Search** - Find files and folders instantly
- 👥 **Sharing** - Share files with users or via public links
- 🔐 **Secure Authentication** - JWT-based login system
- 🎨 **Modern UI** - Responsive design with dark mode support
- ⚡ **Fast Performance** - Built with Next.js and PostgreSQL

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, React, Tailwind CSS, TypeScript
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL (Supabase)
- **Storage:** Supabase Storage
- **Auth:** JWT + bcrypt

---

## 🚀 Quick Start (15 Minutes)

### Prerequisites
- Node.js 18+
- Supabase account (free)

### 1. Setup Supabase

1. Create project at [supabase.com](https://supabase.com)
2. Get API keys from **Settings → API**
3. Run database schema:
   - Go to **SQL Editor**
   - Copy contents of `server/schema.sql`
   - Paste and click **Run**
4. Create storage bucket:
   - Go to **Storage**
   - Create bucket named `drive` (private)
5. Add storage policies in SQL Editor:
```sql
CREATE POLICY "Allow authenticated uploads" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'drive');
CREATE POLICY "Allow authenticated reads" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'drive');
CREATE POLICY "Allow authenticated updates" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'drive');
CREATE POLICY "Allow authenticated deletes" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'drive');
```

### 2. Configure Backend

```bash
cd server
npm install
```

Create/update `server/.env`:
```env
DATABASE_URL=your_supabase_connection_string
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_STORAGE_BUCKET=drive
JWT_SECRET=your_random_secret_32_chars
```

**Note:** URL-encode special characters in DATABASE_URL (`@` → `%40`, `!` → `%21`)

### 3. Configure Frontend

```bash
cd client
npm install
```

Create `client/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 4. Run the App

**Terminal 1 - Backend:**
```bash
cd server
npm run dev    # Runs on port 8000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev    # Runs on port 3000
```

**Access:** http://localhost:3000

---

## 📖 How to Use

### First Time Setup
1. Go to http://localhost:3000
2. Click **Sign Up**
3. Create your account
4. You're in!

### Upload Files
1. Click **+ New** → **File Upload**
2. Select file → Click **Upload**
3. Watch progress bar

### Create Folders
1. Click **+ New** → **New Folder**
2. Type name → Press Enter

### Search
- Type in search bar at top
- Results appear instantly

### Share Files
- Right-click file → **Share**
- Enter email OR create public link

### More Actions
- **Download:** Click ↓ icon
- **Rename:** Click pencil icon
- **Delete:** Click trash icon

---

## 🗂️ Project Structure

```
project-2/
├── client/             # Next.js frontend
│   ├── src/app/       # Pages
│   └── src/components/ # UI components
├── server/            # Express backend
│   ├── src/controllers/ # Business logic
│   └── src/routes/    # API endpoints
├── .gitignore
└── README.md
```

---

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get user info

### Files
- `POST /api/files/init` - Initialize upload
- `GET /api/files/:id` - Get download URL
- `PATCH /api/files/:id` - Rename
- `DELETE /api/files/:id` - Delete

### Folders
- `POST /api/folders` - Create
- `GET /api/folders/:id` - Get contents
- `PATCH /api/folders/:id` - Rename
- `DELETE /api/folders/:id` - Delete

### Search & Share
- `GET /api/search?q={query}` - Search
- `POST /api/shares` - Share with user
- `POST /api/shares/link` - Create public link

---

## 🐛 Troubleshooting

**Backend won't start?**
- Check DATABASE_URL has password URL-encoded
- Ensure all env variables are set
- Restart after editing .env

**Upload fails?**
- Verify storage bucket is named `drive`
- Check storage policies are applied
- Confirm SUPABASE_SERVICE_ROLE_KEY is correct

**Can't login?**
- Ensure database schema is applied
- Check backend is running on port 8000
- Look for errors in browser console

---

## 🚢 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import to Vercel
3. Root directory: `client`
4. Add env: `NEXT_PUBLIC_API_URL`

### Backend (Render/Railway)
1. Connect repository
2. Root directory: `server`
3. Build: `npm install && npm run build`
4. Start: `npm start`
5. Add all environment variables

---

## 📄 License

MIT License - free to use and modify

---

## 🙏 Built With

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Heroicons](https://heroicons.com/)

---

**Made with ❤️**

Version 1.0.0 | January 2026
