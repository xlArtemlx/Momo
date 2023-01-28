export const bolindger = (data, period) => {
   // Define the parameters for the Bollinger Bands calculation
    const stdDevs = 2; // number of standard deviations for the upper and lower bands

    // Define variables to hold the moving average, upper band, and lower band
    let ma;
    let upper;
    let lower;

    // Create the Bollinger Bands calculation function
    function bollingerBands(data) {
        // Calculate the moving average and upper and lower bands
        ma = data.slice(-period).reduce((a, b) => a + b) / period;
        const stdDev = Math.sqrt(data.slice(-period).reduce((a, b) => a + Math.pow(b - ma, 2), 0) / period);
        upper = ma + stdDevs * stdDev;
        lower = ma - stdDevs * stdDev;

        return {upper, lower}
    }
    return bollingerBands(data)
}