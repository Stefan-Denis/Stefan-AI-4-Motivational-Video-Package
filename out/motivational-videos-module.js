/**
 * @author Ștefan Denis
 * @version 4.0.0
 * @since 12.12.2023
 * @description Source File that will have the role to make the motivational videos package work.
 *
 * @project Stefan AI 4 - Motivational Video Package
 */
/**
 * NPM Import
 */
import { spawnSync } from 'child_process';
import bodyparser from 'body-parser';
import { fileURLToPath } from 'url';
import express from 'express';
import fs from 'fs-extra';
import path from 'path';
/**
 * __dirname
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export default async function Main() {
    const app = express();
    app.use(express.static(path.join(__dirname, '../ui')));
    app.use(bodyparser.json());
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../ui/index.html'));
    });
    /**
     * ? Videos
     */
    app.get('/videos/list', (req, res) => {
        res.json(fs.readdirSync(path.join(__dirname, '../storage/videos')).filter((element) => element.endsWith('.mp4')));
    });
    app.get('/video/display', function (req, res) {
        res.sendFile(path.join(__dirname, `../storage/videos/${req.query.elementName}`));
    });
    app.post('/videos/setorder', (req, res) => {
        fs.writeFileSync(path.join(__dirname, '../storage/config/clipsOrder.json'), JSON.stringify(req.body, null, 4));
        res.sendStatus(200);
    });
    app.get('/open/fs', (req, res) => {
        spawnSync('explorer', [path.join(__dirname, '../storage/videos')]);
        res.sendStatus(200);
    });
    /**
     * ? Script
     */
    app.get('/script/getScript', (req, res) => {
        res.json(fs.readFileSync(path.join(__dirname, '../storage/config/videoScript.txt'), 'utf-8'));
    });
    app.post('/script/setScript', (req, res) => {
        fs.writeFileSync(path.join(__dirname, '../storage/config/videoScript.txt'), req.body.text);
        res.sendStatus(200);
    });
    /**
     * ? Subtitles
     */
    app.get('/subtitles/getstyle', (req, res) => {
        res.json(fs.readFileSync(path.join(__dirname, '../storage/config/defaultSubtitles.ass'), 'utf-8'));
    });
    app.post('/subtitles/setstyle', (req, res) => {
        fs.writeFileSync(path.join(__dirname, '../storage/config/defaultSubtitles.ass'), req.body.text);
        res.send(200);
    });
    /**
     * ? Start Production
     */
    app.get('/start', (req, res) => {
        const powershell = spawnSync('powershell.exe', ['.\\start.ps1', '--nonIntegratedTerminal'], { cwd: path.join(__dirname, '../cli') });
        res.sendStatus(200);
    });
    /**
     * ? App Listen
     */
    app.listen(491, () => {
        console.log('Server started on port 491');
        console.log('http://localhost:491');
    });
}
