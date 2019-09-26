import * as envalid from 'envalid';

export default function validateEnv() {
  const env = envalid.cleanEnv(process.env, {
    TYPEORM_CONNECTION: envalid.str(),
    TYPEORM_HOST: envalid.host(),
    TYPEORM_USERNAME: envalid.str(),
    TYPEORM_PASSWORD: envalid.str(),
    TYPEORM_DATABASE: envalid.str(),
    TYPEORM_PORT: envalid.port(),
    TYPEORM_SYNCHRONIZE: envalid.bool(),
    TYPEORM_LOGGING: envalid.bool(),
  });
}
