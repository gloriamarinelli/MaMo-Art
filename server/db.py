import csv
import re
import pymongo

# Setup MongoDB client
client = pymongo.MongoClient('mongodb://localhost:27017')
db = client['MaMo-Art']

def cleanText(text):
   return re.sub(r'\s+,', ',', text)

def loadData():
    print("Loading data into the MongoDB database...")
    paintings = []
    paintings_titles = set()  # Use a set for title uniqueness
    paintings_right = []

    # Read data from the CSV file
    with open('./paintings.csv', 'r', encoding='utf-8') as file:
        csv_reader = csv.reader(file)
        for row in csv_reader:
            # Clean each field in the row
            cleaned_row = [cleanText(field) for field in row]
            paintings.append(cleaned_row)
    
    # Get the MongoDB collection
    paintings_coll = db['paintings']

    # Remove duplicates titles
    for painting in paintings:
        title = painting[1]
        if title not in paintings_titles:
            paintings_titles.add(title)  
            paintings_right.append(painting)
    
    total_paintings = len(paintings_right)

    # Insert each painting into the collection with progress indicator
    for index, painting in enumerate(paintings_right):
        new_painting = {
            'id': painting[0], 'title': painting[1], 'artist_id': painting[2],
            'name': painting[3], 'date': painting[4], 'medium': painting[5],
            'dimensions': painting[6], 'acquisition_date': painting[7],
            'credit': painting[8], 'catalogue': painting[9], 'department': painting[10],
            'classification': painting[11], 'diameter': painting[13], 'circumference': painting[14],
            'height': painting[15], 'length': painting[16], 'width': painting[17],
            'depth': painting[18], 'weight': painting[19]
        }
        paintings_coll.insert_one(new_painting)

        # Calculate and print progress
        progress = (index + 1) / total_paintings * 100
        print(f"Progress: {progress:.2f}%")

    print("Collection 'paintings' loaded successfully.")

def createArtistCollections():
    print("Creating artist collections...")

    # Get the MongoDB collection
    paintings_coll = db['paintings']
    
    # Dictionary to hold artist data
    artist_data = {}

    # Iterate through all paintings and group them by artist
    for painting in paintings_coll.find():
        artist_id = painting.get('artist_id', '')
        
        # Skip paintings with multiple artist IDs
        if ',' in artist_id:
            print(f"Skipping painting with multiple artist IDs: {painting}")
            continue

        artist_name = painting.get('name', '')
        if artist_name:
            if artist_name not in artist_data:
                artist_data[artist_name] = []
            artist_data[artist_name].append(painting)

    # Create a new collection for each artist and insert their paintings
    for artist_name, paintings in artist_data.items():
        # Create a collection for each artist, sanitized for MongoDB collection name rules
        sanitized_artist_name = artist_name.replace(' ', '_').replace('/', '_')
        artist_coll = db[sanitized_artist_name]

        # Insert all paintings for the artist into their collection
        artist_coll.insert_many(paintings)
        print(f"Collection '{sanitized_artist_name}' created and populated with {len(paintings)} paintings.")

    print("All artist collections created successfully.")

# Call the function to load the data and create artist collections
loadData()
createArtistCollections()
