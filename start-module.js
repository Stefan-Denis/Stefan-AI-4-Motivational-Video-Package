import Main from './out/motivational-videos-module.js'
import { spawnSync } from 'child_process'

export async function main() {
    await Main()
}

if (process.argv.includes('--test')) await main()
if (!process.argv.includes('--test')) spawnSync('cmd', ['/c', 'start', 'http://localhost:491'])