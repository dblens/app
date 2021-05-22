/* eslint-disable no-console */
import { BrowserWindow } from 'electron';
import { IpcMainEvent } from 'electron/main';
import { Client, ClientBase } from 'pg';

const connections: Record<
  string,
  { client: ClientBase; window: BrowserWindow }
> = {};

export const connectDB = ({
  window,
  uuid,
  connectionString,
}: {
  window: BrowserWindow;
  uuid: string;
  connectionString: string;
}) => {
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
  _: IpcMainEvent,
  { uuid = '', sql = 'SELECT NOW();' } = {}
) => {
  console.log(JSON.stringify(connections, null, 2));
  if (connections?.[uuid]) {
    const { client, window } = connections?.[uuid];
    client.query(sql, (err, res) => {
      console.log(err, res);
      window.webContents.send('SQL_EXECUTE_RESP', {
        status: 'SUCCESS',
        result: res?.rows ?? [],
      });

      // client.end();
    });
  }
};
