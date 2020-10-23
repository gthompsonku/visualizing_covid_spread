/* ---------------------------------------------- */
/* helper functions Beginning */
/* ---------------------------------------------- */
var groupBy = function(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

function sumSimilarKeysArrStateObjs(arrObjs){
  return arrObjs.reduce(function(acc, val){
     var o = acc.filter(function(obj){
         return obj.Province_State==val.Province_State;
     }).pop() || {Province_State:val.Province_State, confirmed_cases:0};
     
     o.confirmed_cases += val.confirmed_cases;
     acc.push(o);
     return acc;
 },[]);
 }
 
 function sumSimilarKeysArrObjsStateDeath(arrObjs){
   return arrObjs.reduce(function(acc, val){
      var o = acc.filter(function(obj){
          return obj.Province_State==val.Province_State;
      }).pop() || {Province_State:val.Province_State, death:0};
      
      o.death += val.death;
      acc.push(o);
      return acc;
  },[]);
  }

  function creatNewArrOfObjectsStates(arrObj1, arrObj2){
    
     for(let i = 0; i < arrObj1.length; i++){
        arrObj1[i][0]['death'] = Object.values(arrObj2[i])[0]['death'];
     }
       console.log(arrNewObj);
      
   }

   function creatNewArrOfObjectsStates(arrObjConfirmed, arrObjDeath){
     let arrNewObj = [];
     
     for(let i = 0; i < arrObjConfirmed.length; i++){
        let newObj = {}
        newObj['Province_State'] = arrObjConfirmed[i]['Province_State'];
        newObj['confirmed_cases_excluding_death'] = arrObjConfirmed[i]['confirmed_cases'] - arrObjDeath[i]['death'];
        newObj['death'] = arrObjDeath[i]['death'];
        arrNewObj.push(newObj)
     }
       //console.log(arrNewObj);
       return arrNewObj
   }

/* ---------------------------------------------- */
/* data parsing */
/* ---------------------------------------------- */

function getDataUS(){

  Promise.all([
     d3.json("/confirmed_US_db/confirmed_data_US"),
     d3.json("/deaths_US_db/deaths_data_US"),
     
  ]).then(([confirmed,deaths]) =>  {
 // console.log(confirmed);
  //console.log(deaths);
  for (var lastProperty in confirmed[0]);
 // console.log(lastProperty)

   var arrObjsConfirmed = confirmed.map((item) => {
            return {
               Province_State: item['Province_State'],
              'confirmed_cases': +item[lastProperty]
            } 
          });

  var arrObjsDeath = deaths.map((item) => {
           return {
                    Province_State: item['Province_State'],
                 'death': +item[lastProperty]
           } 
      });

//   console.log( arrObjsConfirmed)

var resultConfirmed = sumSimilarKeysArrStateObjs(arrObjsConfirmed).filter((d, index, self) =>
index === self.findIndex((t) => (
  t.Province_State === d.Province_State && t.confirmed_cases === d.confirmed_cases
))
);

//console.log(resultConfirmed)

var resultDeath = sumSimilarKeysArrObjsStateDeath(arrObjsDeath).filter((d, index, self) =>
index === self.findIndex((t) => (
  t.Province_State === d.Province_State && t.death === d.death
))
);

//console.log(resultDeath.map(d => d.death).sort((a,b)=> b - a).slice(0,15))

var casesUS = creatNewArrOfObjectsStates(resultConfirmed,resultDeath)

var ctx = document.getElementById("stackedBarChart").getContext('2d');

var original = Chart.defaults.global.legend.onClick;
Chart.defaults.global.legend.onClick = function(e, legendItem) {
  update_caption(legendItem);
  original.call(this, e, legendItem);
};

var stackedBarChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: casesUS.sort(function(a, b) {
      return b.confirmed_cases_excluding_death - a.confirmed_cases_excluding_death;
  }).map(b => b.Province_State).slice(0,20),
    datasets: [{
      label: "Confirmed Cases Excluding Deaths",
      backgroundColor: "#88C1F2",
      hoverBackgroundColor: "#88C1F2",
      data: casesUS.map(d => d.confirmed_cases_excluding_death).sort((a,b)=> b - a).slice(0,20),
    }, {
      label: "Deaths",
      backgroundColor: "#8C4A32",
      hoverBackgroundColor: "#8C4A32",
      data: resultDeath.map(d => d.death).sort((a,b)=> b - a).slice(0,20)
    }]
  },
  
});

var labels = {
  "Confirmed Cases Excluding Deaths": true,
  "Deaths": true
};

var caption = document.getElementById("caption");

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
 
getDataUS();

  

