
/* ---------------------------------------------- */
/* helper functions Beginning */
/* ---------------------------------------------- */
function renameProperty(obj) {
  let newObject = {};
  Object.entries(obj).forEach(([key, value])=>{
    newObject[key.split("/").join("_")] = value
    })

    return newObject;
}

function convertToTable(data){
  let csv = '';
  let header = Object.keys(data).join(',');
  let values = Object.values(data).map(item => Object.values(item));
  
  csv += header + '\n' + values;
//  console.log(csv)
 // console.log(d3.csvParse(csv));
 return d3.csvParse(csv);

}

function convertValuesToArray(obj){
  return Object.entries(obj).map(([key,value]) => value)
}

function convertArrayObjects(obj){
  var arr = Object.keys(obj).map(function (key) {
    return { [key]: obj[key] };
  });
  
 // console.log(result);
  return arr;
}

 function creatNewArrOfObjects(arrDate, arrObjConfirmed, arrObjDeath, arrObjRecovered){
  let arrNewObj = [];
  
  for(let i = 0; i < arrDate.length; i++){
     let newObj = {}
     newObj['date'] = arrDate[i];
     newObj['active'] = Math.abs(Object.values(arrObjConfirmed[i])[0] - Object.values(arrObjDeath[i])[0] - Object.values(arrObjRecovered[i])[0]);
     newObj['death'] = Object.values(arrObjDeath[i])[0];
     newObj['recovered'] = Object.values(arrObjRecovered[i])[0];
     arrNewObj.push(newObj)
  }
    //console.log(arrNewObj);
    return arrNewObj
}

function creatNewArrOfObjectsChange(arrDate, arrObjConfirmed, arrObjDeath){
  let arrNewObj = [];
  
  for(let i = 0; i < arrDate.length -1; i++){
     let newObj = {}
     newObj['date'] = arrDate[i+1];
     newObj['total_confirmed_cases'] = Math.abs(Object.values(arrObjConfirmed[i])[0]);
     newObj['death'] = Object.values(arrObjDeath[i])[0];
     arrNewObj.push(newObj)
  }
    //console.log(arrNewObj);
    return arrNewObj
}


const multiFilter = (arr, filters) => {
  const filterKeys = Object.keys(filters);
  return arr.filter(eachObj => {
    return filterKeys.every(eachKey => {
      if (!filters[eachKey].length) {
        return true; // passing an empty filter means that filter is ignored.
      }
      return filters[eachKey].includes(eachObj[eachKey]);
    });
  });
};

// the list can be changed as required
const arrayKeysRemoved = ['Province_State', 'Country_Region', 'Lat', 'Long']

function removeProperties(obj,arrayKeysRemoved ){
  var result = _.omit(obj, arrayKeysRemoved);
  //console.log(result);
  return result;
}

function keepProperties(obj, keepList) {
  for (var prop in obj) {
      if (keepList.indexOf( prop ) == -1) {
          delete obj[prop];
      }             
  }
}

function sumSimilarKeysArrObjs(arrObjs){
 return arrObjs.reduce(function(acc, val){
    var o = acc.filter(function(obj){
        return obj.Country_Region==val.Country_Region;
    }).pop() || {Country_Region:val.Country_Region, confirmed_cases:0};
    
    o.confirmed_cases += val.confirmed_cases;
    acc.push(o);
    return acc;
},[]);
}

function sumSimilarKeysArrObjsDeath(arrObjs){
  return arrObjs.reduce(function(acc, val){
     var o = acc.filter(function(obj){
         return obj.Country_Region==val.Country_Region;
     }).pop() || {Country_Region:val.Country_Region, death:0};
     
     o.death += val.death;
     acc.push(o);
     return acc;
 },[]);
 }

function removeDuplicates (arr){
   const seen = new Set();

   const filteredArr = arr.filter(el => {
    const duplicate = seen.has(el.id);
    seen.add(el.id);
    return !duplicate;
  });

  return filteredArr

}

