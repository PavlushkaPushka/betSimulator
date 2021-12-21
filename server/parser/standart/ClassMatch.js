class Match {

    constructor (season, id, stage, round, date, homeTeam, awayTeam, link, coeff) {

        this._season = season
        this._id = id
        this._stage = stage
        this._round = round
        this._date = date
        this._homeTeam = homeTeam
        this._awayTeam = awayTeam
        this._linkToMatch = link
        this._coeff = coeff
    }

}

module.exports = Match