import { useState } from 'react';

function App() {
  const [codigo, setCodigo] = useState('');
  const [salida, setSalida] = useState([]);

  const ejecutar = async () => {
    const res = await fetch('http://localhost:5000/analizar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codigo }),
    });
    const data = await res.json();
    setSalida(data);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Mi Compilador</h1>
      <textarea
        rows={10}
        cols={70}
        value={codigo}
        onChange={e => setCodigo(e.target.value)}
        placeholder="Escribe tu código aquí…"
        style={{ fontFamily: 'monospace', fontSize: '1rem' }}
      />
      <br />
      <button onClick={ejecutar} style={{ marginTop: '1rem' }}>
        Ejecutar
      </button>
      <pre
        style={{
          background: '#f5f5f5',
          padding: '1rem',
          marginTop: '1rem',
          height: '200px',
          overflow: 'auto',
        }}
      >
        {salida.map((tok, i) => (
          <div key={i}>
            {tok.type} → {String(tok.value)} (Línea {tok.line})
          </div>
        ))}
      </pre>
    </div>
  );
}

export default App;

