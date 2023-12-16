/**
 * @author Ștefan Denis
 * @version 4.0.0
 * @since 12.12.2023
 * @description Source File that will have the role to make the motivational videos package work.
 * 
 * @project Stefan AI 4 - Motivational Video Package
 */

/**
 * API Import
 */
import StefanAPI from '../../../../api/out/stefanAPI.js'

/**
 * NPM Import
 */
import bodyparser from 'body-parser'
import { fileURLToPath } from 'url'
import express from 'express'
import fs from 'fs-extra'
import path from 'path'

/**
 * __dirname
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Routes
 */

export default async function Main() {
    const app: express.Application = express()

    app.use(express.static(path.join(__dirname, '../ui')))
    app.use(bodyparser.json())

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../ui/index.html'))
    })

    app.get('/videos/list', (req, res) => {
        res.json(fs.readdirSync(path.join(__dirname, '../storage/videos')).filter((element) => element.endsWith('.mp4')))
    })

    app.get('/video/display', function (req: express.Request, res: express.Response) {
        const elementName = req.query.elementName as string
        res.sendFile(path.join(__dirname, `../storage/videos/${elementName}`))
    })

    app.listen(491, () => {
        console.log('Server started on port 491')
        console.log('http://localhost:491')
    })
}
