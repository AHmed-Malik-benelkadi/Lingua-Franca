"""
This is the main file of the application.
made by: Ahmed M.Ben elkadi
"""
# import libraries Flask for thew web app and the api googletrans for the translation
from flask import Flask, render_template, request, jsonify
from googletrans import Translator, LANGUAGES

# create the app and the translator
app = Flask(__name__, template_folder='template', static_folder='static')
translator = Translator() # create the translator object

@app.route('/', methods=['GET']) # the route of the app and the method GET to get the data from the form
# the function index() to render the template index.html and to get the data from the form
def index():
    if request.method == 'GET': # if the method is GET get the data from the form
        input_text = request.args.get('inputData')
        source_language = request.args.get('srcLanguage')
        dest_language = request.args.get('destLanguage')

    languages = list(LANGUAGES.values()) # get the languages from the googletrans library and put them in a list

    if source_language and dest_language and input_text:
        try: # try to translate the text and return the translation, the source language and the language of the text
            translation, detect_src, src_language = translate_text(input_text, source_language, dest_language)
            return jsonify({'translation': translation, 'detectSrc': detect_src, 'src': src_language})
        except Exception as e: # if the translation failed return an error message
            error_message = 'Translation failed. Please try again later.'
            return jsonify({'error': error_message})

    return render_template('index.html', languages=languages) # render the template index.html and pass the languages list to the template

# the function translate_text() to translate the text and return the translation, the source language and the language of the text
def translate_text(input_text, source_language, dest_language):
    infos = translator.translate(input_text) # get the source language of the text
    detect_src = LANGUAGES[infos.src]
    dest = list(LANGUAGES.keys())[list(LANGUAGES.values()).index(dest_language)] # get the destination language of the text from the list of languages

    if source_language == "auto": # if the source language is auto detect the source language and translate the text
        result = translator.translate(input_text, src=infos.src, dest=dest)
    else:
        src = list(LANGUAGES.keys())[list(LANGUAGES.values()).index(source_language)]
        if infos.src != src:
            result = translator.translate(input_text, src=infos.src, dest=dest)
        else:
            result = translator.translate(input_text, src=src, dest=dest)

    translation = result.text
    return translation, detect_src, source_language # return the translation, the source language and the language of the text

if __name__ == '__main__':
    app.run(debug=True) # run the app in debug mode
