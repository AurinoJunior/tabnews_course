import database from "infra/database"

export default async function (request, response) {
  const updateAt = new Date().toISOString();
  const dbVersion = await database.query("SHOW server_version;");
  const dbMaxConnections = await database.query("SHOW max_connections;");
  const dbOpenedConnections = 
    await database
      .query("SELECT count(*)::int FROM pg_stat_activity WHERE state = 'active';");

  return response.status(200).json({
    updated_at: updateAt,
    dependencies: {
      database: {
        version: dbVersion.rows[0].server_version,
        max_connections: parseInt(dbMaxConnections.rows[0].max_connections),
        opened_connections: dbOpenedConnections.rows[0].count,
      }
    },
  })
}
