/* eslint-disable no-console */
import { BrowserWindow } from 'electron';
import { IpcMainInvokeEvent } from 'electron/main';
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
    console.log('CONNECT_RESP', err, !!err);
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

export const sqlExecute = async (
  _: IpcMainInvokeEvent,
  { uuid = '', sql = 'SELECT NOW();' } = {}
) => {
  try {
    console.error('>>>', uuid, connections, uuid in connections);

    if (connections?.[uuid]) {
      const { client } = connections?.[uuid];
      const { rows } = await client.query(sql);
      return { status: 'SUCCESS', result: rows ?? [] };
    }
  } catch (e) {
    console.error(e);
    return { status: 'FAILED', error: e };
  }
  console.error('>>>');
  return { status: 'FAILED' };
};
