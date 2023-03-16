import flask
from flask import Blueprint
import flask_cors
from utils import *
import openai


openai.api_key = ''

app = flask.Flask(__name__)
flask_cors.CORS(app)

MODEL_CHAT = "gpt-3.5-turbo"
MODEL_SUMMARIZE = "gpt-3.5-turbo"
MODEL_TRANSLATE = "gpt-3.5-turbo"

api = Blueprint('api', __name__, url_prefix='/api/v1')


@api.route('/chat', methods=['POST'])
def chat():
    messages = remove_id_from_messages(flask.request.json['messages'])
    try:
        filtered_messages = limit_tokens(messages)

        completion = openai.ChatCompletion.create(
            model=MODEL_CHAT,
            messages=filtered_messages,
            temperature=0.7,
            top_p=0.5,
        )

        return flask.jsonify({'message': completion['choices'][0]['message']['content']})
    
    except Exception as e:
        return flask.jsonify({'error': str(e)})
    
@api.route('/transcribe', methods=['POST'])
def transcribe():
    video = flask.request.files['video']
    os.makedirs('temp', exist_ok=True)
    video.save(os.path.join('temp', 'video.mp4'))
    
    audios = get_audio_files('temp/video.mp4')
    transcription = get_transcription(audios)

    return flask.jsonify({'message': transcription}), 200

@api.route('/summarize', methods=['POST'])
def summarize():
    message = flask.request.json['message']
    
    messages = [{
        "role" : "user",
        "content" : "Resuma o texto enviado a seguir para mim:"
    }, message]

    try:
        completion = openai.ChatCompletion.create(
            model=MODEL_CHAT,
            messages=messages,
            temperature=0.5,
            top_p=0.5,
        )

        return flask.jsonify({'message': completion['choices'][0]['message']['content']})
    except Exception as e:
        return flask.jsonify({'error': str(e)})


@api.route('/tokens', methods=['POST'])
def tokens():
    text = flask.request.json['text']
    try:
        num_tokens = num_tokens_from_messages(text)
        return flask.jsonify({'tokens': num_tokens})
    except Exception as e:
        return flask.jsonify({'error': str(e)})

app.register_blueprint(api)

if __name__ == '__main__':
    app.run()