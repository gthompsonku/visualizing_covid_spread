from csv import DictReader
from glob import glob
from json import dump
from os.path import splitext


for csvfile in glob('../../nyt_covid-19_us/*.csv'):
    stem, _ = splitext(csvfile)
    jsonfile = stem + '.json'
    
    with open(csvfile) as csv, open(jsonfile, 'w') as json:
         dump(list(DictReader(csv)), json)

