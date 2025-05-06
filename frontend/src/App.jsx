import React, { useState } from 'react';

import './App.css';

function App() {
  const [codigo, setCodigo] = useState('');
  const [salida, setSalida] = useState([]);

  const ejecutar = async () => {
    try {
      const res = await fetch('http://localhost:5000/analizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo }),
      });
      const data = await res.json();
      setSalida(data);
    } catch {
      setSalida([{ type: 'Error', value: 'Servidor no disponible', line: '-' }]);
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

      <div className="editor-container">
        <div className="line-numbers">
          {lineas.map((num) => (
            <div key={num} className="line-number">
              {num}
            </div>
          ))}
        </div>
        <textarea
          className="code-editor"
          wrap="off"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="Escribe tu código aquí…"
        />
      </div>

      <div className="output-container">
        <textarea
          className="output-console"
          wrap="off"
          value={salida
            .map((tok) => `${tok.type} → ${tok.value} (Línea ${tok.line})`)
            .join("\n")}
          readOnly
        />
      </div>
    </div>
  );
}

export default App;
