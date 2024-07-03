import DbSession, {
  AiSuggestion,
  ColumnName,
  DbObject,
  ErdDataType,
  SortColumnType,
  SqlExecReponseType,
  TableType,
} from "./DbSession";

import { executeSQL, getAiSuggestion } from "../../api/query";

class PgSession implements DbSession {
  id: string;

  constructor(message: string) {
    this.id = message;
  }

  executeSQL = (sql: string): Promise<SqlExecReponseType<any>> =>
    new Promise<SqlExecReponseType<any>>((resolve, reject) => {
      executeSQL([sql], this.id)
        .then((data) => {
          data?.data?.[0]
            ? resolve(data?.data?.[0])
            : reject(new Error("Failed to execute query"));
        })
        .catch(reject);
    });

  getDBSchemas = (): Promise<string[]> =>
    new Promise<string[]>((resolve, reject) => {
      const sql = `SELECT schema_name
      FROM information_schema.schemata
      WHERE "schema_name" NOT LIKE 'pg_%' AND schema_name <> 'information_schema';`;
      this.executeSQL(sql)
        .then((data) => {
          if (data?.rows && Array.isArray(data?.rows)) {
            const allSchamas = data?.rows
              .filter((i) => !!i?.schema_name)
              .map((i) => i.schema_name);
            return resolve(allSchamas);
          }
          return reject(new Error("Failed to parse the schemas"));
        })
        .catch(reject);
    });

  getErdData = (): Promise<SqlExecReponseType<ErdDataType[]>> =>
    new Promise<SqlExecReponseType<ErdDataType[]>>((resolve, reject) => {
      const sql = `SELECT
      tc.table_schema,
      tc.constraint_name,
      tc.table_name,
      kcu.column_name,
      ccu.table_schema AS foreign_table_schema,
      ccu.table_name AS foreign_table_name,
      ccu.column_name AS foreign_column_name
  FROM
      information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema;
  `;
      this.executeSQL(sql)
        .then((data) => {
          console.log(data);
          return resolve(data as SqlExecReponseType<ErdDataType[]>);
          // return reject(new Error('Failed to parse the schemas'));
        })
        .catch(reject);
    });

  getAllTables = (schema: string): Promise<TableType[]> =>
    new Promise<TableType[]>((resolve, reject) => {
      const sql = `SELECT * FROM information_schema.tables
      WHERE table_schema = '${schema}'`;
      this.executeSQL(sql)
        .then((data) => {
          if (data?.rows && Array.isArray(data?.rows)) {
            const allSchamas = data?.rows.filter(
              (i) => !!i?.table_name
            ) as TableType[];
            return resolve(allSchamas);
          }
          return reject(new Error("Failed to parse the schemas"));
        })
        .catch(reject);
    });

  getTableData = ({
    schema,
    table,
    pagenumber = 1,
    size = 50,
    sortedColumns,
  }: {
    schema: string;
    table: string;
    offset: number;
    pagenumber: number;
    size: number;
    sortedColumns?: SortColumnType;
  }): Promise<{ status: string; rows: Record<string, unknown>[] }> =>
    new Promise<{ status: string; rows: Record<string, unknown>[] }>(
      (resolve, reject) => {
        const offset = (pagenumber - 1) * size;
        let sql = `SELECT * FROM "${schema}"."${table}" `;
        if (sortedColumns) {
          sql += " ORDER BY ";
          sql += Object.entries(sortedColumns)
            .map(([col, sort]) => `${col} ${sort}`)
            .join(",");
        }

        sql += ` LIMIT ${size} OFFSET ${offset};`;
        this.executeSQL(sql)
          .then((data) => {
            const tableData = data as unknown;
            return resolve(
              tableData as { status: string; rows: Record<string, unknown>[] }
            );
          })
          .catch(reject);
      }
    );

  getColumnNames = ({
    schema,
    table,
  }: {
    schema: string;
    table: string;
  }): Promise<{ status: string; rows: ColumnName[] }> =>
    new Promise<{ status: string; rows: ColumnName[] }>((resolve, reject) => {
      const sql = `SELECT
      column_name,
      data_type
    FROM
      INFORMATION_SCHEMA.COLUMNS
    WHERE
      TABLE_NAME = '${table}'
      AND table_schema = '${schema}';`;

      this.executeSQL(sql)
        .then((data) => {
          const columnNames = data as unknown;
          return resolve(columnNames as { status: string; rows: ColumnName[] });
        })
        .catch(reject);
    });

  getAllDbObjects = (): Promise<DbObject[]> => {
    return new Promise<DbObject[]>((resolve, reject) => {
      this.executeSQL(getAllDbObjectQuery)
        .then((data) => {
          if (!data?.rows)
            return reject(new Error("Failed to get all db objects"));
          const allObjects = data?.rows;
          return resolve(allObjects as DbObject[]);
        })
        .catch(reject);
    });
  };
  
