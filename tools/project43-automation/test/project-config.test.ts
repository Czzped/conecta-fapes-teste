import assert from "node:assert/strict";
import test from "node:test";

import { createProjectConfig } from "../src/config/project-config.js";

test("keeps legacy completion field aliases for compatibility", () => {
  const config = createProjectConfig({
    DONE_AT_FIELD_NAME: "Concluido em",
  });

  assert.equal(config.fieldNames.doneAt, "Concluido em");
  assert.equal(config.fieldNames.doneAtAliases.includes("Concluido em"), true);
  assert.equal(
    config.fieldNames.doneAtAliases.includes("Data de Conclusao"),
    true
  );
  assert.equal(
    config.fieldNames.doneAtAliases.includes("Data de Conclusão"),
    true
  );
  assert.equal(
    config.fieldNames.doneAtAliases.includes("Data de ConclusÃ£o"),
    true
  );
});
