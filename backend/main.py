from lexer import lexer

def test_code(code):
    lexer.input(code)
    for token in lexer:
        print(token)

if __name__ == '__main__':
    ejemplo = '''componente xd = sensor;
    encender sensor_temperatura;

    funcion girar_servomotor(grados) {
        girar servomotor grados;
    }'''
    test_code(ejemplo)
