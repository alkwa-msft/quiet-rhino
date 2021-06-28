import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import * as redis from "redis";
const asyncRedis = require("async-redis");
import { CommunicationIdentityClient } from "@azure/communication-identity"
import { AzureCommunicationTokenCredential } from "@azure/communication-common"
import { ChatThreadClient } from "@azure/communication-chat";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    const threadId = (req.query.threadId || (req.body && req.body.threadId));
    const userId = (req.query.userId || (req.body && req.body.userId));

    const client = redis.createClient(6380, process.env['redishostname'],
        {auth_pass: process.env['rediscachekey'], tls: {servername: process.env['redishostname']}});
    const asyncRedisClient = asyncRedis.decorate(client);

    // get the moderator user from the thread
    const userContentAsString = await asyncRedisClient.get(threadId);
    if (!userContentAsString) {
        console.warn('threadId does not exist')

        context.res = {
             status: 500, /* Defaults to 200 */
            body : {
                participantAdded: false
            }
        };

        return;
    }

    var participantsInThreadAsArray = JSON.parse(userContentAsString);
    var moderatorParticipant = participantsInThreadAsArray[0];
    if(participantsInThreadAsArray.filter(x => x.id.communicationUserId === userId).length != 0) {
        console.warn('not adding the user because they are already apart of the thread according to redis')
        context.res = {
            status: 400, /* Defaults to 200 */
            body : {
                participantAdded: false
            }
       };
       return;
    }

    const identityClient = new CommunicationIdentityClient(process.env['resourceConnectionString'])
    const createUserAndToken = await identityClient.getToken({ communicationUserId: moderatorParticipant.id.communicationUserId}, ['chat'])
    const tokenCredential = new AzureCommunicationTokenCredential(createUserAndToken.token)
    const threadClient = new ChatThreadClient(process.env['resourceEndpoint'], threadId, tokenCredential);
    const result = await threadClient.addParticipants({participants: [{ id: { communicationUserId: userId}}]})
    
    if (result.invalidParticipants) {
        console.warn('an error occured when adding the user : '+userId)

        context.res = {
            status: 400,
            body : {
                participantAdded: false
            }
        };

        return;
    }
    else {
        const participantsInThread = JSON.parse(userContentAsString);
        participantsInThread.push( { id : { communicationUserId: userId}})
        await asyncRedisClient.set(threadId, JSON.stringify(participantsInThread))

        context.res = {
            body : {
                participantAdded: true
            }
        };
    }
};

export default httpTrigger;