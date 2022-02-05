var pg = require('pg');

const connect = async () => {
  var conString =
    'postgres://postgres:postgrespassword@127.0.0.1:5432/postgres';
  var client = new pg.Client(conString);
  await client.connect();
  console.log('connected 2>>');
  return 'Connected';
};

connect();
