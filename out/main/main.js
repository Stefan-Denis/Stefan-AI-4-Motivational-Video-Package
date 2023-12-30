/**
 * @author Ștefan Denis
 * @version 4.0.0
 * @since 22.12.2023
 * @description Source File that will create the video.
 *
 * @project Stefan AI 4 - Motivational Video Package
 *
 * @legend
 * `?` - Function, a.k.a. Code Blocks that produce an output of any kind in the @method main
 * `*` - Global Variables used throughout the @method main
 */
/**
 * File Imports
 */
import StefanAPI from '../../../../../api/out/stefanAPI.js';
import Subtitles from './modules/subtitles.js';
import Check from './modules/check.js';
import TTS from './modules/tts.js';
/**
 * Node Modules Imports
 */
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import chalk from 'chalk';
import path from 'path';
/**
 * @constant __dirname
 * @description The directory name of the current module.
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const test = false;
const unitToTest = 'addAudio';
class Main {
    static async main() {
        /**
         * ? Write the app title in a nice color
         */
        console.log(chalk.rgb(101, 50, 135)('╭──────────────────────────────────────────╮'));
        console.log(chalk.rgb(101, 50, 135)('│ Stefan AI 4 - Motivational Video Package │'));
        console.log(chalk.rgb(101, 50, 135)('╰──────────────────────────────────────────╯'));
        /**
         * ? Check video details
         */
        await Check.clipsOrder();
        await Check.videoFolder();
        await Check.videoFiles();
        await Check.videoAndScriptCount()
            .then(() => {
            console.log('✅ ' + chalk.greenBright('The Videos and Video Data are good!'));
        });
        /**
         * ? Check script
        */
        await Check.existsScript();
        await Check.existsScriptContent()
            .then(() => {
            console.log('✅ ' + chalk.greenBright('The script respects the format!'));
        });
        /**
         * ? Check Default Subtitle File
         */
        await Check.existsDefaultSubtitle()
            .then(() => {
            console.log('✅ ' + chalk.greenBright('The default subtitle file exists!'));
            process.stdout.write('\n');
        })
            .then(() => {
            console.log('⚠️  ' + chalk.yellowBright('Beware that the app will not check the following:'));
            console.log('⚠️  ' + chalk.yellowBright(' - If the default subtitle file is empty.'));
            console.log('⚠️  ' + chalk.yellowBright(' - If the script is bad or formatted wrong'));
            process.stdout.write('\n');
        });
        /**
         * ? Create TTS File
         * @description Create the TTS file from the script, check the length of the script and the length of the video it will be added to.
         */
        // * Global Variables
        const script = await TTS.parseScript();
        const videos = fs.readJsonSync(path.join(__dirname, '../../storage/config/clipsOrder.json'));
        const clipsOrder = JSON.parse(fs.readFileSync(path.join(__dirname, '../../storage/config/clipsOrder.json'), 'utf-8'));
        const audioLengths = [];
        if ((test && unitToTest == 'tts') || !test) {
            // Sort the videos array based on the clips order
            videos.sort((a, b) => clipsOrder.indexOf(a) - clipsOrder.indexOf(b));
            let areScriptLengthsInOrder = true;
            await Promise.all(script.map(async (line, index) => {
                await TTS.create(line, `audio${index}`, 'en-US-Neural2-J');
                const audioDuration = parseFloat(spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', path.join(__dirname, `../../storage/temp/audio/audio${index}.mp3`)]).stdout.toString());
                const video = videos[index];
                const videoDuration = parseFloat(spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', path.join(__dirname, `../../storage/videos/${video}`)]).stdout.toString());
                // Push the lengths to the lengths array
                audioLengths.push(audioDuration);
                if (audioDuration > videoDuration) {
                    areScriptLengthsInOrder = false;
                    await Main.displayTTSTimingError(audioDuration, videoDuration);
                }
            }));
            const audiosToConcat = fs.readdirSync(path.join(__dirname, '../../storage/temp/audio'));
            audiosToConcat.forEach((audio, index) => {
                audiosToConcat[index] = path.join(__dirname, `../../storage/temp/audio/${audio}`);
            });
            await StefanAPI.Audio.concat(audiosToConcat, path.join(__dirname, '../../storage/temp/output.mp3'));
            fs.emptyDirSync(path.join(__dirname, '../../storage/temp/audio'));
            !areScriptLengthsInOrder ? process.exit(1) : console.log('✅ ' + chalk.greenBright('Created TTS!'));
        }
        /**
         * ? Trim Videos
         */
        if ((test && unitToTest == 'trim') || !test) {
            fs.existsSync(path.join(__dirname, '../../storage/temp/video')) && fs.emptyDirSync(path.join(__dirname, '../../storage/temp/video'));
            await Promise.all(videos.map(async (video, index) => { await StefanAPI.Video.trim(path.join(__dirname, `../../storage/videos/${video}`), path.join(__dirname, `../../storage/temp/video/${video}`), 0, audioLengths[index]); }));
        }
        /**
         * ? Concat Videos
         */
        if ((test && unitToTest == 'concat') || !test) {
            const videosToConcat = [];
            videos.forEach((video, index) => { videosToConcat[index] = path.join(__dirname, `../../storage/temp/video/${video}`); });
            fs.existsSync(path.join(__dirname, '../../storage/temp/output.mp4')) && fs.unlinkSync(path.join(__dirname, '../../storage/temp/output.mp4'));
            await StefanAPI.Video.concat(videosToConcat, path.join(__dirname, '../../storage/temp/output.mp4'), { name: 'crossfade', duration: 250 });
            fs.emptyDirSync(path.join(__dirname, '../../storage/temp/video'));
        }
        /**
         * ? Create Subtitles
         */
        if ((test && unitToTest == 'subtitles') || !test) {
            await Subtitles.create();
            console.log('✅ ' + chalk.greenBright('Created Subtitles!'));
        }
        /**
         * ? Add Subtitles and remove Audio
         */
        if ((test && unitToTest == 'addSubtitles') || !test) {
            await Subtitles.updateSubtitleFile();
            await Subtitles.add();
            console.log('✅ ' + chalk.greenBright('Added Subtitles!'));
        }
        if ((test && unitToTest == 'addAudio') || !test) {
            const index = fs.readdirSync(path.join(__dirname, '../../output-videos')).length;
            await StefanAPI.Video.addAudio(path.join(__dirname, '../../storage/temp/final-noedit.mp4'), path.join(__dirname, '../../storage/temp/output.mp3'), path.join(__dirname, `../../output-videos/output${index}.mp4`));
            console.log('✅ ' + chalk.greenBright('Added Audio!'));
        }
        if ((test && unitToTest == 'finishing touches') || !test) {
            fs.unlinkSync(path.join(__dirname, '../../storage/temp/output.mp4'));
            fs.unlinkSync(path.join(__dirname, '../../storage/temp/output.mp3'));
            fs.unlinkSync(path.join(__dirname, '../../storage/temp/output.ass'));
            fs.unlinkSync(path.join(__dirname, '../../storage/temp/final-noedit.mp4'));
            console.log('\n');
            console.log(chalk.greenBright('Video Creation Finished! Opening the file now.'));
            spawnSync('explorer', [path.join(__dirname, '../../output-videos')]);
        }
    }
    /**
     * Displays the TTS Timing Error, showing the audio duration and the video duration.
     * @param audioDuration
     * @param videoDuration
     */
    static async displayTTSTimingError(audioDuration, videoDuration) {
        console.log('❌ ' + chalk.redBright('Audio Length Error!'));
        console.log('❌ ' + chalk.redBright('The first subtitle is too long for the first video!'));
        console.log('❌ ' + chalk.redBright(`Audio Length: ${audioDuration}`));
        console.log('❌ ' + chalk.redBright(`Video Length: ${videoDuration}`));
    }
}
await Main.main();
