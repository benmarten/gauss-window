const gauss = [
    0.3989422804014326779399, // 0
    0.2419707245191433497978, // -1, +1
    0.05399096651318805195056, // -2, +1
    0.004431848411938007175602, // ...
    1.338302257648853517741E-4,
    1.486719514734297707908E-6
]

// console.log(getSmoothedArray([3, 5, 0, 8, 4, 2, 6], 5, 2))
// console.log(getSmoothedArrayIgnoringNull(
//     [null, null, null, 3, 5, 0, 8, 4, 2, 6, null, null], 5, 2)
// )
// console.log(getSmoothedArrayMulti([3, 5, 0, 8, 4, 2, 6],10, 5, 1))

export function getSmoothedArrayMulti(
    array: number[],
    iterations: number = 1,
    window: number = 3,
    edge: number = 0,
    round: boolean = false
): number[] {
    let result = array
    for (let i = 0; i < iterations; i++) {
        result = getSmoothedArray(result, window, edge, round)
    }
    return result
}

export function getSmoothedArrayIgnoringNull(
    array: number[], window = 3, edge = 0, round = false
): number[] {
    // Find left non-null edge.
    let i = 0
    for (i; i < array.length; i++) { if (array[i]) break }

    // Find right non-null edge.
    let j = array.length - 1
    for (j; j > 0; j--) { if (array[j]) break }

    const subArray = array.slice(i, j + 1)
    return array.slice(0, i).concat(
        getSmoothedArray(subArray, window, edge, round)
    ).concat(array.slice(j + 1))
}

export function getSmoothedArray(
    array: number[],
    window: number = 3,
    edge: number = 0,
    round: boolean = false
): number[] {
    const result = []; let oldSum = 0; let newSum = 0
    const windowWidth = Math.abs(0 - (window - 1) / 2)

    for (let i = edge; i < array.length - edge; i++) {
        let newNumber = 0
        for (let j = -windowWidth; j <= windowWidth; j++) {
            newNumber += getInputAtOffset(array, i, j) * gauss[Math.abs(j)]
        }
        oldSum += array[i]
        newSum += newNumber
        result.push(newNumber)
    }
    const corrFactor = oldSum / newSum
    const finalResult = []
    for (let i = 0; i < edge; i++) {
        finalResult.push(array[i])
    }
    result.map(item => {
        finalResult.push(
            round ? Math.round(item * corrFactor) : item * corrFactor
        )
    })
    for (let i = array.length - edge; i < array.length; i++) {
        finalResult.push(array[i])
    }
    return finalResult
}

function getInputAtOffset(
    array: number[], index: number, offset: number
): number {
    const pos = index + offset
    if (pos < 0) return array[0]
    else if (pos >= array.length) return array[array.length - 1]
    else return array[pos]
}
