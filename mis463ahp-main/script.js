const rangeInput = document.querySelectorAll(".range-input input"),
priceInput = document.querySelectorAll(".price-input input"),
range = document.querySelector(".slider .progress");
let priceGap = 10;
priceInput.forEach(input =>{
    input.addEventListener("input", e =>{
        let minPrice = parseInt(priceInput[0].value),
        maxPrice = parseInt(priceInput[1].value);
        
        if((maxPrice - minPrice >= priceGap) && maxPrice <= rangeInput[1].max){
            if(e.target.className === "input-min"){
                rangeInput[0].value = minPrice;
                range.style.left = ((minPrice / rangeInput[0].max) * 100) + "%";
            }else{
                rangeInput[1].value = maxPrice;
                range.style.right = 100 - (maxPrice / rangeInput[1].max) * 100 + "%";
            }
        }
    });
});

rangeInput.forEach(input =>{
    input.addEventListener("input", e =>{
        let minVal = parseInt(rangeInput[0].value),
        maxVal = parseInt(rangeInput[1].value);

        if((maxVal - minVal) < priceGap){
            if(e.target.className === "range-min"){
                rangeInput[0].value = maxVal - priceGap
            }else{
                rangeInput[1].value = minVal + priceGap;
            }
        }else{
            priceInput[0].value = minVal;
            priceInput[1].value = maxVal;
            range.style.left = ((minVal / rangeInput[0].max) * 100) + "%";
            range.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
        }
    });
});

getSelectedGenre = () => {
    let result = []
    $("#genre-dropdown").children().filter(function() {
        //class is checked
        return $(this).hasClass("checked");
    }).each(function() {
        //class is checked
        result.push( $(this).text().split("\n")[4].trim())
    })
    return result
}

getSelectedPublisher = () => {
    let result = []
    $("#publisher-dropdown").children().filter(function() {
        //class is checked
        return $(this).hasClass("checked");
    }).each(function() {
        //class is checked
        result.push( $(this).text().split("\n")[4].trim())
    })
    return result
}

getSelectedOS = () => {
    let result = []
    $("#os-dropdown").children().filter(function() {
        //class is checked
        return $(this).hasClass("checked");
    }).each(function() {
        //class is checked
        result.push( $(this).text().split("\n")[4].trim())
    })
    // map the result to string

    // Convert Windows to windows, Mac OS to mac, Linux to linux
    return result.map(x => x.toLowerCase().replace(" ", "").replace("os", ""))
}

getSelectedPrp = () => {
    let result = []
    $("#prp-dropdown").children().filter(function() {
        //class is checked
        return $(this).hasClass("checked");
    }).each(function() {
        //class is checked
        result.push( $(this).text().split("\n")[4].trim())
    })
    // get the first character of the string
    return result.map(x => x[0])
}

getSelectedPurchase = () => {
    let result = []
    $("#purchase-dropdown").children().filter(function() {
        //class is checked
        return $(this).hasClass("checked");
    }).each(function() {
        //class is checked
        result.push( $(this).text().split("\n")[4].trim())
    })
    // Remove the last character of the string
    return result.map(x => x.slice(0, -1))
}


getSliderValues = () => {
    let result = []
    $("input.form-range").each(function() {
        //class is checked
        result.push($(this).val())
    })
    return result
}



getPriceRange = () => {
    let result = []
    $("input.input-min").each(function() {
        //class is checked
        result.push($(this).val())
    })
    $("input.input-max").each(function() {
        //class is checked
        result.push($(this).val())
    })
    return result
}

getCheckBoxValues = () => {
    let result = []
    $("input#cb1").each(function() {
        //class is checked
        result.push($(this).is(":checked"))
    })
    $("input#cb2").each(function() {
        //class is checked
        result.push($(this).is(":checked"))
    })
    return result
}

getDates = () => {
    let result = []
    $("input#date1").each(function() {
        //class is checked
        result.push($(this).val())
    })
    $("input#date2").each(function() {
        //class is checked
        result.push($(this).val())
    })
    return result
}
