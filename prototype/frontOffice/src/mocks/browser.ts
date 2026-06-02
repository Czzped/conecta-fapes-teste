import { setupWorker } from 'msw/browser';
import { bolsistaHandlers } from './handlers/bolsista';
import { myInfoHandlers } from './handlers/myinfo';
import { nfeHandlers } from './handlers/nfe';

export const worker = setupWorker(
  ...bolsistaHandlers,
  ...myInfoHandlers,
  ...nfeHandlers,
);
