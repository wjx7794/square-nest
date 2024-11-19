import { registerAs } from '@nestjs/config';

export default registerAs('GLOBAL', () => ({
  PORT: process.env.PORT || 3000,
}));
