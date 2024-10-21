import axios from 'axios';

export const cmsInstance = axios.create({
    baseURL: process.env.CMS_BASE,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

export const internalInstance = axios.create({
    baseURL: process.env.LOCAL_BASE,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});
