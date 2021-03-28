import Knex from 'knex';
import knexConfig from './knexfile';

export type AliasRecord = {
    link: string,
    priority?: number,
    label?: string,
    alias: string,
    internal: boolean,
}

console.info(`Initializing Knex for ${process.env.NODE_ENV}`)
const knex = Knex(knexConfig[process.env.NODE_ENV]);
console.info(`Knex initialized`)

export default knex;