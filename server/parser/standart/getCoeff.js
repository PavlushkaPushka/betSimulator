const puppeteer = require ('puppeteer')
const cheerio = require('cheerio')


async function getCoeff (browser, matches) {

    let matchesFor = []

    let lastMatches = []

    let step = 5

    let remainder = (matches.length - 1) % step

    for (let i = 0; i <= matches.length - 1; i++) {

        matchesFor.push(matches[i])

        if ((i) % step == 0 && remainder !== 0 || i == matches.length - 1) {

            try {

                await Promise.all(matchesFor.map( async (elem) => {
                    const coeff = await getCoeffFromPage(browser, elem.linkToMatch)
                    elem.setCoeff(coeff)
                    lastMatches.push(elem)
                }))

            } catch (error) {

                i = matches.length - 1

                console.log('get Error' + error)

            }

            matchesFor = []

        }

    }

    if (matches.length - 1 !== lastMatches.length - 1) {

        let err = new Error ('WARNING!!! Getting not all information about matches!!')

        console.log(err)

    }

    return lastMatches

}

async function getCoeffFromPage (browser, link) {
    // здесь нужен трай кэч
    const page2 = await browser.newPage()
    await page2.goto(link, { waitUntil: 'networkidle2' })
    await page2.setViewport({ width: 1280, height: 577 })

    const coeff = await page2.evaluate(() => Array.from(document.querySelectorAll('#detail > div.oddsWrapper > div.oddsRow > div > div > *'), element => element.outerHTML));

    const msv = coeff.map((elem) => {

        let $ = cheerio.load(elem)('div').attr('title')

        if ($ !== undefined) {
            let result;
            if($ !== 'Odds removed by bookmaker.') {

                result = [
                
                    Number($.slice(0, 4)),
                    Number($.slice(7, 11))
                ]

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
    //await page2.waitForTimeout(10000)
    await page2.close()

    return {

        homeTeam : msv[1],
        draw : msv[2],
        awayTeam : msv[3],
        link : link,
        // inDetailAboutMatch : inDetailAboutMatch

    }
        
}

module.exports = getCoeff