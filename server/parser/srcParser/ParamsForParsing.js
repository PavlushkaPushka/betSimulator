
module.exports = class ParamsForParsing {

    constructor() {
        this._observer = true
        this._NHL = true
        this._KHL = true
        this._history = true
        this._startNHL = 2000
        this._endNHL = (() => {

            if (new Date().getMonth() >= 6) {
                return new Date().getFullYear() - 1
            } else {
                return new Date().getFullYear() - 2
            }

        })()
        this._startKHL = 2000
        this._endKHL = this._endNHL
        this._currentYear = new Date().getFullYear()
    }

    get params() {

        return {

            NHL: this._NHL,
            KHL: this._KHL,
            startNHL: this._startNHL,
            endNHL: this._endNHL,
            startKHL: this._startKHL,
            endKHL: this._endKHL,
            currentYear: this._currentYear

        }

    }

    setNHL(bool) {
        this._NHL = bool
    }

    setKHL(bool) {
        this._KHL = bool
    }

    setStartNHL(year) {

        const result = checkYears(year, true, 'NHL', this.params)

        if (typeof result == 'number') {
            this._startNHL = year
        } else {
            console.log(result)
        }

    }

    setStartKHL(year) {

        const result = checkYears(year, true, 'KHL', this.params)

        if (typeof result == 'number') {
            this._startKHL = year
        } else {
            console.log(result)
        }

    }

    setEndNHL(year) {

        const result = checkYears(year, false, 'NHL', this.params)

        if (typeof result == 'number') {
            this._endNHL = year
        } else {
            console.log(result)
        }

    }

    setEndKHL(year) {

        const result = checkYears(year, false, 'KHL', this.params)

        if (typeof result == 'number') {
            this._endKHL = year
        } else {
            console.log(result)
        }

    }

    getLinks() {

        let msvLinks = []

        if (this._history == true) {

            if (this._NHL) {

                let start = this._startNHL
                let end = this._endNHL

                for (start; start <= end; start++) {

                    msvLinks.push(`https://www.flashscore.ru.com/hockey/usa/nhl-${start}-${start + 1}/results/`)

                }

            }

            if (this._KHL) {

                let start = this._startKHL
                let end = this._endKHL

                for (start; start <= end; start++) {
                    if (start <= 2007) {
                        msvLinks.push(`https://www.flashscore.ru.com/hockey/russia/superliga-${start}-${start + 1}/results/`)
                    } else {
                        msvLinks.push(`https://www.flashscore.com/hockey/russia/khl-${start}-${start + 1}/results/`)
                    }


                }

            }
        }

        return msvLinks

    }



}



function checkYears(year, start, leage, params) {

    let result = null

    if (year >= 2000 && year < params.currentYear) {

        if (start == true) {

            if (leage == 'NHL') {

                result = params.endNHL >= year ? year : new Error('this value cant be more than End NHL')

            }

            if (leage == 'KHL') {

                result = params.endNHL >= year ? year : new Error('this value cant be more than End KHL')

            }

        } else {

            if (leage == 'NHL') {

                result = params.startNHL <= year ? year : console.log(new Error('this value cant be less than start NHL'))

            }

            if (leage == 'KHL') {

                result = params.startNHL <= year ? year : new Error('this value cant be more than start KHL')

            }

        }


    } else {
        result = new Error(`the value should be no less than 2000 and more than ${params.currentYear - 1}`)
    }

    return result
}