const { google } = require('googleapis');
const connection = require("../db/connection").default
const { OAuth2Client } = require('google-auth-library');

// If modifying these scopes, delete your previously saved credentials
const SCOPES = ['https://www.googleapis.com/auth/youtube.readonly'];
const SECRET_PATH = '../credentials/googleclient.json'
const credentials = require(SECRET_PATH);

module.exports.default = async ({ id, data }) => {
    const { address, oauthcode } = data;
    const auth = getOAuthClient()
    const db = await connection();

    if (oauthcode) {
        // Authenticate New User
        const token = await getOAuthTokenForCode(auth, oauthcode)
        //Create/Replace TODO
        const user = await db.models.User.create({
            address: address,
            youtube: token
        });
        return {
            statusCode: 200,
            body: {
                jobRunID: id,
                data: { authenticated: true, address: user.address }
            }
        }
    } else {
        // Get OAuth Url
        const authUrl = auth.generateAuthUrl({
            access_type: 'online',
            scope: SCOPES
        });
        return {
            statusCode: 200,
            body: {
                jobRunID: id,
                data: { authenticated: false, url: authUrl }
            }
        }
    }
}

function getOAuthClient() {
    const clientSecret = credentials.installed.client_secret;
    const clientId = credentials.installed.client_id;
    const redirectUrl = credentials.installed.redirect_uris[0];
    const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUrl);
    return oauth2Client
}

/**
 * Get OAuth2 token.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {string} code The OAuth2 code.
 */
function getOAuthTokenForCode(oauth2Client, code) {
    return new Promise((fulfill, reject) => {
        oauth2Client.getToken(code, function (err, token) {
            if (err) {
                reject(err)
            }
            oauth2Client.credentials = token;
            fulfill(token);
        });
    })
}