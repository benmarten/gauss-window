'use strict'

const gauss = [
    0.3989422804014326779399, // 0
    0.2419707245191433497978, // -1, +1
    0.05399096651318805195056, // -2, +1
    0.004431848411938007175602, // ...
    1.338302257648853517741E-4,
    1.486719514734297707908E-6
]

// console.log(getSmoothedArray([3, 5, 0, 8, 4, 2, 6], 5, 2))
// console.log(getSmoothedArrayIgnoringNull([null, null, null, 3, 5, 0, 8, 4, 2, 6, null, null], 5, 2))

function getSmoothedArrayIgnoringNull(array, window = 3, edge = 0, round = false) {
    let result = []

    // Find left non-null edge.
    for (var i = 0; i < array.length; i++) {
        if (array[i]) break;
    }
    // Find right non-null edge.
    for (var j = array.length -1; j > 0; j--) {
        if (array[j]) break;
    }

    let subArray = array.slice(i, j + 1)

    return array.slice(0, i).concat(getSmoothedArray(subArray, window, edge, round)).concat(array.slice(j + 1))
}

function getSmoothedArray(array, window = 3, edge = 0, round = false) {
    let result = []; let oldSum = 0; let newSum = 0
    let windowWidth = Math.abs(0 - (window - 1) / 2)

    for (let i = edge; i < array.length - edge; i++) {
        let newNumber = 0
        for (let j = -windowWidth; j <= windowWidth; j++) {
            newNumber += getInputAtOffset(array, i, j, edge) * gauss[Math.abs(j)]
        }
        oldSum += array[i]
        newSum += newNumber
        result.push(newNumber)
    }

    let corr_factor = oldSum / newSum
    let final_result = []
    for (let i = 0; i < edge; i++) {
        final_result.push(array[i])
    }
    result.map(item => {
        final_result.push(round ? Math.round(item * corr_factor) : item * corr_factor)
    })
    for (let i = array.length - edge; i < array.length; i++) {
        final_result.push(array[i])
    }
    return final_result
}

function getInputAtOffset(array, index, offset) {
    let pos = index + offset
    if (pos < 0) {
        return array[0]
    } else if (pos >= array.length) {
        return array[array.length - 1]
    } else {
        return array[pos]
    }
}

module.exports = {
    getSmoothedArray: getSmoothedArray,
    getSmoothedArrayIgnoringNull: getSmoothedArrayIgnoringNull
}