import dotenv from 'dotenv';
dotenv.config();

import got from 'got';
import path from 'path';
import { CookieJar } from 'tough-cookie';

const API_URL = process.env.API_URL || 'http://localhost:8095/';
const URL_BASE_ENDPOINT = path.join(API_URL, 'treeView/Credential/');
const sessionId = process.argv[0];

const getData = async () => {
  const cookieJar = new CookieJar();
  cookieJar.setCookie(`JSESSIONID=${sessionId}`, API_URL);
  console.log('Getting data from', URL_BASE_ENDPOINT, 'with sessionId', sessionId);
  const res = await got.get(URL_BASE_ENDPOINT, { cookieJar }).json();
  console.log('data', res);
};

getData();
