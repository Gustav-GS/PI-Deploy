import Link from 'next/link';

export default function ApiDocsPage() {
  const exampleResponse = JSON.stringify(
    [
      {
        id: 1,
        created_at: '2026-03-18T10:00:00.000Z',
        event_date: '2026-04-05T19:00:00.000Z',
        title: 'Reunião Mensal',
        content: 'Descrição detalhada do evento.',
        image_url: 'https://exemplo.com/imagem.jpg',
      },
    ],
    null,
    2
  );

  return (
    <section className="fonte_padrao" style={{ maxWidth: 820, margin: '0 auto', padding: '24px 16px' }}>
      <h2>Documentação da API</h2>
      <p>
        Esta página descreve os endpoints públicos disponíveis na aplicação do{' '}
        <strong>Rotary Club Bariri</strong>.
      </p>

      <hr style={{ margin: '24px 0', borderColor: '#ddd' }} />

      {/* ENDPOINT */}
      <h3>GET /api/proximos-eventos</h3>
      <p>
        Retorna a lista de <strong>eventos futuros</strong> cadastrados, ordenados pela data do evento
        (do mais próximo ao mais distante).
      </p>

      {/* DETALHES */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
        <tbody>
          <tr>
            <td style={tdLabel}>Método</td>
            <td style={tdValue}><code>GET</code></td>
          </tr>
          <tr>
            <td style={tdLabel}>URL</td>
            <td style={tdValue}><code>/api/proximos-eventos</code></td>
          </tr>
          <tr>
            <td style={tdLabel}>Autenticação</td>
            <td style={tdValue}>Não requerida</td>
          </tr>
          <tr>
            <td style={tdLabel}>Formato</td>
            <td style={tdValue}><code>application/json</code></td>
          </tr>
        </tbody>
      </table>

      {/* COMO ACESSAR */}
      <h4>Como acessar</h4>

      <p><strong>Navegador</strong></p>
      <pre style={preStyle}>/api/proximos-eventos</pre>

      <p><strong>JavaScript (fetch)</strong></p>
      <pre style={preStyle}>{`fetch('/api/proximos-eventos')
  .then(res => res.json())
  .then(eventos => console.log(eventos));`}</pre>

      <p><strong>cURL</strong></p>
      <pre style={preStyle}>{`curl https://seu-dominio.com/api/proximos-eventos`}</pre>

      {/* CAMPOS */}
      <h4>Campos retornados</h4>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
        <thead>
          <tr>
            <th style={thStyle}>Campo</th>
            <th style={thStyle}>Tipo</th>
            <th style={thStyle}>Descrição</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['id', 'number', 'Identificador único do evento'],
            ['created_at', 'string (ISO 8601)', 'Data em que o registro foi criado'],
            ['event_date', 'string (ISO 8601)', 'Data e hora em que o evento ocorrerá'],
            ['title', 'string', 'Título do evento'],
            ['content', 'string', 'Descrição do evento'],
            ['image_url', 'string | null', 'URL da imagem de capa (pode ser nulo)'],
          ].map(([campo, tipo, desc]) => (
            <tr key={campo}>
              <td style={tdCode}><code>{campo}</code></td>
              <td style={tdValue}>{tipo}</td>
              <td style={tdValue}>{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* EXEMPLO DE RESPOSTA */}
      <h4>Exemplo de resposta</h4>
      <pre style={preStyle}>{exampleResponse}</pre>

      {/* COMPORTAMENTO */}
      <h4>Comportamento</h4>
      <ul>
        <li>Apenas eventos com <code>event_date</code> maior ou igual à data/hora atual são retornados.</li>
        <li>Eventos sem <code>event_date</code> definido <strong>não</strong> aparecem neste endpoint.</li>
        <li>O resultado é ordenado por <code>event_date</code> de forma crescente (mais próximo primeiro).</li>
        <li>Retorna um array vazio <code>[]</code> se não houver eventos futuros.</li>
      </ul>

      {/* CÓDIGOS */}
      <h4>Códigos de resposta HTTP</h4>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
        <thead>
          <tr>
            <th style={thStyle}>Código</th>
            <th style={thStyle}>Significado</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={tdCode}><code>200 OK</code></td>
            <td style={tdValue}>Requisição bem-sucedida; retorna o array de eventos</td>
          </tr>
          <tr>
            <td style={tdCode}><code>500 Internal Server Error</code></td>
            <td style={tdValue}>Erro interno (ex.: falha na conexão com o banco de dados)</td>
          </tr>
        </tbody>
      </table>

      <hr style={{ margin: '24px 0', borderColor: '#ddd' }} />

      <p><Link href="/">Voltar para o início</Link></p>
    </section>
  );
}

const tdLabel: React.CSSProperties = {
  padding: '8px 12px',
  fontWeight: 600,
  border: '1px solid #ddd',
  backgroundColor: '#f9f9f9',
  width: 160,
};

const tdValue: React.CSSProperties = {
  padding: '8px 12px',
  border: '1px solid #ddd',
};

const tdCode: React.CSSProperties = {
  padding: '8px 12px',
  border: '1px solid #ddd',
  whiteSpace: 'nowrap',
};

const thStyle: React.CSSProperties = {
  padding: '8px 12px',
  border: '1px solid #ddd',
  backgroundColor: '#f0f0f0',
  textAlign: 'left',
};

const preStyle: React.CSSProperties = {
  backgroundColor: '#1e1e1e',
  color: '#d4d4d4',
  padding: '16px',
  borderRadius: 6,
  overflowX: 'auto',
  fontSize: 13,
  lineHeight: 1.6,
  marginBottom: 20,
};
