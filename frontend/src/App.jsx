import React, { useState, useRef } from 'react';
import './App.css';

function App() {
  const [codigo, setCodigo] = useState('');
  const [tokens, setTokens] = useState([]);
  const [lexErrors, setLexErrors] = useState([]);
  const [syntaxErrors, setSyntaxErrors] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  

  const lineRef = useRef(null);
  const textRef = useRef(null);

  const syncScroll = () => {
    if (lineRef.current && textRef.current) {
      lineRef.current.scrollTop = textRef.current.scrollTop;
    }
  };

  const consolaText = (() => {
  if (lexErrors.length > 0) {
    // Si hay errores léxicos, los mostramos
    return lexErrors.join('\n');
  } else if (syntaxErrors.length > 0) {
    // Si no hay léxicos pero sí sintácticos, los mostramos
    return syntaxErrors.join('\n');
  } else {
    // ¡No hay errores! Mensaje de éxito
    return 'Codigo ejecutado correctamente.';
  }
})();

const ejecutar = async () => {
  try {
const res = await fetch('http://localhost:5000/analizar', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codigo }),
    });
    const data = await res.json();
    setTokens(data.tokens || []);
    setLexErrors(data.lex_errors || []);
    setSyntaxErrors(data.syntax_errors || []);
  } catch {
    setTokens([]);
    setLexErrors(['ERROR: No se pudo conectar al servidor']);
    setSyntaxErrors([]);
  }
};

  // Para mostrar números de línea
  const lineas = codigo.split('\n').map((_, i) => i + 1);

  // Preparamos el contenido de la consola de salida
  const salidaConsola = [
    // 1) Tokens
    ...tokens.map(
      tok =>
        `${tok.type} → ${tok.value} (Línea ${tok.line}, Col ${tok.col})`
    ),
    // 2) Errores léxicos
    ...lexErrors.map(err => err),
    // 3) Errores sintácticos
    ...syntaxErrors.map(err => err),
  ].join('\n');

  return (
    <div className="app-container">
      <div className="toolbar">
        <button
          className="tool-btn"
          onClick={() => {
            setCodigo('');
            setTokens([]);
            setLexErrors([]);
            setSyntaxErrors([]);
          }}
        >
          <img src="/icons/nuevo.png" alt="Nuevo" className="btn-icon" />
          <span className="btn-label">Nuevo</span>
        </button>

        <button className="tool-btn">
          <img src="/icons/guardar.png" alt="Guardar" className="btn-icon" />
          <span className="btn-label">Guardar</span>
        </button>

        <button className="tool-btn">
          <img src="/icons/abrir.png" alt="Abrir" className="btn-icon" />
          <span className="btn-label">Abrir</span>
        </button>

        <button className="tool-btn" onClick={ejecutar}>
          <img src="/icons/compilar.png" alt="Compilar" className="btn-icon" />
          <span className="btn-label">Compilar</span>
        </button>

<button className="tool-btn" onClick={() => setModalOpen(true)}>
  <img src="/icons/tokens.png" alt="Tokens" className="btn-icon" />
  <span className="btn-label">Tokens</span>
</button>


        <button className="tool-btn">
          <img src="/icons/ident.png" alt="Ident" className="btn-icon" />
          <span className="btn-label">Ident</span>
        </button>

        <button className="tool-btn">
          <img src="/icons/reservadas.png" alt="Reservadas" className="btn-icon" />
          <span className="btn-label">Reservadas</span>
        </button>
      </div>

      <div className="editor-wrapper">
        <div className="line-numbers" ref={lineRef}>
          {lineas.map(num => (
            <div key={num} className="line-number">{num}</div>
          ))}
        </div>

        <textarea
          ref={textRef}
          className="code-editor"
          value={codigo}
          onChange={e => setCodigo(e.target.value)}
          onScroll={syncScroll}
          wrap="off"
          placeholder="Escribe tu código aquí…"
        />
      </div>

<div className="output-container">
  <textarea
    className="output-console"
    readOnly
    wrap="off"
    value={consolaText}
  />
</div>
{modalOpen && (
  <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
    <div className="modal-content" onClick={e => e.stopPropagation()}>
      <h2>Lista de Tokens</h2>
      <pre className="modal-text">
        {tokens.length > 0
          ? tokens
              .map(
                tok =>
                  `${tok.type} → ${tok.value} (Línea ${tok.line}, Col ${tok.col})`
              )
              .join('\n')
          : 'No hay tokens para mostrar.'}
      </pre>
      <button onClick={() => setModalOpen(false)}>Cerrar</button>
    </div>
  </div>
)}

    </div>
  );
}

export default App;
