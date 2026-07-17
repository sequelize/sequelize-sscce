import { expect } from 'chai';
import { createSequelize6Instance } from '../dev/create-sequelize-instance';

export const testingOnDialects = new Set(['mysql']);

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mysql2 = require('mysql2');

// ---- Fault injection ------------------------------------------------------
// let the TCP handshake succeed then make the post-handshake `SET time_zone`
// init query fail. The error is delivered through the query callback with
// `fatal: false`, like a real MySQL 1041 ER_OUT_OF_RESOURCES, so mysql2
// keeps the socket (and the server thread) open.
let armed = false;
let injected = 0;
const CAP = 20;

const realCreateConnection = mysql2.createConnection.bind(mysql2);
mysql2.createConnection = (cfg: unknown) => {
  const conn = realCreateConnection(cfg);
  const realQuery = conn.query.bind(conn);
  conn.query = function patchedQuery(sql: unknown, ...rest: unknown[]) {
    const text = typeof sql === 'string' ? sql : (sql as { sql?: string })?.sql;
    if (armed && injected < CAP && typeof text === 'string' && text.startsWith('SET time_zone')) {
      injected += 1;
      const cb = rest[rest.length - 1];
      const err = Object.assign(new Error('Query declined - system memory is critically low.'), {
        code: 'ER_OUT_OF_RESOURCES',
        errno: 1041,
        sqlState: 'HY000',
        fatal: false, // non-fatal: mysql2 leaves the socket / server thread open
        sql: text,
      });
      if (typeof cb === 'function') {
        process.nextTick(() => (cb as (e: Error) => void)(err));
        return conn;
      }
    }
    return realQuery(sql, ...rest);
  };
  return conn;
};
// ---------------------------------------------------------------------------

// Your SSCCE goes inside this function.
export async function run() {
  const sequelize = createSequelize6Instance({
    // Force Sequelize to use our patched mysql2 module.
    dialectModule: mysql2,
    pool: { max: 10, min: 0, acquire: 5000, idle: 60000 },
    logging: false,
  });

  const threads = async (): Promise<number> => {
    const [rows] = (await sequelize.query("SHOW STATUS LIKE 'Threads_connected'")) as [
      Array<{ Value: string }>,
      unknown,
    ];
    return Number(rows[0].Value);
  };

  // Warm up + version probe with injection disabled (this connection succeeds).
  await sequelize.authenticate();
  const before = await threads();

  // Open the "memory pressure" window and hammer the pool. Every brand new
  // pooled connection runs `SET time_zone`, which now fails, so connect()
  // rethrows a ConnectionError without closing the already-established raw
  // connection => the mysql2 socket and its server thread are orphaned.
  armed = true;
  const attempts: Array<Promise<unknown>> = [];
  for (let i = 0; i < 100; i++) {
    attempts.push(
      sequelize
        .transaction(async t => {
          await sequelize.query('SELECT 1', { transaction: t });
        })
        .catch(() => {
          /* swallow the ConnectionError(1041) */
        }),
    );
  }
  await Promise.allSettled(attempts);
  armed = false; // stop injecting so measurement is clean

  // Give any legitimate close a chance to happen.
  await new Promise(resolve => setTimeout(resolve, 3000));
  const after = await threads();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pool = (sequelize.connectionManager as any).pool;
  const leaked = after - before - pool.size;

  console.log({
    injected,
    threadsBefore: before,
    threadsAfter: after,
    threadsDelta: after - before,
    poolSize: pool.size, // what Sequelize thinks it holds
    poolAvailable: pool.available,
    poolUsing: pool.using,
    leakedConnections: leaked, // server-side connections Sequelize lost track of
  });

  // BUG PRESENT => leakedConnections ~= injected (server threads stay open and
  //                the pool has no reference to reap them).
  // BUG FIXED   => leakedConnections ~= 0 (connect() destroys the raw connection
  //                in its catch before rethrowing).
  expect(leaked, 'server-side connections leaked past the pool').to.be.at.most(1);
}
