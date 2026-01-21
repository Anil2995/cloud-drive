import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Configure CORS to allow both development and production origins
const allowedOrigins = [
    'http://localhost:3000',
    'https://cloud-drive-three.vercel.app',
    process.env.CORS_ORIGIN
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, Postman)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Cloud Storage API is running');
});

import authRoutes from './routes/authRoutes';
import folderRoutes from './routes/folderRoutes';
import fileRoutes from './routes/fileRoutes';
import searchRoutes from './routes/searchRoutes';
import shareRoutes from './routes/shareRoutes';

app.use('/api/auth', authRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/shares', shareRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
