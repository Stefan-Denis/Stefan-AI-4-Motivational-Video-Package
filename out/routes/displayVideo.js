/**
 * __dirname
 */
import { fileURLToPath } from 'url';
import path from 'path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export default function displayVideo(req, res, elementName) {
    res.sendFile(path.join(__dirname, `../../storage/videos/${elementName}`));
}
