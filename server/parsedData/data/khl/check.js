// const fs = require('fs')
// async function some() {
//     let a = await jsonReader('./2012-2013.json')
//     console.log(a[0])
// }

// some()


// async function jsonReader(filePath) {
//     // console.log(cb())
//     const data = await new Promise((resolve, reject) => {
//         fs.readFile(filePath, 'utf-8', async (err, fileData) => {
//             if (err) {
//                 console.log(err)
//             } else {
//                 const object = JSON.parse(fileData)
//                 resolve(object)
//             }
//         })

//     })

//     return data

// }

// async function readDir(path) {
//     const dir = await new Promise((resolve, reject) => {
//         fs.readdir(path, async (err, files) => {
//             if (err) {
//                 console.log(err);
//             } else {
//                 resolve(files)
//             }
//         })
//     })

//     return dir
// }

// // module.exports = checkingData

const infoDate = { year: 2022, day: Number('23'), mounth: Number('02') - 1, hour: Number('03'), minutes: Number('00') }
const infoDate2 = { year: 2022, day: Number('23'), mounth: Number('02') - 1, hour: Number('13'), minutes: Number('01') }
// const obj2 = { year: null, day: '23', mounth: 1, hour: 12, minutes: 0 }
console.log(infoDate)
let some = new Date(infoDate2.year, infoDate2.mounth, infoDate2.day, infoDate2.hour, infoDate2.minutes)
let c = some.toLocaleTimeString()
let a = new Date(infoDate.year, infoDate.mounth, infoDate.day, infoDate.hour, infoDate.minutes)
let b = a.toLocaleTimeString()

// я думаю, проще тогда сохранять два значения, спарсенный объект и время
// либо сам объект со временем, т.к. потом, им можно будет манипулировать, и я всегда буду знать точное время по моему часовому поясу

console.log(a)