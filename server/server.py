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


# client = MongoClient('mongodb+srv://user1:rxGIWxHGMKNWWee0@cluster0.gbypuyv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
client = MongoClient("mongodb://localhost:27017/")
db = client["MaMo-Art"]
print(client.server_info())


@app.route("/")
def fetch():
    return jsonify({"message": "Server working", "status": 200})


@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    username = data["username"]
    name = data["name"]
    password = data["password"]

    user_coll = db["user"]
    new_user = {"username": username, "name": name, "password": password}

    # Check username
    for elem in user_coll.find():
        if elem["username"] == new_user["username"]:
            return jsonify(
                {"message": "ERROR: This username is not valid.", "status": 400}
            )

    # Insert a new user
    x = user_coll.insert_one(new_user)
    if x is not None:
        return jsonify({"message": f"The user {username} exists.", "status": 200})

    return jsonify({"message": "ERROR: The user does not exists.", "status": 500})


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    username = data["username"]
    password = data["password"]
    user_coll = db["user"]

    # Check username
    query = {"username": username}
    user = user_coll.find_one(query)

    if user is None:
        return jsonify({"message": "The user is not registered.", "status": 404})

    if user["password"] == password:
        return jsonify({"message": "Login successful!", "status": 200})

    return jsonify({"message": "Wrong username and/or password. ", "status": 400})


########### getPaintingsFilter
@app.route("/getPaintingsFilter", methods=["GET"])
def getPaintingsFilter():
    paintings_coll = db["paintings"]

    paintings_coll.create_index(
        [("title", ASCENDING), ("department", ASCENDING), ("name", ASCENDING)],
        name="triple_index",
    )

    title = request.args.get("title")
    department = request.args.get("department")
    name = request.args.get("name")

    query = {}

    if title:
        query["title"] = {"$regex": title, "$options": "i"}
    if department:
        query["department"] = {"$regex": department, "$options": "i"}
    if name:
        query["name"] = {"$regex": name, "$options": "i"}

    if not query:
        return jsonify(
            {"message": "At least one query parameter is required!", "status": 400}
        )

    paintings = list(paintings_coll.find(query).sort("title", ASCENDING))
    paintings = list(paintings_coll.find(query).sort("department", ASCENDING))
    paintings = list(paintings_coll.find(query).sort("name", ASCENDING))

    # Convert ObjectId to string in each document
    paintings = [serializeDocument(doc) for doc in paintings]

    return jsonify({"paintings": paintings, "status": 200})


########### getPaintings, torna i paintings senza uso di strutture (no index, ...)
@app.route("/getPaintings", methods=["GET"])
def getPaintings():
    paintings = []
    paintings_coll = db["paintings"]

    for painting in paintings_coll.find():
        painting["_id"] = str(painting["_id"])
        paintings.append(painting)

    if not paintings:
        return jsonify({"message": "No paintings found!", "status": 404})

    return jsonify({"paintings": paintings, "status": 200})


########### getPaintingsByIndex, torna i paintings con PARAM = ID usando l'index
@app.route("/getPaintingsByIndex", methods=["GET"])
def getPaintingsByIndex():
    paintings_coll = db["paintings"]

    # Create a dense secondary non-unique sorted index
    paintings_coll.create_index([("id", ASCENDING)], name="id_index")

    id = request.args.get("id")

    if not id:
        return jsonify({"message": "Id query parameter is missing!", "status": 400})

    query = {"id": id}

    # Find and sort the documents by 'name' field in ascending order
    paintings = list(paintings_coll.find(query).sort("id", ASCENDING))

    if not paintings:
        return jsonify(
            {"message": "No paintings found for the given id!", "status": 404}
        )

    # Convert ObjectId to string in each document
    paintings = [serializeDocument(doc) for doc in paintings]

    return jsonify({"paintings": paintings, "status": 200})


def serializeDocument(doc):
    if "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc


########### getPaintingsByTitle, torna i paintings con PARAM = TITLE senza uso di strutture (no index, ...)
@app.route("/getPaintingsByTitle", methods=["GET"])
def getPaintingsByTitle():
    title = request.args.get("title")

    if not title:
        return jsonify({"message": "Title query parameter is missing!", "status": 400})

    paintings_coll = db["paintings"]
    query = {"title": {"$regex": title, "$options": "i"}}
    paintings = list(paintings_coll.find(query))

    if not paintings:
        return jsonify(
            {"message": "No paintings found for the given title!", "status": 404}
        )

    return jsonify({"paintings": parse_json(paintings), "status": 200})


########### getPaintingsTitleByIndex, torna i paintings con PARAM = TITLE usando l'index
@app.route("/getPaintingsTitleByIndex", methods=["GET"])
def getPaintingsTitleByIndex():
    paintings_coll = db["paintings"]

    # Create a dense secondary non-unique sorted index
    paintings_coll.create_index([("title", ASCENDING)], name="title_index")

    title = request.args.get("title")

    if not title:
        return jsonify({"message": "Name query parameter is missing!", "status": 400})

    query = {"title": {"$regex": title, "$options": "i"}}

    # Find and sort the documents by 'name' field in ascending order
    paintings = list(paintings_coll.find(query).sort("title", ASCENDING))

    if not paintings:
        return jsonify(
            {"message": "No paintings found for the given title!", "status": 404}
        )

    # Convert ObjectId to string in each document
    paintings = [serializeDocument(doc) for doc in paintings]

    return jsonify({"paintings": paintings, "status": 200})


