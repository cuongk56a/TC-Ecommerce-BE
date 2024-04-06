import { createClient } from 'redis';
import { appConfigs } from '../config/config';

const client = createClient({
    password: 'sth3FAN3vQji7VAMaDK59WWToHfjHfGw',
    socket: {
        host: 'redis-10542.c74.us-east-1-4.ec2.cloud.redislabs.com',
        port: 10542
    }
});