import csv
import re
import pymongo

# Setup MongoDB client
client = pymongo.MongoClient("mongodb://localhost:27018")
# client = pymongo.MongoClient("mongodb://localhost:27017")
db = client["MaMo-Art"]


# Replaces spaces followed by a comma ( , ) with just a comma (,)
def cleanText(text):
    return re.sub(r"\s+,", ",", text)


# Cleans up the name of the collection by:
# Removing dots from the string if it is at the end of the string
def cleanCollectionName(name):
    cleaned_name = name.strip().rstrip(".")
    return cleaned_name


def loadPaintings():
    print("Loading data into the MongoDB database...")
    paintings = []
    paintings_titles = set()  # Use a set for title uniqueness
    paintings_right = []

    # Read data from the CSV file
    with open("./paintings.csv", "r", encoding="utf-8") as file:
        csv_reader = csv.reader(file)
        for row in csv_reader:
            # Clean each field in the row
            cleaned_row = [cleanText(field) for field in row]
            paintings.append(cleaned_row)

    paintings_coll = db["paintings"]

    # Remove duplicates titles by artist
    for painting in paintings:
        title = painting[1]
        artist_name = painting[3]

        # Use a tuple (title, artist_name) for checking duplicates
        if (title, artist_name) not in paintings_titles:
            paintings_titles.add((title, artist_name))
            paintings_right.append(painting)

    total_paintings = len(paintings_right)

    for index, painting in enumerate(paintings_right):
        new_painting = {
            "id": painting[0],
            "title": painting[1],
            "artist_id": painting[2],
            "name": painting[3],
            "date": painting[4],
            "medium": painting[5],
            "dimensions": painting[6],
            "acquisition_date": painting[7],
            "credit": painting[8],
            "catalogue": painting[9],
            "department": painting[10],
            "classification": painting[11],
            "diameter": painting[13],
            "circumference": painting[14],
            "height": painting[15],
            "length": painting[16],
            "width": painting[17],
            "depth": painting[18],
            "weight": painting[19],
        }
        paintings_coll.insert_one(new_painting)

        # Insert the painting into the respective artist collections
        artist_names = painting[3].split(", ")
        for artist_name in artist_names:
            cleaned_artist_name = cleanCollectionName(artist_name)

            # Skip if the cleaned artist name is empty
            if not cleaned_artist_name:
                continue

            artist_coll = db[cleaned_artist_name]

            filter = {
                "title": painting[1],
                "artist_id": painting[2],
            }
            update = {
                "$set": {
                    "id": painting[0],
                    "title": painting[1],
                    "artist_id": painting[2],
                    "name": painting[3],
                    "date": painting[4],
                    "medium": painting[5],
                    "dimensions": painting[6],
                    "acquisition_date": painting[7],
                    "credit": painting[8],
                    "catalogue": painting[9],
                    "department": painting[10],
                    "classification": painting[11],
                    "diameter": painting[13],
                    "circumference": painting[14],
                    "height": painting[15],
                    "length": painting[16],
                    "width": painting[17],
                    "depth": painting[18],
                    "weight": painting[19],
                }
            }

            artist_coll.update_one(filter, update, upsert=True)

        progress = (index + 1) / total_paintings * 100
        print(f"Progress: {progress:.2f}%")

    print("Collection 'paintings' loaded successfully.")


def loadPaintingsMunch():
    print("Loading Edvard Munch's paintings into the MongoDB database...")
    paintings = []
    paintings_titles = set()  # Use a set for title uniqueness
    paintings_right = []
    starting_id = 218012  # Last +1 id of csv file

    # Read data from the CSV file
    with open("./edvard_munch.csv", "r", encoding="utf-8") as file:
        csv_reader = csv.reader(file)
        for row in csv_reader:
            # Clean each field in the row
            cleaned_row = [cleanText(field) for field in row]
            paintings.append(cleaned_row)

    # Get the MongoDB collections
    paintings_coll = db["paintings"]
    munch_coll = db["Edvard Munch"]

    # Remove duplicate titles by keeping unique "title", "artist_id", and "name"
    for painting in paintings:
        title = painting[1]
        artist_name = painting[3]

        # Use a tuple (title, artist_name) for checking duplicates
        if (title, artist_name) not in paintings_titles:
            paintings_titles.add((title, artist_name))
            paintings_right.append(painting)

    total_paintings = len(paintings_right)

    for index, painting in enumerate(paintings_right):
        title = painting[1]
        artist_id = "4164"
        artist_name = "Edvard Munch"

        # Check for duplicates in the 'paintings' collection and 'Edvard Munch' collection based on (title, artist_name)
        existing_in_paintings = paintings_coll.find_one(
            {"title": title, "name": artist_name}
        )
        existing_in_munch = munch_coll.find_one({"title": title, "name": artist_name})

        if existing_in_paintings or existing_in_munch:
            print(f"Skipping duplicate painting: '{title}' by {artist_name}")
            continue

        # Create the painting document
        new_painting = {
            "id": str(starting_id + index),
            "title": painting[1],
            "artist_id": artist_id,
            "name": artist_name,
            "date": painting[3],
            "medium": painting[5],
            "dimensions": painting[6],
            "acquisition_date": "",
            "credit": "",
            "catalogue": "",
            "department": "",
            "classification": "",
            "diameter": "",
            "circumference": "",
            "height": "",
            "length": "",
            "width": "",
            "depth": "",
            "weight": "",
        }

        # Insert into both collections
        munch_coll.insert_one(new_painting)
        paintings_coll.insert_one(new_painting)

        # Calculate and print progress
        progress = (index + 1) / total_paintings * 100
        print(f"Progress: {progress:.2f}%")

    print("Collection 'paintings of Munch' loaded successfully.")


def loadArtists():
    print("Loading data into the MongoDB database...")
    artists = []

    # Read data from the CSV file
    with open("./artists.csv", "r", encoding="utf-8") as file:
        csv_reader = csv.reader(file)
        for row in csv_reader:
            artists.append(row)

    artists_coll = db["artists"]

    for artist in artists:
        new_artist = {
            "id": artist[0],
            "name": artist[1],
            "nationality": artist[2],
            "gender": artist[3],
            "birth_year": artist[4],
            "death_year": artist[5],
        }
        artists_coll.insert_one(new_artist)

    print("Collection 'artists' loaded successfully.")


loadPaintings()
loadArtists()
loadPaintingsMunch()
