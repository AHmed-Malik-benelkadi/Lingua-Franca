from flask import Flask, render_template, request, jsonify
from googletrans import Translator, LANGUAGES

app = Flask(__name__, template_folder='template', static_folder='static')
translator = Translator()

@app.route('/', methods=['GET'])
def index():
    if request.method == 'GET':
        input_text = request.args.get('inputData')
        source_language = request.args.get('srcLanguage')
        dest_language = request.args.get('destLanguage')

    languages = list(LANGUAGES.values())

    if source_language and dest_language and input_text:
        try:
            translation, detect_src, src_language = translate_text(input_text, source_language, dest_language)
            return jsonify({'translation': translation, 'detectSrc': detect_src, 'src': src_language})
        except Exception as e:
            error_message = 'Translation failed. Please try again later.'
            return jsonify({'error': error_message})

    return render_template('index.html', languages=languages)

def translate_text(input_text, source_language, dest_language):
    infos = translator.translate(input_text)
    detect_src = LANGUAGES[infos.src]
    dest = list(LANGUAGES.keys())[list(LANGUAGES.values()).index(dest_language)]

    if source_language == "auto":
        result = translator.translate(input_text, src=infos.src, dest=dest)
    else:
        src = list(LANGUAGES.keys())[list(LANGUAGES.values()).index(source_language)]
        if infos.src != src:
            result = translator.translate(input_text, src=infos.src, dest=dest)
        else:
            result = translator.translate(input_text, src=src, dest=dest)

    translation = result.text
    return translation, detect_src, source_language

if __name__ == '__main__':
    app.run(debug=True)
