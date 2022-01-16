const puppeteer = require('puppeteer');
const { PendingXHR } = require('pending-xhr-puppeteer');

// here we download all xhr information on page about season

const downloadAllElemOnPage = async function (page) {

    const pendingXHR = new PendingXHR(page)

    let some = page.$('#live-table > .event > .leagues--static > .sportName > .event__more')

    let one = 0

        while (some !== null) {
            
            await page.click('#live-table > .event > .leagues--static > .sportName > .event__more')

            await pendingXHR.waitForAllXhrFinished();

            some = await page.$('#live-table > .event > .leagues--static > .sportName > .event__more')

            one++

        }
    console.log('All XHR elem is download')
}

module.exports = downloadAllElemOnPage