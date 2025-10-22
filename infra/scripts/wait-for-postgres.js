const { exec } = require("node:child_process");

function checkPostgresIsReady() {
  exec('docker exec postgres-dev pg_isready --host localhost', handleReturn);

  function handleReturn(error, stdout) {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      checkPostgresIsReady();
      return;
    }

    console.log("\n✅ Postgres está pronto e aceitando conexões!\n");
  }
}

process.stdout.write("\n\n❌ Estmos aguardando Postgres aceitar conexões");
checkPostgresIsReady();