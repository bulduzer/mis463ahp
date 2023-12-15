function generateTable(Data, headerArray, tableLength) {
  if (tableLength > Data.length) {
    tableLength = Data.length;
}

tableLength ++;
    
  if (document.getElementById("myTable") != null && document.getElementById("myTable").innerHTML !== "") {
      document.getElementById("myTable").innerHTML = "";
  }
  // creates a <table> element and a <tbody> element
  const tbl = document.createElement("table");
  tbl.classList.add("content-table");
  // add id to table
  tbl.setAttribute("id", "myTable");
  const tblHead = document.createElement("thead");
  const tblBody = document.createElement("tbody");
  
  // creating all cells
  for (let i = 0; i < tableLength+1; i++) {
    // creates a table row
    const row = document.createElement("tr");

    for (let j = 0; j < 11; j++) {
      const cellD = document.createElement("td");
      let cellH = document.createElement("th");
      let cellText = document.createTextNode("");
      let rowCon = (i!=0 && i!=1);
      if (j==0 && rowCon) {
        cellText = document.createTextNode((i-1).toString());
          
      }
      if (j==1 && rowCon) {
          cellText = document.createElement("img");
          cellText.setAttribute("src", Data[i - 1].image);
          // Set the scale of the image
          cellText.setAttribute("width", "175");
      }
      if (j==2 && rowCon) {
          cellText.textContent = Data[i - 1].name.replace(/[^\x00-\x7F]/g, "");
      }
      if (j==3 && rowCon) {
          cellText.textContent = Data[i - 1].price;
      }
      if (j==4 && rowCon) {
          cellText.textContent = ((Data[i - 1].rating_percentage)/20).toFixed(1);
      }
      if (j==5 && rowCon) {
          cellText.textContent = Data[i - 1].Genre;
      }
      if (j==6 && rowCon) {
        cellText.textContent = Data[i - 1].total_ratings;
    }
      if (j==7 && rowCon) {
          cellText.textContent = Data[i - 1].publisher;
      }
      if (j==8 && rowCon) {
          cellText.textContent = (parseFloat(Data[i - 1].playtime)/60).toFixed(1);
      }
      if (j==9 && rowCon) {
          cellText.textContent = Data[i - 1].release_date;
      }
      if (j==10 && rowCon) {
          cellText.textContent = Data[i - 1].platforms;
      }
      if (i == 0 && j == 1) {
        cellText = document.createTextNode("Select number of entries: ");
        cellD.appendChild(cellText);
        row.appendChild(cellD);
        continue;

    }
    else if (i == 0 && j == 2) {
            let input = document.createElement("input");
          input.setAttribute("type", "number");
          input.setAttribute("id", "inputInt");
          input.setAttribute("min", "1");
          input.setAttribute("max", "50");
          // keep last used value in input
          input.setAttribute("value", tableLength - 1);
          // generate table again when input is changed
          input.addEventListener("change", () => {
              generateTable(Data, headerArray, input.value);
          });

          cellD.appendChild(input);
          row.appendChild(cellD);
        continue;

    }
      if (i == 1) {
          // set the text content to the header
          cellH.textContent = headerArray[j-1];
          row.appendChild(cellH);
          row.classList.add("active-row");
      } else {
          cellD.appendChild(cellText);
          row.appendChild(cellD);
          if (i % 2 === 0) {
            row.classList.add("active-row");
          }
      }
    }

    // add the row to the end of the table body
    if (i==0 || i==1) {
      tblHead.appendChild(row);
    } else {
      tblBody.appendChild(row);
    }
    
  }

  // put the <tbody> in the <table>
  tbl.appendChild(tblHead);
  tbl.appendChild(tblBody);
  
  document.getElementById("myTable").appendChild(tbl);
  // Create a div element to hold the table
  const divContainer = document.createElement("div");
  // add style to the div element 
  divContainer.setAttribute("style", "overflow-y:scroll; height:700px;");
  divContainer.classList.add("table-container");
  divContainer.appendChild(tbl);
  // add the <table> inside the <div> element
  document.getElementById("myTable").
  appendChild(divContainer);
  document.getElementById("tableMessage2").style.display = "block";

}

function removeTable(keepMessage) {
  document.getElementById("myTable").innerHTML = "";
  if (keepMessage == false) {
    document.getElementById("tableMessage2").style.display = "none";
  }  
}