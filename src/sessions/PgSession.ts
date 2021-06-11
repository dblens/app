import utils from '../components/utils/utils';
import DbSession, {
  SqlExecReponseType,
  TableDataType,
  TableType,
} from './DbSession';

class PgSession implements DbSession {
  id: string;

  constructor(message: string) {
    this.id = message;
  }

  executeSQL = (sql: string): Promise<SqlExecReponseType> =>
    new Promise<SqlExecReponseType>((resolve, reject) => {
      utils.executeSQL(sql, this.id).then(resolve).catch(reject);
    });

  getDBSchemas = (): Promise<string[]> =>
    new Promise<string[]>((resolve, reject) => {
      const sql = `SELECT schema_name
      FROM information_schema.schemata
      WHERE "schema_name" NOT LIKE 'pg_%';`;
      utils
        .executeSQL(sql, this.id)
        .then((data) => {
          if (data?.rows && Array.isArray(data?.rows)) {
            const allSchamas = data?.rows
              .filter((i) => !!i?.schema_name)
              .map((i) => i.schema_name);
            return resolve(allSchamas);
          }
          return reject(new Error('Failed to parse the schemas'));
        })
        .catch(reject);
    });

  getAllTables = (schema: string): Promise<TableType[]> =>
    new Promise<TableType[]>((resolve, reject) => {
      const sql = `SELECT * FROM information_schema.tables
      WHERE table_schema = '${schema}'`;
      utils
        .executeSQL(sql, this.id)
        .then((data) => {
          if (data?.rows && Array.isArray(data?.rows)) {
            const allSchamas = data?.rows.filter(
              (i) => !!i?.table_name
            ) as TableType[];
            return resolve(allSchamas);
          }
          return reject(new Error('Failed to parse the schemas'));
        })
        .catch(reject);
    });

  getTableData = (
    schema: string,
    table: string
    // offset: number,
    // pagenumber: number
  ): Promise<TableDataType[]> =>
    new Promise<TableDataType[]>((resolve, reject) => {
      const sql = `SELECT * FROM "${schema}"."${table}"`;
      // console.log('>>>', sql);
      utils
        .executeSQL(sql, this.id)
        .then((data) => {
          const tableData = data as unknown;
          return resolve(tableData as TableDataType[]);
        })
        .catch(reject);
    });

  // TODO
  // getTableList = (): Promise<SqlExecReponseType> =>{}
  // getTableData = (schema,tablename,offset,size): Promise<SqlExecReponseType> =>{}
  // getViewData = (schema,tablename,offset,size): Promise<SqlExecReponseType> =>{}
}

export default PgSession;
