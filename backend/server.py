
from flask import Flask, request, jsonify
from flask_cors import CORS
from lexer import lexer, lexer_errors, calcular_columna
import parser

app = Flask(__name__)
CORS(app)
@app.route('/analizar', methods=['POST'])
def analizar():
    codigo = request.json['codigo']
    
    # Reiniciar lexer y errores
    lexer.input(codigo)
    lexer.lineno = 1
    lexer_errors.clear()

    tokens = []
    while True:
        tok = lexer.token()
        if not tok:
            break
        tokens.append({
            'type': tok.type,
            'value': tok.value,
            'line': tok.lineno,
            'col': calcular_columna(lexer.lexdata, tok.lexpos)
        })
        
            # ——— Parsing ——
    parser.parser.parse(codigo, lexer=lexer)
    parser_errors = parser.parser_errors.copy()
    parser.parser_errors.clear()

    return jsonify({
        'tokens': tokens,
        'errores': lexer_errors,
        'syntax_errors': parser_errors
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)


