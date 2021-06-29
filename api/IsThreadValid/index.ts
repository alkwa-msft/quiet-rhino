import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import * as redis from "redis";
const asyncRedis = require("async-redis");

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    const threadId = (req.query.threadId || (req.body && req.body.threadId));

    if (!threadId) {
        console.warn('no threadId provided to check for existence')
        context.res = {
            status: 500,
            body: { 'threadExists' : false}
        }
        return;
    }

    const client = redis.createClient(6380, process.env['redishostname'],
        {auth_pass: process.env['rediscachekey'], tls: {servername: process.env['redishostname']}});
    const asyncRedisClient = asyncRedis.decorate(client);
    const value = await asyncRedisClient.get(threadId);

    context.res = {
        body: { 'threadExists' : !!value}
    }
};

export default httpTrigger;