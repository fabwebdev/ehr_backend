import { pgTable, primaryKey, bigint } from "drizzle-orm/pg-core";

export const role_has_permissions = pgTable(
  "role_has_permissions",
  {
    permission_id: bigint("permission_id", { mode: "number" }).notNull(),
    role_id: bigint("role_id", { mode: "number" }).notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.permission_id, table.role_id] }),
    };
  }
);
