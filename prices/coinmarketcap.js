let request = require('request-promise-native');

const handle = async (data) => {
    let url = "https://pro-api.coinmarketcap.com/v1/";
    url = url + data.endpoint;
    if (data.resource != "") {
        url = url + "/" + data.resource;
    }
    url = url + "/" + data.path;

    let idOrSymbol = ["id", "symbol"];
    let idOrSlug = ["id", "slug"];

    let endpoints = {
        "cryptocurrency": {
            "info": {
                eitherOr: [idOrSymbol],
                resources: {}
            },
            "map": {
                optional: ["listing_status", "start", "limit", "symbol"],
                resources: {}
            },
            "latest": {
                resources: {
                    "listings": {
                        optional: ["start", "limit", "convert", "sort", "sort_dir", "cryptocurrency_type"],
                    },
                    "market-pairs": {
                        optional: ["start", "limit", "convert"],
                        eitherOr: [idOrSymbol]
                    },
                    "quotes": {
                        optional: ["convert"],
                        eitherOr: [idOrSymbol]
                    }
                }
            },
            "historical": {
                optional: ["time_end", "count", "interval", "convert"],
                resources: {
                    "ohlcv": {
                        required: ["time_start"],
                        optional: ["time_period"],
                        eitherOr: [idOrSymbol]
                    },
                    "quotes": {
                        optional: ["time_start"],
                        eitherOr: [idOrSymbol]
                    }
                }
            }
        },
        "exchange": {
            "info": {
                eitherOr: [idOrSlug],
                resources: {}
            },
            "map": {
                optional: ["listing_status", "slug", "start", "limit"],
                resources: {}
            },
            "latest": {
                optional: ["convert"],
                resources: {
                    "listings": {
                        required: ["sort_dir"],
                        optional: ["start", "limit", "sort", "market_type"],
                    },
                    "market-pairs": {
                        optional: ["start", "limit"],
                        eitherOr: [idOrSlug]
                    },
                    "quotes": {
                        eitherOr: [idOrSlug]
                    }
                }
            },
            "historical": {
                resources: {
                    "quotes": {
                        optional: ["time_start", "time_end", "count", "interval", "convert"],
                        eitherOr: [idOrSlug]
                    }
                }
            }
        },
        "global-metrics": {
            "latest": {
                resources: {
                    "quotes": {
                        optional: ["convert"],
                    }
                }
            },
            "historical": {
                resources: {
                    "quotes": {
                        optional: ["time_start", "time_end", "count", "interval", "convert"],
                    }
                }
            }
        },
        "tools": {
            "price-conversion": {
                required: ["amount"],
                optional: ["time", "convert"],
                eitherOr: [idOrSymbol]
            }
        }
    };

    if (!endpoints.hasOwnProperty(data.endpoint)) {
        return {
            statusCode: 400,
            error: {
                jobRunID: data.jobId,
                status: "errored",
                error: "Not a valid endpoint"
            }
        };
    }

    if (!endpoints[data.endpoint].hasOwnProperty(data.path)) {
        return {
            error: {
                jobRunID: data.jobId,
                status: "errored",
                error: "Path is not valid for this endpoint"
            }
        };
    }

    if (data.resource != "" && !endpoints[data.endpoint][data.path].resources.hasOwnProperty(data.resource)) {
        return {
            error: {
                jobRunID: data.jobId,
                status: "errored",
                error: "Resource is not valid for this endpoint/path"
            }
        };
    }

    let required = endpoints[data.endpoint][data.path].required || [];
    let optional = endpoints[data.endpoint][data.path].optional || [];
    let eitherOr = endpoints[data.endpoint][data.path].eitherOr || [];

    if (data.resource != "") {
        required = required.concat(endpoints[data.endpoint][data.path].resources[data.resource].required || []);
        optional = optional.concat(endpoints[data.endpoint][data.path].resources[data.resource].optional || []);
        eitherOr = eitherOr.concat(endpoints[data.endpoint][data.path].resources[data.resource].eitherOr || []);
    }

    var requestObj = {};

    for (var i = 0; i < required.length; i++) {
        if (data[required[i]] == "") {
            return {
                error: {
                    jobRunID: data.jobId,
                    status: "errored",
                    error: "Missing required parameter"
                }
            };
        }
        requestObj[required[i]] = data[required[i]];
    }

    for (var i = 0; i < optional.length; i++) {
        if (data[optional[i]] != "") {
            requestObj[optional[i]] = data[optional[i]];
        }
    }

    for (var i = 0; i < eitherOr.length; i++) {
        let options = eitherOr[i];
        let selected = false;
        for (var j = 0; j < options.length; j++) {
            if (data[options[j]] != "") {
                requestObj[options[j]] = data[options[j]];
                selected = true;
                break;
            }
        }

        if (!selected) {
            return {
                error: {
                    jobRunID: data.jobId,
                    status: "errored",
                    error: "Missing required either-or parameter"
                }
            };
        }
    }

    let options = {
        method: 'GET',
        uri: url,
        qs: requestObj,
        headers: {
            'X-CMC_PRO_API_KEY': data.apiKey
        },
        json: true
    };

    let response = await request(options);
    if (data.endpoint === "cryptocurrency" && data.resource === "quotes" && data.path === "latest")
        response.result = response.data[data.symbol].quote[data.convert].price;

    return {
        jobRunID: data.jobId,
        data: response
    }
};

module.exports.default = async (event) => {
    console.log(event)
    let data = {
        jobId: event.id,
        apiKey: process.env.CMC_API_KEY || event.data.apiKey,
        endpoint: event.data.endpoint || "cryptocurrency",
        resource: event.data.resource || "quotes",
        path: event.data.path || "latest",
        id: event.data.id || "",
        symbol: event.data.coin || event.data.symbol || "",
        listing_status: event.data.listing_status || "",
        start: event.data.start || "",
        limit: event.data.limit || "",
        convert: event.data.market || event.data.convert || "",
        sort: event.data.sort || "",
        sort_dir: event.data.sort_dir || "",
        cryptocurrency_type: event.data.cryptocurrency_type || "",
        time_start: event.data.time_start || "",
        time_end: event.data.time_end || "",
        time_period: event.data.time_period || "",
        count: event.data.count || "",
        interval: event.data.interval || "",
        slug: event.data.slug || "",
        market_type: event.data.market_type || "",
        amount: event.data.amount || "",
    };

    return await handle(data);
};
