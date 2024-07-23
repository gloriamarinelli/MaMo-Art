import pymongo
from pymongo import MongoClient
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime

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


#@app.route('/getPaintings', methods=['GET'])
#def getPaintings():
 
if __name__ == "__main__":
    app.run(debug=True, host="localhost", port=5000)