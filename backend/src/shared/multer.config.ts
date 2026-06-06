import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { mkdirSync } from 'fs';

const uploadDir = join(process.cwd(), '..', 'frontend', 'public', 'assets', 'img');

// Ensure the directory exists at startup
try { mkdirSync(uploadDir, { recursive: true }); } catch {}

export const multerConfig = {
  storage: diskStorage({
    destination: (_req: any, _file: any, cb: any) => cb(null, uploadDir),
    filename: (_req: any, file: any, cb: any) => {
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${unique}${extname(file.originalname)}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
};

export const toAssetUrl = (filename: string) => `/assets/img/${filename}`;
