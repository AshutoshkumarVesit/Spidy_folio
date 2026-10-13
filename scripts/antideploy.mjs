import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const configPath = path.join(os.homedir(), '.antideploy', 'config.json');
const devicePath = path.join(os.tmpdir(), 'spidy-antideploy-device.json');
const projectPath = path.join(root, '.antideploy.json');
const base = 'https://antideploy.com';
const report = value => console.log(JSON.stringify(value).replace(/\b(?:gsk_|adu_|ad_)[A-Za-z0-9_-]{16,}/g, '[REDACTED]'));
const readJSON = async filename => JSON.parse((await fs.readFile(filename, 'utf8')).replace(/^\uFEFF/, ''));
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function token() { return (await readJSON(configPath)).token; }
async function call(endpoint, { method = 'GET', body, auth = true } = {}) {
  const headers = auth ? { Authorization: `Bearer ${await token()}` } : {};
  if (body) headers['Content-Type'] = 'application/json';
  const response = await fetch(base + endpoint, { method, headers, body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(30000) });
  const data = await response.json();
  if (!response.ok) throw new Error(`Antideploy HTTP ${response.status}: ${data.error || data.code || 'request failed'}`);
  return data;
}
async function project() { return (await readJSON(projectPath)).applicationId; }
const [command, argument] = process.argv.slice(2);
try {
  if (command === 'connect') {
    const device = await readJSON(devicePath);
    const deadline = Date.now() + (device.expiresIn || 900) * 1000;
    while (Date.now() < deadline) {
      await delay((device.interval || 5) * 1000);
      const response = await fetch(base + '/api/v1/device/token', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ deviceCode: device.deviceCode }), signal: AbortSignal.timeout(30000) });
      const data = await response.json();
      if (response.ok) {
        if (!data.token) throw new Error('Approval response did not contain a token.');
        await fs.mkdir(path.dirname(configPath), { recursive: true, mode: 0o700 });
        await fs.writeFile(configPath, JSON.stringify({ token: data.token }) + '\n', { mode: 0o600 });
        if (process.platform === 'win32') execFileSync('icacls.exe', [configPath, '/inheritance:r', '/grant:r', `${process.env.USERDOMAIN}\\${process.env.USERNAME}:(F)`], { stdio: 'ignore' });
        report({ connected: true, account: data.account });
        break;
      }
      if ((data.error || data.code) !== 'authorization_pending') throw new Error(`Connection stopped: ${data.error || data.code}`);
    }
  } else if (command === 'create') {
    if (await fs.stat(projectPath).catch(() => null)) report(await call(`/api/v1/applications/${await project()}`));
    else {
      const data = await call('/api/v1/applications', { method: 'POST', body: { name: 'Spidy Folio' } });
      await fs.writeFile(projectPath, JSON.stringify({ applicationId: data.applicationId }, null, 2) + '\n');
      report(data);
    }
  } else if (command === 'check-host') {
    report(await call(`/api/v1/hostnames/check?label=${encodeURIComponent(argument)}`));
  } else if (command === 'set-host') {
    report(await call(`/api/v1/applications/${await project()}`, { method: 'PATCH', body: { subdomain: argument } }));
  } else if (command === 'deploy') {
    process.loadEnvFile(path.join(root, '.env'));
    if (!process.env.GROQ_API_KEY) throw new Error('Local GROQ_API_KEY is missing.');
    const applicationId = await project();
    const application = await call(`/api/v1/applications/${applicationId}`);
    const publicOrigin = new URL(application.url || `https://${application.subdomain}.antideploy.app`).origin;
    const archive = path.join(os.tmpdir(), 'spidy-antideploy.tar.gz');
    const fileList = path.join(os.tmpdir(), 'spidy-antideploy-files.txt');
    const files = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean);
    if (files.some(name => name === '.env' || name === 'info.txt')) throw new Error('Private file in deployment manifest.');
    await fs.writeFile(fileList, files.join('\n') + '\n');
    execFileSync('tar', ['-czf', archive, '-C', root, '-T', fileList], { stdio: 'pipe' });
    const form = new FormData();
    form.append('archive', new Blob([await fs.readFile(archive)], { type: 'application/gzip' }), 'portfolio.tar.gz');
    form.append('env', JSON.stringify({ GROQ_API_KEY: process.env.GROQ_API_KEY, GROQ_MODEL: process.env.GROQ_MODEL || 'openai/gpt-oss-20b', NODE_ENV: 'production', HOST: '0.0.0.0', ALLOWED_ORIGIN: publicOrigin, PROXY_HOST: 'true' }));
    const response = await fetch(`${base}/api/v1/deploy?applicationId=${applicationId}`, { method: 'POST', headers: { Authorization: `Bearer ${await token()}` }, body: form, signal: AbortSignal.timeout(120000) });
    const data = await response.json();
    if (!response.ok) throw new Error(`Deploy HTTP ${response.status}: ${data.error || data.code || 'request failed'}`);
    report(data);
  } else if (command === 'status') {
    report(await call(`/api/v1/deployments/${encodeURIComponent(argument)}`));
  } else if (command === 'services') {
    report(await call(`/api/v1/services?applicationId=${await project()}&need=Groq`));
  } else throw new Error('Use connect, create, check-host <name>, set-host <name>, deploy, status <taskId>, or services.');
} catch (error) { report({ error: error.message }); process.exitCode = 1; }