function changeInCount(a) {
  var x = [];
  for(var i = 0, j = i +1;i<a.length;i++, j++)
      x.push(Math.abs(a[i] - a[j]));
      //console.log(x)
      return x;
}     


/* ---------------------------------------------- */
/* helper functions End */
/* ---------------------------------------------- */

/* ---------------------------------------------- */
/* data parsing */
/* ---------------------------------------------- */

function init(){

  var selector = d3.select("#selCountry");

  const urlCountry = "csse_covid_19_time_series/time_series_covid19_confirmed_global.json";
   d3.json(urlCountry).then(countriesData => {
     var newObjectCountry = countriesData.map(d => renameProperty(d)).map(d => d.Country_Region);
    
     uniqueCountryList = [...new Set(newObjectCountry)];// remove duplicates

   var options = selector.selectAll("option")
     .data(uniqueCountryList)
     .enter()
     .append("option")
     .attr("value", function(d) {
       return d;
     })
     .text(function(d) {
       return d;
     });
   
   options.property("selected", function(d){return d === "US"});

var indexUS = uniqueCountryList.findIndex(x => x ==="US");

const selectedCountry = uniqueCountryList[indexUS];
getDataTimeSeries(selectedCountry)
getDataTimeSeriesSumary(selectedCountry)
getDataTimeSeriesChange(selectedCountry)

}).catch(err => console.log(err));  
}

init();

function getDataTimeSeriesSumary(country){

  var filters = {
      "Country/Region": country
    };
    
  Promise.all([
      d3.json('csse_covid_19_time_series/time_series_covid19_confirmed_global.json'),
      d3.json('csse_covid_19_time_series/time_series_covid19_deaths_global.json'),
      d3.json('csse_covid_19_time_series/time_series_covid19_recovered_global.json'),
  ]).then(([confirmed, deaths, recovered]) =>  {
    //console.log(confirmed)
    var confirmedData = multiFilter(confirmed,filters);
    var deathData = multiFilter(deaths,filters);
    var recoveredData = multiFilter(recovered,filters);
   
    // renaming the properties that has '/' to '_', this step can be excluded if the naming convension is followed
    var newConfirmedObjectArr = confirmedData.map(d => renameProperty(d)).map((d) => removeProperties(d,arrayKeysRemoved )) 
    var  newDeathObjectArr= deathData.map(d => renameProperty(d)).map((d) => removeProperties(d,arrayKeysRemoved )) 
    var  newRecoveredObjectArr= recoveredData.map(d => renameProperty(d)).map((d) => removeProperties(d,arrayKeysRemoved )) 
    //console.log(newConfirmedObjectArr);
  
    const arrDates = newConfirmedObjectArr.map(obj => Object.keys(obj))
   //console.log(arrDates)
  
    const arrValuesConfirmed = newConfirmedObjectArr.map(obj => Object.values(obj))
    const arrValuesDeath = newDeathObjectArr.map(obj => Object.values(obj))
    const arrValuesRecovered = newRecoveredObjectArr.map(obj => Object.values(obj))
    //console.log(arrValuesDeath)
   // console.log(arrValuesConfirmed.map(arr => arr.map(Number))); // calculate sum of multiple arrays
  
    var sumArrayConfirmed = arrValuesConfirmed.map(arr => arr.map(Number)).reduce( (a,b) => a.map( (c,i) => c + b[i] ));
    var sumArrayDeath = arrValuesDeath.map(arr => arr.map(Number)).reduce( (a,b) => a.map( (c,i) => c + b[i] ));
    var sumArrayRecovered = arrValuesRecovered.map(arr => arr.map(Number)).reduce( (a,b) => a.map( (c,i) => c + b[i] ));
    
    // convert key value pair to array of objects,format required for plotting
    var arrDatesConfirmed= convertArrayObjects(sumArrayConfirmed);
    var arrDatesDeath = convertArrayObjects(sumArrayDeath);
    var arrDatesRecovered = convertArrayObjects(sumArrayRecovered);
      
    var arrDatesConfirmedDeathCount = creatNewArrOfObjects(arrDates[0],arrDatesConfirmed,arrDatesDeath, arrDatesRecovered);
      arrDatesConfirmedDeathCount.map((d) => {
            const arrayKeysKeep = [ 'active', 'death','recovered']
            return keepProperties(d,arrayKeysKeep)
          });

      var dataSelector = d3.select('#sumary');
      dataSelector.html("");

      dataSelector.html("") ;
      var locale = d3.formatLocale({
        decimal: ",",
        thousands: ", ",
        grouping: [3]
      });

      var format = locale.format(",");

        Object.entries(arrDatesConfirmedDeathCount [arrDatesConfirmedDeathCount.length -1]).forEach(([key,value]) =>{
            dataSelector.append('p').text(`${key}:`).append('p').text(`${format(value)}`).append('hr')
            
        });

       const totalCases = Object.values(arrDatesConfirmedDeathCount [arrDatesConfirmedDeathCount.length -1]).reduce((a, b) => a + b) ;
       //console.log(totalCases);

       dataSelector.append('p').text(`total:`).append('p').text(`${format(totalCases) }`).append('hr')        
      
        
  }).catch(function(err) {
      console.log(err)
  })
  }

