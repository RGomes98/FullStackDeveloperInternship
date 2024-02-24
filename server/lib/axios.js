import axios from 'axios';

export const API = axios.create({
  baseURL: 'https://www.amazon.com/s?k=',
  headers: { Accept: 'application/json', 'User-Agent': 'axios 1.6.7' },
});
