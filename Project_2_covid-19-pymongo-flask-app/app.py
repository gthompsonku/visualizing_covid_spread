from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json
from bson import json_util
from bson.json_util import dumps

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/confirmed_db/confirmed_data")
def confirmed_db_confirmed_data():
    client = MongoClient('localhost', 27017)
    db = client['confirmed_db']
    collection_confirmed = db['confirmed']
    confirmed_data = collection_confirmed.find()
    json_confirmed = []
    for c in confirmed_data:
        json_confirmed.append(c)
    json_confirmed = json.dumps(json_confirmed, default=json_util.default)
    client.close()
    return json_confirmed


@app.route("/deaths_db/deaths_data")
def deaths_db_deaths_data():
    client = MongoClient('localhost', 27017)
    db = client['deaths_db']
    collection_deaths = db['deaths']
    deaths_data = collection_deaths.find()
    json_deaths = []
    for d in deaths_data:
        json_deaths.append(d)
    json_deaths = json.dumps(json_deaths, default=json_util.default)
    client.close()
    return json_deaths


@app.route("/recovered_db/recovered_data")
def recovered_db_recovered_data():
    client = MongoClient('localhost', 27017)
    db = client['recovered_db']
    collection_recovered = db['recovered']
    recovered_data = collection_recovered.find()
    json_recovered = []
    for r in recovered_data:
        json_recovered.append(r)
    json_recovered = json.dumps(json_recovered, default=json_util.default)
    client.close()
    return json_recovered

@app.route("/confirmed_US_db/confirmed_data_US")
def confirmed_US_db_confirmed_data_US():
    client = MongoClient('localhost', 27017)
    db = client['confirmed_US_db']
    collection_confirmed_US = db['confirmed_US']
    confirmed_data_US = collection_confirmed_US.find()
    json_confirmed_US = []
    for c in confirmed_data_US:
        json_confirmed_US.append(c)
    json_confirmed_US = json.dumps(json_confirmed_US, default=json_util.default)
    client.close()
    return json_confirmed_US

@app.route("/deaths_US_db/deaths_data_US")
def deaths_US_db_deaths_data_US():  
    client = MongoClient('localhost', 27017) 
    db = client['deaths_US_db']
    collection_deaths_US = db['deaths_US']
    deaths_data_US = collection_deaths_US.find()
    json_deaths_US = []
    for d in deaths_data_US:
        json_deaths_US.append(d)
    json_deaths_US = json.dumps(json_deaths_US, default=json_util.default)
    client.close()
    return json_deaths_US

@app.route("/counties_db/counties_data")
def counties_db_counties_data():  
    client = MongoClient('localhost', 27017) 
    db = client['counties_db']
    collection_counties = db['counties']
    counties_data = collection_counties.find()
    json_counties = []
    for c in counties_data:
        json_counties.append(c)
    json_counties = json.dumps(json_counties, default=json_util.default)
    client.close()
    return json_counties

@app.route("/states_db/states_data")
def states_db_states_data():  
    client = MongoClient('localhost', 27017) 
    db = client['states_db']
    collection_states = db['states']
    states_data = collection_states.find()
    json_states = []
    for s in states_data:
        json_states.append(s)
    json_states = json.dumps(json_states, default=json_util.default)
    client.close()
    return json_states

@app.route("/lookup_db/lookup_data")
def lookup_db_lookup_data():  
    client = MongoClient('localhost', 27017) 
    db = client['lookup_db']
    collection_lookup = db['lookup']
    lookup_data = collection_lookup.find()
    json_lookup = []
    for s in lookup_data:
        json_lookup.append(s)
    json_lookup = json.dumps(json_lookup, default=json_util.default)
    client.close()
    return json_lookup

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000,debug=True)