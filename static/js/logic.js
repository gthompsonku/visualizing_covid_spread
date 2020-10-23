

function createMap(cases, deaths) {

    /*
    var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Idery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets-basic",
        accessToken: API_KEY,
        //accessToken: "pk.eyJ1IjoiZ3Rob21wc29ua3UiLCJhIjoiY2s4MXZodXI1MHRzMDNrbzR6MHJyeHp0eiJ9.8NxzweI4xusaeElhL4ka0Q"
    });
*/

// Standard Mapbox maps
    // var darkmap = L.tileLayer(`https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${accessToken}`, {
    //     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Idery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    //     maxZoom: 18,
    //     id: "mapbox.dark",
    //     accessToken: API_KEY,
    //     //accessToken: "pk.eyJ1IjoiZ3Rob21wc29ua3UiLCJhIjoiY2s4MXZodXI1MHRzMDNrbzR6MHJyeHp0eiJ9.8NxzweI4xusaeElhL4ka0Q"
    // });

    // var outdoors = L.tileLayer(`https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${accessToken}`, {
    //     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Idery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    //     maxZoom: 18,
    //     id: "mapbox.outdoors",
    //     accessToken: API_KEY,
    //     //accessToken: "pk.eyJ1IjoiZ3Rob21wc29ua3UiLCJhIjoiY2s4MXZodXI1MHRzMDNrbzR6MHJyeHp0eiJ9.8NxzweI4xusaeElhL4ka0Q"
    // });

    // //custom map created in mapbox studio:
    // var grants = L.tileLayer(`https://api.mapbox.com/styles/v1/{username}/{style_id}/tiles/256/{z}/{x}/{y}?access_token=${accessToken}`, {
    //     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Idery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    //     maxZoom: 18,
    //     username: "gthompsonku",
    //     style_id: "ck8qi3nel08dg1is514wrhx29",
    //     accessToken: API_KEY,
    //     //accessToken: "pk.eyJ1IjoiZ3Rob21wc29ua3UiLCJhIjoiY2s4MXZodXI1MHRzMDNrbzR6MHJyeHp0eiJ9.8NxzweI4xusaeElhL4ka0Q"
    // });

    // var baseMaps = {
    //     "Light Map": grants,
    //     "Dark Map": darkmap,
    //     "Outdoor Map": outdoors,
    // };

// Alternative: Keyless Openstreetmap map
    // Example from: https://leafletjs.com/
    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    // }).addTo(map);

    // var darkmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    //     maxZoom: 18,
    //     id: "mapbox.dark"
    // });

    // var outdoors = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    //     maxZoom: 18,
    //     id: "mapbox.outdoors"
    // });

    var grants = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    var baseMaps = {
        "Light Map": grants
        // "Light Map": grants,
        // "Dark Map": darkmap,
        // "Outdoor Map": outdoors,
    };

// Continue with regular code...

    var overlayMaps = {
        "Confirmed Cases": cases,
        "Deaths": deaths
    };

    var map = L.map("us_div", {
        center: [37.0902, -95.7129],
        zoom: 4,
        layers: [grants, cases]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collaped: false
    }).addTo(map);


    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {
   
    var div = L.DomUtil.create('div', 'info legend');

    grades = [0, 100, 1000, 5001, 10001],
    labels = ['<strong>Number of Cases:</strong>'],
    categories = ['<100','<1,000','<5,000',' <10,000  ', '+10,000'];
   
    for (var i = 0; i < grades.length; i++) {
           var grade = grades[i];
      labels.push(
           '<br><i class="circlepadding" style="width: '+Math.max(8,(7-2.2*markerSize(grade)))+'px;"></i> <i style="background: #8C2A2A; width: '+markerSize(grade)*2+'px; height: '+markerSize(grade)*2+'px; border-radius: 50%; margin-top: '+Math.max(0,(9-markerSize(grade)))+'px;"></i><i class="circlepadding" style="width: '+Math.max(2,(25-2*markerSize(grade)))+'px;"></i> ' + categories[i]);
        };
    div.innerHTML = labels.join('<br>');
    return div;
    };
    legend.addTo(map);

};


function markerSize(cases) {
        if (cases<100)
            return 2;
        else if (cases<1000)
            return 4;
        else if (cases<5000)
            return 11;
        else if (cases<10000)
            return 15;
        else if (cases>10000)
            return 23;
        else
            return 1;
    };



function createMarkers(states) {

    var casesMarker = [];
    var deathsMarker = [];

    states.forEach(function(state) {
      
        casesMarker.push(
            L.circle(state.location, {
                fillOpacity: 0.5,
                weight:0.5,
                color: "#8C2A2A",
                fillColor: "#8C2A2A",
                radius: (markerSize(state.cases))*5000,
        }).bindPopup("<h5>" + state.county + ", " + state.state + "</h5><hr><p>There are <b>" + state.cases + "</b> known cases of people who have or have had COVID-19. Thus far, <b>"+state.deaths+" people have died.</b> Last update: "+state.date+".</p>")
      );

      deathsMarker.push(
        L.circle(state.location, {
            fillOpacity: 0.5,
            weight:0,
            color: "black",
            fillColor: "black",
            radius: (markerSize(state.deaths)),
            }).bindPopup("<h5>" + state.county + ", " + state.state + "</h5><hr><p>There are <b>" + state.cases + "</b> known cases of people who have or have had COVID-19. Thus far, <b>"+state.deaths+" people have died.</b> Last update: "+state.date+".</p>")
        );
    });

    var cases = L.layerGroup(casesMarker);
    var deaths = L.layerGroup(deathsMarker);
    
    createMap(cases,deaths);
};


//convert fips to lat/lng approimxations for markers
function convertLatLng(latestData) {
    
    //link to FIPS lookup table 
    var FipsURL = "lookup_tables/UID_ISO_FIPS_LookUp_Table.csv"
    
    d3.csv(FipsURL).then(function(fipsData){
        fipsData.forEach(function(d) {
            d.FIPS = +d.FIPS;
            d.Lat = +d.Lat;
            d.Long_ = +d.Long_;
        });
        
        latestData.forEach(function(data) {
            var result = fipsData.filter(function(fip){
                return fip.FIPS === data.fips;
            });
            
            Lat = (result[0] !== undefined) ? result[0].Lat : null;
            Lng = (result[0] !== undefined) ? (result[0].Long_) : null;
            data.location=[Lat, Lng];
            
            return latestData;
        });
        createMarkers(latestData);
    });
};

function latestData(data) {
    //Get last date in dataset 
    lastDate = data[(data.length)-1].date

    todaysData = [];

    //filter data to include only the latest information
    data.forEach(d => {
        if (d.date === lastDate)
        todaysData.push(d);
    });

    convertLatLng(todaysData);
};

function getData(url) {
    d3.json(url).then(function(jsonData) {
   
        jsonData.forEach(function(data) {
            data.fips = +data.fips;
            data.cases = +data.cases;
            data.deaths = +data.deaths;
            data.state = data.state;
            data.date = data.date;

            if (data.county === "New York City") {
                data.fips = 36061;
            };
        });

        latestData(jsonData);
    });
};





function markerColor(d) {
    return d > 2000 ? '#bd0026' :
        d > 1000  ? '#8C2A2A' :
        d > 500  ? '#40291C' :
        d > 200   ? '#8C4A32' :
        d > 100   ? '#fac934' :
                '#FFEDA0';
};

usStateURL = "nyt_covid-19_us/us-counties.json";


getData(usStateURL);

