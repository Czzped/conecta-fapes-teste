// src/components/BpmnViewer.js
import React, { useEffect, useRef, useState } from 'react';
import BpmnJS from 'bpmn-js';

const BpmnViewer = ({ diagramUrl, height }) => {
  const viewerRef = useRef(null);
  const [viewerHeight, setViewerHeight] = useState(height);

  useEffect(() => {
    const bpmnViewer = new BpmnJS({
      container: viewerRef.current,
    });

    fetch(diagramUrl)
      .then(response => response.text())
      .then(xml => bpmnViewer.importXML(xml))
      .then(() => {
        const canvas = bpmnViewer.get('canvas');
        canvas.zoom('fit-viewport');

        if (!height || height.endsWith('%')) {
          // Se o height for em porcentagem ou não for fornecido, mantém o valor ou ajusta ao contêiner
          setViewerHeight(height || '100%');
        } else {
          // Se o height for fixo em pixels, ajusta com o valor calculado
          const viewbox = canvas.viewbox();
          const calculatedHeight = viewbox.height;
          setViewerHeight(`${calculatedHeight}px`);
        }
      })
      .catch(error => console.error('Error loading BPMN diagram:', error));

    return () => {
      bpmnViewer.destroy();
    };
  }, [diagramUrl, height]);

  return <div ref={viewerRef} style={{ width: '100%', height: viewerHeight }} />;
};

export default BpmnViewer;