function getDataTimeSeries(country){

var filters = {
    "Country/Region": country
  };
  
Promise.all([
    d3.json('csse_covid_19_time_series/time_series_covid19_confirmed_global.json'),
    d3.json('csse_covid_19_time_series/time_series_covid19_deaths_global.json'),
    d3.json('csse_covid_19_time_series/time_series_covid19_recovered_global.json'),
]).then(([confirmed, deaths, recovered]) =>  {
  //console.log(confirmed)

  var confirmedData = multiFilter(confirmed,filters);
  var deathData = multiFilter(deaths,filters);
  var recoveredData = multiFilter(recovered,filters);
 
  // renaming the properties that has '/' to '_', this step can be excluded if the naming convension is followed
  var newConfirmedObjectArr = confirmedData.map(d => renameProperty(d)).map((d) => removeProperties(d,arrayKeysRemoved )) 
  var  newDeathObjectArr= deathData.map(d => renameProperty(d)).map((d) => removeProperties(d,arrayKeysRemoved )) 
  var  newRecoveredObjectArr= recoveredData.map(d => renameProperty(d)).map((d) => removeProperties(d,arrayKeysRemoved )) 
  //console.log(newConfirmedObjectArr);

  const arrDates = newConfirmedObjectArr.map(obj => Object.keys(obj))
 //console.log(arrDates)

  const arrValuesConfirmed = newConfirmedObjectArr.map(obj => Object.values(obj))
  const arrValuesDeath = newDeathObjectArr.map(obj => Object.values(obj))
  const arrValuesRecovered = newRecoveredObjectArr.map(obj => Object.values(obj))
  //console.log(arrValuesDeath)
 // console.log(arrValuesConfirmed.map(arr => arr.map(Number))); // calculate sum of multiple arrays

  var sumArrayConfirmed = arrValuesConfirmed.map(arr => arr.map(Number)).reduce( (a,b) => a.map( (c,i) => c + b[i] ));
  var sumArrayDeath = arrValuesDeath.map(arr => arr.map(Number)).reduce( (a,b) => a.map( (c,i) => c + b[i] ));
  var sumArrayRecovered = arrValuesRecovered.map(arr => arr.map(Number)).reduce( (a,b) => a.map( (c,i) => c + b[i] ));
  
  // convert key value pair to array of objects,format required for plotting
  var arrDatesConfirmed= convertArrayObjects(sumArrayConfirmed);
  var arrDatesDeath = convertArrayObjects(sumArrayDeath);
  var arrDatesRecovered = convertArrayObjects(sumArrayRecovered);
    
  var arrDatesConfirmedDeathCount = creatNewArrOfObjects(arrDates[0],arrDatesConfirmed,arrDatesDeath, arrDatesRecovered);
  //console.log(arrDatesConfirmedDeathCount)

  const ticksDate = arrDatesConfirmedDeathCount.slice(Math.max(arrDatesConfirmedDeathCount.length - 30, 0))

  barStackedChart(ticksDate)
  
}).catch(function(err) {
    console.log(err)
})
}

