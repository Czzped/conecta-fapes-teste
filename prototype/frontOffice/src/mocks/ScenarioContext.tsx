import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { ScenarioId, setActiveScenario } from './scenarios';

interface ScenarioContextValue {
  pageScenarios: ScenarioId[];
  activeScenario: ScenarioId | null;
  setActive: (id: ScenarioId) => void;
  registerScenarios: (ids: ScenarioId[]) => void;
  unregisterScenarios: () => void;
}

const ScenarioContext = createContext<ScenarioContextValue>({
  pageScenarios: [],
  activeScenario: null,
  setActive: () => {},
  registerScenarios: () => {},
  unregisterScenarios: () => {},
});

export function ScenarioProvider({ children }: { children: React.ReactNode }) {
  const [pageScenarios, setPageScenarios] = useState<ScenarioId[]>([]);
  const [activeScenario, setActive_] = useState<ScenarioId | null>(null);

  const registerScenarios = (ids: ScenarioId[]) => {
    setPageScenarios(ids);
    const first = ids[0] ?? null;
    setActive_(first);
    if (first) setActiveScenario(first);
  };

  const unregisterScenarios = () => {
    setPageScenarios([]);
    setActive_(null);
  };

  const setActive = (id: ScenarioId) => {
    setActive_(id);
    setActiveScenario(id);
  };

  return (
    <ScenarioContext.Provider value={{ pageScenarios, activeScenario, setActive, registerScenarios, unregisterScenarios }}>
      {children}
    </ScenarioContext.Provider>
  );
}

export const useScenarioContext = () => useContext(ScenarioContext);

export function usePageScenarios(ids: ScenarioId[]) {
  const { registerScenarios, unregisterScenarios } = useScenarioContext();
  const key = ids.join(',');

  useEffect(() => {
    registerScenarios(ids);
    return () => unregisterScenarios();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}
