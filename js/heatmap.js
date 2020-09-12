let markers = []
let legend = []
let barangays = [{name: "ASINAN", coordinate: [14.828236, 120.283887],recovered:0,active:0,died:0},
{name: "BANICAIN", coordinate: [14.828054, 120.277119],recovered:0,active:0,died:0},
{name: "BARRETTO", coordinate: [14.869928, 120.272827],recovered:0,active:0,died:0},
{name: "EAST BAJAC-BAJAC", coordinate: [14.839815, 120.288996],recovered:0,active:0,died:0},
{name: "GORDON HEIGHTS", coordinate: [14.871727, 120.291141],recovered:0,active:0,died:0},
{name: "KALAKLAN", coordinate: [14.834816, 120.272189],recovered:0,active:0,died:0},
{name: "MABAYUAN", coordinate: [14.848098, 120.281492],recovered:0,active:0,died:0},
{name: "NEW CABALAN", coordinate: [14.850711, 120.329373],recovered:0,active:0,died:0},
{name: "NEW ILALIM", coordinate: [14.834860, 120.279002],recovered:0,active:0,died:0},
{name: "NEW KABABAE", coordinate: [14.831199, 120.277513],recovered:0,active:0,died:0},
{name: "NEW KALALAKE", coordinate: [14.831969, 120.288937],recovered:0,active:0,died:0},
{name: "OLD CABALAN", coordinate: [14.853843, 120.313999],recovered:0,active:0,died:0},
{name: "PAG-ASA", coordinate: [14.827359, 120.286861],recovered:0,active:0,died:0},
{name: "STA. RITA", coordinate: [14.854192, 120.295724],recovered:0,active:0,died:0},
{name: "WEST BAJAC-BAJAC", coordinate: [14.842291, 120.285077],recovered:0,active:0,died:0},
{name: "WEST TAPINAC", coordinate: [14.832594, 120.280120],recovered:0,active:0,died:0},
{name: "NO LOCATION", coordinate: [14.838875, 120.284379],recovered:0,active:0,died:0}]

totalStats = {active:0,recovered:0,died:0}

function loadLegend() {
    console.log('loadData')

    Papa.parse("/data/data2.csv", {
        download: true,
        complete: function (results) {
            let dataSet = [...results.data];
            dataSet.shift()
            dataSet.pop()

            let jsonData = []
            dataSet.map(x => {
                let jsonItem = {};
                jsonItem['name'] = x[0];
                jsonItem['age'] = x[1];
                jsonItem['gender'] = x[2];
                jsonItem['location'] = x[3];
                jsonItem['description'] = x[4]
                jsonItem['status'] = x[5];
                jsonItem['date'] = x[6];

                countStats(jsonItem['location'], jsonItem['status'])

                jsonData.push(jsonItem);
            });

            legend = jsonData;
            initMap();
            initTable();
            console.log(`legend loaded`)
        }
    });
}

initTable = ()=>{
    let tBody = document.getElementById("barangay-tbody")
    let tRows = ""
 
        
    barangays.sort((a, b) => {
        if (a["active"] > b["active"]) {
            return -1;
        } else if (a["active"] < b["active"]) {
            return 1;
        }
        return 0;
    }); 

    cnt = 0;
    barangays.map(barangay => {
        tRows = tRows + `<tr class="${(cnt%2 == 0) ? 'bg-blue-100' : ''}">
            <td class="truncate border px-4 py-2">${barangay.name}</td>
            <td class="truncate border px-4 py-2 ${(barangay.active > 0) ? 'font-bold text-red-500' : 'text-gray-500'} ">${barangay.active}</td>
            <td class="truncate border px-4 py-2 ${(barangay.recovered > 0) ? 'font-bold text-green-500' : 'text-gray-500'} ">${barangay.recovered}</td>
            <td class="truncate border px-4 py-2 ${(barangay.died > 0) ? 'font-bold' : 'text-gray-500'} ">${barangay.died}</td>
        </tr>`
        cnt++;
    });

    tBody.innerHTML = tRows
}

