import { EOL, cpus, homedir, userInfo, arch } from 'os';

export function getOsInfo(param) {
  switch (param) {
    case '--EOL':
      return { output: JSON.stringify(EOL) };
      
    case '--cpus': {
      const cores = cpus();
      const output = `Total CPUs: ${cores.length}\n` +
        cores.map((cpu, i) => 
          `${i + 1}. ${cpu.model} @ ${(cpu.speed / 1000).toFixed(2)} GHz`
        ).join('\n');
      return { output };
    }
      
    case '--homedir':
      return { output: homedir() };
      
    case '--username':
      return { output: userInfo().username };
      
    case '--architecture':
      return { output: arch() };
      
    default:
      return { error: 'Invalid input' };
  }
}