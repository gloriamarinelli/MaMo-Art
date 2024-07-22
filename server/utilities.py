import csv
import math
import pymongo
import json
from bson import json_util

client = pymongo.MongoClient('mongodb://localhost:27017/')
db = client['MaMo-Art']  

