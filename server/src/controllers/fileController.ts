import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import pool from '../config/db';

dotenv.config();

// Supabase Setup
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''; // Use service role for backend ops if needed, or anon if using user token. 
// Spec says: "API checks auth -> creates DB placeholder -> returns key + presigned URLs".
// Secure approach: Backend uses Service Role to generate Signed URLs for the client.

const supabase = createClient(supabaseUrl, supabaseKey);

interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
    };
}

// Init Upload
export const initUpload = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { name, mime_type, size_bytes, folder_id } = req.body;
        const owner_id = req.user?.id;

        if (!owner_id) {
            res.status(401).json({ msg: 'Unauthorized' });
            return;
        }

        // 1. Generate unique storage path: tenants/{user_id}/folders/{folder_id}/files/{uuid}-{name}
        // Note: folder_id might be null (root).
        const fileUuid = crypto.randomUUID();
        const safeName = name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const storagePath = `tenants/${owner_id}/${fileUuid}-${safeName}`; // Simplified path

        // 2. Insert DB placeholder (status='uploading' - wait, spec schema doesn't have status, but 'is_deleted' etc. We can trust the flow or add a status column. Spec has 'storage_key' unique).
        // Spec schema for Files table: id, name, mime_type, size_bytes, storage_key, owner_id, folder_id...

        const newFile = await pool.query(
            `INSERT INTO files (id, name, mime_type, size_bytes, storage_key, owner_id, folder_id) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [fileUuid, name, mime_type, size_bytes, storagePath, owner_id, folder_id || null]
        );

        // 3. Generate Presigned URL (Signed Upload URL)
        // using supabase-js: supabase.storage.from('bucket').createSignedUploadUrl(path)
        const { data, error } = await supabase
            .storage
            .from(process.env.SUPABASE_STORAGE_BUCKET || 'drive')
            .createSignedUploadUrl(storagePath);

        if (error) {
            console.error('Supabase Storage Error:', error);
            // Rollback DB insert
            await pool.query('DELETE FROM files WHERE id = $1', [fileUuid]);
            throw error;
        }

        res.json({
            fileId: newFile.rows[0].id,
            storageKey: storagePath,
            uploadUrl: data?.signedUrl,
            token: data?.token // If needed
        });

    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Complete Upload (Optional if we trust the client to just finish. But usually we want to confirm existence).
// Spec says: "Client calls upload-complete -> API verifies -> finalizes DB row".
// Since we inserted the row in 'init', maybe we just need to verify?
// Or we could have a 'status' column in files table (pending/ready). The current schema suggests the file exists once inserted.
// Let's implement a 'verify' endpoint that checks if file exists in storage.

// Get File (Download URL)
export const getFile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const owner_id = req.user?.id;

        const fileResult = await pool.query('SELECT * FROM files WHERE id = $1 AND owner_id = $2', [id, owner_id]);

        if (fileResult.rows.length === 0) {
            res.status(404).json({ msg: 'File not found' });
            return;
        }

        const file = fileResult.rows[0];

        // Generate Signed Download URL
        const { data, error } = await supabase
            .storage
            .from(process.env.SUPABASE_STORAGE_BUCKET || 'drive')
            .createSignedUrl(file.storage_key, 60 * 60); // 1 hour

        if (error) throw error;

        res.json({
            file,
            downloadUrl: data?.signedUrl
        });

    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update File (Rename)
export const updateFile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const owner_id = req.user?.id;

        const updatedFile = await pool.query(
            'UPDATE files SET name = $1, updated_at = now() WHERE id = $2 AND owner_id = $3 RETURNING *',
            [name, id, owner_id]
        );

        if (updatedFile.rows.length === 0) {
            res.status(404).json({ msg: 'File not found' });
            return;
        }

        res.json(updatedFile.rows[0]);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete File
export const deleteFile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const owner_id = req.user?.id;

        // Soft delete in DB
        const deletedFile = await pool.query(
            'UPDATE files SET is_deleted = true, updated_at = now() WHERE id = $1 AND owner_id = $2 RETURNING *',
            [id, owner_id]
        );

        if (deletedFile.rows.length === 0) {
            res.status(404).json({ msg: 'File not found' });
            return;
        }

        res.json({ msg: 'File moved to trash' });

    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get Storage Usage
export const getStorageUsage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const owner_id = req.user?.id;

        if (!owner_id) {
            res.status(401).json({ msg: 'Unauthorized' });
            return;
        }

        const result = await pool.query(
            'SELECT COALESCE(SUM(size_bytes), 0) as used_bytes FROM files WHERE owner_id = $1 AND is_deleted = false',
            [owner_id]
        );

        const usedBytes = parseInt(result.rows[0].used_bytes);
        const totalBytes = 15 * 1024 * 1024 * 1024; // 15GB

        res.json({
            usedBytes,
            totalBytes,
            percentage: (usedBytes / totalBytes) * 100
        });

    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get Recent Files
export const getRecentFiles = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const owner_id = req.user?.id;
        const limit = parseInt(req.query.limit as string) || 20;

        if (!owner_id) {
            res.status(401).json({ msg: 'Unauthorized' });
            return;
        }

        const result = await pool.query(
            `SELECT * FROM files 
             WHERE owner_id = $1 AND is_deleted = false 
             ORDER BY updated_at DESC 
             LIMIT $2`,
            [owner_id, limit]
        );

        res.json({ files: result.rows });

    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get Starred Files
export const getStarredFiles = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const owner_id = req.user?.id;

        if (!owner_id) {
            res.status(401).json({ msg: 'Unauthorized' });
            return;
        }

        const result = await pool.query(
            `SELECT * FROM files 
             WHERE owner_id = $1 AND is_deleted = false AND is_starred = true 
             ORDER BY updated_at DESC`,
            [owner_id]
        );

        res.json({ files: result.rows });

    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Toggle Star on File
export const toggleStar = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const owner_id = req.user?.id;

        if (!owner_id) {
            res.status(401).json({ msg: 'Unauthorized' });
            return;
        }

        const fileResult = await pool.query(
            'SELECT is_starred FROM files WHERE id = $1 AND owner_id = $2',
            [id, owner_id]
        );

        if (fileResult.rows.length === 0) {
            res.status(404).json({ msg: 'File not found' });
            return;
        }

        const currentStarred = fileResult.rows[0].is_starred || false;

        const updatedFile = await pool.query(
            'UPDATE files SET is_starred = $1, updated_at = now() WHERE id = $2 AND owner_id = $3 RETURNING *',
            [!currentStarred, id, owner_id]
        );

        res.json({
            file: updatedFile.rows[0],
            message: currentStarred ? 'Removed from starred' : 'Added to starred'
        });

    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
