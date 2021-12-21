const cheerio = require('cheerio')
const puppeteer = require('puppeteer')

function some () {
    return 1
}

async function scrapBookmaker (browser, link) {


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
            homeTeam:msv[1],
            draw:msv[2],
            awayTeam:msv[3],
            link:link
        }
   
}






module.exports = scrapBookmaker