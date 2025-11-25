const { spawn, execSync } = require("child_process");

// Função para rodar comandos síncronos (espera terminar para ir pro próximo)
function runCommand(command) {
  console.log(`\n🔄 Executando: ${command}...`);
  execSync(command, { stdio: "inherit" });
}

// Função de limpeza
function cleanup() {
  console.log("\n🛑 Encerrando ambiente de desenvolvimento...");
  try {
    runCommand("npm run services:stop");
    console.log("✅ Ambiente encerrado com sucesso.");
  } catch (error) {
    console.error("❌ Erro ao encerrar serviços:", error.message);
  }
}

// Captura sinais de encerramento (Ctrl+C, kill, etc)
process.on("SIGINT", () => {
  cleanup();
  process.exit();
});

process.on("SIGTERM", () => {
  cleanup();
  process.exit();
});

try {
  // 1. Sobe os containers
  runCommand("npm run services:up");

  // 2. Aguarda o banco de dados
  runCommand("npm run services:wait:database");

  // 3. Roda as migrações
  runCommand("npm run migrations:up");

  // 4. Inicia o Next.js (Spawn é usado aqui pois é um processo de longa duração)
  console.log("\n🚀 Iniciando Next.js...");
  const nextDev = spawn("next", ["dev"], { stdio: "inherit", shell: true });

  // Se o Next.js morrer por algum erro interno, também limpamos
  nextDev.on("close", (code) => {
    if (code !== 0) {
      console.log(`Next.js encerrou com código ${code}`);
    }
    cleanup();
  });

} catch (error) {
  console.error("\n❌ Erro na inicialização:", error.message);
  cleanup();
  process.exit(1);
}