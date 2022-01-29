const ParamsForParsing = require('../srcParser/ParamsForParsing')
const puppeteer = require('puppeteer')
const { createDataStructure, savingData } = require('../srcParser/saveData')
const downloadAllElemOnPage = require('./../srcParser/downloadAllInfoOnPage')
const getAllInfoFromMainPage = require('./../srcParser/getAllInfo')
// const getInfo = require('../srcParser/getInfoFromPageAboutMatch')
// const getInfoAboutFutureMatches = require('./futureMatches')
const getInfoFuture = require('./future')
const getInfo = require('./getInfoFromPageAboutMatch')
const { checkingData } = require('./check')


async function observ(params, pathToSave, iteration) {

    let linksMassive = []
    let existenceData;
    // console.log(linksMassive)
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
        console.log(existenceData)
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


        // console.log(linksMassive[i])
        console.log(infoAboutCompletedMatches[0])


        // check on new page
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
        console.log(existenceData)
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

        // console.log(infoAboutFutureMatches[0])
        console.log(infoAboutFutureMatches.length)
        // console.log(infoAboutFutureMatches[90])



        await page.close()

    }


    console.log('you are get all data !!!')
    browser.close()

}


// observ(params)
// решить проблему со временем 

module.exports = observ