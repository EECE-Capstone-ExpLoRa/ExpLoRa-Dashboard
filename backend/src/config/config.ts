export const config = () => ({
    port: Number(process.env.PORT) || 3000,
    database: {
        client: 'mysql2',
        version: '5.7',
        connection: {
            host: process.env.MY_SQL_DB_HOST,
            port: Number(process.env.MY_SQL_DB_PORT), // This must be specified as it's database specific
            user: process.env.MY_SQL_DB_USER,
            password: process.env.MY_SQL_DB_PASSWORD,
            database: process.env.MY_SQL_DB_DATABASE,
        },
        pool: { min: 0, max: 7 }
    }
});