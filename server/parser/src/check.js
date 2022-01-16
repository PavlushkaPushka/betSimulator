const fs = require('fs')
// сделать чекинг, настроить енв, вивер,
async function checkingData (currentSeason, infoFromMainPage) {

    let name = currentSeason[1] + '-' + currentSeason[2]

    if (currentSeason[0] == 'nhl') {
        
        let path = `../../parsedData/data/nhl/${nameFile}.json`
        readdir()
        // let nameFile = link[1] + '-' + link[2]
        // let path = `../../parsedData/data/nhl/${nameFile}.json`
        // writeFile(path, data)
        // console.log('data successfully written')
    }

    if (currentSeason[0] == 'khl') {
        // let nameFile = link[1] + '-' + link[2]
        // let path = `../../parsedData/data/nhl/${nameFile}.json`
        // writeFile(path, data)
        // console.log('data successfully written')
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


function jsonReader (filePath, cb) {
    fs.readFile(filePath, 'utf-8', (err, fileData) => {
        if(err) {
            return cb && cb(err)
        }
        try {
            const object = JSON.parse(fileData)
            return cb && cb (null, object)
        } catch (err) {
            return cb && cb(err)
        }
    })
}

const downloadedTeams = await new Promise((resolve, reject) => {
    fs.readdir('D:/myWorks/new/betSimulator/server/parsedData/logo', async (err, files) => {
        if (err) {
            console.log(err);
        } else {
            resolve(files)
        }
    })
})

// jsonReader('./data.json', (elem) => {
//     console.log(elem)
// })



// const downloadedTeams = await new Promise((resolve, reject) => {
//     fs.readdir('D:/myWorks/new/betSimulator/server/parsedData/logo', async (err, files) => {
//         if (err) {
//             console.log(err);
//         } else {
//             resolve(files)
//         }
//     })

//     fs.readdir('D:/myWorks/new/betSimulator/server/parsedData/logo', async (err, files) => {
//         if (err) {
//             console.log(err);
//         } else {
//             resolve(files)
//         }
//     })
// })

// function readdir (path) {

//     fs.readdir(path, async (err, files) => {
//         if (err) {
//             console.log(err);
//         } else {
//             return files
//         }
//     })

// }

module.exports = checkingData