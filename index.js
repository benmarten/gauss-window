'use strict'

const gauss = [
    0.3989422804014326779399, // 0
    0.2419707245191433497978, // -1, +1
    0.05399096651318805195056, // -2, +1
    0.004431848411938007175602, // ...
    1.338302257648853517741E-4,
    1.486719514734297707908E-6
]

let result = getSmoothedArray([3, 5, 0, 8, 4, 2, 6], 5)
console.log(result)

function getSmoothedArray(array, window = 3, round = false) {
    let result = []
    let oldSum = 0
    let newSum = 0
    for (let i = 0; i < array.length; i++) {
        let start = 0 - (window - 1) / 2
        let newNumber = 0
        for (let j = start; j <= Math.abs(start); j++) {
            newNumber += getInputAtOffset(array, i, j) * gauss[Math.abs(j)]
        }
        oldSum += array[i]
        newSum += newNumber
        result.push(newNumber)
    }

    let corr_factor = oldSum / newSum
    return result.map(item => {
        if (round) {
            return Math.round(item * corr_factor)
        } else {
            return item * corr_factor
        }
    })
}

function getCorrection(window) {
    let start = 0 - (window - 1) / 2
    let result = 0
    for (let j = start; j <= Math.abs(start); j++) {
        result += gauss[Math.abs(j)]
    }
    return result
}

function getInputAtOffset(array, index, offset) {
    let pos = index + offset
    if (pos < 0) {
        return array[0]
    } else if (pos >= array.length) {
        return array[array.length -1]
    } else {
        return array[pos]
    }
}

module.exports = getSmoothedArray