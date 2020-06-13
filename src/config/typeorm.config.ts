import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';

const { type, host, port, username, password, database, synchronize } = config.get('db');

const { RDS_HOSTNAME, RDS_PORT, RDS_USERNAME, RDS_PASSWORD, RDS_DB_NAME, TYPEORM_SYNC } = process.env;

const typeOrmConfig: TypeOrmModuleOptions = {
  type,
  host: RDS_HOSTNAME || host,
  port: RDS_PORT || port,
  username: RDS_USERNAME || username,
  password: RDS_PASSWORD || password,
  database: RDS_DB_NAME || database,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: TYPEORM_SYNC || synchronize,
};

export default typeOrmConfig;
