const ParamsForParsing = require('./ParamsForParsing')
const puppeteer = require('puppeteer')
const downloadAllElemOnPage = require('./downloadAllInfoOnPage')
const getAllInfoFromMainPage = require('./getAllInfo')
//const getCoeff = require('./getCoeff')
const getInfo = require('./getInfoFromPageAboutMatch')
const savingData = require('./saveData')
const checkData = require('../../parsedData/data/nhl/index')
// D:\myWorks\new\betSimulator\server\parsedData\data\nhl\index.js
// server\parsedData\data\nhl\index.js

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
    
        await downloadAllElemOnPage(page)

        const infoFromMainPage = await getAllInfoFromMainPage(page)

        let currentSeason = links[i].split('/')[5].split('-')

        checkData(infoFromMainPage)



        //чек данных должен быть здесь
        //в соответсвии с проверкой, файлов может быть меньше, либо какие то данные не собраны, то есть мы проверяем наличие сезона, и целостность имеющихся данных

        // try {

        //     let bb = await getInfo(browser, infoFromMainPage)
        //     console.log(bb)

        // } catch (e) {

        //     console.log(e)

        // } finally {

            
        //     savingData(currentSeason, infoFromMainPage)

        // }

        await page.close()

    }

    // result.khl['2018-2019'].map((elem => {
    //     let a = elem.bull
    //     if (a.homeTeamBull !== null || a.awayTeamBull !== null) {
    //         console.log(elem)
    //     }
 
    // }))
    browser.close()
}

parsingData(some)


//сохранить данные в файл
//спарсить периоды (более подробные данные о ходе матча) и кэффы
// сделать сохранение 2
// сделать отслеживатель имеющихся данных 4
// в случае ошибки сохрянять имеющиеся данные 3
// + проверка суһествуөһих данных


// далее переходить к серверу
// запись данных в БД
// апи

// клиент

// вебпак


// сделать сохрание
// экстренное сохранение
// обновление актуальных данных
// вивер, отслеживание
// и переходить далее
// изучитғ 3 д
// сделатғ типа сбор инфы все что надо знатғ длә постоәнного изучениә
// правильный парсинг времени матча в соответствии с моим чаосвым поясом

//ENV

