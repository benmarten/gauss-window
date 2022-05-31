const gauss = [
  0.3989422804014326, // 0
  0.2419707245191433, // -1, +1
  0.0539909665131880, // -2, +1
  0.0044318484119380, // ...
  1.338302257648853E-4,
  1.486719514734297E-6
]

export function getSmoothedArrayMulti(
  array: number[],
  iterations = 1,
  window = 3,
  edge = 0,
  round = false
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
  for (i; i < array.length; i++) if (array[i]) break

  // Find right non-null edge.
  let j = array.length - 1
  for (j; j > 0; j--) if (array[j]) break

  const subArray = array.slice(i, j + 1)
  return array.slice(0, i)
    .concat(getSmoothedArray(subArray, window, edge, round))
    .concat(array.slice(j + 1))
}

export function getSmoothedArray(
  array: number[],
  window = 3,
  edge = 0,
  round = false
): number[] {
  const result: number[] = []; let oldSum = 0; let newSum = 0
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
  const finalResult: number[] = []
  for (let i = 0; i < edge; i++) {
    finalResult.push(array[i])
  }
  for (const item of result) {
    finalResult.push(round ? Math.round(item * corrFactor) : item * corrFactor)
  }
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
