// src/pages/bpmn.js
import React from 'react';
import Layout from '@theme/Layout';
import BpmnViewer from '../components/BpmnViewer';

function BpmnPage() {
  return (
    <Layout title="BPMN Viewer">
      <div style={{ textAlign: 'center' }}>
        <h1>Teste de BPMN</h1>
        <BpmnViewer diagramUrl="/diagrams/diagram_new_.bpmn" />
      </div>
    </Layout>
  );
}

export default BpmnPage;