function optionChanged(newCountry) {
  //console.log(newCountry)
  getDataTimeSeries(newCountry);
  getDataTimeSeriesSumary(newCountry)
  getDataTimeSeriesChange(newCountry)
    
 }

 function geoMapCountries(){
          Promise.all([
            d3.json('csse_covid_19_time_series/time_series_covid19_confirmed_global.json'),
            d3.json('csse_covid_19_time_series/time_series_covid19_deaths_global.json'),
            d3.json('csse_covid_19_time_series/time_series_covid19_recovered_global.json'),
        ]).then(([confirmed, deaths, recovered])=>{
          // console.log(confirmed) 
           var newConfirmedObjectArr = confirmed.map(d => renameProperty(d))
           //console.log(newConfirmedObjectArr)  
           for (var lastProperty in newConfirmedObjectArr[0]);// to always grab the latest date
           //console.log(lastProperty)
          
          var arrObjs = newConfirmedObjectArr.map((item) => {
            return {
              Country_Region: item['Country_Region'],
              'confirmed_cases': +item[lastProperty]
            } 
          });

         // console.log(arrObjs)
          
        var result = sumSimilarKeysArrObjs(arrObjs).filter((d, index, self) =>
              index === self.findIndex((t) => (
                t.Country_Region === d.Country_Region && t.confirmed_cases === d.confirmed_cases
              ))
            );
        //console.log(result)
          //console.log(result)
          //console.log(d3.min(result,d=> d.confirmed_cases))
          //console.log(d3.max(result,d=> d.confirmed_cases))

          const newArrayHeaders = [...Object.keys(result[0])]
  
          const arrValues = result.map((obj)=> {
            return Object.values(obj)
            })
           //console.log (arrValues)
           const dataSet = [[...newArrayHeaders],...arrValues]
          // console.log(dataSet);
          
          google.charts.load('current', {
            'packages':['geochart'],
            // See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
            'mapsApiKey': 'AIzaSyCjNYHzz5ehTehNHZUWbLca7LIy5gHzoiU'
          });
          google.charts.setOnLoadCallback(drawRegionsMap);
    
          function drawRegionsMap() {
            var data = google.visualization.arrayToDataTable(dataSet);
    
               var options = {
                  sizeAxis: { minValue: d3.min(result,d=> d.confirmed_cases), maxValue: d3.max(result,d=> d.confirmed_cases) },
                  displayMode: 'auto',   //auto, chart will automatically detect data set whether it is regions or points
                  keepAspectRatio: true, // code to set max size of chart according to div size html
                  colorAxis: {minValue: d3.min(result,d=> d.confirmed_cases), maxValue:d3.max(result,d=> d.confirmed_cases), colors: ['#fac934', '#40291C']},
                };
    
            var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));
    
            chart.draw(data, options);
          }
          
        }).catch(function(err) {
          console.log(err)
        })
  
   }
  
   geoMapCountries();

  function totalCases(){
            Promise.all([
                d3.json('csse_covid_19_time_series/time_series_covid19_confirmed_global.json'),
                d3.json('csse_covid_19_time_series/time_series_covid19_deaths_global.json'),
                d3.json('csse_covid_19_time_series/time_series_covid19_recovered_global.json'),
          ]).then(([confirmed, deaths, recovered])=>{
               //console.log(confirmed) 
               var newConfirmedObjectArr = confirmed.map(d => renameProperty(d))
               var newDeathObjectArr = deaths.map(d => renameProperty(d))
               for (var lastProperty in newConfirmedObjectArr[0]);// to always grab the latest date
              // console.log(lastProperty)
              
              var arrObjs = newConfirmedObjectArr.map((item) => {
                return {
                  Country_Region: item['Country_Region'],
                  'confirmed_cases': +item[lastProperty]
                } 
              });
    
              var arrObjsDeath = newDeathObjectArr.map((item) => {
                      return {
                            Country_Region: item['Country_Region'],
                            'death': +item[lastProperty]
                      } 
                 });
      
            
          var resultConfirmed = sumSimilarKeysArrObjs(arrObjs).filter((d, index, self) =>
                index === self.findIndex((t) => (
                  t.Country_Region === d.Country_Region && t.confirmed_cases === d.confirmed_cases
                ))
              );

           // console.log(resultConfirmed)

          var resultDeath = sumSimilarKeysArrObjsDeath(arrObjsDeath).filter((d, index, self) =>
                index === self.findIndex((t) => (
                  t.Country_Region === d.Country_Region && t.death === d.death
                ))
              );
              //console.log(resultDeath.reduce((a, b) => +a + +b.death, 0))
              //console.log(resultConfirmed.reduce((a,b) => a + b.confirmed_cases,0))

              var dataSelector = d3.select('#sumary-top');
              dataSelector.html("") ;
              var locale = d3.formatLocale({
                decimal: ",",
                thousands: ", ",
                grouping: [3]
              });

              var format = locale.format(",");
              
               dataSelector.append('p').text(`Total Worldwide Cases:`).append('br');
               dataSelector.append('h3').text(`${format(resultConfirmed.reduce((a,b) => a + b.confirmed_cases,0)) }`).append('hr') 
               dataSelector.append('p').text(`Deaths Worldwide:`).append('br');
               dataSelector.append('h3').text(`${format(resultDeath.reduce((a, b) => +a + +b.death, 0)) }`).append('hr')   
            
            
          }).catch(function(err) {
            console.log(err)
          })
    
     }
  
  totalCases();

  /* increase in cases */ 

  function getDataTimeSeriesChange(country){

    var filters = {
        "Country/Region": country
      };
      
    Promise.all([
        d3.json('csse_covid_19_time_series/time_series_covid19_confirmed_global.json'),
        d3.json('csse_covid_19_time_series/time_series_covid19_deaths_global.json'),
        d3.json('csse_covid_19_time_series/time_series_covid19_recovered_global.json'),
    ]).then(([confirmed, deaths, recovered]) =>  {
      //console.log(confirmed)
    
      var confirmedData = multiFilter(confirmed,filters);
      var deathData = multiFilter(deaths,filters);
      var recoveredData = multiFilter(recovered,filters);
     
      // renaming the properties that has '/' to '_', this step can be excluded if the naming convension is followed
      var newConfirmedObjectArr = confirmedData.map(d => renameProperty(d)).map((d) => removeProperties(d,arrayKeysRemoved )) 
      var  newDeathObjectArr= deathData.map(d => renameProperty(d)).map((d) => removeProperties(d,arrayKeysRemoved )) 
      var  newRecoveredObjectArr= recoveredData.map(d => renameProperty(d)).map((d) => removeProperties(d,arrayKeysRemoved )) 
      //console.log(newConfirmedObjectArr);
    
      const arrDates = newConfirmedObjectArr.map(obj => Object.keys(obj))
     //console.log(arrDates)
    
      const arrValuesConfirmed = newConfirmedObjectArr.map(obj => Object.values(obj))
      const arrValuesDeath = newDeathObjectArr.map(obj => Object.values(obj))
      const arrValuesRecovered = newRecoveredObjectArr.map(obj => Object.values(obj))
      //console.log(arrValuesDeath)
     // console.log(arrValuesConfirmed.map(arr => arr.map(Number))); // calculate sum of multiple arrays
    
      var sumArrayConfirmed = arrValuesConfirmed.map(arr => arr.map(Number)).reduce( (a,b) => a.map( (c,i) => c + b[i] ));
     // console.log(sumArrayConfirmed)
      var sumArrayDeath = arrValuesDeath.map(arr => arr.map(Number)).reduce( (a,b) => a.map( (c,i) => c + b[i] ));
      var sumArrayRecovered = arrValuesRecovered.map(arr => arr.map(Number)).reduce( (a,b) => a.map( (c,i) => c + b[i] ));
      
      var changeConfirmed = changeInCount(sumArrayConfirmed)
     // console.log(changeConfirmed)
      var changeDeath = changeInCount(sumArrayDeath)
      var changeRecovered = changeInCount(sumArrayRecovered)
      
      // convert key value pair to array of objects,format required for plotting
      var arrDatesConfirmed= convertArrayObjects(changeConfirmed);
      var arrDatesDeath = convertArrayObjects(changeDeath);
      var arrDatesRecovered = convertArrayObjects(changeRecovered);

      //console.log(arrDatesConfirmed)

      let arrDatesConfirmedDeathChange = creatNewArrOfObjectsChange(arrDates[0],arrDatesConfirmed,arrDatesDeath); 
      let lenthArr = arrDatesConfirmedDeathChange.length

      let chartStacked = document.getElementById("bar-chart-grouped").getContext('2d');

      var original = Chart.defaults.global.legend.onClick;
      Chart.defaults.global.legend.onClick = function(e, legendItem) {
        update_caption(legendItem);
        original.call(this, e, legendItem);
      };

      if(window.chart && window.chart !== null){
        window.chart.destroy();
    }
      
      window.chart =   new Chart(chartStacked, {
          type: 'bar',
          data: {
            labels: arrDatesConfirmedDeathChange.map(d => d.date).slice((lenthArr - 20), lenthArr),
            datasets: [
              {
                label: "Total_Confirmed_Cases",
              backgroundColor: "#88C1F2",
              data: arrDatesConfirmedDeathChange.map(d => d.total_confirmed_cases).slice((lenthArr - 20), lenthArr)
              }, {
                 label: "Death",
                backgroundColor: "#8C4A32",
                data: arrDatesConfirmedDeathChange.map(d => d.death).slice((lenthArr - 20), lenthArr)
  
              }
            ]
          },
          options: {
            title: {
              display: true,
               text: 'Change in Cases per Day',
            }
          }
        });

        var labels = {
          "Total_Confirmed_Cases": true,
          "Deaths": true
        };

        var caption = document.getElementById("captionChange");

var update_caption = function(legend) {
  labels[legend.text] = legend.hidden;

  var selected = Object.keys(labels).filter(function(key) {
    return labels[key];
  });

    var text = selected.length ? selected.join(" & ") : "nothing";
    caption.innerHTML;

  };
   
    }).catch(function(err) {
        console.log(err)
    })
    }
 /* increase in cases */ 

 // population, restful get api
 axios.get('https://restcountries.eu/rest/v2/alpha/us')
 .then(response => {
   console.log(response.data);
 }).catch(error => console.log(error));