countStats = (location,status)=>{
    barangays.map((barangay)=>{
        if(barangay['name'] == location.toUpperCase()){
            switch (status.toUpperCase()) {
                case "RECOVERED":
                    barangay['recovered']++;
                    totalStats['recovered']++;
                    break;
                case "DIED":
                    barangay['died']++;
                    totalStats['died']++;
                    break;
                default:
                    barangay['active']++;
                    totalStats['active']++;
                    break;
            }
        }else if(barangay['name'] == "NO LOCATION" && !location){
            switch (status.toUpperCase()) {
                case "RECOVERED":
                    barangay['recovered']++;
                    break;
                case "DIED":
                    barangay['died']++;
                    break;
                default:
                    barangay['active']++;
                    break;
            }
        }
    })
}

function initMap() {

    // Map options
    var gapo = { lat: 14.8342996, lng: 120.2783786 };
    var options = {
        zoom: 15,
        center: gapo
    }
    // Initialize map
    var map = new google.maps.Map(document.getElementById('map'), options);
    // Add traffic layer
    var trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);

    // // Define the LatLng coordinates for the polygon's path.
    // var eastTapinac = [
    //     { lat: 14.838116, lng: 120.281433 },
    //     { lat: 14.837649, lng: 120.281969 },
    //     { lat: 14.837265, lng: 120.281390 },
    //     { lat: 14.833957, lng: 120.281090 },
    //     { lat: 14.833148, lng: 120.280736 },
    //     { lat: 14.828718, lng: 120.281957 },
    //     { lat: 14.828865, lng: 120.279895 },
    //     { lat: 14.828450, lng: 120.279809 },
    //     { lat: 14.828937, lng: 120.278221 },
    //     { lat: 14.833148, lng: 120.279916 },
    //     { lat: 14.836280, lng: 120.280259 },
    //     { lat: 14.836270, lng: 120.280688 }
    // ]; 

    // // Construct the polygon.
    // var barangayLayer = new google.maps.Polygon({
    //     paths: eastTapinac,
    //     strokeColor: '#FF0000',
    //     strokeOpacity: 0.8,
    //     strokeWeight: 2,
    //     fillColor: '#FF0000',
    //     fillOpacity: 0.35
    // });
    // barangayLayer.setMap(map);



    let infomarkers = []

    // Loop through markers
    for (var i = 0; i < barangays.length; i++) {
        addMarker(barangays[i], infomarkers);
    }


    function closeAllMarkers() {
        for (var i = 0; i < infomarkers.length; i++) {
            infomarkers[i].close();
        }
    }

    // Add Marker function
    function addMarker(props, infomarkers) {
        var marker = new google.maps.Marker({
            position: { lat: props.coordinate[0], lng: props.coordinate[1] },
            map: map,
            content: props.name
        });

        
        markers.push(marker);

        let barangayIcon = {
            url: 'res/coronavirus.svg',
            anchor: new google.maps.Point(10, 10),
            scaledSize: new google.maps.Size(20, 20),
            size: new google.maps.Size(50, 50),
        }

        // Specify icon
        if((props.active) > 0 || props.name =="NO LOCATION"){

            let scale = (props.active /totalStats.active )*200 > 50 ? 50 : ((props.active /totalStats.active )*200 < 30 ? 30: (props.active /totalStats.active )*200)
            console.log(scale)
            let sickIcon = {
                url: 'res/coronavirus.svg',
                anchor: new google.maps.Point(10, 10),
                scaledSize: new google.maps.Size(scale, scale),
                size: new google.maps.Size(50, 50),
            }
            marker.setIcon(sickIcon);
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }else{
            marker.setIcon(barangayIcon);
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }
        
        var infoWindow = new google.maps.InfoWindow({
            content: `<div class="text-center "><span class='text-xl text-indigo-600'>${props.name}</span></br> Active: <span class='font-bold text-red-600'> ${props.active} </span> </br> Recovered: <span class='font-bold text-green-600'> ${props.recovered} </span> </br> Died: <span class='font-bold text-black-600'> ${props.died} </span></div>`
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

    autocomplete(document.getElementById("locationInput"), barangays, markers);
}

function autocomplete(inp, arr, markers) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/

        let prevEntry = ""
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].name.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/

                if (prevEntry == arr[i].name) {
                    //skip
                    break;
                }

                prevEntry = arr[i].name

                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].name.substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].name.substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i].name + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                let marker = markers[i]
                b.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                    console.log(i);
                    google.maps.event.trigger(marker, 'click')
                });
                a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

