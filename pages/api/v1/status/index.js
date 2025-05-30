import database from "infra/database.js";

async function status(request, response) {
  const databaseVersion = await database.query("SHOW server_version;");
  const databaseVersionRows = databaseVersion.rows[0].server_version;
  const databaseMaxConnections = await database.query("SHOW max_connections;");
  const databaseMaxConnectionsRows =
    databaseMaxConnections.rows[0].max_connections;

  const updatedAt = new Date().toISOString();

  const databaseName = process.env.POSTGRES_DB;
  const databaseOpenedConnections = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const databaseOpenedConnectionsLength =
    databaseOpenedConnections.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionRows,
        max_connections: parseInt(databaseMaxConnectionsRows),
        opened_connections: databaseOpenedConnectionsLength,
      },
    },
  });
}

export default status;
