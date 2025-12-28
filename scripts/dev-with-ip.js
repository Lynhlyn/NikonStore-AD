const { spawn } = require('child_process');
const os = require('os');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const localIP = getLocalIP();
const port = process.env.PORT || 3001;

console.log('\n');
console.log('╔════════════════════════════════════════╗');
console.log('║   Network Access Information          ║');
console.log('╚════════════════════════════════════════╝');
console.log(`  Network:  http://${localIP}:${port}`);
console.log('\n');

const nextProcess = spawn('next', ['dev', '-H', '0.0.0.0', '-p', port.toString()], {
  stdio: 'inherit',
  shell: true
});

process.on('SIGINT', () => {
  nextProcess.kill('SIGINT');
  process.exit();
});

process.on('SIGTERM', () => {
  nextProcess.kill('SIGTERM');
  process.exit();
});

