import _ from "lodash";
import {api} from "@/api";

const dataFilesConfig = {
    counter: {
        displayName: "COUNTER JR1 report",
        counterVersion: 4,
        serverKey: "counter",
        msg: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    counterTrj2: {
        displayName: "COUNTER TR_J2 report",
        counterVersion: 5,
        serverKey: "counter-trj2",
        msg: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    counterTrj3: {
        displayName: "COUNTER TR_J3 report",
        counterVersion: 5,
        serverKey: "counter-trj3",
        msg: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    counterTrj4: {
        displayName: "COUNTER TR_J4 report",
        counterVersion: 5,
        serverKey: "counter-trj4",
        msg: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    price: {
        displayName: "Title-by-title pricelist",
        serverKey: "price",
        msg: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    perpetualAccess: {
        displayName: "Post-Termination Access (PTA)",
        serverKey: "perpetual-access",
        msg: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    coreJournals: {
        displayName: "Core journals list",
        serverKey: "core-journals",
        msg: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    pricePublic: {
        displayName: "Public pricelist",
        serverKey: "price-public",
        msg: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
}

const fileStatusFromApiData = function (apiData) {
    if (!apiData) return

    // temp while waiting for heather to update the File object
    // if (apiData.percent_loaded === 0) return "ready"
    // if (apiData.percent_loaded === 100) return "loaded"
    // return "parsing"

    // if it's done parsing, there are only two possible outcomes:
    if (apiData.is_live) return "live"
    if (!!apiData.error) return "error"

    // must not be done parsing
    if (apiData.is_uploaded) return "parsing"
    return "ready"
}


const idFromApiData = function(apiData){
    if (!apiData) return
    const name = apiData.name.replace("prices", "price")
    return _.camelCase(name)
}

const getPublisherFileServerKey = function(id){
    if (dataFilesConfig[id]) {
        return dataFilesConfig[id].serverKey
    }
}

const makePublisherFileStatus = function(apiData) {
    const id = idFromApiData(apiData)

    return {
        id,
        displayName: (apiData) ? dataFilesConfig[id].displayName : undefined,
        serverKey: (apiData) ? dataFilesConfig[id].serverKey : undefined,
        counterVersion: (apiData) ? dataFilesConfig[id].counterVersion : undefined,
        status: fileStatusFromApiData(apiData), // options:  ready | parsing | error | live
        createdDate: apiData?.created_date,
        rowsCount: apiData?.rows_count,
        error: apiData?.error,
        errorDetails: apiData?.error_details,
        percentParsed: apiData?.percent_parsed,
        isUploaded: apiData?.is_uploaded,
        isParsed: apiData?.is_parsed,
        isLive: apiData?.is_live,
    }
}


export
{
    dataFilesConfig,
    makePublisherFileStatus,
    getPublisherFileServerKey,

}