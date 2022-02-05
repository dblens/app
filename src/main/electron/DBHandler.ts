/* eslint-disable no-console */
import { BrowserWindow } from 'electron';
import { IpcMainInvokeEvent } from 'electron/main';
import { Client, ClientBase } from 'pg';

const connections: Record<
  string,
  { client: ClientBase; window: BrowserWindow }
> = {};

export const connectDB = async ({
  window,
  uuid,
  connectionString,
}: {
  window: BrowserWindow;
  uuid: string;
  connectionString: string;
}) => {
  let client = new Client({
    connectionString,
  });
  try {
    await client.connect();
    // console.log('connected >>');
    connections[uuid] = { client, window };
    return { status: 'CONNECTED', uuid };
  } catch (error) {
    // return { status: 'FAILED', uuid, error };
    console.log(error);
  }

  // retry with ssl
  client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
  try {
    await client.connect();
    // console.log('connected 2>>');
    connections[uuid] = { client, window };
    return { status: 'CONNECTED', uuid };
  } catch (error) {
    // console.log(error);
  }
  return { status: 'FAILED', uuid };
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