function getPopulation(){
  
 Promise.all([
   d3.json('lookup_tables/UID_ISO_FIPS_LookUp_Table.json'),
   d3.json('csse_covid_19_time_series/time_series_covid19_confirmed_global.json'),   
]).then(([lookup,confirmed])=>{
  console.log(lookup);
}).catch(error => console.log(error));
}

  
/* ---------------------------------------------- */
/* data parsing */
/* ---------------------------------------------- */


/* ---------------------------------------------- */
/* charts */
/* ---------------------------------------------- */

/* create a bar chart */
function barStackedChart(data){
  // to replace the svg that already exists
  d3.select("#barChart").selectAll("svg").remove();

   // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 50, left: 50},
    width = 800 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom, padding = 40;

    // append the svg object to the body of the page
    var svg = d3.select("#barChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

      // List of subgroups = header of the csv files = soil condition here
  var subgroups = Object.keys(data[0]).slice(1)

  //console.log(subgroups)

  // List of groups = species here = value of the first column called group -> I show them on the X axis
  var groups = d3.map(data, function(d){return(d.date)}).keys()

  //console.log(groups)

  // Add X axis
  var x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.2])
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSizeOuter(-10)).selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end").attr("class", "axis");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, d3.max(data, d=> (d.active + d.death + d.recovered))])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y)).attr("class", "axis");

    // ----------------
    // Create a label
    // ----------------

    svg.append("text")
        .attr("transform", `translate(${width -10 },${height +30 })`)
        .attr("class", "axis-text")
        .text("Dates")

    svg.append("text")
        .attr("transform", `translate(15,50 )rotate(270)`)
        .attr("class", "axis-text")
        .text("Cases")

    svg.append('g')
          .attr('transform', `translate(${width / 2}, ${padding - 20})`)
          .append('text')
          .attr('x', 0)
          .attr('y', 20)
          .classed('aText active', true)
          .text('COVID-19 Cases');

  // color palette = one color per subgroup
  var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#fac934','#40291C','#88C1F2'])

  //stack the data? --> stack per subgroup
  var stackedData = d3.stack()
    .keys(subgroups)
    (data)

  // console.log(stackedData)

  // ----------------
  // Create a tooltip
  // ----------------
  var tooltip = d3.select("#barChart")
    .append("div")
    .attr("class", "tooltip")
    .style("background-color", 'white')
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
  

  // Show the bars
  var barGroup = svg.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .enter().append("g")
      .attr("fill", function(d) { 
        return color(d.key); })
      .selectAll("rect")
            .data(function(d) { return d; })
      .enter().append("rect")
        .attr("x", function(d) { 
         // console.log(d.data);
          return x(d.data.date); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width",x.bandwidth());
      

     barGroup.on("mouseover", function(d) {
        // console.log(this.parentNode);
         var subgroupName = d3.select(this.parentNode).datum().key;
        // console.log(subgroupName);
         var subgroupValue = d.data[subgroupName];
         //console.log(subgroupValue);
         tooltip.style("display", "block")
             .html(subgroupName + "<br>" + subgroupValue)
             .style("opacity", 1)
             .style("left", d3.select(this).attr("x")+ "px")
             .style("top", d3.select(this).attr("y") + "px");

       })
      .on("mouseout", function(d) {
        tooltip.style("display", "none");
      })

      // ----------------
      // Create a legend
      // ----------------
      var colorLegend = d3.scaleOrdinal()
      .domain(subgroups)
      .range(['#88C1F2','#40291C','#fac934'])

      var legend = svg.append('g')
                .attr('class', 'legend')
                .attr('transform', 'translate(' + (padding + 12) + ', 0)');

            legend.selectAll('rect')
                .data(subgroups)
                .enter()
                .append('rect')
                .attr('x', 0)
                .attr('y', function(d, i){
                    return i * 18;
                })
                .attr('width', 12)
                .attr('height', 12)
                .attr('fill', function(d, i){
                    return colorLegend(i);
                });
            
            legend.selectAll('text')
                .data(subgroups.reverse())
                .enter()
                .append('text')
                .text(function(d){
                    return d;
                })
                .attr('x', 18)
                .attr('y', function(d, i){
                    return i * 18;
                })
                .attr('text-anchor', 'start')
                .attr('alignment-baseline', 'hanging');

 }

/* ---------------------------------------------- */
/* charts */
/* ---------------------------------------------- */
