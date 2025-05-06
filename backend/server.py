from flask import Flask, request, jsonify
from flask_cors import CORS
from lexer import lexer  

app = Flask(__name__)
CORS(app)

@app.route('/analizar', methods=['POST'])
def analizar():
    codigo = request.json.get('codigo', '')
    lexer.lineno = 1

    lexer.input(codigo)
    tokens = []
    while True:
        tok = lexer.token()
        if not tok:
            break
        tokens.append({
            'type': tok.type,
            'value': tok.value,
            'line': tok.lineno,
            'pos': tok.lexpos
        })
    return jsonify(tokens)

if __name__ == '__main__':
    # ejecuta en localhost:5000
    app.run(port=5000, debug=True)