  getAiFix = (query: string, error: string): Promise<AiSuggestion> => {
    return new Promise<AiSuggestion>((resolve, reject) => {
      this.getAllDbObjects()
        .then((data) => {
          const systemInstructions = getSystemInstructions(data);
          getAiSuggestion(systemInstructions, query, error)
            .then((data) => {
              if (data) return resolve(data);
              reject(new Error("Failed to execute query"));
            })
            .catch(reject);
        })
        .catch((e) => {
          return reject(e);
        });
    });
  };
  // TODO
  // getTableList = (): Promise<SqlExecReponseType> =>{}
  // getTableData = (schema,tablename,offset,size): Promise<SqlExecReponseType> =>{}
  // getViewData = (schema,tablename,offset,size): Promise<SqlExecReponseType> =>{}
}
export default PgSession;

const getAllDbObjectQuery = `
-- List of User-Created Schemas
SELECT
    'schema' AS object_type,
    schema_name AS object_name,
    NULL AS table_name,
    NULL AS object_detail
FROM
    information_schema.schemata
WHERE
    schema_name NOT IN ('pg_catalog', 'information_schema', 'pg_toast', 'pg_temp_1', 'pg_toast_temp_1')

UNION ALL

-- List of User-Created Tables
SELECT
    'table' AS object_type,
    table_schema AS object_name,
    table_name AS table_name,
    NULL AS object_detail
FROM
    information_schema.tables
WHERE
    table_type = 'BASE TABLE'
    AND table_schema NOT IN ('pg_catalog', 'information_schema', 'pg_toast', 'pg_temp_1', 'pg_toast_temp_1')

UNION ALL

-- List of User-Created Columns
SELECT
    'column' AS object_type,
    table_schema AS object_name,
    table_name AS table_name,
    column_name || ' ' || data_type || COALESCE('(' || character_maximum_length || ')', '') AS object_detail
FROM
    information_schema.columns
WHERE
    table_schema NOT IN ('pg_catalog', 'information_schema', 'pg_toast', 'pg_temp_1', 'pg_toast_temp_1')

UNION ALL

-- List of User-Created Views
SELECT
    'view' AS object_type,
    table_schema AS object_name,
    table_name AS table_name,
    NULL AS object_detail
FROM
    information_schema.views
WHERE
    table_schema NOT IN ('pg_catalog', 'information_schema', 'pg_toast', 'pg_temp_1', 'pg_toast_temp_1')

UNION ALL

-- List of User-Created Functions
SELECT
    'function' AS object_type,
    specific_schema AS object_name,
    routine_name AS table_name,
    data_type || ' function' AS object_detail
FROM
    information_schema.routines
WHERE
    specific_schema NOT IN ('pg_catalog', 'information_schema', 'pg_toast', 'pg_temp_1', 'pg_toast_temp_1')

ORDER BY
    object_type,
    object_name,
    table_name;`;

const getSystemInstructions = (allDbObjects: DbObject[]) => {
  const schemaFormat = convertToSchemaFormat(allDbObjects);
  return `
You are a Database Expert Engine designed to assist engineers in fixing their PostgreSQL queries. You will provide JSON outputs that generate SQL fixes in the following format so that solutions can parse the JSON directly and apply the fixes.

\`\`\`json
{
    "query": "new SQL",
    "reason": "reason"
}
\`\`\`

### Input
You will receive input in the form of an error message or a faulty SQL query. Based on this input, you are to generate a corrected SQL query and provide a reason for the fix.

### Output
Your output should be a JSON object containing:
- \`"query"\`: The corrected SQL query.
- \`"reason"\`: A brief explanation of why the fix is necessary.

### Example
**Input:**
\`\`\`
SELECT * FROM Custome;
\`\`\`
**Output:**
\`\`\`json
{
    "query": "SELECT * FROM Customer;",
    "reason": "Corrected the table name from 'Custome' to 'Customer'."
}
\`\`\`

### Error Handling
If you cannot generate a fix, provide the following JSON response:
\`\`\`json
{
    "query": "",
    "reason": "Unable to generate a fix for the given input."
}
\`\`\`

### Database Objects
Below is the list of all PostgreSQL database objects available for reference:

${schemaFormat}
`;
};

function convertToSchemaFormat(data) {
  let schemaFormatString = "";

  const columns = data.filter((item) => item.object_type === "column");
  const tables = data.filter((item) => item.object_type === "table");
  const schemas = data.filter((item) => item.object_type === "schema");

  columns.forEach((column) => {
    schemaFormatString += `column,${column.object_name},${column.table_name},${column.object_detail}\n`;
  });

  tables.forEach((table) => {
    schemaFormatString += `table,${table.object_name},${table.table_name},\n`;
  });

  schemas.forEach((schema) => {
    schemaFormatString += `schema,${schema.object_name},,\n`;
  });

  return schemaFormatString.trim();
}
