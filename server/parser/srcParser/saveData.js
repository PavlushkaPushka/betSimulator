const fs = require('fs')

function savingData(link, data, path) {

    let leage = link[0] == 'superliga' ? 'khl' : link[0] == 'khl' ? 'khl' : link[0] == 'nhl' ? 'nhl' : undefined
    let nameFile = link[1] + '-' + link[2]

    if (leage == undefined && link.indexOf('flashscore') !== -1) {

        leage = link.indexOf('superliga') !== -1 ? 'khl' : link.indexOf('khl') !== -1 ? 'khl' : link.indexOf('nhl') !== -1 ? 'nhl' : undefined

        if (link.indexOf('results') !== -1) nameFile = 'currentSeason'
        if (link.indexOf('fixtures') !== -1) nameFile = 'nextMatches'

    }

    let pathToSave = `${path}/data/${leage}/${nameFile}.json`

    writeFile(pathToSave, data)

}

function writeFile(path, data) {
    fs.writeFile(path, JSON.stringify(data), err => {
        if (err) {
            console.log(err)
        } else {
            console.log('data been successfully saved')
        }
    })
}

function createFolder(path) {

    let folderExist = fs.existsSync(path)

    if (!folderExist) {
        fs.mkdirSync(path, err => {
            if (err) {
                console.log(err)
            }
        })
    } else {
        // console.log('Folders already exist')
    }
}

function createDataStructure(pathToSave) {
    // структуру папок 
    let path = pathToSave

    let folderExist = fs.existsSync(path)

    if (folderExist) {

        createFolder(path + '/logo')
        path = path + '/data'
        createFolder(path)
        createFolder(path + '/nhl')
        createFolder(path + '/khl')

    } else {

        throw new Error('the folder for saving data specified by you is not exist')

    }

}


module.exports = {
    savingData,
    createDataStructure
}