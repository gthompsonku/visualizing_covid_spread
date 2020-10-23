// Alexis Perumal, 4/4/20
// Use plotly to build a timeseries chart comparing different areas.

// console.log('In logic-timeseries.js');

// US State time series data from NY Times:
//   https://github.com/nytimes/covid-19-data/blob/master/us-states.csv
        // Schema Example:
        // {date: "2020-01-21", state: "Washington", fips: "53", cases: "1", deaths: "0"}
        //     date: "2020-01-21"
        //     state: "Washington"
        //     fips: "53"
        //     cases: "1"
        //     deaths: "0"
// usStatesURL_JSON = "";
usStatesURL_CSV = "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv";
usStatesFlaskRoute = "/states_db/states_data";

// US County data time series data from NY Times:
//   https://github.com/nytimes/covid-19-data/blob/master/us-counties.csv
        // Schema Example:
        // {date: "2020-01-21", county: "Snohomish", state: "Washington", fips: "53061", cases: "1", …}
        //     date: "2020-01-21"
        //     county: "Snohomish"
        //     state: "Washington"
        //     fips: "53061"
        //     cases: "1"
        //     deaths: "0"
usCountiesURL_JSON = "nyt_covid-19_us/us-counties.json";
usCountiesURL_CSV = "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv";

function init() {
    var chart_div_selector = document.getElementById('us_timeseries');

    // Read in the csv into javascript, http://learnjsdata.com/read_data.html
    d3.csv(usStatesURL_CSV).then((data) => {   
        buildStateTimeSeriesChart(chart_div_selector, data);
        buildStateSelectionChart(data);
        // buildStateTimeSeriesRibbonChart(chart_div_selector, data);
        // buildGDPSelectionChart();
        } );
}


function buildStateTimeSeriesChart(selector, dataset) {
    var states = ['New York', 'New Jersey', 'Washington', 'California', 'Michigan']

    let cases_traces = [];
    let deaths_traces = [];
    let state_data = [];
    let trace = {};
    for (i=0; i<states.length; i++) {
        state_data = dataset.filter(record => ((record.state == states[i]) &&
                                    (Date.parse(record.date) >= Date.parse("2020-03-15"))));
        x_values = state_data.map(function(value) { return value.date; });
        y_cases = state_data.map(function(value) { return value.cases; });
        y_deaths = state_data.map(function(value) { return value.deaths; });

        cases_trace = {
            x: x_values,
            y: y_cases,
            name: `${states[i]} Cases`,
            mode: 'lines'
        };
        cases_traces.push(cases_trace);

        deaths_trace = {
            x: x_values,
            y: y_deaths,
            name: `${states[i]} Deaths`,
            mode: 'lines'
        };
        deaths_traces.push(deaths_trace);
    };

    var cases_layout = {
        title: 'COVID-19 Cases by select US States',
        yaxis : {
            // type : 'log',
            // autorange : true,
            title: {text : '# of Cases to Date'}
          }
      };

    Plotly.newPlot("us_timeseries_cases", cases_traces, cases_layout);

    var deaths_layout = {
        title: 'COVID-19 Deaths by select US States',
        yaxis : {
            // type : 'log',
            // autorange : true,
            title: {text : '# of Deaths to Date'}
          }
      };

    Plotly.newPlot("us_timeseries_deaths", deaths_traces, deaths_layout);
}


