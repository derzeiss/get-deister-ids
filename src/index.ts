import dotenv from 'dotenv';
dotenv.config();

import got from 'got';
import path from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { CookieJar } from 'tough-cookie';
interface OverviewRes {
  count: number;
  Items: { name: string; icon: string; type: string }[];
}

const DEMO_JSON: OverviewRes = {
  count: 23,
  Items: [
    { name: '#', icon: 'svgFolderOpen', type: 'g_1_[#]' },
    { name: 'A', icon: 'svgFolderOpen', type: 'g_1_[A]' },
    { name: 'B', icon: 'svgFolderOpen', type: 'g_1_[B]' },
    { name: 'C', icon: 'svgFolderOpen', type: 'g_1_[C]' },
    { name: 'D', icon: 'svgFolderOpen', type: 'g_1_[D]' },
    { name: 'E', icon: 'svgFolderOpen', type: 'g_1_[E]' },
    { name: 'F', icon: 'svgFolderOpen', type: 'g_1_[F]' },
    { name: 'G', icon: 'svgFolderOpen', type: 'g_1_[G]' },
    { name: 'H', icon: 'svgFolderOpen', type: 'g_1_[H]' },
    { name: 'J', icon: 'svgFolderOpen', type: 'g_1_[J]' },
    { name: 'K', icon: 'svgFolderOpen', type: 'g_1_[K]' },
    { name: 'L', icon: 'svgFolderOpen', type: 'g_1_[L]' },
    { name: 'M', icon: 'svgFolderOpen', type: 'g_1_[M]' },
    { name: 'N', icon: 'svgFolderOpen', type: 'g_1_[N]' },
    { name: 'O', icon: 'svgFolderOpen', type: 'g_1_[O]' },
    { name: 'P', icon: 'svgFolderOpen', type: 'g_1_[P]' },
    { name: 'R', icon: 'svgFolderOpen', type: 'g_1_[R]' },
    { name: 'S', icon: 'svgFolderOpen', type: 'g_1_[S]' },
    { name: 'T', icon: 'svgFolderOpen', type: 'g_1_[T]' },
    { name: 'U', icon: 'svgFolderOpen', type: 'g_1_[U]' },
    { name: 'V', icon: 'svgFolderOpen', type: 'g_1_[V]' },
    { name: 'Y', icon: 'svgFolderOpen', type: 'g_1_[Y]' },
    { name: 'Z', icon: 'svgFolderOpen', type: 'g_1_[Z]' },
  ],
};

const LOGS_DIR = path.join(path.dirname(process.argv[1]), '..', '/logs');
const API_URL = process.env.API_URL || 'http://localhost:8095/';
const URL_BASE_ENDPOINT = path.join(API_URL, 'treeView/Credential/');
const sessionId = process.argv[process.argv.length - 1];
const cookieJar = new CookieJar();
cookieJar.setCookie(`JSESSIONID=${sessionId}`, API_URL);
console.log('Using sessionId', sessionId);

const main = async () => {
  const overview = await getOverview();
  logData(overview, 'overview');
  const details = await getDetails(overview);
  logData(details, 'details');
  console.log('done');
};

const getOverview = () => {
  return got.get(URL_BASE_ENDPOINT, { cookieJar }).json() as Promise<OverviewRes>;
};

const getDetails = (data: OverviewRes) => {
  const res = data.Items.map((row) => {
    const url = path.join(URL_BASE_ENDPOINT, encodeURIComponent(`?$filter=type eq '${row.type}'`));
    return got.get(url, { cookieJar }).json();
  });
  return Promise.all(res);
};

const logData = (data: object, name?: string) => {
  if (!existsSync(LOGS_DIR)) mkdirSync(LOGS_DIR);
  const nameSuffix = name ? `_${name}` : '';
  const timestamp = new Date()
    .toISOString()
    .replace(/[Z]/g, '') // remove Z at the end
    .replace(/\.\d+/, '') // remove milliseconds
    .replace(/[:]/g, ''); // remove colons between minutes
  const filename = `${timestamp}${nameSuffix}.json`; // 2023-10-02T15:33:39.277Z_overview
  writeFileSync(path.join(LOGS_DIR, filename), JSON.stringify(data), { flag: 'wx' });
};

logData(DEMO_JSON, 'overview');
// main();
