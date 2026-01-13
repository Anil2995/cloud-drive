import { Request, Response } from 'express';
import pool from '../config/db';

interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
    };
}

// Search files and folders
export const search = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { q } = req.query;
        const owner_id = req.user?.id;

        if (!q || typeof q !== 'string') {
            res.status(400).json({ msg: 'Search query required' });
            return;
        }

        const searchTerm = `%${q.toLowerCase()}%`;

        // Search folders
        const folders = await pool.query(
            `SELECT id, name, parent_id, created_at, 'folder' as type 
             FROM folders 
             WHERE owner_id = $1 AND is_deleted = false AND LOWER(name) LIKE $2 
             ORDER BY name ASC 
             LIMIT 50`,
            [owner_id, searchTerm]
        );

        // Search files
        const files = await pool.query(
            `SELECT id, name, folder_id, size_bytes, mime_type, updated_at, 'file' as type 
             FROM files 
             WHERE owner_id = $1 AND is_deleted = false AND LOWER(name) LIKE $2 
             ORDER BY name ASC 
             LIMIT 50`,
            [owner_id, searchTerm]
        );

        res.json({
            results: [
                ...folders.rows,
                ...files.rows
            ],
            count: folders.rows.length + files.rows.length
        });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