########### getPaintingsByDepByIndex, torna i paintings con PARAM = DEPARTMENT usando l'index
@app.route("/getPaintingsDepByIndex", methods=["GET"])
def getPaintingsDepByIndex():
    paintings_coll = db["paintings"]

    # Create a dense secondary non-unique sorted index
    paintings_coll.create_index([("department", ASCENDING)], name="dep_index")

    dep = request.args.get("department")

    if not dep:
        return jsonify(
            {"message": "Department query parameter is missing!", "status": 400}
        )

    query = {"department": {"$regex": dep, "$options": "i"}}

    # Find and sort the documents by 'name' field in ascending order
    paintings = list(paintings_coll.find(query).sort("department", ASCENDING))

    if not paintings:
        return jsonify(
            {"message": "No paintings found for the given name!", "status": 404}
        )

    # Convert ObjectId to string in each document
    paintings = [serializeDocument(doc) for doc in paintings]

    return jsonify({"paintings": paintings, "status": 200})


########### getPaintingsByDep, torna i paintings con PARAM = DEPARTMENT senza uso di strutture (no index, ...)
@app.route("/getPaintingsByDep", methods=["GET"])
def getPaintingsByDep():
    department = request.args.get("department")

    if not department:
        return jsonify(
            {"message": "Department query parameter is missing!", "status": 400}
        )

    paintings_coll = db["paintings"]
    query = {"department": {"$regex": department, "$options": "i"}}
    paintings = list(paintings_coll.find(query))

    if not paintings:
        return jsonify(
            {"message": "No paintings found for the given department!", "status": 404}
        )

    return jsonify({"paintings": parse_json(paintings), "status": 200})


########### getDepartements
@app.route("/getDepartments", methods=["GET"])
def getDepartments():
    paintings_coll = db["paintings"]

    departments = paintings_coll.distinct("department")

    if not departments:
        return jsonify({"message": "No departments found!", "status": 404})

    return jsonify({"departments": departments, "status": 200})


########### getPaintingsByArtist, torna i paintings con PARAM = NAME senza uso di strutture (no index, ...)
@app.route("/getPaintingsByArtist", methods=["GET"])
def getPaintingsByArtist():
    name = request.args.get("name")

    if not name:
        return jsonify({"message": "Name query parameter is missing!", "status": 400})

    paintings_coll = db["paintings"]
    query = {"name": {"$regex": name, "$options": "i"}}
    paintings = list(paintings_coll.find(query))

    if not paintings:
        return jsonify(
            {"message": "No paintings found for the given name!", "status": 404}
        )

    return jsonify({"paintings": parse_json(paintings), "status": 200})


########### getPaintingsArtistByIndex, torna i paintings con PARAM = NAME usando l'index
@app.route("/getPaintingsArtistByIndex", methods=["GET"])
def getPaintingsArtistByIndex():
    paintings_coll = db["paintings"]

    # Create a dense secondary non-unique sorted index
    paintings_coll.create_index([("name", ASCENDING)], name="name_index")

    name = request.args.get("name")

    if not name:
        return jsonify({"message": "Name query parameter is missing!", "status": 400})

    query = {"name": {"$regex": name, "$options": "i"}}

    # Find and sort the documents by 'name' field in ascending order
    paintings = list(paintings_coll.find(query).sort("name", ASCENDING))

    if not paintings:
        return jsonify(
            {"message": "No paintings found for the given name!", "status": 404}
        )

    # Convert ObjectId to string in each document
    paintings = [serializeDocument(doc) for doc in paintings]

    return jsonify({"paintings": paintings, "status": 200})


@app.route("/getArtists", methods=["GET"])
def getArtists():
    db = client["MaMo-Art"]

    # Get all collections in the database
    collections = db.list_collection_names()

    # Filter out 'user' and 'paintings'
    collections_to_return = [
        col for col in collections if col not in ["user", "paintings"]
    ]

    # Sort the list of artists
    collections_to_return.sort()

    return {"artists": collections_to_return}, 200


@app.route("/getArtistsPaintings", methods=["GET"])
def getArtistsPaintings():
    name = request.args.get("name")

    if not name:
        return jsonify({"error": "Missing name parameter"}), 400

    db = client["MaMo-Art"]

    # Ensure the artist exists
    if name not in db.list_collection_names():
        return jsonify({"error": "Artist not found"}), 404

    # Get paintings from the artist's collection
    collection = db[name]
    paintings = list(collection.find({}))

    if not paintings:
        return jsonify({"error": "No paintings found"}), 404

    # Format paintings as a list of dictionaries
    formatted_paintings = [
        {
            "title": p.get("title"),
            "date": p.get("date"),
            "medium": p.get("medium"),
            "dimensions": p.get("dimensions"),
            "acquisition_date": p.get("acquisition_date"),
            "credit": p.get("credit"),
            "catalogue": p.get("catalogue"),
            "department": p.get("department"),
            "classification": p.get("classification"),
            "object_number": p.get("object_number"),
            "diameter_cm": p.get("diameter_cm"),
            "circumference_cm": p.get("circumference_cm"),
            "height_cm": p.get("height_cm"),
            "length_cm": p.get("length_cm"),
            "width_cm": p.get("width_cm"),
            "depth_cm": p.get("depth_cm"),
            "weight_kg": p.get("weight_kg"),
            "duration_s": p.get("duration_s"),
        }
        for p in paintings
    ]

    return jsonify({"paintings": formatted_paintings}), 200


def parse_json(data):
    return json.loads(json_util.dumps(data))


if __name__ == "__main__":
    app.run(debug=True, host="localhost", port=5000)
