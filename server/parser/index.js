const ParamsForParsing = require('./srcParser/ParamsForParsing')
const parsingData = require('./srcParser/parser.js')
const observ = require('./srcObserver/observer')


const some = new ParamsForParsing()
some.setStartKHL(2018)
some.setEndKHL(2018)
some.setStartNHL(2019)
some.setEndNHL(2019)

observ(some, './../parsedData/new', 7)

