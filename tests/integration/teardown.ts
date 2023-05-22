import { execSync } from 'child_process';

export default async function () {
  execSync('docker-compose down');
}
