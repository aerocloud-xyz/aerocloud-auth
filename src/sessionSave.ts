import redis from 'redis';
import { REDIS_CREDS } from './constants';

const saveSession = async (token: string, ipaddress: string, userid: string, role: string) => {
    const sessionObj = {
        token: token,
        ip: ipaddress,
        userid: userid,
        role: role,
    };

    try {
        const key = userid;
        const client = redis.createClient({
            url: `rediss://${REDIS_CREDS}@eu2-willing-malamute-30693.upstash.io:30693`
        });
        client.on("error", (err) => {
            throw err;
        });
        await client.connect();
        for (const prop in sessionObj) {
            console.log(prop, (sessionObj as any)[prop]);
            await client.hSet(key, prop, (sessionObj as any)[prop]);
        }
        client.disconnect();
    } catch (error) {
        console.error(error);
    }
};

export default saveSession;
