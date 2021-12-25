class Match {

    constructor (season, id, stage, round, date, homeTeam, awayTeam, link) {

        this._season = season

        this._id = id

        this._stage = stage

        this._round = round

        this._date = date

        this._homeTeam = homeTeam

        this._awayTeam = awayTeam

        this._linkToMatch = link

        this._coeff = null

    }

    setCoeff (coeff) {

        this._coeff = coeff

    }

    get linkToMatch () {

        return this._linkToMatch
        
    }

}

module.exports = Match