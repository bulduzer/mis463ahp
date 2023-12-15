var genre, publisher, os, prp, purchase, priceArray, dateArray = undefined;
var headerArray = ["","Name", "Price", "Rating", "Genre", "Publisher","Number of Reviews","AVG Playtime (hrs)", "Release Date", "Operating System"];
var sliderValues = [0,0,0,0,0,0];


function transformSliderValues(array) {
    let result = []
    // multiply each element by (-1)
    for (let i = 0; i < array.length; i++) {
        array[i] = array[i] * (-1)
    }
    for (let i = 0; i < array.length; i++) {
        if (array[i] < 0) {
            array[i] = 1/(1 - array[i])
        }
        else if (array[i] >= 0) {
            array[i] = 1 + array[i]
        }
    }
    return array
}

function CreateAhpMatrix(inputArray) {
    // deep copy the input array
    array = inputArray.slice()
    array = transformSliderValues(array)
    ahpMatrix = [
        [1, array[0], array[1], array[2]],
        [1/array[0], 1, array[3], array[4]],
        [1/array[1],1/array[3] , 1, array[5]],
        [1/array[2], 1/array[4],1/array[5] , 1]
    ];
    // Returns a 2D array
    return ahpMatrix;
}

function normalizeColumns(ahpMatrix) {
    // Find the total of each column
    let colTotals = [];
    for (let i = 0; i < ahpMatrix[0].length; i++) {
        colTotals[i] = 0;
        for (let j = 0; j < ahpMatrix.length; j++) {
            colTotals[i] += ahpMatrix[j][i];
        }
    }
    // Create a copy of the AHP matrix
    let resultMatrix = ahpMatrix.slice();

    // Normalize each column by dividing each element by the column total
    for (let i = 0; i < ahpMatrix.length; i++) {
        for (let j = 0; j < ahpMatrix[0].length; j++) {
            resultMatrix[i][j] /= colTotals[j];
        }
    }
    return resultMatrix;
}

function CaltulateRowAverage(ahpMatrix) {
    let rowAverages = [];
    for (let i = 0; i < ahpMatrix.length; i++) {
        rowAverages[i] = 0;
        for (let j = 0; j < ahpMatrix.length; j++) {
            rowAverages[i] += ahpMatrix[i][j];
        }
        rowAverages[i] /= ahpMatrix.length;
    }
    return rowAverages;
}

function CalculateConsistencyRatio(ahpMatrix, rowAverages) {
    // Matrix multiplication of the AHP matrix and the row averages
    let ax = [];
    for (let i = 0; i < ahpMatrix.length; i++) {
        ax[i] = 0;
        for (let j = 0; j < ahpMatrix.length; j++) {
            ax[i] += ahpMatrix[i][j] * rowAverages[j];
        }
    }
    // The lambda max is ax/rowAverages summed and divided by the number of rows
    let lambdaMax = 0;
    for (let i = 0; i < ahpMatrix.length; i++) {
        lambdaMax += ax[i] / rowAverages[i];
    }
    lambdaMax /= ahpMatrix.length;
    // The consistency Index is the lambda max divided by the number of rows
    let CI = (lambdaMax - ahpMatrix.length) / (ahpMatrix.length - 1);
    // The consistency ratio is the consistency index divided by the random index
    // The random index is 0.90 for 4 rows
    let CR = CI / 0.90;
    return CR;
}

function CalculateAhp(inputArray) {
    let ahpMatrix = CreateAhpMatrix(inputArray);
    console.log("Input Array: ", inputArray)
    console.log( "AHP Matrix: ", ahpMatrix)
    normalizedAhpMatrix = normalizeColumns(ahpMatrix);
    console.log("Normalized AHP Matrix: ", normalizedAhpMatrix)
    ahpMatrix = CreateAhpMatrix(inputArray);
    console.log("AHP Matrix: ", normalizedAhpMatrix);
    let rowAverages = CaltulateRowAverage(normalizedAhpMatrix);
    let CR = CalculateConsistencyRatio(ahpMatrix, rowAverages);
    if (CR >= 0.1) {
        document.getElementById("tableMessage").innerHTML = "The AHP matrix is not consistent. The CR is %" + (CR*100).toFixed(2) + ", please adjust AHP range slider to make your comparisons consistent.";
        // style the tableMessage
        document.getElementById("tableMessage").style.color = "#F92F60";
        removeTable(keepMessage = false);
        return;
    }
    else {
        document.getElementById("tableMessage").innerHTML = "The AHP matrix is consistent. The CR is %" + (CR*100).toFixed(2) + ". ";
        // style the tableMessage
        document.getElementById("tableMessage").style.color = "#00D26A";
    }
    return rowAverages;
}

