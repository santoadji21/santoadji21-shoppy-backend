import { registerAs } from '@nestjs/config';
import { z } from 'zod';

// Define the Zod schema
const databaseConfigSchema = z.object({
  host: z.string(),
  port: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), {
      message: 'Port must be a number',
    }),
  username: z.string(),
  password: z.string(),
  database: z.string(),
});

// Create the configuration object
export default registerAs('database', () => {
  const parsedConfig = databaseConfigSchema.safeParse({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  });

  if (!parsedConfig.success) {
    console.error(
      'Invalid database configuration:',
      parsedConfig.error.format(),
    );
    throw new Error('Invalid database configuration');
  }

  return parsedConfig.data;
});

// Define the databaseConfig constant
export const databaseConfig = {
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
};

// Define the type for DatabaseConfig
export type DatabaseConfig = typeof databaseConfig;
