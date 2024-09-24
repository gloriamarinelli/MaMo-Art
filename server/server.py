import json
import re
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
        return jsonify({"message": "Login was successful.", "status": 200})

    return jsonify(
        {"message": "ERROR: Wrong username and/or password. ", "status": 400}
    )


########### getPaintingsFilter, get all paintings with PARAM = TITLE, DEPARTMENT, NAME using the filter method
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

    paintings = list(
        paintings_coll.find(query).sort(
            [("title", ASCENDING), ("department", ASCENDING), ("name", ASCENDING)]
        )
    )

    paintings = [serializeDocument(doc) for doc in paintings]

    return jsonify({"paintings": paintings, "status": 200})


########### getPaintings, get all paintings without any structure
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


########### getPaintingsDetails, get all paintings with PARAM = ID with an index
@app.route("/getPaintingsDetails", methods=["GET"])
def getPaintingsDetails():
    paintings_coll = db["paintings"]

    # Create a dense secondary non-unique sorted index
    paintings_coll.create_index([("id", ASCENDING)], name="id_index")

    id = request.args.get("id")

    if not id:
        return jsonify({"message": "ID query parameter is missing!", "status": 400})

    query = {"id": id}

    paintings = list(paintings_coll.find(query).sort("id", ASCENDING))

    if not paintings:
        return jsonify(
            {"message": "No paintings found for the given ID!", "status": 404}
        )

    paintings = [serializeDocument(doc) for doc in paintings]

    return jsonify({"paintings": paintings, "status": 200})


def serializeDocument(doc):
    if "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc


########### getPaintingsTitle, get all paintings with PARAM = TITLE without any structure
@app.route("/getPaintingsTitle", methods=["GET"])
def getPaintingsTitle():
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


########### getPaintingsTitleByIndex, get all paintings with PARAM = TITLE using an index
@app.route("/getPaintingsTitleByIndex", methods=["GET"])
def getPaintingsTitleByIndex():
    paintings_coll = db["paintings"]

    # Create a dense secondary non-unique sorted index
    paintings_coll.create_index([("title", ASCENDING)], name="title_index")

    title = request.args.get("title")

    if not title:
        return jsonify({"message": "Title query parameter is missing!", "status": 400})

    query = {"title": {"$regex": title, "$options": "i"}}

    # Find and sort the documents by 'name' field in ascending order
    paintings = list(paintings_coll.find(query).sort("title", ASCENDING))

    if not paintings:
        return jsonify(
            {"message": "No paintings found for the given title!", "status": 404}
        )

    paintings = [serializeDocument(doc) for doc in paintings]

    return jsonify({"paintings": paintings, "status": 200})


########### getDepartements, get all departments without any structure
@app.route("/getDepartments", methods=["GET"])
def getDepartments():
    paintings_coll = db["paintings"]

    departments = paintings_coll.distinct("department")

    if not departments:
        return jsonify({"message": "No departments found!", "status": 404})

    return jsonify({"departments": departments, "status": 200})


########### getPaintingsDep, get all paintings with PARAM = DEPARTMENT without any structure
@app.route("/getPaintingsDep", methods=["GET"])
def getPaintingsDep():
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


########### getPaintingsDepByIndex, get all paintings with PARAM = DEPARTMENT using an index
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

    paintings = [serializeDocument(doc) for doc in paintings]

    return jsonify({"paintings": paintings, "status": 200})


########### getPaintingsArtist, get all paintings with PARAM = NAME without any structure
@app.route("/getPaintingsArtist", methods=["GET"])
def getPaintingsArtist():
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


########### getArtists, use of the collections (except 'user' , 'paintings' and 'artists' ) in the database
@app.route("/getArtists", methods=["GET"])
def getArtists():
    db = client["MaMo-Art"]

    # Get all collections in the database
    collections = db.list_collection_names()

    # Filter out 'user' and 'paintings' and 'orders' collections
    collections_to_return = [
        col
        for col in collections
        if col not in ["user", "paintings", "orders", "artists"]
    ]

    # Sort the list of artists
    collections_to_return.sort()

    return {"artists": collections_to_return}, 200


