from flask import Flask, request, jsonify
import requests
import json

app = Flask(__name__)

# ========== ESTILOS MUSICAIS ==========
ESTILOS_MUSICAIS = {
    'lofi': {'nome': 'Lo-Fi Beats', 'seeds': ['lo-fi beats', 'study beats', 'chill lo-fi'], 'descricao': 'Batidas relaxantes para foco total', 'icon': '🎧'},
    'classica': {'nome': 'Música Clássica', 'seeds': ['classical', 'classical study', 'classical focus'], 'descricao': 'Composições para concentração profunda', 'icon': '🎻'},
    'piano': {'nome': 'Piano Relaxante', 'seeds': ['piano chill', 'piano study', 'solo piano'], 'descricao': 'Piano suave para leitura e redação', 'icon': '🎹'},
    'jazz': {'nome': 'Jazz Suave', 'seeds': ['jazz', 'smooth jazz', 'jazz for study'], 'descricao': 'Jazz instrumental para manter o ritmo', 'icon': '🎷'},
    'eletronica': {'nome': 'Eletrônica Focus', 'seeds': ['electronic focus', 'ambient electronic', 'deep house study'], 'descricao': 'Eletrônica instrumental para alta produtividade', 'icon': '⚡'},
    'ambient': {'nome': 'Ambient', 'seeds': ['ambient', 'ambient study', 'white noise ambient'], 'descricao': 'Som ambiente para imersão total', 'icon': '🌌'},
    'rock': {'nome': 'Rock Instrumental', 'seeds': ['instrumental rock', 'post rock', 'rock study'], 'descricao': 'Rock sem vocais para manter energia', 'icon': '🎸'},
    'indie': {'nome': 'Indie Folk', 'seeds': ['indie folk', 'acoustic study', 'indie acoustic'], 'descricao': 'Indie acústico para estudos tranquilos', 'icon': '🪕'},
    'hiphop': {'nome': 'Hip-Hop Beats', 'seeds': ['hip hop instrumental', 'lo-fi hip hop', 'boom bap beats'], 'descricao': 'Beats de hip-hop para manter o flow', 'icon': '🎤'},
    'bossa': {'nome': 'Bossa Nova', 'seeds': ['bossa nova', 'brazilian jazz', 'bossa nova study'], 'descricao': 'Bossa nova brasileira para relaxar', 'icon': '🌴'}
}

# ========== ROTA: LISTAR ESTILOS ==========
@app.route('/api/spotify/estilos')
def listarEstilos():
    return jsonify({
        'estilos': [
            {'id': key, 'nome': val['nome'], 'descricao': val['descricao'], 'icon': val['icon'], 'seeds': val['seeds']}
            for key, val in ESTILOS_MUSICAIS.items()
        ]
    })

# ========== ROTA: LISTAR PLAYLISTS DO USUÁRIO ==========
@app.route('/api/spotify/minhas-playlists')
def listarMinhasPlaylists():
    access_token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not access_token:
        return jsonify({'error': 'Token de acesso ausente'}), 401

    response = requests.get('https://api.spotify.com/v1/me/playlists?limit=50', headers={
        'Authorization': 'Bearer ' + access_token
    })

    if response.status_code != 200:
        return jsonify({'error': 'Erro ao buscar playlists: ' + response.text}), response.status_code

    data = response.json()
    playlists = []
    for item in data.get('items', []):
        playlists.append({
            'id': item['id'],
            'name': item['name'],
            'description': item.get('description', ''),
            'image': item['images'][0]['url'] if item.get('images') else '',
            'tracks_total': item['tracks']['total'] if item.get('tracks') else 0,
            'owner': item['owner']['display_name'] if item.get('owner') else '',
            'uri': item['uri'],
            'url': item['external_urls']['spotify'] if item.get('external_urls') else ''
        })

    return jsonify({'playlists': playlists, 'total': data.get('total', len(playlists))})

# ========== ROTA: BUSCAR MÚSICAS DE UMA PLAYLIST ESPECÍFICA ==========
@app.route('/api/spotify/playlist-tracks')
def buscarTracksPlaylist():
    playlist_id = request.args.get('playlist_id')
    access_token = request.headers.get('Authorization', '').replace('Bearer ', '')

    if not playlist_id:
        return jsonify({'error': 'playlist_id ausente'}), 400
    if not access_token:
        return jsonify({'error': 'Token de acesso ausente'}), 401

    todas_musicas = []
    offset = 0
    limit = 100

    # Paginação — Spotify retorna máx 100 faixas por requisição
    while True:
        url = 'https://api.spotify.com/v1/playlists/' + playlist_id + '/tracks?limit=' + str(limit) + '&offset=' + str(offset) + '&fields=items(track(id,uri,name,duration_ms,preview_url,artists(name),album(name,images(url))))'
        response = requests.get(url, headers={'Authorization': 'Bearer ' + access_token})

        if response.status_code != 200:
            return jsonify({'error': 'Erro ao buscar faixas: ' + response.text}), response.status_code

        data = response.json()
        items = data.get('items', [])

        if not items:
            break

        for item in items:
            track = item.get('track')
            if not track or not track.get('id'):
                continue

            artistas = track.get('artists', [])
            artista_nome = artistas[0]['name'] if artistas else 'Desconhecido'

            album = track.get('album', {})
            imagens = album.get('images', [])

            todas_musicas.append({
                'id': track['id'],
                'uri': track['uri'],
                'name': track['name'],
                'artist': artista_nome,
                'album': album.get('name', ''),
                'duration_ms': track.get('duration_ms', 0),
                'image': imagens[0]['url'] if imagens else '',
                'preview_url': track.get('preview_url', '')
            })

        if len(items) < limit:
            break

        offset += limit

    return jsonify({
        'playlist_id': playlist_id,
        'total': len(todas_musicas),
        'musicas': todas_musicas
    })

