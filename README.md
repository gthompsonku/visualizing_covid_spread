# The COVID-19 Pandemic
UCSD Data Science Project 2 - D3 Visualization

![Corona Website Demo](Presentation/2020-04-08_Corona_flask_website_demo-480.gif)

### Team Members
* Alexis Perumal 
* Arundhati Chakraborty
* Grant Thompson

### Summary

An interactive data visualization website of the COVID-19 WW Pandemic with various js visualization libraries, Python, and MongoDB.

### Source Datasets

 * Time Series Data from John Hopkins University, https://github.com/CSSEGISandData/COVID-19
   * WW: confirmed cases, death, and recovered cases
   * US: confirmed and deaths in United States
 
 * States and County data for the United States from The New York Times, https://github.com/nytimes/covid-19-data

 
### Libraries

 * D3, Leaflet, Plotly, DC charts, google Charts (visualization)
 * Axios (library to call Promises in js), Lodash (helper functions)
 * pymongo to interacting with MongoDB (Notebook)
 * Flask to build the server, for routing
 * utility files in python to grab csv and convert to json before pushing it to database

### Dependencies/Installations
 * MongoDB, PyMongo, Flask

### Local Hosting Instructions

 * cd Project_2_covid-19-pymongo-flask-app
 * run: app_pymongo_counties_states_US.ipynb and app_pymongo_time_series.ipynb which pushes the data to database
 * python app.py -> to run server using flask connecting to the Frontend Visualization
 * put your own mapbox api key in config.js to view the leaflet geomap
 
 ### Key Links
 
 * Static version of the site: https://alexisperumal.github.io/covid-19/
 * High resolution video demo of the site: https://github.com/alexisperumal/covid-19/blob/master/Presentation/2020-04-08_Corona_flask_website_demo.mp4
 * Code Tree for the Flask version of the site: https://github.com/alexisperumal/covid-19/tree/master/Project_2_covid-19-pymongo-flask-app
 * Project presentation: https://github.com/alexisperumal/covid-19/blob/master/Presentation/Project_2_Corona_Visualization_Presentation.pptx
 
 


