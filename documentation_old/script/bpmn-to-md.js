const fs = require('fs');
const path = require('path');
const BpmnModdle = require('bpmn-moddle');

// Tipos de tarefas a extrair
const taskTypes = [
  'bpmn:Task',
  'bpmn:UserTask',
  'bpmn:ServiceTask',
  'bpmn:ScriptTask',
  'bpmn:ManualTask',
  'bpmn:BusinessRuleTask',
  'bpmn:SendTask',
  'bpmn:ReceiveTask',
  'bpmn:CallActivity'
];

// Busca recursiva por tarefas
function findTasks(elements, result = []) {
  for (const el of elements) {
    if (taskTypes.includes(el.$type) && el.name) {
      result.push(el.name);
    }
    if (el.flowElements) {
      findTasks(el.flowElements, result);
    }
  }
  return result;
}

// Nome a partir de participant
function getProcessNameFromParticipant(rootElement, processId) {
  const participants = rootElement.rootElements.filter(el => el.$type === 'bpmn:Participant');
  const participant = participants.find(p => p.processRef && p.processRef.id === processId);
  return participant?.name;
}

// Nome a partir de lane
function getProcessNameFromLane(process) {
  if (process.laneSets && process.laneSets.length > 0) {
    for (const laneSet of process.laneSets) {
      if (laneSet.lanes && laneSet.lanes.length > 0) {
        const laneWithName = laneSet.lanes.find(lane => lane.name);
        if (laneWithName) return laneWithName.name;
      }
    }
  }
  return null;
}

// Função principal
async function convertBPMNtoMarkdown(filePath) {
  const xml = fs.readFileSync(filePath, 'utf-8');
  const moddle = new BpmnModdle();

  try {
    const { rootElement } = await moddle.fromXML(xml);
    const processes = rootElement.rootElements.filter(el => el.$type === 'bpmn:Process');

    for (const process of processes) {
      const processName =
        process.name ||
        getProcessNameFromParticipant(rootElement, process.id) ||
        getProcessNameFromLane(process) ||
        `Processo ${process.id}`;

      let md = `# ${processName}\n\n`;

      const tasks = findTasks(process.flowElements || []);
      for (const task of tasks) {
        md += `## ${task}\n\n`;
      }

      const output = path.basename(filePath, path.extname(filePath)) + '.md';
      fs.writeFileSync(output, md, 'utf-8');
      console.log(`✅ Markdown gerado com sucesso: ${output}`);
    }
  } catch (err) {
    console.error('❌ Erro ao processar o arquivo BPMN:', err.message);
  }
}

// CLI
const [, , inputFile] = process.argv;
if (!inputFile) {
  console.error('❌ Por favor, informe o caminho do arquivo .bpmnio');
  process.exit(1);
}

convertBPMNtoMarkdown(inputFile);