// This function reads the steammaster.csv file as list of objects from https://github.com/MuratCaganGogebakan/mis463ahp/blob/main/data/steammaster.csv
async function ReadSteamMaster() {
    const response = await fetch('https://raw.githubusercontent.com/MuratCaganGogebakan/mis463ahp/main/data/steammaster.csv');
    const text = await response.text();
    lines = text.split('\n');
    let headers = lines[0].split(',');
    let data = [];
    for (let i = 1; i < lines.length; i++) {
        let obj = {};
        let currentline = lines[i].split(',');
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }
        data.push(obj);
    }
    return data;
}

function FilterGenre(Data, genre) {
    if (genre .length===0) {
        return Data;
    }
    // Filter the data set
    let filteredData = Data.filter(el => {
        // Check if the Genre property is defined
        if (el.Genre) {
            // Check if the Genre property contains at least one of the genres in the input array
            for (let i = 0; i < genre.length; i++) {
                if (el.Genre.includes(genre[i])) {
                    return true;
                }
            }
        }
        return false;
    });
    return filteredData;
}


function FilterPublisher(Data, publisher) {
    if (publisher .length===0) {
        return Data;
    }
    // Filter the data set
    let filteredData = Data.filter(el => {
        // Check if the Publisher property is defined
        if (el.publisher) {
            // Check if the Publisher property contains at least one of the publishers in the input array
            for (let i = 0; i < publisher.length; i++) {
                if (el.publisher.includes(publisher[i])) {
                    return true;
                }
            }
        }
        return false;
    });
    return filteredData;
}

function FilterOS(Data, os) {
    if (os .length===0) {
        return Data;
    }
    // map OS names to the ones in the data set
    console.log("OS: ", os)
    // Filter the data set
    let filteredData = Data.filter(el => {
        // Check if the OS property is defined
        if (el.platforms) {
            // Check if the OS property contains at least one of the OS in the input array
            for (let i = 0; i < os.length; i++) {
                if (el.platforms.includes(os[i])) {
                    return true;
                }
            }
        }
        return false;
    });
    return filteredData;
}

function FilterPrP(Data, prp) {
    if (prp .length===0) {
        return Data;
    }
    prp = prp * 20;
    // Filter the data set
    let filteredData = Data.filter(el => {
        // Check if the Price property is defined
        if (el.rating_percentage && el.rating_percentage >= prp) {
            return true;
        } else {
            return false;
        }
    });
    return filteredData;
}

function FilterPurcahse(Data, purchase) {
    if (purchase .length===0) {
        return Data;
    }
    //Convert the purchase to a string and remove spaces from it
    purchase = purchase.toString().replace(/\s/g, '');
    // convert the purchase string to a float
    purchase = parseFloat(purchase);
    // Filter the data set also convert el.min_owners to float
    let filteredData = Data.filter(el => {
        // Check if the Price property is defined
        if (el.min_owners && parseFloat(el.min_owners) >= purchase) {
            return true;
        } else {
            return false;
        }
    });
    return filteredData;
} 

function FilterPriceRange(Data, priceArray) {
    if (priceArray .length===0) {
        return Data;
    }
    // Filter the data set
    let filteredData = Data.filter(el => {
        // Check if the Price property is defined
        if (!el.price) return false;
        // Convert the price string to a float
        const price = parseFloat(el.price);
        // Check if the Price property is defined
        if (price >= priceArray[0] && price <= priceArray[1]) {
            return true;
        } else {
            return false;
        }
    });
    return filteredData;
}

function FilterDates(Data, dateArray) {
    if (dateArray[0] === "" || dateArray[1] === "") {
        return Data;
    }
    // Convert dateArray to date objects
    dateArray[0] = new Date(dateArray[0]);
    dateArray[1] = new Date(dateArray[1]);
    // Convert el.release_date to date object
    Data.forEach(el => {
        if (el.release_date) {
            el.release_date = new Date(el.release_date);
        }
    });
    
    // Filter the data set taking date as an integer
    let filteredData = Data.filter(el => {
        // Check if the date property is defined
        if (!el.release_date) return false;
        // Check if the date property is defined
        if (el.release_date >= dateArray[0] && el.release_date <= dateArray[1]) {
            return true;
        } else {
            return false;
        }
    });
    // Drop time from date
    filteredData.forEach(el => {
        if (el.release_date) {
            el.release_date = el.release_date.toISOString().split('T')[0];
        }
    });
    return filteredData;
}

function FilterCheckboxes(Data, checkboxes) {
    // Filter English Support
    if (checkboxes[0]) {
        let filteredData = Data.filter(el => {
            if (el.english == 1.0) {
                return true;
            } else {
                return false;
            }
        });
        Data = filteredData;
    }
    // Filter Multiplayer
    if (checkboxes[1]) {
        let filteredData = Data.filter(el => {
            if (el.Genre && el.Genre.includes("Multiplayer")) {
                return true;
            } else {
                return false;
            }
        });
        Data = filteredData;
    }
    return Data;
}



