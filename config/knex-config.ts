import * as dotenv from 'dotenv';
dotenv.config();

const knexConfig = {
  config: {
    client: process.env.DB_CLIENT,
    useNullAsDefault: true,
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      charset: 'utf8',
      dateStrings: true,
    },
    pool: {
      afterCreate: function (connection, callback) {
        connection.query(`SET time_zone = "${process.env.TIME_ZONE}";`, function (err) {
          callback(err, connection);
        });
      },
      min: parseInt(process.env.DB_POOL_MIN || '2', 10),
      max: parseInt(process.env.DB_POOL_MAX || '50', 10),
      acquireTimeoutMillis: 30000,
      idleTimeoutMillis: 30000,
    },
  },
};

export default knexConfig;