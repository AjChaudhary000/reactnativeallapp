import axios from 'axios';

export default axios.create({
    baseURL: 'http://api.bileshwarmahadevfinance.com/api',
    headers: {'X-Requested-With': 'XMLHttpRequest','Accept':'application/json','Content-Type':'application/json'},
})