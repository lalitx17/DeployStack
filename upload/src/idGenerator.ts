import crypto from 'crypto';

export function idGenerator(length: number): string{
    return crypto.randomBytes(Math.ceil(length/2)).toString('hex').slice(0, length);
}

