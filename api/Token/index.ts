import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { CommunicationIdentityClient } from "@azure/communication-identity"

const connectionString = process.env["resourceConnectionString"]

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    // we should validate the connection string
    if (!connectionString) {
        console.warn('no resource connection string set')
        context.res.status = 500
        return;
    }

    let tokenClient = new CommunicationIdentityClient(connectionString);

    const userAndToken = await tokenClient.createUserAndToken(["chat"])

    context.res = {
        body: userAndToken
    };
};

export default httpTrigger;