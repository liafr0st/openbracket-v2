import sjcl = require('sjcl');
import { OpenBracketError } from './OpenBracketError';
import * as crypto from 'crypto';
import * as base32 from 'hi-base32';

/*
Reference: https://stackoverflow.com/a/32311188
Published: 31/08/2015 - https://stackoverflow.com/users/3832970/wiktor-stribi%c5%bcew
Retrieved: 21/02/2024
*/
export function checkPassword(pwd: string): void {
    let errstring = "";
    if (pwd.length < 8) {
        errstring += "Password must be at least 8 characters long\n";
    };
    if (!(/\d/.test(pwd))) {
        errstring += "Password must contain a number\n";
    };
    if (!(/[a-z]/.test(pwd))) {
        errstring += "Password must contain a lower case character\n";
    };
    if (errstring.length > 0) {
        throw new OpenBracketError(errstring);
    }
}

/*
Reference: https://cryptojs.altervista.org/hash/doc/doc_hash_stanford.html
Published: 05/09/2012 - michelerosica@gmail.com
Retrieved: 21/02/2024
*/
export function hashPassword(pwd: string): string {
    const myBitArray = sjcl.hash.sha256.hash(pwd);
    const myHash = sjcl.codec.hex.fromBits(myBitArray);
    return myHash;
}

/*
Reference: https://levelup.gitconnected.com/go-beyond-passwords-secure-your-node-js-empire-with-two-factor-authentication-2fa-ff63c4b93112
Published: 01/01/2024 - https://medium.com/@ndbeladiya720?source=post_page-----ff63c4b93112--------------------------------
Retrieved: 02/03/2024
*/
export function generateSalt(): string {
    const buffer = crypto.randomBytes(4);
    const secret = base32.encode(buffer).replace(/=/g, "").substring(0, 24);
    return secret;
};