function buildStateTimeSeriesRibbonChart(selector, dataset) {
    // var states = ['New York', 'New Jersey', 'Washington', 'California', 'Michigan'];
    var states = ['New York'];

    var colorscale = [
        [
            "0", 
            "rgb(217,217,255)"
        ], 
        [
            "0.1", 
            "rgb(217,217,255)"
        ], 
        [
            "0.2", 
            "rgb(217,217,255)"
        ], 
        [
            "0.3", 
            "rgb(217,217,255)"
        ], 
        [
            "0.4", 
            "rgb(217,217,255)"
        ], 
        [
            "0.5", 
            "rgb(217,217,255)"
        ], 
        [
            "0.6", 
            "rgb(217,217,255)"
        ], 
        [
            "0.7", 
            "rgb(217,217,255)"
        ], 
        [
            "0.8", 
            "rgb(217,217,255)"
        ], 
        [
            "0.9", 
            "rgb(217,217,255)"
        ], 
        [
            "1", 
            "rgb(217,217,255)"
        ]
    ];

    console.log('In ribbon chart builder.')

    let cases_traces = [];
    let deaths_traces = [];
    let state_data = [];
    let trace = {};
    for (i=0; i<states.length; i++) {
        state_data = dataset.filter(record => ((record.state == states[i]) &&
                                    (Date.parse(record.date) >= Date.parse("2020-03-15"))));
        // date_values = state_data.map(function(value) { return [value.date, value.date]; });
        // console.log('date_values[0]: ', date_values[0]);
        // cases_values = state_data.map(function(value) { return [value.cases, value.cases]; });
        // console.log('cases_values[0]: ', cases_values[0]);
        // deaths_values = state_data.map(function(value) { return [value.deaths, value.deaths]; });
        // trace_index = Array(state_data.length).fill([3*i+1, 3*i+2]);
        // console.log('trace_index[0]: ', trace_index[0]);

        date_values = state_data.map(function(value) { return [value.date, value.date]; });
        console.log('date_values[0]: ', date_values);
        cases_values = state_data.map(function(value) { return [value.cases, value.cases]; });
        console.log('cases_values[0]: ', cases_values);
        deaths_values = state_data.map(function(value) { return [value.deaths, value.deaths]; });
        state_index = Array(state_data.length).fill([2*i, 2*i+1]);
        console.log('state_index[0]: ', state_index);

        console.log(state_index.length, date_values.length, cases_values.length);

        cases_trace = {
            x: state_index,
            y: date_values,
            z: cases_values,
            // name: `${states[i]} Cases`,
            name: '',
            // colorscale: colorscale,
            // mode: 'lines'
            type: 'surface',
            showscale: false
        };
        cases_traces.push(cases_trace);

        // deaths_trace = {
        //     x: x_values,
        //     y: y_deaths,
        //     name: `${states[i]} Deaths`,
        //     mode: 'lines'
        // };
        // deaths_traces.push(deaths_trace);
    };

    var cases_layout = {
        title: 'COVID-19 Cases by select US States',
        // yaxis : {
        //     // type : 'log',
        //     // autorange : true,
        //     title: {text : '# of Cases to Date'}
        showlegend: false,
        autosize: true,
        // width: 600,
        // height: 600,
        scene: {
            xaxis: {title: 'State'},
            yaxis: {title: 'Date'},
            zaxis: {title: 'Total Cases'}
        }
      };

    console.log("About to call Plotly.newPlot for the ribbon.");
    Plotly.newPlot("us_timeseries_cases", cases_traces, cases_layout);
    console.log("Just called Plotly.newPlot for the ribbon.");

    // var deaths_layout = {
    //     title: 'COVID-19 Deaths by select US States',
    //     yaxis : {
    //         // type : 'log',
    //         // autorange : true,
    //         title: {text : '# of Deaths to Date'}
    //       }
    //   };

    // Plotly.newPlot("us_timeseries_deaths", deaths_traces, deaths_layout);
}

// function optionChanged(newSample) {
//     // Fetch new data each time a new sample is selected
//     buildCharts(newSample);
// }



// Build a selection chart for state data (cases and deaths).
function buildStateSelectionChart(dataset) {

    function unpack(rows, key) {
        return rows.map(function(row) { return row[key]; });
    }

    var allCountryNames = unpack(dataset, 'state'),
        listofCountries = allCountryNames.filter((x, i, a) => a.indexOf(x) === i).sort(),
        allDate = unpack(dataset, 'date'),
        allCases = unpack(dataset, 'cases'),
        allDeaths = unpack(dataset, 'deaths');
    
    function getCountryData(chosenCountry) {
        currentDate = [];
        currentCases = [];
        currentDeaths = [];
        for (var i = 0 ; i < allCountryNames.length ; i++){
            if ( allCountryNames[i] === chosenCountry ) {
                currentDate.push(allDate[i]);
                currentCases.push(allCases[i]);
                currentDeaths.push(allDeaths[i]);
            } 
        }
    };

    // Default Country Data
    setBubblePlot(listofCountries[0]);
    
    function setBubblePlot(chosenCountry) {
        getCountryData(chosenCountry);  

        var trace1 = {
            x: currentDate,
            y: currentCases,
            mode: 'lines+markers',
            marker: {
                size: 12, 
                opacity: 0.5
            },
            name: 'Cases'
        };

        var trace2 = {
            x: currentDate,
            y: currentDeaths,
            mode: 'lines+markers',
            marker: {
                size: 12, 
                opacity: 0.5
            },
            name: 'Deaths',
            // color: 'red'
        };

        var data = [trace1, trace2];

        var layout = {
            title: 'COVID-19 Cases and Deaths<br>' + chosenCountry
        };

        Plotly.newPlot('plotdiv', data, layout, {showSendToCloud: true});
    };
    
    var innerContainer = document.querySelector('[data-num="0"'),
        plotEl = innerContainer.querySelector('.plot'),
        countrySelector = innerContainer.querySelector('.countrydata');

    function assignOptions(textArray, selector) {
        for (var i = 0; i < textArray.length;  i++) {
            var currentOption = document.createElement('option');
            currentOption.text = textArray[i];
            selector.appendChild(currentOption);
        }
    }

    assignOptions(listofCountries, countrySelector);

    function updateCountry(){
        setBubblePlot(countrySelector.value);
    }
    
    countrySelector.addEventListener('change', updateCountry, false);
};


// Initialize the dashboard
init();
