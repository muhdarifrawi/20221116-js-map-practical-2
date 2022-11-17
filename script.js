function createMap() {
    var map = L.map('map').setView([1.3521, 103.8198], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    return map
}



async function taxiPoints() {
    // axios.get('https://api.data.gov.sg/v1/transport/taxi-availability')
    //     .then(function (response) {
    //         // handle success
    //         console.log(response);
    //     })

    let response = await axios.get('https://api.data.gov.sg/v1/transport/taxi-availability');

    let taxiCoordinates = response.data["features"][0]["geometry"]["coordinates"];
    return taxiCoordinates
}

async function busPoints() {
    let response = await axios.get('https://gist.githubusercontent.com/kunxin-chor/b0a3e50161cd7a53d1bcdc5cc93b11fe/raw/05716c38af2b960d0f34d4db1fef6ce38d42455e/bus-stop.json');

    let busCoordinates = response.data
    return busCoordinates
}

async function plotMap(){
    let map = createMap();

    let taxiCoordinates = await taxiPoints();
    // var taxis = L.layerGroup();
    var taxis = new L.MarkerClusterGroup();
    for(let t of taxiCoordinates){
        console.log(t)
        let taxiLat = t[1];
        let taxiLong = t[0];
        L.marker([taxiLat, taxiLong]).addTo(taxis);
    }

    let busCoordinates = await busPoints();
    var buses = L.layerGroup();
    // console.log(busCoordinates);
    for(let b in busCoordinates){
        
        let busLat = busCoordinates[b][1];
        let busLong = busCoordinates[b][0];
        // console.log(b, busLat, busLong)

        L.circle([busLat, busLong], {
            color: "blue",
            fillColor: "lightblue",
            fillOpacity: 0.5,
            radius:10
        }).addTo(buses)
    }

    taxis.addTo(map);

    // radio buttons option
    // document.querySelector("#plot-1").addEventListener("click", function(){
    //     map.removeLayer(buses);
    //     map.addLayer(taxis);
    // })

    // document.querySelector("#plot-2").addEventListener("click", function(){
    //     map.removeLayer(taxis);
    //     map.addLayer(buses);
    // })

    // checkbox option
    document.querySelector("#plot-1").addEventListener("click", function(){
        if(map.hasLayer(taxis)){
            map.removeLayer(taxis);
        }
        else{
            map.addLayer(taxis);
        }
    })

    document.querySelector("#plot-2").addEventListener("click", function(){
        if(map.hasLayer(buses)){
            map.removeLayer(buses);
        }
        else{
            map.addLayer(buses);
        }
    })
}


plotMap();



