export function formatToday(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function shouldHandleStatusChange({
  eventName,
  payload,
  projectId,
  statusFieldId,
}) {
  return (
    eventName === "projects_v2_item" &&
    payload?.action === "edited" &&
    payload?.projects_v2_item?.project_node_id === projectId &&
    payload?.changes?.field_value?.field_node_id === statusFieldId
  );
}

export function buildDateMutations({
  statusName,
  startedAt,
  completedAt,
  today,
  startedAtFieldName,
  completedAtFieldName,
  inProgressStatusName,
  doneStatusName,
}) {
  const mutations = [];

  if (statusName === inProgressStatusName && !startedAt) {
    mutations.push({
      op: "set_date",
      fieldName: startedAtFieldName,
      date: today,
    });
  }

  if (statusName === doneStatusName) {
    if (completedAt !== today) {
      mutations.push({
        op: "set_date",
        fieldName: completedAtFieldName,
        date: today,
      });
    }

    return mutations;
  }

  if (completedAt) {
    mutations.push({
      op: "clear",
      fieldName: completedAtFieldName,
    });
  }

  return mutations;
}
