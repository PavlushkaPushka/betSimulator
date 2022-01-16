const fs = require('fs')

function savingData (link, data) {

    
    if (link[0] == 'nhl') {
        let nameFile = link[1] + '-' + link[2]
        let path = `../../parsedData/data/nhl/${nameFile}.json`
        writeFile(path, data)
        console.log('data successfully written')
    }

    if (link[0] == 'khl') {
        let nameFile = link[1] + '-' + link[2]
        let path = `../../parsedData/data/khl/${nameFile}.json`
        writeFile(path, data)
        console.log('data successfully written')
    }

}

function writeFile (path, data) {
    fs.writeFile(path, JSON.stringify(data), err => {
        if (err) {
            console.log(err)
        } else {
            console.log('file successfully written')
        }
    })
}

module.exports = savingData