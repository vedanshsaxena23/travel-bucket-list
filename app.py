import os
import sqlite3
import io
from flask import Flask, render_template, jsonify, send_file, request
from flask_cors import CORS
from waitress import serve
import logging
import sys 

# 1. Configure logging to stream directly to the terminal (stdout/stderr)
logging.basicConfig(
    stream=sys.stdout,           # Forces logs to go to the terminal screen
    level=logging.INFO,          # Captures info, warnings, and errors
    format='%(asctime)s [%(levelname)s] %(message)s', # Formats with timestamps
    datefmt='%Y-%m-%d %H:%M:%S'
)

# 2. Tell Waitress to talk to the logger so you see HTTP traffic
logger = logging.getLogger('waitress')
logger.setLevel(logging.INFO)

# Define database file path
DATABASE_PATH = os.path.join(os.path.dirname(__file__), 'database', 'main.db')


api_keyword = "/api"


def init_db():
    """Initializes the database by creating tables and seeding default data if empty."""
    # Ensure database directory exists
    os.makedirs(os.path.dirname(DATABASE_PATH), exist_ok=True)
    
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    # Schema migration check: Drop table if it exists but lacks the image_blob column
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='destinations'")
    if cursor.fetchone():
        cursor.execute("PRAGMA table_info(destinations)")
        columns = [row[1] for row in cursor.fetchall()]
        if 'image_blob' not in columns:
            cursor.execute("DROP TABLE destinations")
            conn.commit()

    # Create the destinations table matching frontend structure
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS destinations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            destination TEXT NOT NULL,
            location TEXT NOT NULL,
            tagline TEXT,
            moreaboutplace TEXT,
            notes TEXT,
            article_link TEXT,
            image_url TEXT,
            image_blob BLOB,
            main_characteristics TEXT
        )
    ''')
    
    # Check if table is already seeded
    cursor.execute('SELECT COUNT(*) FROM destinations')
    count = cursor.fetchone()[0]
    
    if count == 0:
        # Seed with initial travel bucket list destinations from the UI (image_blob set to None for seeded data)
        seed_data = [
            (
                "Venice", "Italy", 
                "Venice: A city of reflections.",
                "Venice is eternity itself, floating on water. It is built on a group of 126 islands that are separated by expanses of open water and by canals; portions of the city are linked by 472 bridges.",
                "To explore the beautiful canals, historic bridges, and romantic scenery.",
                "https://whc.unesco.org/en/list/394/",
                "https://i0.wp.com/picjumbo.com/wp-content/uploads/venice-canals-italy-free-photo.jpg?w=2210&quality=70",
                None,
                "Romance,Elegance,Timelessness"
            ),
            (
                "Kyoto", "Japan",
                "Kyoto: The City of Ten Thousand Shrines.",
                "Kyoto is famous for its numerous classical Buddhist temples, gardens, imperial palaces, and traditional wooden houses. It was the capital of Japan for over a millennium and remains the country's cultural soul.",
                "To see the beautiful shrines, peaceful Zen gardens, and experience traditional Japanese culture.",
                "https://en.wikipedia.org/wiki/Kyoto",
                "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2670&auto=format&fit=crop",
                None,
                "Tradition,Zen,Culture"
            ),
            (
                "Santorini", "Greece",
                "Santorini: The Gem of the Aegean.",
                "Santorini is one of the Cyclades islands in the Aegean Sea. Rebuilt after a massive volcanic eruption, it features stunning caldera views and sunset-drenched clifftop villages.",
                "To view the magnificent sunsets and the iconic white-washed houses with blue domes.",
                "https://en.wikipedia.org/wiki/Santorini",
                "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2600&auto=format&fit=crop",
                None,
                "Sunsets,Volcanic,Iconic"
            ),
            (
                "Machu Picchu", "Peru",
                "Machu Picchu: Above the Clouds.",
                "Machu Picchu is an Incan citadel set high in the Andes Mountains in Peru. Built in the 15th century, it is a masterpiece of engineering and a testament to the Inca Empire's grandeur.",
                "To witness the ancient mystery and spectacular architectural achievements of the Incas.",
                "https://en.wikipedia.org/wiki/Machu_Picchu",
                "https://www.new7wonders.com/app/uploads/sites/3/2016/08/scott-umstattd-87129-1920x1280.jpg",
                None,
                "Ancient,Mystery,Incan"
            ),
            (
                "Paris", "France",
                "Paris: A moveable feast.",
                "Paris is a global center for art, fashion, gastronomy, and culture. From the Eiffel Tower to the Louvre, the city exudes an unparalleled elegance and romantic charm.",
                "To visit world-renowned landmarks, museums, and experience the Parisian lifestyle.",
                "https://en.wikipedia.org/wiki/Paris",
                "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2673&auto=format&fit=crop",
                None,
                "Fashion,Art,Cafes"
            ),
            (
                "Iceland", "Iceland",
                "Iceland: Land of Fire and Ice.",
                "Iceland is defined by its dramatic landscape with volcanoes, geysers, hot springs and lava fields. Massive glaciers are protected in Vatnajökull and Snæfellsjökull national parks.",
                "To see the northern lights, active volcanoes, majestic glaciers, and geysers.",
                "https://en.wikipedia.org/wiki/Iceland",
                "https://images.unsplash.com/photo-1476610182048-b716b8518aae?q=80&w=2659&auto=format&fit=crop",
                None,
                "Nature,Aurora,Wild"
            ),
            (
                "Petra", "Jordan",
                "Petra: A city half as old as time.",
                "Petra is a historical and archaeological city in southern Jordan. Famous for its rock-cut architecture, it was the capital of the Nabataean Kingdom in the 4th century BC.",
                "To marvel at the archaeological ruins and the spectacular Treasury carved into the sandstone cliffs.",
                "https://en.wikipedia.org/wiki/Petra",
                "https://lh3.googleusercontent.com/gps-cs-s/APNQkAEb_c9s75EmEefeC1PIktt6xS-waAriTNdAmzPDqwpfGh7pZpB1woI_GjGNC-mXHBF7EU-LYsWXhvTv_3C4wqbkVqDgD9-PImdREfvq_CAGmj01Dd1a2BH6MzvFaV2WYFZed-7F=s1360-w1360-h1020",
                None,
                "Archaeology,Desert,History"
            ),
            (
                "Bali", "Indonesia",
                "Bali: Tropical Paradise.",
                "Bali is an Indonesian island known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs. It is a haven for both adventure and spiritual seekers.",
                "To enjoy the tropical beaches, rice terrace scenery, and spiritual atmosphere.",
                "https://en.wikipedia.org/wiki/Bali",
                "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2638&auto=format&fit=crop",
                None,
                "Tropical,Spirituality,Beaches"
            ),
            (
                "New York City", "USA",
                "NYC: The City That Never Sleeps.",
                "New York City comprises 5 boroughs sitting where the Hudson River meets the Atlantic Ocean. It is a global hub of finance, media, and culture with an iconic skyline.",
                "To feel the energetic pulse of the big city, Broadway shows, and walk through Central Park.",
                "https://en.wikipedia.org/wiki/New_York_City",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/New_york_times_square-terabass_%28cropped%29.jpg/960px-New_york_times_square-terabass_%28cropped%29.jpg",
                None,
                "Urban,Skyline,Hustle"
            ),
            (
                "Swiss Alps", "Switzerland",
                "Swiss Alps: Snowy Heights.",
                "Swiss Alps represent a major natural feature of Switzerland, offering breathtaking landscapes, world-class skiing, and charming mountain villages like Zermatt.",
                "To experience winter sports and enjoy the stunning snow-capped mountains.",
                "https://en.wikipedia.org/wiki/Swiss_Alps",
                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2670&auto=format&fit=crop",
                None,
                "Mountains,Skiing,Luxury"
            ),
            (
                "Bagan", "Myanmar",
                "Bagan: Spiritual Horizon.",
                "Bagan is an ancient city in Myanmar. From the 9th to 13th centuries, over 10,000 Buddhist temples and pagodas were constructed, of which over 2,000 remain today.",
                "To view the sunrise over the vast plain of thousands of historic temples.",
                "https://en.wikipedia.org/wiki/Bagan",
                "https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?q=80&w=2672&auto=format&fit=crop",
                None,
                "Pagodas,Sunrise,Serenity"
            )
        ]
        
        cursor.executemany('''
            INSERT INTO destinations (
                destination, location, tagline, moreaboutplace, notes, article_link, image_url, image_blob, main_characteristics
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', seed_data)
        conn.commit()
        print("Database initialized and seeded successfully.")
    else:
        print("Database already initialized. Table has records.")
        
    conn.close()

# Initialize Flask with custom folder paths
app = Flask(__name__, 
            static_folder='dist', 
            template_folder='dist',
            static_url_path='')

CORS(app)

# Perform database initialization
init_db()

@app.route('/')
def index():
    # This will now look for index.html inside the 'dist' folder
    return render_template('index.html')


@app.route(api_keyword + "/hello", methods = ["POST", "GET"])
def hello_wrold():
    return jsonify({"message": "Hello World"}), 200

@app.route(api_keyword + "/sendall", methods = ["GET"])
def sendall():
    try:
        with sqlite3.connect(DATABASE_PATH) as conn:
            cursor = conn.cursor()
            cursor.execute("Select * from destinations;")
            data = cursor.fetchall();
            newdata = []
            newdata = []
            for row in data:
                # Check if image_blob (index 8) contains actual binary payload
                if row[8] is not None:
                    final_image_url = api_keyword + f"/img/{row[0]}"
                else:
                    final_image_url = row[7] # Fallback to standard text image_url string (index 7)

                # Construct a clean dictionary to match your React Card mapping properties
                newdata.append({
                    "id": row[0],
                    "destination": row[1],
                    "location": row[2],
                    "tagline": row[3],
                    "moreaboutplace": row[4],
                    "notes": row[5],
                    "article_link": row[6],
                    "image_url": final_image_url,
                    "main_characteristics": row[9]
                })
            return jsonify(newdata), 200
    except:
        return jsonify({"error": "Server Error"}), 400

@app.route(api_keyword + "/img/<imagetoken>", methods = ["GET"])
def imagereturn(imagetoken):
    try: 
        with sqlite3.connect(DATABASE_PATH) as conn:
            cursor = conn.cursor();
            cursor.execute("Select image_blob from destinations where id = ?", [imagetoken,])
            row = cursor.fetchone()
            if row and row[0]:
                return send_file(
                    io.BytesIO(row[0]),
                    mimetype='image/jpeg'
                )
            else:
                return jsonify({"error": "Image asset not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route(api_keyword + "/destinations", methods=["POST"])
def destinations():
    # return jsonify({"error": f"Internal Server Error: Sample Error"}), 500
    # To toggle error during development
    try:
        # 1. Grab all text fields from request.form (mapped from React's state fields)
        destination = request.form.get('destination')
        location = request.form.get('location')
        tagline = request.form.get('tagline')
        more_about_place = request.form.get("moreaboutplace")
        notes = request.form.get("notes")
        article_link = request.form.get("articleLink")
        main_characteristics = request.form.get("main_characteristics") # Receives string like "Romance,Elegance"
        image_type = request.form.get("imageType") # "url" or "upload"

        # Basic validation
        if not destination or not location:
            return jsonify({"error": "Destination Name and Country/Region are required fields."}), 400

        # Initialize placeholders for the database columns
        image_url = None
        image_blob = None

        # 2. Process image logic dynamically depending on the active frontend choice
        if image_type == "url":
            image_url = request.form.get("imageLink")
        elif image_type == "upload":
            if "imageFile" in request.files:
                file = request.files["imageFile"]
                if file and file.filename != "":
                    # Read the binary stream of the uploaded file straight into memory
                    image_blob = file.read()

        # 3. Insert the parameters into your SQLite destinations table
        with sqlite3.connect(DATABASE_PATH) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO destinations (
                    destination, location, tagline, moreaboutplace, notes, 
                    article_link, image_url, image_blob, main_characteristics
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                destination, location, tagline, more_about_place, notes,
                article_link, image_url, image_blob, main_characteristics
            ))
            conn.commit()

        print(f" Successfully inserted new destination: {destination}")
        return jsonify({"status": "success", "message": f"Successfully added {destination} to your bucket list!"}), 201

    except Exception as e:
        print(f"❌ Error inserting destination into SQL: {str(e)}")
        return jsonify({"error": f"Internal Server Error: {str(e)}"}), 500

if __name__ == '__main__':
    # app.run(debug=True)
    print("Starting Waitress server")
    serve(app, host='0.0.0.0', port=8080, threads=4)