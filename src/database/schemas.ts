import { boolean, index, integer, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core"

export const tableExample = pgTable(
  "example",
  {
    id: text("id").primaryKey().notNull(),
    exampleData: text("example_data").notNull(),
  },
  (tableExample) => ({
    exampleDataIndex: index("example_data_index").on(tableExample.exampleData),
  }),
)
