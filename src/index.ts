import dotenv from 'dotenv';
dotenv.config();

import { existsSync, mkdirSync, writeFileSync } from 'fs';
import got from 'got';
import path from 'path';
import { CookieJar } from 'tough-cookie';
import { ResEntity } from './types/ResEntity.js';
import { ResIdentItem } from './types/ResIdentItem.js';

const LOGS_DIR = path.join(path.dirname(process.argv[1]), '..', '/logs');
const API_URL = process.env.API_URL || 'http://localhost:8095/';
const URL_BASE_ENDPOINT = path.join(API_URL, 'treeView/Credential/');
const sessionId = process.argv[process.argv.length - 1];
const cookieJar = new CookieJar();
cookieJar.setCookie(`JSESSIONID=${sessionId}`, API_URL);
console.log('Using sessionId', sessionId);

const main = async () => {
  const overview = await getOverview();
  logData(JSON.stringify(overview, null, 2), 'overview');
  const details = await getDetails(overview);
  logData(JSON.stringify(details, null, 2), 'details');
  const flattened = flattenRes(details);
  writeNamesLog(flattened);
  console.log('done');
};

const getOverview = () => {
  return got.get(URL_BASE_ENDPOINT, { cookieJar }).json() as Promise<ResEntity>;
};

const getDetails = (data: ResEntity) => {
  const res = data.Items.map((row) => {
    const url = `${URL_BASE_ENDPOINT}?$filter=type%20eq%20%27g_1_%5B${encodeURIComponent(
      row.name
    )}%5D%27`;

    console.log('Fetching details for', url);
    return got.get(url, { cookieJar }).json() as Promise<ResEntity<ResIdentItem>>;
  });
  return Promise.all(res);
};

const logData = (data: string, name?: string, ext = 'json') => {
  if (!existsSync(LOGS_DIR)) mkdirSync(LOGS_DIR);
  const nameSuffix = name ? `_${name}` : '';
  const timestamp = new Date()
    .toISOString()
    .replace(/[Z]/g, '') // remove Z at the end
    .replace(/\.\d+/, '') // remove milliseconds
    .replace(/[:]/g, ''); // remove colons between minutes
  const filename = `${timestamp}${nameSuffix}.${ext}`; // 2023-10-02T15:33:39.277Z_overview.json
  writeFileSync(path.join(LOGS_DIR, filename), data, { flag: 'wx' });
};

const flattenRes = (details: ResEntity<ResIdentItem>[]) => {
  const flatData = details.reduce<ResIdentItem[]>((arr, currLetter) => {
    currLetter.Items.forEach((item) => {
      arr.push(item);
      return null;
    });
    return arr;
  }, []);
  return flatData;
};

const writeNamesLog = (flattenRes: ResIdentItem[]) => {
  const names = flattenRes.map((i) => i.name.replace(/ - (CARD|Karte)$/, '')).join('\n');
  logData(names, 'names', 'txt');
};

main();
