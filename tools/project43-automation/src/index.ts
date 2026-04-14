import { ProjectStatusDateWorker } from "./app/project-status-date-worker.js";
import type { WorkerEnvironment } from "./config/worker-config.js";

const worker = new ProjectStatusDateWorker();

export default {
  fetch(request: Request, env: WorkerEnvironment): Promise<Response> {
    return worker.fetch(request, env);
  },
};
