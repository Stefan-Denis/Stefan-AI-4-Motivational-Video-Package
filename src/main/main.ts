/**
 * @author Ștefan Denis
 * @version 4.0.0
 * @since 22.12.2023
 * @description Source File that will create the video.
 * 
 * @project Stefan AI 4 - Motivational Video Package
 */

/**
 * File Imports
 */
import Check from './modules/check.js'

/**
 * Node Modules Imports
 */
import chalk from 'chalk'

class Main {
    static async main() {
        /**
         * Write the app title
         */
        console.log(chalk.rgb(101, 50, 135)('╭──────────────────────────────────────────╮'))
        console.log(chalk.rgb(101, 50, 135)('│ Stefan AI 4 - Motivational Video Package │'))
        console.log(chalk.rgb(101, 50, 135)('╰──────────────────────────────────────────╯'))

        /**
         * Check video details
         */
        await Check.clipsOrder()
        await Check.videoFolder()
        await Check.videoFiles()
            .then(() => {
                console.log('✅ ' + chalk.greenBright('The Videos and Video Data are good!'))
            })

        /**
         * Check script
        */
        await Check.existsScript()
        await Check.existsScriptContent()
            .then(() => {
                console.log('✅ ' + chalk.greenBright('The script respects the format!'))
            })

        /**
         * Check Default Subtitle File
         */
        await Check.existsDefaultSubtitle()
            .then(() => {
                console.log('✅ ' + chalk.greenBright('The default subtitle file exists!'))
            })
            .then(() => {
                console.log('⚠️  ' + chalk.yellowBright('Beware that the app will not check the following:'))
                console.log('⚠️  ' + chalk.yellowBright(' - If the default subtitle file is empty.'))
                console.log('⚠️  ' + chalk.yellowBright(' - If the script is bad or formatted wrong'))
                process.stdout.write('\n')
            })
    }
}


export { }; await Main.main()