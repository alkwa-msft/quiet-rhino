import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { CommunicationIdentityClient } from "@azure/communication-identity"

const connectionString = process.env["resourceConnectionString"]

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    // we should validate the connection string
    if (!connectionString) {
        console.warn('no resource connection string set')
        return;
    }

    let tokenClient = new CommunicationIdentityClient(connectionString);
    
    // we should validate if the userId is valid
    // for production usage you should make this a POST request and use body parameters
    const communicationUserId = req.query["userId"]

    if (!communicationUserId) {
        console.warn('no communicationUserId provided')
    }

    const userAndToken = await tokenClient.getToken({communicationUserId: communicationUserId}, ['chat']);

    context.res = {
        body: userAndToken
    };
    
};

export default httpTrigger;