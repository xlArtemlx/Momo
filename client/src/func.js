function BollingerBands(data, period, k) {
    var MA = 0;
    var MD = 0;
    var BollingerBands = {};
    BollingerBands.upper = [];
    BollingerBands.middle = [];
    BollingerBands.lower = [];

    for (var i = 0; i < data.length; i++) {
        if (i < period - 1) {
            MA += data[i];
            BollingerBands.middle.push(null);
            BollingerBands.upper.push(null);
            BollingerBands.lower.push(null);
        } else if (i === period - 1) {
            MA = MA / period;
            for (var j = 0; j < period; j++) {
                MD += Math.pow(data[j] - MA, 2);
            }
            MD = Math.sqrt(MD / period);
            BollingerBands.middle.push(MA);
            BollingerBands.upper.push(MA + k * MD);
            BollingerBands.lower.push(MA - k * MD);
        } else {
            MA = (MA * (period - 1) + data[i]) / period;
            MD = 0;
            for (var j = i - period + 1; j <= i; j++) {
                MD += Math.pow(data[j] - MA, 2);
            }
            MD = Math.sqrt(MD / period);
            BollingerBands.middle.push(MA);
            BollingerBands.upper.push(MA + k * MD);
            BollingerBands.lower.push(MA - k * MD);
        }
    }
    return BollingerBands;
}


// const period = 10; // number of periods for the moving average
// const stdDevs = 2; // number of standard deviations for the upper and lower bands

// // Define variables to hold the moving average, upper band, and lower band
// let ma;
// let upper;
// let lower;
// let buySignal = false;
// let sellSignal = false;

// // Create the Bollinger Bands calculation function
// function bollingerBands(data) {
//     // Calculate the moving average and upper and lower bands
//     ma = data.slice(-period).reduce((a, b) => a + b) / period;
//     const stdDev = Math.sqrt(data.slice(-period).reduce((a, b) => a + Math.pow(b - ma, 2), 0) / period);
//     upper = ma + stdDevs * stdDev;
//     lower = ma - stdDevs * stdDev;
//     console.log(upper, lower)
//     // Check for buy and sell signals
//     if (data[data.length-1] > upper) {
//         buySignal = false;
//         sellSignal = true;
//     } else if (data[data.length-1] < lower) {
//         buySignal = true;
//         sellSignal = false;
//     } else {
//         buySignal = false;
//         sellSignal = false;
//     }
// }