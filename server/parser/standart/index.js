const ParamsForParsing = require('./ParamsForParsing')
const puppeteer = require('puppeteer')
const downloadAllElemOnPage = require('./downloadAllInfoOnPage')
const getAllElem = require('./getAllElem')

const some = new ParamsForParsing()
// some.setStartKHL(2019)
// some.setEndKHL(2019)
some.setStartNHL(2019)
some.setEndNHL(2019)
some.setKHL(false)


 async function  parsingData (params) {

    const result = {
        nhl : {},
        khl : {}
    }

    let links = params.getLinks()
    console.log(links)

    const browser = await puppeteer.launch({headless:false})

    for (let i = 0; i <= links.length - 1; i++) {

        const page = await browser.newPage()
    
        await page.goto(links[i], { waitUntil: 'networkidle2' })
    
        await page.setViewport({ width: 1280, height: 577 })
    
        //await downloadAllElemOnPage(page)

        const infoAboutMatches = await getAllElem(page, browser)

        let a = links[i].split('/')[5].split('-')
        console.log(a)

        if (a[0] == 'nhl') result.nhl[a[1] + '-' + a[2]] = infoAboutMatches
        if (a[0] == 'khl') result.khl[a[1] + '-' + a[2]] = infoAboutMatches

        await page.close()

    }

    console.log(result)
    console.log(result.khl)
    browser.close()
}

parsingData(some)


//сохранить данные в файл
//спарсить периоды (более подробные данные о ходе матча) и кэффы

