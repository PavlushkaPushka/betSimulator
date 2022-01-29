const { jsonReader } = require('./srcObserver/check')
const puppeteer = require('puppeteer')






let b = 'wefwef'

console.log(typeof b == 'string')

async function some() {
    const browser = await puppeteer.launch({ headless: false }, erfr)
    console.log(browser)
}

some()
