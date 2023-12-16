import Main from './out/motivational-videos-module.js'

export async function main() {
    await Main()
}

if (process.argv.includes('--test')) await main()