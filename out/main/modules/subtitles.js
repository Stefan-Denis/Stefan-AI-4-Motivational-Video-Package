/**
 * @author Ștefan Denis
 * @version 4.0.0
 * @since 22.12.2023
 * @description Source File that contains the class to create the subtitles
 * @project Stefan AI 4 - Motivational Video Package
 */
/**
 * StefanAPI Import
 */
import StefanAPI from '../../../../../../api/out/stefanAPI.js';
/**
 * Imports
 */
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
/**
 * @constant __dirname
 * @description The directory name of the current module.
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export default class Subtitles {
    static async create() {
        // Audio File
        const audioFile = path.join(__dirname, '../../../storage/temp/output.mp3');
        // Transcript File
        const transcriptFile = path.join(__dirname, '../../../storage/temp/subtitles/transcript.lab');
        const scriptFile = path.join(__dirname, '../../../storage/config/videoScript.txt');
        fs.ensureFileSync(transcriptFile);
        fs.writeFileSync(transcriptFile, fs.readFileSync(scriptFile));
        // Output Subtitles
        const subtitleFile = path.join(__dirname, '../../../storage/temp/output.ass');
        fs.removeSync(subtitleFile);
        await StefanAPI.Subtitles.audioToSubtitles(audioFile, transcriptFile, subtitleFile);
    }
    /**
     * Overwrites the retrieved subtitles file and adds at the top the filtergraphs
     */
    static async updateSubtitleFile() {
        // Paths
        const subtitleFile = path.join(__dirname, '../../../storage/temp/output.ass');
        const defaultSubtitleFile = path.join(__dirname, '../../../storage/config/defaultSubtitles.ass');
        // Get the Subtitles and delete that file
        const subtitles = fs.readFileSync(subtitleFile, 'utf-8');
        fs.removeSync(subtitleFile);
        // Get the Default styles and delete that file
        const filterGraph = fs.readFileSync(defaultSubtitleFile, 'utf-8');
        const constructedSubtitles = `${filterGraph} \n ${subtitles}`;
        fs.ensureFileSync(subtitleFile);
        fs.writeFileSync(subtitleFile, constructedSubtitles);
    }
    static async add() {
        const videoFile = '../../../storage/temp/output.mp4';
        const subtitleFile = '../../../storage/temp/output.ass';
        const outputFile = '../../../storage/temp/final-noedit.mp4';
        const process = spawnSync('ffmpeg', ['-i', videoFile, '-vf', `ass=${subtitleFile}`, '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', '-y', outputFile], { cwd: __dirname });
    }
}
