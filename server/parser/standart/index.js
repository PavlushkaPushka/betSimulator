const ParamsForParsing = require('./ParamsForParsing')
const puppeteer = require('puppeteer')
const downloadAllElemOnPage = require('./downloadAllInfoOnPage')
const getAllInfoFromMainPage = require('./getAllInfo')
const getCoeff = require('./getCoeff')

const some = new ParamsForParsing()
some.setStartKHL(2018)
some.setEndKHL(2018)
some.setStartNHL(2019)
some.setEndNHL(2019)
some.setNHL(false)


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

        const infoFromMainPage = await getAllInfoFromMainPage(page)

        const infoWithCoeff = await getCoeff(browser, infoFromMainPage)



        // получаем год и делаем ключом в объекте
        let a = links[i].split('/')[5].split('-')


        if (a[0] == 'nhl') result.nhl[a[1] + '-' + a[2]] = infoWithCoeff
        if (a[0] == 'khl') result.khl[a[1] + '-' + a[2]] = infoWithCoeff

        await page.close()

    }

    console.log(result)
    console.log(result.khl['2018-2019'][5])
    console.log(result.khl['2018-2019'][2])
    console.log(result.khl['2018-2019'][7])
    browser.close()
}

parsingData(some)


//сохранить данные в файл
//спарсить периоды (более подробные данные о ходе матча) и кэффы

