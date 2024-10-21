// util/httpAuthCheck.js

import initializeBasicAuth from 'nextjs-basic-auth';

const basicAuthCred = process.env.BASIC_AUTH_CREDENTIALS?.split(':');

let func = () => {};
if (basicAuthCred && basicAuthCred.length >= 2) {
    const users = [{ user: basicAuthCred[0], password: basicAuthCred[1] }];
    func = initializeBasicAuth({
        users: users,
    });
}
export default func;
