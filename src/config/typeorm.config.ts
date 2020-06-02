import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const DEFAULT_POSTGRESS_PORT = 5432;

const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: DEFAULT_POSTGRESS_PORT,
  username: 'postgres',
  password: 'newPassword',
  database: 'taskmanagement',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true, // not recommended for production
};

export default typeOrmConfig;
