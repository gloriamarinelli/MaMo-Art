import json
import pymongo
from pymongo import MongoClient
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
from bson import json_util
import concurrent.futures

app = Flask(__name__)
CORS(app)

@app.before_request
def before_request():
    if request.method == "OPTIONS":
        headers = {
            "Access-Control-Allow-Origin": "http://localhost:3000",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
            "Access-Control-Allow-Credentials": "true",
        }
        return ("", 200, headers)
    

#client = MongoClient('mongodb+srv://user1:rxGIWxHGMKNWWee0@cluster0.gbypuyv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
client = MongoClient('mongodb://localhost:27017/')
db = client['MaMo-Art']  
print(client.server_info())

@app.route("/")
def fetch():
    return jsonify({"message":"Server working", "status":200})

@app.route("/register", methods=['POST'])
def register():
    data = request.get_json()
    
    username = data['username']
    name = data['name']
    surname = data['surname']
    password = data['password']
    
    user_coll = db['user']
    new_user = {'username':username, 'name':name, 'surname':surname,'password':password}
    
    # Check username
    for elem in user_coll.find():
        if elem['username'] == new_user['username']:
            return jsonify({'message':'ERROR: This username is not valid.', 'status':400})
    
    # Insert a new user
    x = user_coll.insert_one(new_user)    
    if x is not None:
        return jsonify({'message':f'The user {username} exists.', 'status':200})
    
    return jsonify({'message':'ERROR: The user does not exists.', 'status':500})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    username = data['username']
    password = data['password']
    user_coll = db['user']

    # Check username
    query = {'username':username}
    user = user_coll.find_one(query)

    if user is None:
        return jsonify({'message':'The user is not registered.', 'status':404})
    
    if user['password'] == password:
        return jsonify({'message':'Login successful!', 'status':200})
    
    return jsonify({'message':'Wrong username and/or password. ', 'status':400})

@app.route('/deleteAccount', methods=['POST'])
def deleteAccount():
    data = request.get_json()
    username = data['username']
    user_coll = db['user']

    # Check if the user exists
    query = {'username':username}
    user = user_coll.find_one(query)
    if user is None:
        return jsonify({'message':'ERROR: User not found.', 'status':404})    

    user_coll.delete_one(user)

    return jsonify({'message':'Account successfully deleted!', 'status':200})


@app.route('/getPaintings', methods=['GET'])
def getPaintings():
    paintings = []
    paintings_coll = db['paintings']

    for painting in paintings_coll.find():
        paintings['_id']= str(painting['_id'])
        paintings.append(painting)

    return jsonify({'paintings':paintings, 'status':200})


@app.route('/getPaintingsByDep', methods=['GET'])
def getPaintingsByDep():
    department = request.args.get('department')
    
    if not department:
        return jsonify({'message': 'Department query parameter is missing!', 'status': 400})
    
    paintings_coll = db['paintings']
    query = {'department': {'$regex': department, '$options': 'i'}}
    paintings = list(paintings_coll.find(query))

    if not paintings:
        return jsonify({'message': 'No paintings found for the given department!', 'status': 404})

    return jsonify({'paintings': parse_json(paintings), 'status': 200})

@app.route('/getPaintingsByArt', methods=['GET'])
def getPaintingsByArt():
    name = request.args.get('name')
    
    if not name:
        return jsonify({'message': 'Name query parameter is missing!', 'status': 400})
    
    paintings_coll = db['paintings']
    query = {'name': {'$regex': name, '$options': 'i'}}
    paintings = list(paintings_coll.find(query))

    if not paintings:
        return jsonify({'message': 'No paintings found for the given name!', 'status': 404})

    return jsonify({'paintings': parse_json(paintings), 'status': 200})

def queryOnCollection(collection_name, query):
    collection = db[collection_name]
    results = collection.find(query)
    paintings = []
    for result in results:
        if 'title' in result: 
            paintings.append({
                'title': result['title'],
                'collection_name': collection_name
            })
    return paintings

@app.route('/getPaintingsByArtColl', methods=['GET'])
def getPaintingsByArtColl():
    name = request.args.get('name')
    
    if not name:
        return jsonify({'message': 'Name query parameter is missing!', 'status': 400})
    
    query = {'title': {'$regex': name, '$options': 'i'}}
    paintings = []

    # Get all collections in the database
    collections = db.list_collection_names()
    
    # Exclude specific collections
    collections_to_query = [coll for coll in collections if coll not in ['paintings', 'artists']]
    
    with concurrent.futures.ThreadPoolExecutor() as executor:
        resultCollection = {executor.submit(queryOnCollection, coll, query): coll for coll in collections_to_query}
        for result in concurrent.futures.as_completed(resultCollection):
            result = result.result()
            paintings.extend(result)
    
    if not paintings:
        return jsonify({'message': 'No paintings found for the given name!', 'status': 404})
    
    return jsonify({'paintings': paintings, 'status': 200})

"""
@app.route('/getPaintingsByArtColl', methods=['GET'])
def getPaintingsByArtColl():
    name = request.args.get('name')
    
    if not name:
        return jsonify({'message': 'Name query parameter is missing!', 'status': 400})
    
    query = {'title': {'$regex': name, '$options': 'i'}}
    paintings = []

    # Get all collections in the database
    collections = db.list_collection_names()
    
    # Exclude specific collections
    collections_to_query = [coll for coll in collections if coll not in ['paintings', 'artists']]
    
    for collection_name in collections_to_query:
        collection = db[collection_name]
        results = collection.find(query)
        for result in results:
            if 'title' in result:  # Ensure 'title' field exists
                paintings.append({
                    'title': result['title'],
                    'collection_name': collection_name
                })
    
    if not paintings:
        return jsonify({'message': 'No paintings found for the given name!', 'status': 404})
    
    return jsonify({'paintings': paintings, 'status': 200})
"""

def parse_json(data):
    return json.loads(json_util.dumps(data))


if __name__ == "__main__":
    app.run(debug=True, host="localhost", port=5000)