########### getPaintingsArtistByIndex, get all paintings with PARAM = NAME using an index
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

    paintings = [serializeDocument(doc) for doc in paintings]

    return jsonify({"paintings": paintings, "status": 200})


########### getArtistsPaintings, get all paintings with PARAM = NAME without any structure
@app.route("/getArtistsPaintings", methods=["GET"])
def getArtistsPaintings():
    name = request.args.get("name")

    if not name:
        return jsonify({"message": "Name query parameter is missing!", "status": 400})

    db = client["MaMo-Art"]

    # Ensure the artist exists
    if name not in db.list_collection_names():
        {"message": "No artists found for the given name!", "status": 404}

    # Get paintings from the artist's collection
    collection = db[name]
    paintings = list(collection.find({}))

    if not paintings:
        {"message": "No paintings found for the given name!", "status": 404}

    # list of dictionaries
    details_painting = [
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

    return jsonify({"paintings": details_painting}), 200


########### getBio, get the biography of an artist with PARAM = NAME
@app.route("/getBio", methods=["GET"])
def getBio():
    name = request.args.get("name")

    if not name:
        return jsonify({"message": "Name parameter is required!", "status": 400})

    artists_coll = db["artists"]

    artist = artists_coll.find_one({"name": {"$regex": name, "$options": "i"}})

    if not artist:
        {"message": "No artists found for the given name!", "status": 404}

    artist["_id"] = str(artist["_id"])

    return jsonify({"artist": artist, "status": 200})


########### addtocart, add an item to the cart with PARAM = ORDER_ID, USERNAME, ARTWORK_ID
@app.route("/addtocart", methods=["POST"])
def addtocart():
    data = request.get_json()

    cart_coll = db["orders"]

    order_id = data.get("order_id")
    username = data.get("username")
    artwork_id = data.get("artwork_id")
    timestamp = datetime.now()

    if not order_id or not username or not artwork_id:
        return jsonify({"error": "Missing required fields"}), 400

    cart_data = {
        "order_id": order_id,
        "username": username,
        "artwork_id": artwork_id,
        "timestamp": timestamp,
    }

    result = cart_coll.insert_one(cart_data)

    return (
        jsonify({"message": "Item added to cart", "cart_id": str(result.inserted_id)}),
        201,
    )


########### getUserOrders, get all orders with PARAM = USERNAME with an index
@app.route("/getUserOrders", methods=["GET"])
def getUserOrders():
    username = request.args.get("username")

    if not username:
        return jsonify({"error": "Missing username parameter"}), 400

    cart_coll = db["orders"]

    cart_coll.create_index([("username", ASCENDING)], name="username_index")

    query = {"username": username}

    orders_details = {"order_id": 1, "artwork_id": 1, "timestamp": 1, "_id": 0}

    orders = list(cart_coll.find(query, orders_details).sort("timestamp", DESCENDING))

    return jsonify({"cart": parse_json(orders)}), 200


"""@app.route("/searchPaintings", methods=["GET"])
def searchPaintings():
    start_year = request.args.get("start_year", type=int)
    end_year = request.args.get("end_year", type=int)

    if start_year is None or end_year is None:
        return jsonify(
            {"message": "Both start_year and end_year are required.", "status": 400}
        )

    paintings_coll = db["paintings"]

    # Creare una query per cercare quadri nel range di date
    query = {
        "$or": [
            {
                "date": {
                    "$regex": r"^\d{4}$",
                    "$gte": str(start_year),
                    "$lte": str(end_year),
                }
            },  # Format xxxx
            {
                "date": {
                    "$regex": r"^\d{4}-\d{2}$",
                    "$gte": f"{start_year}-01",
                    "$lte": f"{end_year}-12",
                }
            },  # Format xxxx-xx
            {
                "date": {
                    "$regex": r"^\d{4}-\d{4}$",
                    "$gte": f"{start_year}-01",
                    "$lte": f"{end_year}-12",
                }
            },  # Format xxxx-xxxx
        ]
    }

    projection = {"title": 1, "date": 1, "_id": 0}

    results = list(paintings_coll.find(query, projection))

    return jsonify(json.loads(json_util.dumps(results)))
"""


def parse_json(data):
    return json.loads(json_util.dumps(data))


if __name__ == "__main__":
    app.run(debug=True, host="localhost", port=5000)