async function FilterData(genre, publisher, os, prp, purchase, priceArray, dateArray) {
    steamMasterData = await ReadSteamMaster();
    steamMasterData = FilterGenre(steamMasterData, genre);
    steamMasterData = FilterPublisher(steamMasterData, publisher);
    steamMasterData = FilterOS(steamMasterData, os);
    steamMasterData = FilterPrP(steamMasterData, prp);
    steamMasterData = FilterPurcahse(steamMasterData, purchase);
    steamMasterData = FilterPriceRange(steamMasterData, priceArray);
    steamMasterData = FilterDates(steamMasterData, dateArray);
    steamMasterData = FilterCheckboxes(steamMasterData, checkBoxes);
    return steamMasterData;
}

function CreateGameMatrix(Data) {
    // Create a game matrix
    let gameMatrix = [];
    Data.forEach(el => {
        let game = [];
        game.push(el.price);
        game.push(el.total_ratings);
        game.push(el.playtime);
        game.push(el.rating_percentage);
        gameMatrix = [...gameMatrix, game];
    });
    // Convert the game matrix to a matrix of floats
    gameMatrix = gameMatrix.map(el => el.map(el => parseFloat(el)));
    // Convert price to a 300-price
    gameMatrix = gameMatrix.map(el => [300 - el[0], ...el.slice(1)]);
    // Normalize the columns of game matrix
    gameMatrix = normalizeColumns(gameMatrix);
    // Add the the Data object as the first column of the game matrix
    gameMatrix = gameMatrix.map((el, i) => [Data[i], ...el]);
    return gameMatrix;
}

function multiplyMatrixVector(matrix, vector) {
    if (matrix[0].length !== vector.length) {
      throw new Error("Matrix and vector are not compatible for multiplication.");
    }
  
    const result = new Array(matrix.length);
  
    for (let i = 0; i < matrix.length; i++) {
      result[i] = 0;
  
      for (let j = 0; j < vector.length; j++) {
        result[i] += matrix[i][j] * vector[j];
      }
    }
  
    return result;
  }
  
  

function multiplyGameandAHP(gameMatrix, priorityVector) {
    // store the first column of game matrix
    let firstColumn = gameMatrix.map(el => el[0]);
    // remove the first column of game matrix
    gameMatrix = gameMatrix.map(el => el.slice(1));
    // Check if the game matrix and ahp matrix are compatible
    if (gameMatrix[0].length != priorityVector.length) {
        console.log("The game matrix and ahp matrix are not compatible");
        return;
    }
    // matrix multiplication
    let result = multiplyMatrixVector(gameMatrix, priorityVector);
    // Add the first column back to the result
    result = result.map((el, i) => [firstColumn[i], el]);
    // Sort the result in descending order of the second column
    result.sort((a, b) => b[1] - a[1]);
    return result;
}
    

main = async () => {
    genre = getSelectedGenre();
    publisher = getSelectedPublisher();
    os = getSelectedOS();
    prp = getSelectedPrp();
    purchase = getSelectedPurchase();
    priceArray = getPriceRange();
    dateArray = getDates();
    checkBoxes = getCheckBoxValues();
    steamMasterData = await FilterData(genre, publisher, os, prp, purchase, priceArray, dateArray, checkBoxes);
    console.log(genre, publisher, os, prp, purchase, priceArray, dateArray, checkBoxes); 
    sliderValues = getSliderValues();
    // Calculate the priority vector
    let priorityVector = CalculateAhp(sliderValues);
    if (priorityVector === undefined) {
        return;
    }
    if (steamMasterData.length != 0) {
        // Set the text of GameFound html element
        document.getElementById("tableMessage2").innerHTML = `${steamMasterData.length} games listed below in order.`;
        // Set the color of GameFound html element #00D26A (green)
        document.getElementById("tableMessage2").style.color = "#00D26A";
    }
    if (steamMasterData.length === 0) {
        // set the text of GameFound html element
        document.getElementById("tableMessage2").innerHTML = `We couldn't find any games. Please change your filter preferences.`;
        // Set the color of GameFound html element #F92F60 (red)
        document.getElementById("tableMessage2").style.color = "#F92F60";
        removeTable(keepMessage = true);
        return;
    }
    gameMatrix = CreateGameMatrix(steamMasterData);
    // multiply the game matrix and the priority vector
    let result = multiplyGameandAHP(gameMatrix, priorityVector);
    // Drop the second column of the result
    result = result.map(el => el[0]);
    console.log("priorityVector: ", priorityVector)
    console.log(result)
    generateTable(result, headerArray, 50);

}



