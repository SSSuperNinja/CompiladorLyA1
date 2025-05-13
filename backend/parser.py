import ply.yacc as yacc
from lexer import tokens  # tokens definidos en lexer.py

# Lista donde acumularemos errores de sintaxis
parser_errors = []
def reset_parser():
    global parser_errors
    parser_errors.clear()
# Precedencia (si necesitas operadores)
precedence = (
    # ('left', 'PLUS', 'MINUS'),
    # ...
)

# … arriba: imports, tokens, parser_errors, precedence …

# Producción raíz
def p_programa(p):
    "programa : declaraciones"
    p[0] = p[1]

# Declaraciones (sin tilde en el nombre)
def p_declaraciones(p):
    """
    declaraciones : declaracion declaraciones
                  | empty
    """
    if len(p) == 3:
        p[0] = [p[1]] + p[2]
    else:
        p[0] = []

# Ahora declaracion (sin tilde)
def p_declaracion(p):
    """
    declaracion : decl_componente
                | decl_funcion
                | stmt_simple
    """
    p[0] = p[1]
# Declaración de tipo
def p_tipo(p):
    """
    tipo : ID
         | LED
         | SENSOR
         | TERMOMETRO
         | SERVOMOTOR
         | VENTILADOR
         | MICROPROCESADOR
         | DISPLAY
         | BOTON
    """
    p[0] = p[1]
# Declaración de componente
def p_decl_componente(p):
    "decl_componente : COMPONENTE ID ASSIGN tipo SEMI"
    p[0] = ('decl_comp', p[2], p[4])

# Declaración de función
def p_decl_funcion(p):
    """
    decl_funcion : FUNCION ID LPAREN lista_ids RPAREN LBRACE declaraciones RBRACE
    """
    p[0] = ('decl_func', p[2], p[4], p[7])

# Lista de IDs
def p_lista_ids(p):
    """
    lista_ids : ID coma_ids
              | empty
    """
    if len(p) == 3:
        p[0] = [p[1]] + p[2]
    else:
        p[0] = []

def p_coma_ids(p):
    """
    coma_ids : COMMA ID coma_ids
             | empty
    """
    if len(p) == 4:
        p[0] = [p[2]] + p[3]
    else:
        p[0] = []

# Sentencias simples
def p_stmt_simple(p):
    """
    stmt_simple : ENCENDER ID SEMI
                | APAGAR ID SEMI
                | LEER ID SEMI
                | GIRAR ID ID SEMI
                | ID LPAREN lista_ids RPAREN SEMI
    """
    if p[1] == 'girar':
        p[0] = ('girar', p[2], p[3])
    elif p[1] in ('encender', 'apagar', 'leer'):
        p[0] = (p[1], p[2])
    else:
        p[0] = ('call', p[1], p[3])

def p_empty(p):
    "empty :"
    p[0] = None

# Manejo de errores de sintaxis
def p_error(p):
    if p:
        parser_errors.append(
            f"Syntax error at '{p.value}' (token {p.type}) line {p.lineno}"
        )
    else:
        parser_errors.append("Syntax error: unexpected end of input")

# Construcción final
parser = yacc.yacc()
