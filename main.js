function getData(url, cb) {                                                             // Opening a callback fuction to get the data from SW-API
    let xhr = new XMLHttpRequest();                                                     // variable defining the XML request (Exstensible Markup Language) - this is how to get data from a server
    xhr.open("GET", url);                                                               // Creating a request to the API to GET the data from the URL
    xhr.send();                                                                         // Sending the request
    xhr.onreadystatechange = function() {                                               //      This function is telling JS that when the ready state is 4 (done) and the status is 
        if (this.readyState == 4 && this.status == 200) {                               //      200 (okay), to display the data which is the 'response text' from the API
            cb(JSON.parse(this.responseText));                                          // JSON parse is the method of changing the recieved string to a JS Object
        }
    };
}

function getTableHeaders(obj) {
    let tableHeaders = [];                                                              // An empty array ready to store the table headings 

    Object.keys(obj).forEach(function(key) {
        tableHeaders.push(`<td>${key}</td>`);                                           // Pushing the result of each cell into its own cell to be viewed
    });
    
    return `<tr>${tableHeaders}</tr>`;                                                  // the result of the function will be to return the data in a table row
}

function generatePaginationButtons(next, prev) {                                        // this function is generating 'next' and 'previous' buttons to navigate the lists as only 10 are displayed at a time
    if (next && prev) {
        return  `<button onclick="writeToDocument('${prev}')">Previous</button>`;
                `<button onclick="writeToDocument('${next}')">Next</button>`;
    } else if (next && !prev) {
        return  `<button onclick="writeToDocument('${next}')">Next</button>`;           // the front page will not allow you to go back
    } else if (!next && prev) {
        return  `<button onclick="writeToDocument('${prev}')">Previous</button>`        //the last page will not allow you to carry on, only go back
    }
}

function writeToDocument(url) {
    let tableRows = [];
    let el = document.getElementById("data");
    el.innerHTML = "";

    getData(url, function(data) {
        let pagination;
        if (data.next || data.previous) {
            pagination = generatePaginationButtons(data.next, data.previous)
        }
        data = data.results;
        let tableHeaders = getTableHeaders(data[0]);

        data.forEach(function(item) {
            let dataRow = [];

            Object.keys(item).forEach(function(key) {                                       //
                let rowData = item[key].toString();                                         //
                let truncatedData = rowData.substring(0, 15);                               // this code is limiting the cells to 15 characters 
                dataRow.push(`<td>${truncatedData}</td>`);                                  //
            })
            tableRows.push(`<tr>${dataRow}</tr>`);
        });

        el.innerHTML = `<table>${tableHeaders}${tableRows}</table>${pagination}`.replace(/,/g, "")  // This code is putting together the whole HTML page and is why we see what we do
    });                                                                                             // table headers on top, then rows of data underneath followed by the next/prev buttons
}