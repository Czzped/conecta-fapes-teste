import { GitFlowWorker } from "./app/git-flow-worker.js";
import { ProjectStatusDateWorker } from "./app/project-status-date-worker.js";
import type { WorkerEnvironment } from "./config/worker-config.js";

const statusWorker = new ProjectStatusDateWorker();
const gitFlowWorker = new GitFlowWorker();

function isGitFlowRequest(request: Request): boolean {
  const url = new URL(request.url);

  if (url.pathname.startsWith("/git-flow")) {
    return true;
  }

  return request.headers.get("x-github-event") === "pull_request";
}

export default {
  fetch(request: Request, env: WorkerEnvironment): Promise<Response> {
    if (isGitFlowRequest(request)) {
      return gitFlowWorker.fetch(request, env);
    }

    return statusWorker.fetch(request, env);
  },
};
