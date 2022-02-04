const fs = require('fs');

async function checkingData(currentSeason, infoFromMainPage, pathToSave) {

    let season;
    let leage;

    if (typeof currentSeason !== 'string') {
        season = currentSeason[1] + '-' + currentSeason[2]
        leage = currentSeason[0] == 'superliga' ? 'khl' : currentSeason[0] == 'khl' ? 'khl' : currentSeason[0] == 'nhl' ? 'nhl' : undefined
    } else {
        season = currentSeason.indexOf('results') !== -1 ? 'currentSeason' : currentSeason.indexOf('fixtures') !== -1 ? 'nextMatches' : undefined
        leage = currentSeason.indexOf('superliga') !== -1 ? 'khl' : currentSeason.indexOf('khl') !== -1 ? 'khl' : currentSeason.indexOf('nhl') !== -1 ? 'nhl' : undefined
    }

    let existenceData = false;


    let path = `${pathToSave}/data/${leage}/`
    let files = await readDir(path)

    files.forEach(async (elem) => {

        if (elem.indexOf(season) !== -1) {

            existenceData = true

        }

    })

    if (existenceData) {

        let pathToFile = path + season + '.json'
        let data = await jsonReader(pathToFile)

        if (infoFromMainPage.length >= data.length) {

            const between = infoFromMainPage.length - data.length

            if (between !== 0) {

                existenceData = false
            }

            for (i = data.length - 1; i !== 0; i--) {

                const bool = data[i].id == infoFromMainPage[i + between].id

                if (bool) {

                    if (data[i].moreInfo !== null) {

                        infoFromMainPage[i + between].moreInfo = data[i].moreInfo

                    }

                }
            }

        }

    }

    return existenceData


}

async function jsonReader(filePath) {

    const data = await new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', async (err, fileData) => {
            if (err) {
                console.log(err)
            } else {
                const object = JSON.parse(fileData)
                resolve(object)
            }
        })

    })

    return data

}

async function readDir(path) {
    const dir = await new Promise((resolve, reject) => {
        fs.readdir(path, async (err, files) => {
            if (err) {
                console.log(err);
            } else {
                resolve(files)
            }
        })
    })

    return dir
}

module.exports = { checkingData, jsonReader }
