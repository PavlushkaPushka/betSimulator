const cheerio = require('cheerio')


function getLinkToMatch(id) {

    let idForLink = id.split('_')[2]
    return `https://www.flashscore.com/match/${idForLink}/#match-summary`
}

function handlerDataAboutMatch(elem) {

    let b = {
        homeTeam: {
            teamName: elem('.event__participant--home').text(),
        },
        awayTeam: {
            teamName: elem('.event__participant--away').text(),
        }
    }

    return b
}

function getDate(elem, season) {

    let first = season.substr(0, 4)
    let last = season.substr(-4, 4)

    const infoDate = {
        year: null,
        day: elem('.event__time').text().substr(0, 2),
        mounth: Number(elem('.event__time').text().substr(3, 2)) - 1,
        hour: Number(elem('.event__time').text().substr(7, 2)),
        minutes: Number(elem('.event__time').text().substr(10, 2))
    }

    if (Number(infoDate.mounth) < 6) {
        infoDate.year = Number(last)
    } else {
        infoDate.year = Number(first)
    }

    const GrinvichTime = new Date(infoDate.year, infoDate.mounth, infoDate.day, infoDate.hour, infoDate.minutes)

    return {
        infoDate,
        GrinvichTime
    }

}

function handlerData(msv, season) {

    let stage;
    let round;
    let data = [

    ]

    msv.map((elem) => {

        let titleName = cheerio.load(elem)('span.event__title--name').text()
        let roundStatic = cheerio.load(elem)('.event__round--static').text()

        titleName !== '' ? stage = titleName : roundStatic !== '' ? round = roundStatic : 0

        let match = cheerio.load(elem)

        if (match('div').attr('id') !== undefined) {

            const commands = handlerDataAboutMatch(match)
            // console.log('efwefwewfwe')

            let id = match('div').attr('id')

            let date = getDate(match, season)

            let link = getLinkToMatch(id)

            const result = {
                season: season,
                id: id,
                stage: stage,
                round: round,
                date,
                homeTeam: commands.homeTeam,
                awayTeam: commands.awayTeam,
                linkToMatch: link,
                moreInfo: null
            }

            data.push(result)
        }
    })

    return data

}

async function getInfoFuture(page) {

    let season = await page.$eval('.heading__info', elem => elem.innerText)

    const elemsFromMain = await page.evaluate(() => Array.from(document.querySelectorAll('#live-table > div.event.event--fixtures > div > div > *'), element => element.outerHTML));

    return handlerData(elemsFromMain, season)

}


module.exports = getInfoFuture