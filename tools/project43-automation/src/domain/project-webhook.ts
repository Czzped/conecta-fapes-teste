export interface ProjectsV2ItemWebhookPayload {
  action?: string;
  installation?: {
    id?: number | string;
  };
  projects_v2_item?: {
    node_id?: string;
    project_node_id?: string;
  };
  changes?: {
    field_value?: {
      field_node_id?: string;
    };
  };
}

interface StatusChangeContext {
  eventName: string | null;
  payload: ProjectsV2ItemWebhookPayload;
  projectId: string;
  statusFieldId: string;
}

export function shouldHandleStatusChange({
  eventName,
  payload,
  projectId,
  statusFieldId,
}: StatusChangeContext): boolean {
  return (
    eventName === "projects_v2_item" &&
    payload.action === "edited" &&
    payload.projects_v2_item?.project_node_id === projectId &&
    payload.changes?.field_value?.field_node_id === statusFieldId
  );
}
