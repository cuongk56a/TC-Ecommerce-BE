import { createClient } from 'redis';
import { appConfigs } from '../config/config';

const client = createClient({
    password: 'XyxfGbbalo3BT6mC9NWPsrz5VFBLnVze',
    socket: {
        host: 'redis-15543.c100.us-east-1-4.ec2.redns.redis-cloud.com',
        port: 15543
    }
});

(async () => {
    client.on('error', err => console.log("redisClient.on('error", err));
    await client.connect();
})();

export const getRedisAsync = async (key: string) => {
    const value = await client.get(key);
    return value;
};

export const setRedisAsync = async (key: string, value: string) => {
    await client.set(key, value);
};

export const clearRedisAsync = async (key: string, time: number) => {
    await client.expire(key, time)
}

export const onConnetCallback = (callback: () => void) => {
    client.on('connect', () => {
        callback();
    });
}