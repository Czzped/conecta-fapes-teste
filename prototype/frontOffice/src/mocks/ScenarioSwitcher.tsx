import { SCENARIOS, ScenarioId } from './scenarios';
import { useScenarioContext } from './ScenarioContext';

export function ScenarioSwitcher() {
  const { pageScenarios, activeScenario, setActive } = useScenarioContext();

  if (pageScenarios.length === 0) return null;

  const def = activeScenario ? SCENARIOS[activeScenario] : null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 9999,
        backgroundColor: '#0f172a',
        border: '1px solid rgba(6,182,212,0.35)',
        borderRadius: 10,
        padding: 14,
        width: 300,
        fontFamily: 'var(--font-family, monospace)',
        fontSize: 12,
        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
      }}
    >
      <div style={{ color: '#67e8f9', fontWeight: 600, marginBottom: 8 }}>
        🎭 Cenário MSW
      </div>

      <select
        value={activeScenario ?? ''}
        onChange={e => setActive(e.target.value as ScenarioId)}
        style={{
          display: 'block',
          width: '100%',
          padding: '4px 8px',
          backgroundColor: '#1e293b',
          border: '1px solid rgba(6,182,212,0.25)',
          borderRadius: 6,
          color: '#f1f5f9',
          fontSize: 12,
          fontFamily: 'inherit',
          cursor: 'pointer',
        }}
      >
        {pageScenarios.map(id => (
          <option key={id} value={id}>{SCENARIOS[id].label}</option>
        ))}
      </select>

      {def && (
        <>
          <div style={{ marginTop: 8, color: '#94a3b8', lineHeight: 1.5 }}>
            {def.descricao}
          </div>
          {def.dadosTeste && (
            <div
              style={{
                marginTop: 6,
                padding: '6px 8px',
                backgroundColor: 'rgba(250,204,21,0.08)',
                border: '1px solid rgba(250,204,21,0.25)',
                borderRadius: 4,
                color: '#fde68a',
                fontSize: 11,
                fontFamily: 'monospace',
                wordBreak: 'break-all',
                lineHeight: 1.5,
              }}
            >
              🧪 {def.dadosTeste}
            </div>
          )}
          <div
            style={{
              marginTop: 6,
              padding: '4px 8px',
              backgroundColor: 'rgba(6,182,212,0.08)',
              borderRadius: 4,
              color: '#67e8f9',
              fontSize: 10,
              fontFamily: 'monospace',
            }}
          >
            {def.epicRef}
          </div>
        </>
      )}
    </div>
  );
}
