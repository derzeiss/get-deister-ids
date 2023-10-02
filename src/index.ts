import dotenv from 'dotenv';
dotenv.config();

import got from 'got';
import path from 'path';

const API_URL = process.env.API_URL || 'http://localhost:8095/';
const URL_BASE_ENDPOINT = path.join(API_URL, 'treeView/Credential/');

const getData = async () => {
  const res = await got.get(URL_BASE_ENDPOINT).json();
  console.log('data', res);
};

getData();
