from csv import DictReader
from glob import glob
from json import dump
from os.path import splitext


for csvfile in glob('../../lookup_tables/*.csv'):
    stem, _ = splitext(csvfile)
    jsonfile = stem + '.json'
    
    with open(csvfile) as csv, open(jsonfile, 'w') as json:
         dump(list(DictReader(csv)), json)
         

"""
file = './csse_covid_19_time_series/time_series_covid19_confirmed_global.csv'
json_file = './csse_covid_19_time_series/time_series_covid19_confirmed_global.json'

#Read CSV File
def read_CSV(file, json_file):
    csv_rows = []
    with open(file) as csvfile:
        reader = csv.DictReader(csvfile)
        field = reader.fieldnames
        for row in reader:
            csv_rows.extend([{field[i]:row[field[i]] for i in range(len(field))}])
        convert_write_json(csv_rows, json_file)
    

#Convert csv data into json
def convert_write_json(data, json_file):
    with open(json_file, "w") as f:
        f.write(json.dumps(data))


read_CSV(file,json_file)
"""

