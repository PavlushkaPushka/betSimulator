const ParamsForParsing = require('./ParamsForParsing')
const puppeteer = require('puppeteer')
const downloadAllElemOnPage = require('./downloadAllInfoOnPage')
const getAllInfoFromMainPage = require('./getAllInfo')
const getInfo = require('./getInfoFromPageAboutMatch')
const { savingData, createDataStructure } = require('./saveData')
const checkingData = require('./check')
// const  = require('./saveData')

module.exports = async function parsingData(params, pathToSave) {

    createDataStructure(pathToSave)

    let links = params.getLinks()

    const browser = await puppeteer.launch({ headless: false })

    for (let i = 0; i <= links.length - 1; i++) {

        const page = await browser.newPage()

        console.log(links[i])

        try {

            await page.goto(links[i], { waitUntil: 'networkidle2' })
            await page.setViewport({ width: 1280, height: 577 })
            await downloadAllElemOnPage(page)

        } catch (e) {

            console.log(e)

            if (e) {

                continue

            }

        }

        const infoFromMainPage = await getAllInfoFromMainPage(page)

        let currentSeason = links[i].split('/')[5].split('-')

        const existenceData = await checkingData(currentSeason, infoFromMainPage, pathToSave)

        if (!existenceData) {

            try {

                await getInfo(browser, infoFromMainPage, pathToSave)

            } catch (e) {

                console.log(e)

            } finally {

                savingData(currentSeason, infoFromMainPage, pathToSave)

            }

        }

        await page.close()

    }
    console.log('you are get all data !!!')
    browser.close()
}
