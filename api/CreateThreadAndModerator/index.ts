import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import * as redis from "redis";
import { CommunicationIdentityClient } from "@azure/communication-identity"
import { AzureCommunicationTokenCredential } from "@azure/communication-common"
import { ChatClient, ChatParticipant } from "@azure/communication-chat";
const asyncRedis = require("async-redis");

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    
    const identityClient = new CommunicationIdentityClient(process.env['resourceConnectionString'])
    const createUserAndToken = await identityClient.createUserAndToken(['chat'])
    const tokenCredential = new AzureCommunicationTokenCredential(createUserAndToken.token)
    const chatClient = new ChatClient(process.env['resourceEndpoint'], tokenCredential)

    const moderatorUser: ChatParticipant = {
        id: {
            communicationUserId : createUserAndToken.user.communicationUserId
        }
    }

    // add the moderator the thread, they will always be the first participant
    const chatThreadResult = await chatClient.createChatThread({topic: 'test topic'}, { participants: [moderatorUser]})
    const threadId = chatThreadResult.chatThread.id;

    if (chatThreadResult.invalidParticipants) {
        console.warn('unable to create thread')
        context.res = {
            body: {
                status: 500,
                threadId: 'error'
            }
        }
        return;
    } else {
        context.res = {
            body: {
                threadId: chatThreadResult.chatThread.id
            }
        }
    }

    const client = redis.createClient(6380, process.env['redishostname'],
        {auth_pass: process.env['rediscachekey'], tls: {servername: process.env['redishostname']}});

    const asyncRedisClient = asyncRedis.decorate(client);
    // serialize the array of users in a thread
    asyncRedisClient.set(threadId, JSON.stringify([moderatorUser]))

    console.log('written thread information with moderator into the redis cache')
};

export default httpTrigger;