const redis = require('redis');
const { REDIS_CREDS } = require('./constants');

const saveSession = async (token, ipaddress, userid, role) => {

    const sessionObj = {
        token: token,
        ip: ipaddress,
        userid: userid,
        role: role,
    };

    try {
        const key = userid;
        const client = redis.createClient ({
            url : `rediss://${REDIS_CREDS}@eu2-willing-malamute-30693.upstash.io:30693`
          });
          client.on("error", function(err) {
            throw err;
          });
          await client.connect()
        for (const prop in sessionObj) {
            console.log(prop, sessionObj[prop]);
            await client.hSet(key, prop, sessionObj[prop]);
        }
        client.disconnect();
    }
    catch (error) {
        console.error(error);
    }
   
    /* const client = redis.createClient ({
      url : "rediss://default:73dda21b17444eac8f5d952fe1c32d81@eu2-willing-malamute-30693.upstash.io:30693"
    });
    client.on("error", function(err) {
      throw err;
    });
    await client.connect()
    //await client.set('foo','bar');
    //await client.hSet(userid, 'ip', ipaddress, 'token', token, 'role', role);
 */};
module.exports = saveSession;