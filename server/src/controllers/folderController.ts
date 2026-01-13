import { Request, Response } from 'express';
import pool from '../config/db';

interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
    };
}

// Create Folder
export const createFolder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { name, parent_id } = req.body;
        const owner_id = req.user?.id;

        if (!owner_id) {
            res.status(401).json({ msg: 'Unauthorized' });
            return;
        }

        // Basic validation
        if (!name) {
            res.status(400).json({ msg: 'Folder name is required' });
            return;
        }

        const newFolder = await pool.query(
            'INSERT INTO folders (name, parent_id, owner_id) VALUES ($1, $2, $3) RETURNING *',
            [name, parent_id || null, owner_id]
        );

        res.json(newFolder.rows[0]);
    } catch (err: any) {
        if (err.code === '23505') { // Unique violation
            res.status(400).json({ msg: 'Folder with this name already exists in this location' });
            return;
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get Folder Content (Children)
export const getFolder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const owner_id = req.user?.id;

        // If id is 'root', we fetch root folders (parent_id is NULL)
        const isRoot = id === 'root';
        const queryId = isRoot ? null : id;

        let folder = null;
        if (!isRoot) {
            const folderResult = await pool.query('SELECT * FROM folders WHERE id = $1 AND owner_id = $2 AND is_deleted = false', [queryId, owner_id]);
            if (folderResult.rows.length === 0) {
                res.status(404).json({ msg: 'Folder not found' });
                return;
            }
            folder = folderResult.rows[0];
        }

        // Get subfolders
        let subfolders;
        if (isRoot) {
            subfolders = await pool.query(
                'SELECT * FROM folders WHERE parent_id IS NULL AND owner_id = $1 AND is_deleted = false ORDER BY name ASC',
                [owner_id]
            );
        } else {
            subfolders = await pool.query(
                'SELECT * FROM folders WHERE parent_id = $1 AND owner_id = $2 AND is_deleted = false ORDER BY name ASC',
                [queryId, owner_id]
            );
        }

        // Get files
        let files;
        if (isRoot) {
            files = await pool.query(
                'SELECT * FROM files WHERE folder_id IS NULL AND owner_id = $1 AND is_deleted = false ORDER BY name ASC',
                [owner_id]
            );
        } else {
            files = await pool.query(
                'SELECT * FROM files WHERE folder_id = $1 AND owner_id = $2 AND is_deleted = false ORDER BY name ASC',
                [queryId, owner_id]
            );
        }

        res.json({
            folder,
            children: {
                folders: subfolders.rows,
                files: files.rows
            }
        });

    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

// Rename/Move Folder (Update)
export const updateFolder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, parent_id } = req.body;
        const owner_id = req.user?.id;

        const folder = await pool.query('SELECT * FROM folders WHERE id = $1 AND owner_id = $2', [id, owner_id]);

        if (folder.rows.length === 0) {
            res.status(404).json({ msg: 'Folder not found' });
            return;
        }

        const updateQuery = `
            UPDATE folders 
            SET name = COALESCE($1, name), 
                parent_id = COALESCE($2, parent_id),
                updated_at = now()
            WHERE id = $3 AND owner_id = $4
            RETURNING *
        `;

        const updatedFolder = await pool.query(updateQuery, [name, parent_id, id, owner_id]);

        res.json(updatedFolder.rows[0]);

    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

// Delete Folder (Soft Delete)
export const deleteFolder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const owner_id = req.user?.id;

        // Ideally we should recursively delete or check for children, but for soft delete we just mark the folder.
        // UI should handle hiding children if parent is deleted, or backend logic should cascade.
        // For MVP spec: "Trash with retention...".
        // Let's just soft delete the target folder for now.

        const deletedFolder = await pool.query(
            'UPDATE folders SET is_deleted = true, updated_at = now() WHERE id = $1 AND owner_id = $2 RETURNING *',
            [id, owner_id]
        );

        if (deletedFolder.rows.length === 0) {
            res.status(404).json({ msg: 'Folder not found' });
            return;
        }

        res.json({ msg: 'Folder moved to trash' });

    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}
