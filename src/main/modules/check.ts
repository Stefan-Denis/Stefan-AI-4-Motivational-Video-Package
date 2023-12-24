/**
 * @author Ștefan Denis
 * @version 4.0.0
 * @since 22.12.2023
 * @description Source File that contains methods to check if the app can run with no errors..
 * 
 * @project Stefan AI 4 - Motivational Video Package
 */

/**
 * Imports
 */
import { fileURLToPath } from 'url'
import { spawnSync } from 'child_process'
import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'

import TTS from './tts.js'

/**
 * @constant __dirname
 * @description The directory name of the current module.
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * @Class Check
 * @description Class that contains methods to check if the app can start with no errors.
 */
export default class Check {
    /**
     * @method clipsOrder
     * @description Check if the clipsOrder.json file exists.
     */
    static async clipsOrder() {
        !fs.existsSync(path.join(__dirname, '../../../storage/config/clipsOrder.json')) as boolean && (() => {
            console.clear()

            /**
             * @constant clipsOrderSupposedPath
             * @description The path where the clipsOrder.json file is supposed to be.
             */
            const clipsOrderSupposedPath = path.join(__dirname, '../../../storage/config')

            console.log(chalk.redBright('The clipsOrder.json file is missing!'))
            console.log('Here is where to add that file: ' + clipsOrderSupposedPath)
            process.exit(1)
        })()
    }

    /**
     * @method videoFolder
     * @description Check if the videos folder exists.
     */
    static async videoFolder() {
        !fs.existsSync(path.join(__dirname, '../../../storage/videos')) as boolean && (() => {
            console.clear()

            /**
             * @constant clipsOrderSupposedPath
             * @description The path where the clipsOrder.json file is supposed to be.
             */
            const clipsOrderSupposedPath = path.join(__dirname, '../../../storage/videos')

            console.log(chalk.redBright('The videos folder is missing!'))
            console.log('Here is where to add that folder: ' + clipsOrderSupposedPath)
            process.exit(1)
        })()
    }

    /**
     * @method videoFiles
     * @description Check if the video files exists.
     */
    static async videoFiles() {
        /**
         * @constant videos
         * @description The videos array from clipsOrder.json.
         * @type {Array<string>}
         */
        const videos: Array<string> = fs.readJSONSync(path.join(__dirname, '../../../storage/config/clipsOrder.json'))

        /**
         * If no video exists inside the clipsOrder.json file, then exit the process.
         */
        await this.isNoVideo(videos) && (() => {
            console.clear()
            console.log(chalk.redBright('No videos have been added!'))
            process.exit(1)
        })()

        /**
         * Run Checks on Each Video.
         */
        videos.forEach(video => {
            /**
             * Check if it exists where it is supposed to be.
             */
            !fs.existsSync(path.join(__dirname, '../../../storage/videos/' + video)) as boolean && (() => {
                console.clear()

                /**
                 * @constant clipsOrderSupposedPath
                 * @description The path where the clipsOrder.json file is supposed to be.
                 */
                const clipsOrderSupposedPath = path.join(__dirname, '../../../storage/videos/' + video)

                console.log(chalk.redBright('The video file ' + video + ' is missing!'))
                console.log('Here is where to add that file: ' + clipsOrderSupposedPath)
                process.exit(1)
            })()

            /**
             * Check if it has the right extension.
             */
            !video.endsWith('.mp4') && (() => {
                console.clear()

                /**
                 * @constant clipsOrderSupposedPath
                 * @description The path where the clipsOrder.json file is supposed to be.
                 */
                const clipsOrderSupposedPath = path.join(__dirname, '../../../storage/videos/' + video)

                console.log(chalk.redBright('The video file ' + video + ' has the wrong extension!'))
                console.log('Here is where to add that file: ' + clipsOrderSupposedPath)
                process.exit(1)
            })()

            /**
             * Check if the video is 1080x1920.
             */
            this.checkVideoDimensions(video)
        })
    }

    private static async checkVideoDimensions(video: string) {
        /**
         * @constant constructedVideoPath
         * @description The path where the video is at.
         */
        const constructedVideoPath = path.join(__dirname, '../../../storage/videos/' + video)

        /**
         * @constant videoDimensions
         * @description The video dimensions returned from FFprobe.
         */
        const videoDimensions = spawnSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=s=x:p=0', constructedVideoPath]).stdout.toString().trim()

        videoDimensions !== '1080x1920' && (() => {
            console.clear()

            console.log(chalk.redBright('The video file ' + video + ' has the wrong dimensions!'))
            console.log('All clips have to be 1080x1920')
            process.exit(1)
        })()
    }

    /**
     * Checks if the videos array from clipsOrder.json is empty.
     * @param videos The videos array from clipsOrder.json.
     * @returns 
     */
    static async isNoVideo(videos: Array<string>) {
        if (videos.length === 0) {
            return true
        } else {
            return false
        }
    }

    /**
     * @method existsScript
     * @description Check if the script file exists.
     */
    static async existsScript() {
        const scriptLocation = path.join(__dirname, '../../../storage/config/videoScript.txt')

        !fs.existsSync(scriptLocation) && (() => {
            console.clear()

            console.log(chalk.redBright('The script file is missing!'))
            process.exit(1)
        })()
    }

    /**
     * @method existsScriptContent
     * @description Check if the script has content to it.
     */
    static async existsScriptContent() {
        const scriptLocation = path.join(__dirname, '../../../storage/config/videoScript.txt')

        fs.readFileSync(scriptLocation).toString().trim() === '' && (() => {
            console.clear()

            console.log(chalk.redBright('The script file is empty!'))
            process.exit(1)
        })()
    }

    /**
     * @method existsDefaultSubtitle
     * @description Check if the default subtitle file exists.
     */
    static async existsDefaultSubtitle() {
        const defaultSubtitleLocation = path.join(__dirname, '../../../storage/config/defaultSubtitles.ass')

        !fs.existsSync(defaultSubtitleLocation) && (() => {
            console.clear()

            console.log(chalk.redBright('The default subtitle file is missing!'))
            process.exit(1)
        })()

        fs.readFileSync(defaultSubtitleLocation).toString().trim() === '' && (() => {
            console.clear()

            console.log(chalk.redBright('The subtitles file is empty'))
            process.exit(1)
        })
    }

    /**
     * @method videoAndScript
     * @description Checks if the video count is equal to the scripts
     */
    static async videoAndScriptCount() {
        const scripts: Array<string> = await TTS.parseScript()
        const clips = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../storage/config/clipsOrder.json'), 'utf-8'))

        if (scripts.length != clips.length) {
            console.clear()
            console.log('❌ ' + chalk.redBright('The amount of lines inside the script does not match the amount of videos provided!'))
            process.exit(1)
        }
    }
}
