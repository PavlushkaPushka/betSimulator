const puppeteer = require ('puppeteer')
const cheerio = require('cheerio')
const Match = require('./ClassMatch')
const scrapBookmaker = require('./getCoeffAboutMatch')


function getLinkToMatch (id) {

    let idForLink = id.split('_')[2]
    return `https://www.flashscore.com/match/${idForLink}/#match-summary`
}

function parseDataAboutMatch(elem) {

    function count (obj) {

        return obj.firstP + obj.secondP + obj.thirdP

    }

    function mainGame (object) {

        for (key in object) {
            if (!isNaN(Number(object[key]))) {
                if (object[key] !== null)
                object[key] = Number(object[key])
            }
        }
    }

    let b = {
        homeTeam : {
            teamName : elem('.event__participant--home').text(),
            mainGame : null,
            allGame : elem('.event__score--home').text(),
            firstP : elem('.event__part--home.event__part--1').text(),
            secondP : elem('.event__part--home.event__part--2').text(),
            thirdP : elem('.event__part--home.event__part--3').text(),
            ot : null,
            bull : null
        },
        awayTeam : {
            teamName : elem('.event__participant--away').text(),
            mainGame : null,
            allGame : elem('.event__score--away').text(),
            firstP : elem('.event__part--away.event__part--1').text(),
            secondP : elem('.event__part--away.event__part--2').text(),
            thirdP : elem('.event__part--away.event__part--3').text(),
            ot : null,
            bull : null
        }
    }
    if (elem('.event__part--home.event__part--4').text() !== '') {
        b.homeTeam.ot = elem('.event__part--home.event__part--4').text()
        b.awayTeam.ot = elem('.event__part--away.event__part--4').text()

        if (elem('.event__part--home.event__part--5').text() !== '') {
            b.homeTeam.bull = elem('.event__part--home.event__part--5').text()
            b.awayTeam.bull = elem('.event__part--away.event__part--5').text()
        }
    }

    mainGame (b.homeTeam)
    mainGame (b.awayTeam)

    b.homeTeam.mainGame = count(b.homeTeam)
    b.awayTeam.mainGame = count(b.awayTeam)

    return b
}

function getDate (elem, season) {

    let first = season.substr(0, 4)
    let last = season.substr(-4, 4)

   const infoDate = {
        year: null,
        day : elem('.event__time').text().substr(0, 2),
        mounth : Number(elem('.event__time').text().substr(3, 2)) - 1,
        hour : Number(elem('.event__time').text().substr(7, 2)),
        minutes : Number(elem('.event__time').text().substr(10, 2))
    }

    if (Number(infoDate.mounth) < 6) {
        infoDate.year = Number(last)
    } else {
        infoDate.year = Number(first)
    }

    return new Date(infoDate.year, infoDate.mounth, infoDate.day, infoDate.hour, infoDate.minutes)
    
}

async function parseData (msv, season, browser) {
    let stage;
    let round;
    let data = [

    ]
    

    msv.map((elem)=>{
        let titleName = cheerio.load(elem)('span.event__title--name').text()
        let roundStatic = cheerio.load(elem)('.event__round--static').text()

        titleName !== '' ? stage = titleName : roundStatic !== '' ? round = roundStatic : 0

        let match = cheerio.load(elem)
        if (match('div').attr('id') !== undefined) {
            const commands = parseDataAboutMatch(match)
            if(match('div').attr('id') !== undefined) {
            const commands = parseDataAboutMatch(match)
            let id = match('div').attr('id')
            let date = getDate(match, season)
            let link = getLinkToMatch(id)
    
                
            let coeff = scrapBookmaker(browser, link)
            //console.log(coeff)
           // let coeff = 0

            
            const result = new Match(season, id, stage, round, date, commands.homeTeam, commands.awayTeam, link, coeff)  // link to match, data from mathch
    
            data.push(result)
            }
        }
    })

    // for (let i = 0; i <= msv.length - 1; i++) {
        
    //         let titleName = cheerio.load(msv[i])('span.event__title--name').text()
    //         let roundStatic = cheerio.load(msv[i])('.event__round--static').text()
    
    //         titleName !== '' ? stage = titleName : roundStatic !== '' ? round = roundStatic : 0
    
    //         let match = cheerio.load(msv[i])
    
    //         if(match('div').attr('id') !== undefined) {
    //             const commands = parseDataAboutMatch(match)
    //             let id = match('div').attr('id')
    //             let date = getDate(match, season)
    //             let link = getLinkToMatch(id)
    
                
    //             let coeff = await scrapBookmaker(browser, link)
    //             console.log(coeff)
    
    //             const result = new Match(season, id, stage, round, date, commands.homeTeam, commands.awayTeam, link, coeff)  // link to match, data from mathch
    
    //             data.push(result)
    //         }
    // }


    return data
}

async function getAllElem (page, browser) {

    let name = await page.$eval('.teamHeader__text', elem => elem.innerText)

    const elemsFromMain = await page.evaluate(() => Array.from(document.querySelectorAll('#live-table > div.event.event--results > div > div > *'), element => element.outerHTML));

    //console.log(i)
    return parseData(elemsFromMain, name, browser)

    

}


module.exports = getAllElem