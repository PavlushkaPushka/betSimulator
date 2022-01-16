const puppeteer = require ('puppeteer')
const cheerio = require('cheerio')
const download = require('image-downloader')
const fs = require('fs')
const path = require('path')



async function getInfo (browser, matches) {
    //this function is designed to adjust the parsing speed (how many pages are opened at a time. you need just change a variable name's like @step@ )
    let matchesFor = []

    let step = 7

    let remainder = (matches.length - 1) % step

    for (let i = 0; i <= matches.length - 1; i++) {

        matchesFor.push(matches[i])

        if ((i) % step == 0 || remainder !== 0 && i == matches.length - 1) {

            try {

                await Promise.all(matchesFor.map( async (elem) => {
                    const info = await getInfoFromPage(browser, elem.linkToMatch)
                    elem.moreInfo = info
                }))

            } catch (error) {

                i = matches.length - 1

                console.log('getting not all information' + '\n' + error)

            }

            matchesFor = []

        }

    }


}

async function getInfoFromPage (browser, link) {


    // open page with puppeteer
    const page2 = await browser.newPage()
    await page2.goto(link, { waitUntil: 'networkidle2' })
    await page2.setViewport({ width: 1280, height: 577 })

    // get data about coeff from matches' page
    const coeff = await page2.evaluate(() => Array.from(document.querySelectorAll('#detail > div.oddsWrapper > div.oddsRow > div > div > *'), element => element.outerHTML));
    // get info info about course of the Matches 
    const theCourseOfTheMatch = await page2.evaluate(() => Array.from(document.querySelectorAll('.section > *'), element => element.outerHTML));
    // get info about Logo
    const logoType = await getLogo (page2)
    //handling data about course of the match
    const handlerInfoAbotMatch = theCourseOfTheMatch.map((elem) => {

        let $ = cheerio.load(elem)
        let period = $('.section__title > div:nth-child(1)').text()
        let score = $('.section__title > div:nth-child(2)').text()

        let goalsHome = $('.smv__homeParticipant .hockeyGoal-ico').text()
        let goalsAway = $('.smv__awayParticipant .hockeyGoal-ico').text()

        if (period && score !== "") {
            return period + '/' + score
        }

        if (goalsHome !== "") {
            return $('.smv__timeBox').text() + '/' + $('.smv__playerName').text() + '/' + 'home team'
        }

        if (goalsAway !== "") {
            return $('.smv__timeBox').text() + '/' + $('.smv__playerName').text() + '/' + 'away team'
        }

    })
    let infoAboutMatch = handlerInfoAbotMatch.filter(item => item !== undefined)

    // handling data about coeff with cheerio
    const msv = coeff.map((elem) => {

        let $ = cheerio.load(elem)('div').attr('title')

        if ($ !== undefined) {

            let result;

            if($ !== 'Odds removed by bookmaker.') {

                result = $.split((/\[[a-z]\]/))

            } else {
                $ = cheerio.load(elem)('.oddsValueInner').text()

                result = [
                
                    Number($),
                    Number($)
                ]
            }
            
            return result
        
        }

        return 0

    })

    await page2.close()

    return {

        homeTeam : msv[1],
        draw : msv[2],
        awayTeam : msv[3],
        link : link,
        inDetailAboutMatch : infoAboutMatch,
        teamsLogo : logoType

    }
        
}

async function getLogo (page) {
    // get teams names on page
    let homeName = await page.$eval('#detail > div.duelParticipant > div.duelParticipant__home > div.participant__participantNameWrapper > div.participant__participantName.participant__overflow > a', (elem) => elem.text)
    let awayName = await page.$eval('#detail > div.duelParticipant > div.duelParticipant__away > div.participant__participantNameWrapper > div.participant__participantName.participant__overflow > a', (elem) => elem.text)
    // get url for downloading from page
    let urlHome = await page.$eval('#detail > div.duelParticipant > div.duelParticipant__home > div.participant__participantImage > a > img', (img) => img.src)
    let urlAway = await page.$eval('#detail > div.duelParticipant > div.duelParticipant__away > div.participant__participantImage > a > img', (img) => img.src)

    // get teams from dir (which been downloaded)
    const downloadedTeams = await new Promise((resolve, reject) => {
        fs.readdir('D:/myWorks/new/betSimulator/server/parsedData/logo', async (err, files) => {
            if (err) {
                console.log(err);
            } else {
                resolve(files)
            }
        })
    })

    // determine whether the logo is downloaded or not
    let homeIs = false
    let awayIs = false

    

    downloadedTeams.forEach( (elem) => {
        if (elem.indexOf(homeName) !== -1) {
            homeIs = true
        } 
        if (elem.indexOf(awayName) !== -1) {
            awayIs = true
        } 
    })

    // call function for download logo or returns the path
    let homeDest = await downloadLogo(urlHome, homeName, homeIs);
    let awayDest = await downloadLogo(urlAway, awayName, awayIs);
    
    return {
        homeLogo : homeDest,
        awayLogo : awayDest
    }

}

async function downloadLogo (url, teamName, bool) {

    let options = {
        url: url,
        dest: `D:/myWorks/new/betSimulator/server/parsedData/logo/${teamName}.png`,         // will be saved to /path/to/dest/photo
        extractFilename: false
    }

    if (bool == false) {
        download.image(options).catch((err) => console.error(err))
    }

    return options.dest
}



module.exports = getInfo




