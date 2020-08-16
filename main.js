function getData(url, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.send();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            cb(JSON.parse(this.responseText));
        }
    };
}

function getTableHeaders(obj) {
    let tableHeaders = [];

    Object.keys(obj).forEach(function(key) {
        tableHeaders.push(`<td>${key}</td>`);
    });
    
    return `<tr>${tableHeaders}</tr>`;
}

function generatePaginationButtons(next, prev) {
    if (next && prev) {
        return  `<button onclick="writeToDocument('${prev}')">Previous</button>`;
                `<button onclick="writeToDocument('${next}')">Next</button>`;
    } else if (next && !prev) {
        return  `<button onclick="writeToDocument('${next}')">Next</button>`;
    } else if (!next && prev) {
        return  `<button onclick="writeToDocument('${prev}')">Previous</button>` 
    }
}

function writeToDocument(url) {
    let tableRows = [];
    var el = document.getElementById("data");
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

            Object.keys(item).forEach(function(key) {
                let rowData = item[key].toString();
                let truncatedData = rowData.substring(0, 15);
                dataRow.push(`<td>${truncatedData}</td>`);
            })
            tableRows.push(`<tr>${dataRow}</tr>`);
        });

        el.innerHTML = `<table>${tableHeaders}${tableRows}</table>${pagination}`.replace(/,/g, "")
    });
}