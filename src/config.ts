import { ConnectionOptions } from 'typeorm';
import dotenv from "dotenv"
dotenv.config()

var connectionOption: ConnectionOptions = {
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    username: "postgres",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    schema: "public",
    synchronize: true,
    entities: [
        "src/entities/**/*.ts"
    ],
}

var connectionOptionHeroku: ConnectionOptions = {
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: true,
    schema: "public",
    ssl: true,
    entities: [
        "src/entities/**/*.ts"
    ],
}


export const ormconfig = process.env.DATABASE_URL ? connectionOptionHeroku : connectionOption;