const fs = require('fs');

// считать папку, провести проверку данных, если матч этот уже есть то консолим что данный матч есть
// сделать чекинг, настроить енв, вивер,
async function checkingData(currentSeason, infoFromMainPage, pathToSave) {

    let season = currentSeason[1] + '-' + currentSeason[2]
    let leage = currentSeason[0] == 'superliga' ? 'khl' : currentSeason[0] == 'khl' ? 'khl' : currentSeason[0] == 'nhl' ? 'nhl' : undefined
    let existenceData = false;
    let path = `${pathToSave}/data/${leage}/`
    let files = await readDir(path)

    files.forEach(async (elem) => {

        if (elem.indexOf(season) !== -1) {

            console.log(elem)
            existenceData = true

        }

    })

    if (existenceData) {

        let pathToFile = path + season + '.json'
        let data = await jsonReader(pathToFile)

        if (data.length == infoFromMainPage.length) {

            for (i = 0; i !== data.length - 1; i++) {

                const bool = data[i].id == infoFromMainPage[i].id

                if (bool) {
                    if (data[i].moreInfo !== null) {

                        infoFromMainPage[i].moreInfo = data[i].moreInfo

                    } else {

                        existenceData = false
                    }

                } else {
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

module.exports = checkingData