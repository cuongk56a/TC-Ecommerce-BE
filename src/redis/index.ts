import { createClient } from 'redis';
import { appConfigs } from '../config/config';

const client = createClient({
    password: 'BQXiD0Sl9jpLk5R0NoEQnqwVnWqWj7c2',
    socket: {
        host: 'redis-12030.c99.us-east-1-4.ec2.redns.redis-cloud.com',
        port: 12030
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

export const setRedisAsync = async (key: string, value: any) => {
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