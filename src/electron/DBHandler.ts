import { Client } from 'pg';

const connections = {};
const connectionStringDef =
  'postgresql://postgres:postgrespassword@127.0.0.1/postgres';

export const connectDB = ({ window, uuid, connectionString }) => {
  const client = new Client({
    connectionString,
  });
  client.connect((err) => {
    if (err) {
      if (window)
        window.webContents.send('CONNECT_RESP', { status: 'FAILED', uuid });
    } else {
      console.log('CONNECT_RESP');
      connections[uuid] = { client, window };
      if (window)
        window.webContents.send('CONNECT_RESP', { status: 'CONNECTED', uuid });
    }
  });
};

export const sqlExecute = (
  event,
  { uuid = '', sql = 'SELECT NOW();' } = {}
) => {
  // console.log(params);
  console.log(JSON.stringify(connections, null, 2));
  if (connections?.[uuid]) {
    const { client, window } = connections?.[uuid];
    client.query(sql, (err, res) => {
      console.log('>>>>>TTTT');
      console.log(err, res);
      window.webContents.send('SQL_EXECUTE_RESP', {
        status: 'SUCCESS',
        result: res?.rows ?? [],
      });

      // client.end();
    });
  }
};
