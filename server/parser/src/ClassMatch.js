class Match {

    constructor (season, id, stage, round, date, homeTeam, awayTeam, link) {

        this.season = season

        this.id = id

        this.stage = stage

        this.round = round

        this.date = date

        this.homeTeam = homeTeam

        this.awayTeam = awayTeam

        this.linkToMatch = link

        this.moreInfo = null

    }

    setMoreInfo (info) {

        this.moreInfo = info

    }

    // get id () {
    //     return this.id
    // }

    // get linkToMatch () {

    //     return this.linkToMatch

    // }

}

module.exports = Match