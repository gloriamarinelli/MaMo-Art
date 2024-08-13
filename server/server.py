import json
import pymongo
from pymongo import DESCENDING, MongoClient
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
from bson import json_util
import concurrent.futures
from pymongo import ASCENDING


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




########### getPaintings, torna i paintings senza uso di strutture (no index, ...)

@app.route('/getPaintings', methods=['GET'])
def getPaintings():
    paintings = []
    paintings_coll = db['paintings']

    for painting in paintings_coll.find():
        painting['_id'] = str(painting['_id'])
        paintings.append(painting)
        
    if not paintings:
        return jsonify({'message': 'No paintings found!', 'status': 404})

    return jsonify({'paintings':paintings, 'status':200})

########### getPaintingsByIndex, torna i paintings con PARAM = ID usando l'index

@app.route('/getPaintingsByIndex', methods=['GET'])
def getPaintingsByIndex():
    paintings_coll = db['paintings']

    # Create a dense secondary non-unique sorted index
    paintings_coll.create_index([('id', ASCENDING)], name='id_index')

    id = request.args.get('id')
    
    if not id:
        return jsonify({'message': 'Id query parameter is missing!', 'status': 400})
    
    query = {'id': id}
    
    # Find and sort the documents by 'name' field in ascending order
    paintings = list(paintings_coll.find(query).sort('id', ASCENDING))
    
    if not paintings:
        return jsonify({'message': 'No paintings found for the given id!', 'status': 404})

    # Convert ObjectId to string in each document
    paintings = [serializeDocument(doc) for doc in paintings]

    return jsonify({'paintings': paintings, 'status': 200})


def serializeDocument(doc):
    if '_id' in doc:
        doc['_id'] = str(doc['_id'])
    return doc

########### getPaintingsByTitle, torna i paintings con PARAM = TITLE senza uso di strutture (no index, ...)

@app.route('/getPaintingsByTitle', methods=['GET'])
def getPaintingsByTitle():
    title = request.args.get('title')
    
    if not title:
        return jsonify({'message': 'Title query parameter is missing!', 'status': 400})
    
    paintings_coll = db['paintings']
    query = {'title': {'$regex': title, '$options': 'i'}}
    paintings = list(paintings_coll.find(query))

    if not paintings:
        return jsonify({'message': 'No paintings found for the given title!', 'status': 404})

    return jsonify({'paintings': parse_json(paintings), 'status': 200})

########### getPaintingsTitleByIndex, torna i paintings con PARAM = TITLE usando l'index

@app.route('/getPaintingsTitleByIndex', methods=['GET'])
def getPaintingsTitleByIndex():
    paintings_coll = db['paintings']

    # Create a dense secondary non-unique sorted index
    paintings_coll.create_index([('title', ASCENDING)], name='title_index')

    title = request.args.get('title')
    
    if not title:
        return jsonify({'message': 'Name query parameter is missing!', 'status': 400})
    
    query = {'title': {'$regex': title, '$options': 'i'}}
    
    # Find and sort the documents by 'name' field in ascending order
    paintings = list(paintings_coll.find(query).sort('title', ASCENDING))
    
    if not paintings:
        return jsonify({'message': 'No paintings found for the given title!', 'status': 404})

    # Convert ObjectId to string in each document
    paintings = [serializeDocument(doc) for doc in paintings]

    return jsonify({'paintings': paintings, 'status': 200})

########### getPaintingsByDepByIndex, torna i paintings con PARAM = DEPARTMENT usando l'index

@app.route('/getPaintingsByDepByIndex', methods=['GET'])
def getPaintingsByDepByIndex():
    paintings_coll = db['paintings']

    # Create a dense secondary non-unique sorted index
    paintings_coll.create_index([('department', ASCENDING)], name='dep_index')

    dep = request.args.get('department')
    
    if not dep:
        return jsonify({'message': 'Name query parameter is missing!', 'status': 400})
    
    query = {'department': {'$regex': dep, '$options': 'i'}}
    
    # Find and sort the documents by 'name' field in ascending order
    paintings = list(paintings_coll.find(query).sort('department', ASCENDING))
    
    if not paintings:
        return jsonify({'message': 'No paintings found for the given name!', 'status': 404})

    # Convert ObjectId to string in each document
    paintings = [serializeDocument(doc) for doc in paintings]

    return jsonify({'paintings': paintings, 'status': 200})

########### getPaintingsByDep, torna i paintings con PARAM = DEPARTMENT senza uso di strutture (no index, ...)
       
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

########### getPaintingsByArtist, torna i paintings con PARAM = NAME senza uso di strutture (no index, ...)

@app.route('/getPaintingsByArtist', methods=['GET'])
def getPaintingsByArtist():
    name = request.args.get('name')
    
    if not name:
        return jsonify({'message': 'Name query parameter is missing!', 'status': 400})
    
    paintings_coll = db['paintings']
    query = {'name': {'$regex': name, '$options': 'i'}}
    paintings = list(paintings_coll.find(query))

    if not paintings:
        return jsonify({'message': 'No paintings found for the given name!', 'status': 404})

    return jsonify({'paintings': parse_json(paintings), 'status': 200})

########### getPaintingsByArtistByIndex, torna i paintings con PARAM = NAME usando l'index

@app.route('/getPaintingsByArtistByIndex', methods=['GET'])
def getPaintingsByArtistByIndex():
    paintings_coll = db['paintings']

    # Create a dense secondary non-unique sorted index
    paintings_coll.create_index([('name', ASCENDING)], name='name_index')

    name = request.args.get('name')
    
    if not name:
        return jsonify({'message': 'Name query parameter is missing!', 'status': 400})
    
    query = {'name': {'$regex': name, '$options': 'i'}}
    
    # Find and sort the documents by 'name' field in ascending order
    paintings = list(paintings_coll.find(query).sort('name', ASCENDING))
    
    if not paintings:
        return jsonify({'message': 'No paintings found for the given name!', 'status': 404})

    # Convert ObjectId to string in each document
    paintings = [serializeDocument(doc) for doc in paintings]

    return jsonify({'paintings': paintings, 'status': 200})

'''@app.route('/getPaintingsByArtColl', methods=['GET'])
def getPaintingsByArtColl():
    name = request.args.get('name')
    
    if not name:
        return jsonify({'message': 'Name query parameter is missing!', 'status': 400})
    
    paintings = []
    
    # Get all collections in the database
    collections = db.list_collection_names()
    
    # Find collections whose names contain the input name
    matching_collections = [coll for coll in collections if name.lower() in coll.lower()]
    
    if not matching_collections:
        return jsonify({'message': 'No matching collections found!', 'status': 404})
    
    for collection_name in matching_collections:
        collection = db[collection_name]
        results = collection.find({}, {'title': 1, '_id': 0})  
        for result in results:
            if 'title' in result:
                paintings.append({
                    'title': result['title'],
                    'collection_name': collection_name
                })
    
    if not paintings:
        return jsonify({'message': 'No paintings found in the matching collections!', 'status': 404})
    
    return jsonify({'paintings': paintings, 'status': 200})'''

def parse_json(data):
    return json.loads(json_util.dumps(data))

if __name__ == "__main__":
    app.run(debug=True, host="localhost", port=5000)


