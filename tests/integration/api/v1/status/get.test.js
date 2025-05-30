test("GET to api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toEqual(200);

  const responseBody = await response.json();
  expect(responseBody.updated_at).toBeDefined();

  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(parsedUpdatedAt).toBe(responseBody.updated_at);

  // Recuperar objeto database
  expect(responseBody.dependencies.database).toBeDefined();

  // Recuperar a versão da database
  expect(responseBody.dependencies.database.version).toBeDefined();
  expect(responseBody.dependencies.database.version).toBe("16.0");

  // Recuperar as conexões máximas
  expect(responseBody.dependencies.database.max_connections).toBeDefined();
  expect(
    responseBody.dependencies.database.max_connections,
  ).toBeLessThanOrEqual(100);

  // Recuperar as conexões abertas
  expect(responseBody.dependencies.database.opened_connections).toBeDefined();
  expect(responseBody.dependencies.database.opened_connections).toBe(1);
});
