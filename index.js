"use strict";
exports.__esModule = true;
exports.getSmoothedArray = exports.getSmoothedArrayIgnoringNull = exports.getSmoothedArrayMulti = void 0;
var gauss = [
    0.3989422804014326779399,
    0.2419707245191433497978,
    0.05399096651318805195056,
    0.004431848411938007175602,
    1.338302257648853517741E-4,
    1.486719514734297707908E-6
];
// console.log(getSmoothedArray([3, 5, 0, 8, 4, 2, 6], 5, 2))
// console.log(getSmoothedArrayIgnoringNull([null, null, null, 3, 5, 0, 8, 4, 2, 6, null, null], 5, 2))
// console.log(getSmoothedArrayMulti([3, 5, 0, 8, 4, 2, 6],10, 5, 1))
function getSmoothedArrayMulti(array, iterations, window, edge, round) {
    if (iterations === void 0) { iterations = 1; }
    if (window === void 0) { window = 3; }
    if (edge === void 0) { edge = 0; }
    if (round === void 0) { round = false; }
    var result = array;
    for (var i = 0; i < iterations; i++) {
        result = getSmoothedArray(result, window, edge, round);
    }
    return result;
}
exports.getSmoothedArrayMulti = getSmoothedArrayMulti;
function getSmoothedArrayIgnoringNull(array, window, edge, round) {
    if (window === void 0) { window = 3; }
    if (edge === void 0) { edge = 0; }
    if (round === void 0) { round = false; }
    // Find left non-null edge.
    var i = 0;
    for (i; i < array.length; i++) {
        if (array[i])
            break;
    }
    // Find right non-null edge.
    var j = array.length - 1;
    for (j; j > 0; j--) {
        if (array[j])
            break;
    }
    var subArray = array.slice(i, j + 1);
    return array.slice(0, i).concat(getSmoothedArray(subArray, window, edge, round)).concat(array.slice(j + 1));
}
exports.getSmoothedArrayIgnoringNull = getSmoothedArrayIgnoringNull;
function getSmoothedArray(array, window, edge, round) {
    if (window === void 0) { window = 3; }
    if (edge === void 0) { edge = 0; }
    if (round === void 0) { round = false; }
    var result = [];
    var oldSum = 0;
    var newSum = 0;
    var windowWidth = Math.abs(0 - (window - 1) / 2);
    for (var i = edge; i < array.length - edge; i++) {
        var newNumber = 0;
        for (var j = -windowWidth; j <= windowWidth; j++) {
            newNumber += getInputAtOffset(array, i, j) * gauss[Math.abs(j)];
        }
        oldSum += array[i];
        newSum += newNumber;
        result.push(newNumber);
    }
    var corrFactor = oldSum / newSum;
    var finalResult = [];
    for (var i = 0; i < edge; i++) {
        finalResult.push(array[i]);
    }
    result.map(function (item) {
        finalResult.push(round ? Math.round(item * corrFactor) : item * corrFactor);
    });
    for (var i = array.length - edge; i < array.length; i++) {
        finalResult.push(array[i]);
    }
    return finalResult;
}
exports.getSmoothedArray = getSmoothedArray;
function getInputAtOffset(array, index, offset) {
    var pos = index + offset;
    if (pos < 0)
        return array[0];
    else if (pos >= array.length)
        return array[array.length - 1];
    else
        return array[pos];
}
