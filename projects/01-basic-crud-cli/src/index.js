const { runCli } = require('./cli');

runCli().catch((err) => {
  console.error('Fallo inesperado en el CLI:', err);
  process.exit(1);
});