# ========== ROTA: BUSCAR MÚSICAS POR ESTILO (mantida para o criador) ==========
@app.route('/api/spotify/buscar-por-estilo')
def buscarPorEstilo():
    estilo_id = request.args.get('estilo')
    access_token = request.headers.get('Authorization', '').replace('Bearer ', '')

    if not estilo_id or estilo_id not in ESTILOS_MUSICAIS:
        return jsonify({'error': 'Estilo inválido'}), 400
    if not access_token:
        return jsonify({'error': 'Token de acesso ausente'}), 401

    estilo = ESTILOS_MUSICAIS[estilo_id]
    todas_musicas = []

    for seed in estilo['seeds']:
        url = 'https://api.spotify.com/v1/search?q=' + requests.utils.quote(seed) + '&type=track&limit=10'
        response = requests.get(url, headers={'Authorization': 'Bearer ' + access_token})

        if response.status_code == 200:
            tracks = response.json().get('tracks', {}).get('items', [])
            for track in tracks:
                if track['id'] not in [m['id'] for m in todas_musicas]:
                    todas_musicas.append({
                        'id': track['id'],
                        'uri': track['uri'],
                        'name': track['name'],
                        'artist': track['artists'][0]['name'] if track['artists'] else 'Desconhecido',
                        'album': track['album']['name'] if track.get('album') else '',
                        'duration_ms': track['duration_ms'],
                        'image': track['album']['images'][0]['url'] if track.get('album', {}).get('images') else '',
                        'preview_url': track.get('preview_url', '')
                    })

    return jsonify({
        'estilo': estilo_id,
        'estilo_nome': estilo['nome'],
        'total': len(todas_musicas[:30]),
        'musicas': todas_musicas[:30]
    })

# ========== ROTA: CRIAR PLAYLIST ==========
@app.route('/api/spotify/criar-playlist', methods=['POST'])
def criarPlaylist():
    data = request.json
    access_token = data.get('access_token')
    user_id = data.get('user_id')
    nome_playlist = data.get('nome', 'Playlist VestHub')
    descricao = data.get('descricao', 'Playlist criada pelo VestHub')
    track_uris = data.get('track_uris', [])

    if not access_token or not user_id:
        return jsonify({'error': 'Token ou user_id ausente'}), 401
    if not track_uris:
        return jsonify({'error': 'Nenhuma música selecionada'}), 400

    headers = {'Authorization': 'Bearer ' + access_token, 'Content-Type': 'application/json'}

    # 1. Criar playlist vazia
    create_url = 'https://api.spotify.com/v1/users/' + user_id + '/playlists'
    create_response = requests.post(create_url, headers=headers, json={
        'name': nome_playlist, 'description': descricao, 'public': False
    })

    if create_response.status_code != 201:
        return jsonify({'error': 'Erro ao criar playlist: ' + create_response.text}), create_response.status_code

    playlist_data = create_response.json()
    playlist_id = playlist_data['id']
    playlist_url = playlist_data['external_urls']['spotify']

    # 2. Adicionar músicas (máx 100 por requisição)
    add_url = 'https://api.spotify.com/v1/playlists/' + playlist_id + '/tracks'
    for i in range(0, len(track_uris), 100):
        batch = track_uris[i:i + 100]
        add_response = requests.post(add_url, headers=headers, json={'uris': batch})
        if add_response.status_code not in [200, 201]:
            return jsonify({'error': 'Playlist criada mas erro ao adicionar músicas', 'playlist_url': playlist_url}), 500

    return jsonify({
        'success': True,
        'playlist_id': playlist_id,
        'playlist_url': playlist_url,
        'total_musicas': len(track_uris),
        'nome': nome_playlist
    })

# ========== ROTA: OBTER PERFIL ==========
@app.route('/api/spotify/me')
def obterPerfil():
    access_token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not access_token:
        return jsonify({'error': 'Token ausente'}), 401

    response = requests.get('https://api.spotify.com/v1/me', headers={'Authorization': 'Bearer ' + access_token})
    if response.status_code != 200:
        return jsonify({'error': 'Erro ao obter perfil'}), response.status_code

    data = response.json()
    return jsonify({
        'id': data['id'],
        'display_name': data.get('display_name', data['id']),
        'email': data.get('email', ''),
        'image': data['images'][0]['url'] if data.get('images') else '',
        'product': data.get('product', 'free')
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
