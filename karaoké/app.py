from flask import Flask, request, jsonify, render_template
from youtubesearchpython import VideosSearch
import lyricsgenius

app = Flask(__name__)

genius_token = "9LUNKoN_PDPHs1zNvvY0vsvZgndrqYE266Sek0RGZ2kjuebwz1MX_d_9jWdlUEbL"
genius = lyricsgenius.Genius(genius_token)

def get_youtube_link(artist, song_title):
    search = VideosSearch(f"{song_title} {artist}", limit=1)
    result = search.result()
    if result['result']:
        return result['result'][0]['link']
    return None

def get_lyrics(artist, song_title):
    song = genius.search_song(song_title, artist)
    if song:
        return song.url, song.lyrics
    return None, None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search', methods=['POST'])
def search():
    data = request.json
    artist = data.get('artist')
    song_title = data.get('song_title')
    
    youtube_link = get_youtube_link(artist, song_title)
    genius_url, lyrics = get_lyrics(artist, song_title)
    
    if youtube_link and lyrics:
        return jsonify({
            'youtube_link': youtube_link,
            'genius_url': genius_url,
            'lyrics': lyrics
        })
    else:
        return jsonify({'error': 'Informations introuvables'}), 404

if __name__ == "__main__":
    app.run(debug=True)
