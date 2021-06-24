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
    ssl: { rejectUnauthorized: false },
  });
  client.connect((err) => {
    // console.log('CONNECT_RESP', err, !!err);
    if (err) {
      // console.log('CONNECT_RESP');
      if (window)
        window.webContents.send('CONNECT_RESP', { status: 'FAILED', uuid });
    } else {
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
  const startTime = +new Date();
  try {
    // console.error('>>>', uuid, connections, uuid in connections);

    if (connections?.[uuid]) {
      const { client } = connections?.[uuid];
      const { rows } = await client.query(sql);
      const duration = +new Date() - startTime;

      if (Array.isArray(rows))
        return {
          status: 'SUCCESS',
          rows: rows ?? [],
          duration,
        };
      return { status: 'SUCCESS', rows: [rows] ?? [], duration };
    }
  } catch (e) {
    console.error(e);
    const duration = +new Date() - startTime;
    return { status: 'FAILED', error: e, duration };
  }
  const duration = +new Date() - startTime;
  console.error('>>>');
  return { status: 'FAILED', duration };
};
