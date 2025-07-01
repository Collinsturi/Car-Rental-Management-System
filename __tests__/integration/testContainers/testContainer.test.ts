// import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
// import { Client } from 'pg';
//
// const IMAGE = 'postgres:15';
//
// describe('PostgreSQL TestContainer', () => {
//   let container: StartedPostgreSqlContainer;
//   let client: Client;
//
//   beforeAll(async () => {
//     // Start PostgreSQL container
//     container = await new PostgreSqlContainer(IMAGE)
//       .withDatabase('test_db')
//       .withUsername('test_user')
//       .withPassword('test_password')
//       .withExposedPorts(5432)
//       .start();
//
//     // Create PostgreSQL client
//     client = new Client({
//       host: container.getHost(),
//       port: container.getPort(),
//       database: container.getDatabase(),
//       user: container.getUsername(),
//       password: container.getPassword(),
//     });
//
//     await client.connect();
//   }, 60000); // 60 second timeout for container startup
//
//   afterAll(async () => {
//     // Clean up
//     if (client) {
//       await client.end();
//     }
//     if (container) {
//       await container.stop();
//     }
//   });
//
//   it('should start PostgreSQL container successfully', () => {
//     expect(container).toBeDefined();
//     expect(container.getConnectionUri()).toContain('postgres://');
//   });
//
//   it('should have correct container configuration', () => {
//     expect(container.getDatabase()).toBe('test_db');
//     expect(container.getUsername()).toBe('test_user');
//     expect(container.getPassword()).toBe('test_password');
//     expect(container.getPort()).toBeGreaterThan(0);
//     expect(container.getHost()).toBe('localhost');
//   });
//
//   it('should be able to connect to the database', async () => {
//     expect(client).toBeDefined();
//
//     // Test basic query
//     const result = await client.query('SELECT 1 as test_value');
//     expect(result.rows).toHaveLength(1);
//     expect(result.rows[0].test_value).toBe(1);
//   });
//
//   it('should be able to create and query tables', async () => {
//     // Create a test table
//     await client.query(`
//       CREATE TABLE IF NOT EXISTS test_table (
//         id SERIAL PRIMARY KEY,
//         name VARCHAR(100) NOT NULL,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `);
//
//     // Insert test data
//     await client.query(
//       'INSERT INTO test_table (name) VALUES ($1)',
//       ['Test Record']
//     );
//
//     // Query the data
//     const result = await client.query('SELECT * FROM test_table WHERE name = $1', ['Test Record']);
//
//     expect(result.rows).toHaveLength(1);
//     expect(result.rows[0].name).toBe('Test Record');
//     expect(result.rows[0].id).toBeDefined();
//     expect(result.rows[0].created_at).toBeDefined();
//   });
//
//   it('should have PostgreSQL version information', async () => {
//     const result = await client.query('SELECT version()');
//     expect(result.rows[0].version).toContain('PostgreSQL');
//   });
//
//   it('should support concurrent connections', async () => {
//     // Create additional client
//     const client2 = new Client({
//       host: container.getHost(),
//       port: container.getPort(),
//       database: container.getDatabase(),
//       user: container.getUsername(),
//       password: container.getPassword(),
//     });
//
//     await client2.connect();
//
//     try {
//       // Both clients should be able to query simultaneously
//       const [result1, result2] = await Promise.all([
//         client.query('SELECT 2 as value'),
//         client2.query('SELECT 3 as value')
//       ]);
//
//       expect(result1.rows[0].value).toBe(2);
//       expect(result2.rows[0].value).toBe(3);
//     } finally {
//       await client2.end();
//     }
//   });
// });