const { google } = require('googleapis');
const connection = require("../db/connection").default
const { OAuth2 } = google.auth;

// If modifying these scopes, delete your previously saved credentials
const SECRET_PATH = '../credentials/googleclient.json'
const credentials = require(SECRET_PATH);

module.exports.default = async ({ id, data }) => {
    const { resource, action, params, address } = data;
    const auth = getOAuthClient()
    const db = await connection();

    //Authenticated User
    const token = await getOAuthTokenForAddress({ db, address });
    if (!token) { throw new Error("Not authenticated!")}
    auth.credentials = token;


    const response = await youtubeRequest({ auth, resource, action, params });
    return {
        statusCode: 200,
        body: {
            jobRunID: id,
            data: response.data
        }
    }
}

module.exports.likes = async ({ id, data }) => {
    const { address } = data;
    const auth = getOAuthClient()
    const db = await connection();

    //Authenticated User
    const token = await getOAuthTokenForAddress({ db, address });
    if (!token) { throw new Error("Not authenticated!")}
    auth.credentials = token;

    const resource = "videos";
    const action = "list";
    const params = {
    		"part": "statistics",
    		"maxResults": 50,
    		"myRating": "like"
    	};
    const response = await youtubeRequest({ auth, resource, action, params });
    const likes = response.data.items.map((video) => video.id)
    return {
        statusCode: 200,
        body: {
            jobRunID: id,
            data: likes
        }
    }
}

module.exports.subscriptions = async ({ id, data }) => {
    const { address } = data;
    const auth = getOAuthClient()
    const db = await connection();

    //Authenticated User
    const token = await getOAuthTokenForAddress({ db, address });
    if (!token) { throw new Error("Not authenticated!")}
    auth.credentials = token;

    const resource = "subscriptions";
    const action = "list";
    const params = {
            "part": "snippet",
            "mine": true,
    		"maxResults": 50
    	};
    const response = await youtubeRequest({ auth, resource, action, params });
    const subscriptions = response.data.items.map((item) => item.snippet.resourceId.channelId)
    return {
        statusCode: 200,
        body: {
            jobRunID: id,
            data: subscriptions
        }
    }
}

module.exports.videos = async ({ id, data }) => {
    const { address } = data;
    const auth = getOAuthClient()
    const db = await connection();

    //Authenticated User
    const token = await getOAuthTokenForAddress({ db, address });
    if (!token) { throw new Error("Not authenticated!")}
    auth.credentials = token;

    const resource = "channels";
    const action = "list";
    const params = {
            "part": "contentDetails",
            "mine": true
    	};
    const response = await youtubeRequest({ auth, resource, action, params });
    const uploadsPlaylist = response.data.items[0].contentDetails.relatedPlaylists.uploads;
    const resource2 = "playlistItems";
    const action2 = "list";
    const params2 = {
            "part": "contentDetails",
            "playlistId": uploadsPlaylist
        };
    const response2 = await youtubeRequest({ auth, resource: resource2, action: action2, params: params2 });
    const uploads = response2.data.items.map((item) => item.contentDetails.videoId)

    return {
        statusCode: 200,
        body: {
            jobRunID: id,
            data: uploads
        }
    }
}


async function youtubeRequest({auth, resource, action, params}) {
    return new Promise((fulfill, reject) => {
        const service = google.youtube('v3');
        service[resource][action]({
            auth: auth,
            ...params
        }, (err, response) => {
            //ERROR bc callback
            if (err) { reject(err) }
            fulfill(response)  
        })
    })
}

function getOAuthClient() {
    const clientSecret = credentials.installed.client_secret;
    const clientId = credentials.installed.client_id;
    const redirectUrl = credentials.installed.redirect_uris[0];
    const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);
    return oauth2Client
}

/**
 * Get OAuth2 token for signed.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {string} code The OAuth2 code.
 */
async function getOAuthTokenForAddress({ db, address }) {
    const query = await db.models.User.findAll({
        where: { address: address },
        limit: 1
    });
    const user = query[0];
    if (!user) {
        throw new Error("Not Found");
    }

    return user.youtube
}