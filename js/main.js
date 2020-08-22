// Parse local CSV file
Papa.parse("/data/data1.csv", {
    download: true,
	complete: function(results) {
        let currentValues = results.data[results.data.length-1]
        // assign latest values
        document.getElementById("date-span").innerHTML = currentValues[0];
        document.getElementById("active-span").innerHTML = currentValues[1];
        document.getElementById("recovery-span").innerHTML = currentValues[2];
        document.getElementById("death-span").innerHTML = currentValues[3];

        //pie chart
        new Chart(document.getElementById("chartjs-4"), {
            "type": "doughnut",
            "data": {
                "labels": ["Active Cases", "Recoveries", "Deaths"],
                "datasets": [{
                    "label": "Issues",
                    "data": [currentValues[1], currentValues[2], currentValues[3]],
                    "backgroundColor": ["rgb(237,137,54)", "rgb(72,187,120)", "rgb(245,101,101)"]
                }]
            }
        });

        let dataSet = [...results.data];

        let labels = dataSet.map(x => x[0])
        let activeData = dataSet.map(x => x[1])
        let recoveryData = dataSet.map(x => x[2])
        let deathData = dataSet.map(x => x[3])
        let confirmedData = dataSet.map(x => x[4])

        new Chart(document.getElementById("chartjs-7"), {
            "type": "bar",
            "data": {
                "labels": labels,
                "datasets": [{
                    "label": "Active",
                    "data": activeData,
                    "borderColor": "rgb(255, 99, 132)",
                    "backgroundColor": "rgba(255, 99, 132, 0.2)"
                }, {
                    "label": "Recoveries",
                    "data": recoveryData,
                    "type": "line",
                    "fill": false,
                    "borderColor": "rgb(72,187,120)"
                }, {
                    "label": "Deaths",
                    "data": deathData,
                    "type": "line",
                    "fill": false,
                    "borderColor": "rgb(245,101,101)"
                }, {
                    "label": "Confirmed",
                    "data": confirmedData,
                    "type": "line",
                    "fill": false,
                    "borderColor": "rgb(0,0,0)"
                }]
            },
            "options": {
                "scales": {
                    "yAxes": [{
                        "ticks": {
                            "beginAtZero": true
                        }
                    }]
                }
            }
        });

	}
});

Papa.parse("/data/data2.csv", {
    download: true,
	complete: function(results) {
        let dataSet = [...results.data];
        let tBody = document.getElementById("patients-tbody")

        dataSet.shift()
        let tRows = ""
        dataSet.map(x => {
            tRows = tRows + `<tr class="${x[5] == 'Recovered'? 'bg-green-200':''} ${x[5] == 'Died'? 'bg-red-200':''}">
                <td class="truncate border px-4 py-2">${x[0]}</td>
                <td class="truncate border px-4 py-2">${x[1]}</td>
                <td class="truncate border px-4 py-2">${x[2]}</td>
                <td class="truncate border px-4 py-2">${x[3]}</td>
                <td class="truncate border px-4 py-2">${x[4]}</td>
                <td class="truncate border px-4 py-2">${x[5]}</td>
            </tr>`
        });

        tBody.innerHTML = tRows
    }
});