import ply.lex as lex

# Palabras reservadas
reserved = {
    'componente': 'COMPONENTE',
    'girar': 'GIRAR',
    'configurar_pin': 'CONFIGURAR_PIN',
    'llamar': 'LLAMAR',
    'funcion': 'FUNCION',
    'encender': 'ENCENDER',
    'leer_texto': 'LEER_TEXTO',
    'en': 'EN',
    'infinita': 'INFINITA',
    'apagar': 'APAGAR',
    'imprimir': 'IMPRIMIR',
    'libreria': 'LIBRERIA',
    'configurar': 'CONFIGURAR',
    'leer': 'LEER',
    'escribir_digital': 'ESCRIBIR_DIGITAL',
    'si': 'SI',
    'sino': 'SINO',
    'mientras': 'MIENTRAS',
    'para': 'PARA',
    'hacer': 'HACER',
    'int': 'TIPO_INT',
    'double': 'TIPO_DOUBLE',
    'string': 'TIPO_STRING',
    'char': 'TIPO_CHAR',
    'boolean': 'TIPO_BOOLEAN',
    'verdadero': 'TRUE',
    'falso': 'FALSE',
    'led': 'LED',
    'termometro': 'TERMOMETRO',
    'ventilador': 'VENTILADOR',
    'sensor': 'SENSOR',
    'servomotor': 'SERVOMOTOR',
    'microprocesador': 'MICROPROCESADOR',
    'display': 'DISPLAY',
    'boton': 'BOTON',
    'Lista': 'LISTA',
    'Cola': 'COLA',
    'Pila': 'PILA',
    'leer_digital': 'LEER_DIGITAL',
    'leer_analogico': 'LEER_ANALOGICO',
    'pin_digital': 'PIN_DIGITAL',
    'pin_analogico': 'PIN_ANALOGICO',
}

tokens = [
    'ID', 'ENTERO', 'REAL', 'CADENA', 'CARACTER',
    'PLUS', 'MINUS', 'TIMES', 'DIVIDE', 'MOD', 'POW',
    'AND', 'OR', 'NOT',
    'EQ', 'NE', 'LT', 'LE', 'GT', 'GE',
    'ASSIGN', 'PLUS_ASSIGN', 'MINUS_ASSIGN',
    'LPAREN', 'RPAREN', 'LBRACE', 'RBRACE',
    'LBRACKET', 'RBRACKET', 'SEMI', 'COMMA', 'COLON', 'DOT'
] + list(reserved.values())

# Reglas simples
t_PLUS = r'\+'
t_MINUS = r'-'
t_TIMES = r'\*'
t_DIVIDE = r'/'
t_MOD = r'%'
t_POW = r'\^'

t_AND = r'&'
t_OR = r'\|'
t_NOT = r'!'

t_EQ = r'=='
t_NE = r'!='
t_LE = r'<='
t_GE = r'>='
t_LT = r'<'
t_GT = r'>'

t_ASSIGN = r'='
t_PLUS_ASSIGN = r'\+='
t_MINUS_ASSIGN = r'-='

t_LPAREN = r'\('
t_RPAREN = r'\)'
t_LBRACE = r'\{'
t_RBRACE = r'\}'
t_LBRACKET = r'\['
t_RBRACKET = r'\]'
t_SEMI = r';'
t_COMMA = r','
t_COLON = r':'
t_DOT = r'\.'

# Errores guardados aquí
lexer_errors = []

def t_REAL(t):
    r'\d+\.\d+'
    t.value = float(t.value)
    return t

def t_ENTERO(t):
    r'\d+'
    t.value = int(t.value)
    return t

def t_CADENA(t):
    r'"([^"\\]|\\.)*"'
    t.value = t.value[1:-1]
    return t

def t_CARACTER(t):
    r"'([^'\\]|\\.)'"
    t.value = t.value[1:-1]
    return t

def t_ID(t):
    r'[A-Za-z_][A-Za-z0-9_]*'
    t.type = reserved.get(t.value.lower(), 'ID')
    return t

# Ignorar espacios y comentarios
t_ignore = ' \t\r'

def t_COMMENT(t):
    r'//.*'
    pass

def t_newline(t):
    r'\n+'
    t.lexer.lineno += len(t.value)

# Calcular columna real
def calcular_columna(texto, lexpos):
    ultima_nueva_linea = texto.rfind('\n', 0, lexpos)
    if ultima_nueva_linea < 0:
        return lexpos + 1
    return lexpos - ultima_nueva_linea

# Manejo de errores
def t_error(t):
    col = calcular_columna(t.lexer.lexdata, t.lexpos)
    error_msg = f"ERROR [line {t.lineno},col {col}]: Carácter ilegal '{t.value[0]}'"
    lexer_errors.append(error_msg)
    t.lexer.skip(1)

# Construcción
lexer = lex.lex()
