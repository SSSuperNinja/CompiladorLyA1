import React, { useState,useRef } from 'react';

import './App.css';

function App() {
  const [codigo, setCodigo] = useState('');
  const [salida, setSalida] = useState([]);
  const lineRef = useRef(null);
  const textRef = useRef(null);
  const [errores, setErrores] = useState([]); 

  const ejecutar = async () => {
    try {
      const res = await fetch('http://localhost:5000/analizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo }),
      });
      const { tokens, errors } = await res.json();
      setSalida(tokens);
      setErrores(errors || []);   // ← Usa setErrores aquí
    } catch {
      setSalida([]);
      setErrores([{ char: '', line: '-', pos: '-', msg: 'Servidor no disponible' }]);
    }
  };

  const syncScroll = () => {
    if (lineRef.current && textRef.current) {
      lineRef.current.scrollTop = textRef.current.scrollTop;
    }
  };

  const lineas = codigo.split('\n').map((_, i) => i + 1);

  return (
    <div className="app-container">
      <div className="toolbar">
        <button
          className="tool-btn"
          onClick={() => {
            setCodigo("");
            setSalida([]);
          }}
        >
          <img src="/icons/nuevo.png" alt="Nuevo" className="btn-icon" />
          <span>Nuevo</span>
        </button>
        <button className="tool-btn">
          <img src="/icons/guardar.png" alt="Guardar" className="btn-icon" />
          <span>Guardar</span>
        </button>
        <button className="tool-btn">
          <img src="/icons/abrir.png" alt="Abrir" className="btn-icon" />
          <span>Abrir</span>
        </button>
        <button className="tool-btn" onClick={ejecutar}>
          <img src="/icons/compilar.png" alt="Compilar" className="btn-icon" />
          <span>Compilar</span>
        </button>
        <button className="tool-btn">
          <img src="/icons/tokens.png" alt="Tokens" className="btn-icon" />
          <span>Tokens</span>
        </button>
        <button className="tool-btn">
          <img src="/icons/ident.png" alt="Ident" className="btn-icon" />
          <span>Ident</span>
        </button>
        <button className="tool-btn">
          <img src="/icons/reservadas.png" alt="Reservadas" className="btn-icon" />
          <span>Reservadas</span>
        </button>
      </div>

      <div className="editor-wrapper">
  <div className="line-numbers" ref={lineRef}>
    {codigo.split('\n').map((_, i) => (
      <div className="line-number" key={i}>{i + 1}</div>
    ))}
  </div>

  <textarea
    ref={textRef}
    className="code-editor"
    value={codigo}
    onChange={e => setCodigo(e.target.value)}
    onScroll={syncScroll}
    wrap="off"
  />
</div>

  <div className="output-container">
  <textarea
  className="output-console"
  wrap="off"
  value={[
    ...salida.map(tok => `${tok.type} → ${tok.value} (Línea ${tok.line})`),
    ...errores.map(err => `ERROR [L${err.line},col ${err.pos}]: ${err.msg}`)
  ].join('\n')}
  readOnly
/>
  </div>
    </div>
  );
}

export default App;
