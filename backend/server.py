from flask import Flask, request, jsonify
from flask_cors import CORS
from lexer import lexer, lexer_errors

app = Flask(__name__)
CORS(app)

@app.route('/analizar', methods=['POST'])
def analizar():
    codigo = request.json.get('codigo', '')

    # Reiniciar contador y errores
    lexer.lineno = 1
    lexer_errors.clear()

    # Tokenizar
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

    # Devolver tokens y errores
    return jsonify({
        'tokens': tokens,
        'errors': lexer_errors
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)
