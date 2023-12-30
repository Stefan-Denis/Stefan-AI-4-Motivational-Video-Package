/**
 * Imports
 */
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import path from 'path';
/**
 * __dirname
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export default function getVideo() {
    return fs.readdirSync(path.join(__dirname, '../../storage/videos'));
}
