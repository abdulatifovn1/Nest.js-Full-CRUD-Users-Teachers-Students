import { Pool } from 'pg';
import {configDotenv} from 'dotenv';
configDotenv();

export const pool = new Pool({
    port:Number(process.env.PG_PORT),
    host:String(process.env.PG_HOST),
    user:String(process.env.PG_USER),
    password:String(process.env.PG_PSW),
    database:String(process.env.PG_DB)
})