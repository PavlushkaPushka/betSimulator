const ParamsForParsing = require('../srcParser/ParamsForParsing')
const puppeteer = require('puppeteer')
const { createDataStructure, savingData } = require('../srcParser/saveData')
const downloadAllElemOnPage = require('./../srcParser/downloadAllInfoOnPage')
const getAllInfoFromMainPage = require('./../srcParser/getAllInfo')
const getInfoFuture = require('./future')
const getInfo = require('./getInfoFromPageAboutMatch')
const { checkingData } = require('./check')


async function observ(params, pathToSave, iteration) {

    let linksMassive = []
    let existenceData;

    params._NHL == true ? linksMassive.push('https://www.flashscore.ru.com/hockey/usa/nhl/results/') : null
    params._KHL == true ? linksMassive.push('https://www.flashscore.ru.com/khl/results/') : null

    createDataStructure(pathToSave)

    const browser = await puppeteer.launch({ headless: false })

    for (let i = 0; i <= linksMassive.length - 1; i++) {

        console.log(i)

        const page = await browser.newPage()

        try {

            await page.goto(linksMassive[i], { waitUntil: 'networkidle2' })
            await page.setViewport({ width: 1280, height: 577 })
            await downloadAllElemOnPage(page)

        } catch (e) {

            console.log(e)

            if (e) {

                continue

            }

        }

        const infoAboutCompletedMatches = await getAllInfoFromMainPage(page)

        existenceData = await checkingData(linksMassive[i], infoAboutCompletedMatches, pathToSave)

        if (!existenceData) {

            try {

                await getInfo(browser, infoAboutCompletedMatches, pathToSave, iteration)

            } catch (e) {

                console.log(e)

            }
            finally {

                savingData(linksMassive[i], infoAboutCompletedMatches, pathToSave)

            }

        }

        let linkToSchedule = linksMassive[i].indexOf('khl') !== -1 ? 'https://www.flashscore.ru.com/khl/fixtures/' : linksMassive[i].indexOf('nhl') !== -1 ? 'https://www.flashscore.ru.com/hockey/usa/nhl/fixtures/' : null
        console.log(linkToSchedule)
        try {
            await page.goto(linkToSchedule, { waitUntil: 'networkidle2' })
            await page.setViewport({ width: 1280, height: 577 })
            await downloadAllElemOnPage(page)
        } catch (e) {

            console.log(e)

            if (e) {
                continue
            }
        }

        const infoAboutFutureMatches = await getInfoFuture(page)
        existenceData = await checkingData(linkToSchedule, infoAboutFutureMatches, pathToSave)
        if (infoAboutFutureMatches >= 20) {

            for (let b = 20; b <= infoAboutFutureMatches.length - 1; b++) {
                if (infoAboutFutureMatches[b].moreInfo == null) {
                    infoAboutFutureMatches[b].moreInfo = 'most likely, data yet is not exist'
                }

            }

        }

        if (!existenceData) {
            try {

                await getInfo(browser, infoAboutFutureMatches, pathToSave, iteration)

            } catch (e) {

                console.log(e)

            }
            finally {

                savingData(linkToSchedule, infoAboutFutureMatches, pathToSave)

            }
        }

        await page.close()

    }


    console.log('you are get all data !!!')
    browser.close()

}

module.exports = observ