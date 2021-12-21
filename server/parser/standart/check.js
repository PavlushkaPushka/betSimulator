
async function someFunction () {
    let a = setTimeout(await some, 2000)
    return a
}

function some () {
    return 1
}

let b = someFunction()

console.log(b)