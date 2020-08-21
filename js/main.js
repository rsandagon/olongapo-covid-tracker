// Parse local CSV file
Papa.parse("../data/data1.csv", {
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

Papa.parse("../data/data2.csv", {
    download: true,
	complete: function(results) {
        let dataSet = [...results.data];
        let tBody = document.getElementById("patients-tbody")

        dataSet.shift()
        let tRows = ""
        dataSet.map(x => {
            tRows = tRows + `<tr class="${x[5] == 'Recovered'? 'bg-green-200':''} ${x[5] == 'Deceased'? 'bg-red-200':''}">
                <td class="border px-4 py-2">${x[0]}</td>
                <td class="border px-4 py-2">${x[1]}</td>
                <td class="border px-4 py-2">${x[2]}</td>
                <td class="border px-4 py-2">${x[3]}</td>
                <td class="border px-4 py-2">${x[4]}</td>
                <td class="border px-4 py-2">${x[5]}</td>
            </tr>`
        });

        tBody.innerHTML = tRows
    }
});


let markers = []
let legend = []

function loadLegend() {
    fetch("data/data.json")
        .then(res => res.json())
        .then(data => { 
            legend = data; 
            initMap(); 
        });
}

function initMap() {
    // Map options
    var mmla = { lat: 14.6091, lng: 121.0223 };
    var options = {
        zoom: 11,
        center: mmla
    }
    // Initialize map
    var map = new google.maps.Map(document.getElementById('map'), options);
    // Add traffic layer
    var trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);

    
    let infomarkers = []

    // Loop through markers
    for (var i = 0; i < legend.length; i++) {
        addMarker(legend[i],infomarkers);
    }


    function closeAllMarkers(){
        for (var i=0;i<infomarkers.length;i++) {
            infomarkers[i].close();
        }
    }
    
    // Add Marker function
    function addMarker(props,infomarkers) {
        var marker = new google.maps.Marker({
            position: { lat: props.lat, lng: props.lng },
            map: map,
            content: props.location
        });

        markers.push(marker);

        var goIcon = {
            url: 'res/Gosign.svg',
            anchor: new google.maps.Point(10, 10),
            scaledSize: new google.maps.Size(20, 20),
            size: new google.maps.Size(50, 50)
        }

        var stopIcon = {
            url: 'res/Stopsign.svg',
            anchor: new google.maps.Point(10, 10),
            scaledSize: new google.maps.Size(20, 20),
            size: new google.maps.Size(50, 50)
        }

        
        var recoveredIcon = {
            url: 'res/First_Aid_Green_Cross.svg',
            anchor: new google.maps.Point(10, 10),
            scaledSize: new google.maps.Size(20, 20),
            size: new google.maps.Size(50, 50)
        }

        var deadIcon = {
            url: 'res/Maki-hospital-11.svg',
            anchor: new google.maps.Point(10, 10),
            scaledSize: new google.maps.Size(20, 20),
            size: new google.maps.Size(50, 50)
        }

        
        var sickIcon = {
            url: 'res/Red_Cross_icon.svg',
            anchor: new google.maps.Point(10, 10),
            scaledSize: new google.maps.Size(20, 20),
            size: new google.maps.Size(50, 50)
        }

        // Specify icon
        if (props.type) {
            switch (props.type) {
                case 'EntryExit':
                    marker.setIcon(goIcon);
                    break;
                case 'RoadClosure':
                    marker.setIcon(stopIcon);
                    break;
                case 'Recovered':
                    marker.setIcon(recoveredIcon);
                    break;
                case 'Died':
                    marker.setIcon(deadIcon);
                    break;
                case 'Admitted':
                    marker.setIcon(sickIcon);
                    break;
                default:
                // code block
            }
        }

        // Check content



        if (props.location) {
            var infoWindow = new google.maps.InfoWindow({
                content: `<div class="text-center "><span class='text-xl text-indigo-600'>${props.location}</span></br> <span class='text-center ${props.type == 'Admitted' ?  'text-orange-600' : ''} ${props.type == 'Recovered' ?  'text-green-600' : ''} ${props.type == 'Died' ?  'text-red-600' : ''}'> ${props.type} </br> ${props.description} </span></div>`
            });

            infomarkers.push(infoWindow);

            marker.addListener('click', function () {
                
                closeAllMarkers();

                infoWindow.close();

                infoWindow.open(map, marker);

                map.setZoom(17);
                map.panTo(marker.position);
            });
        }
    }
}