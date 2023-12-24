/**
 * @author Ștefan Denis
 * @version 4.0.0
 * @since 24.12.2023
 * @description Source File that contains methods to create and validate the TTS.
 * 
 * @project Stefan AI 4 - Motivational Video Package
 */

/**
 * Imports
 */
import { TextToSpeechClient } from '@google-cloud/text-to-speech'
import { fileURLToPath } from 'url'
import { config } from 'dotenv'
import chalk from 'chalk'
import fs from 'fs-extra'
import util from 'util'
import path from 'path'

/**
 * @constant __dirname
 * @description The directory name of the current module.
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url))

config({ path: path.join(__dirname, '../../../storage/config/tts.env') })

export default class TTS {
    /**
     * ? Method to create the TTS using Google Text To Speech API.
     * @param text The text to make into TTS
     * @param filename The name only, without extension
     * @param voice The voice the TTS model shall use
     */
    static async create(text: string, filename: string, voice: string) {
        const client = new TextToSpeechClient()

        const request: object = {
            'audioConfig': {
                'audioEncoding': 'LINEAR16',
                'effectsProfileId': [
                    'small-bluetooth-speaker-class-device'
                ],
                'pitch': -20,
                'speakingRate': 1
            },
            'input': {
                'text': text
            },
            'voice': {
                'languageCode': 'en-US',
                'name': voice
            }
        }

        /**
         * Check if the file exists
         * If it does, delete it
         */
        try {
            fs.existsSync(path.join(__dirname, '../../../storage/temp/audio', `${filename}.mp3`)) ?
                fs.unlinkSync(path.join(__dirname, '../../../storage/temp/audio', `${filename}.mp3`)) :
                null
        } catch (error) {
            console.log(chalk.redBright('❌ ') + chalk.red(error))
        }

        /**
         * Check if the temporary audio directory exists
         * If it doesn't, create it
         */
        try {
            !fs.existsSync(path.join(__dirname, '../../../storage/temp/audio')) ?
                fs.mkdirSync(path.join(__dirname, '../../../storage/temp/audio')) :
                null
        } catch (error) {
            console.log(chalk.redBright('❌ ') + chalk.red(error))
        }

        /**
         * Write mp3 data to file
         */
        const [response] = await client.synthesizeSpeech(request)
        const writeFile = util.promisify(fs.writeFile)
        await writeFile(path.join(__dirname, '../../../storage/temp/audio', `${filename}.mp3`), response.audioContent as string, 'binary')

    }

    static async parseScript(): Promise<Array<string>> {
        const data = fs.readFileSync(path.join(__dirname, '../../../storage/config/videoScript.txt'), 'utf-8')
        return data.split('\n')
    }
}