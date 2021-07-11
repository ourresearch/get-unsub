import axios from "axios";
import Vue from "vue"
import {makePublisherFileStatus, getPublisherFileServerKey} from "@/shared/publisherFileStatus";

import {api} from "../api"
import {
    clearScenarioCache,
    fetchScenario,
    newScenario,
    createScenario,
    copyScenario,
    saveScenario,
    deleteScenario,
} from "../shared/scenario";
import {makePublisherJournal} from "../shared/publisher";
import _ from "lodash";
import appConfigs from "../appConfigs";
import {publisherLogoFromId, bigDealAnnualCost, publisherIcon} from "../shared/publisher";

// https://www.npmjs.com/package/short-uuid
const short = require('short-uuid');

const warningsConfig = {
    missingPerpetualAccess: {
        displayName: "Missing PTA",
        link: "http://help.unsub.org/en/articles/5229614-warning-no-pta-file-uploaded",
    },
    missingPrices: {
        displayName: "Missing prices",
        link: "http://help.unsub.org/en/articles/5229615-warning-missing-prices",
    },
    missingCounterData: {
        displayName: "Missing COUNTER",
        link: "http://help.unsub.org/en/articles/5229612-warning-no-counter-file-uploaded",
    },
    missingBigDealCosts: {
        displayName: "Missing Big Deal costs",
        link: "http://help.unsub.org/en/articles/5232773-warning-missing-big-deal-costs",
    },
}


export const publisher = {
    state: {
        selected: null,

        isLoading: false,
        apcIsLoading: false,

        id: null,
        publisher: "",
        name: "",
        isDemo: false,
        scenarios: [],
        journals: [],
        dataFiles: [],
        warnings: [],
        counterIsUploaded: false,
        bigDealCost: 0,
        bigDealCostIncrease: 0,
        isBigDealCostIncreaseDefined: false,
        isOwnedByConsortium: false,
        currency: "USD",
        hasCompleteCounterData: false,
        isConsortialProposalSet: false,

        // apc stuff
        apcHeaders: [],
        apcJournals: [],
        apcPapersCount: null,
        apcAuthorsFractionalCount: null,
        apcCost: null,


    },
    mutations: {
        clearPublisher(state) {
            state.isLoading = false
            state.id = null
            state.publisher = ""
            state.name = ""
            state.isDemo = false
            state.scenarios = []
            state.dataFiles = []
            state.warnings = []
            state.counterIsUploaded = false
            state.bigDealCost = 0
            state.bigDealCostIncrease = 0
            state.isBigDealCostIncreaseDefined = false
            state.isConsortialProposalSet = false

            state.hasCompleteCounterData = false

            state.apcHeaders = []
            state.apcJournals = []
            state.apcPapersCount = null
            state.apcAuthorsFractionalCount = null
            state.apcCost = null
            state.isOwnedByConsortium = false
            state.currency = "USD"

        },
        clearApcData(state) {
            state.apcHeaders = []
            state.apcJournals = []
            state.apcPapersCount = null
            state.apcAuthorsFractionalCount = null
            state.apcCost = null
        },

        setSelectedPublisher(state, apiPublisher) {
            console.log("setSelectedPublisher", apiPublisher)
            state.selected = apiPublisher // legacy

            state.id = apiPublisher.id
            state.publisher = apiPublisher.publisher
            state.name = apiPublisher.name
            state.isDemo = apiPublisher.is_demo
            state.scenarios = apiPublisher.scenarios
            state.isConsortialProposalSet = apiPublisher.is_consortial_proposal_set


            state.dataFiles = apiPublisher.data_files.map(dataFile => {
                return makePublisherFileStatus(dataFile)
            })
            state.warnings = apiPublisher.warnings.map(warning => {
                warning.id = _.camelCase(warning.id)
                return Object.assign(warning, warningsConfig[warning.id])
            })
            state.hasCompleteCounterData = apiPublisher.has_complete_counter_data

            state.counterIsUploaded = state.dataFiles.findIndex(f => f.name === 'counter' && f.uploaded) > -1
            state.bigDealCost = apiPublisher.cost_bigdeal
            state.bigDealCostIncrease = apiPublisher.cost_bigdeal_increase
            state.isBigDealCostIncreaseDefined = apiPublisher.cost_bigdeal_increase === 0 || apiPublisher.cost_bigdeal_increase > 0
            
            state.isOwnedByConsortium = apiPublisher.is_owned_by_consortium
            state.currency = apiPublisher.currency
        },
        startLoading(state) {
            state.isLoading = true
        },
        finishLoading(state) {
            state.isLoading = false
        },
        replaceScenario(state, newScenario) {
            const index = state.scenarios.findIndex(s => s.id === newScenario.id)
            state.scenarios.splice(index, 1, newScenario)
        },
        replaceFile(state, newFile) {
            const index = state.dataFiles.findIndex(s => s.id === newFile.id)
            state.dataFiles.splice(index, 1, newFile)
        },

        deleteScenario(state, id) {
            const index = state.scenarios.findIndex(s => s.id === newScenario.id)
            state.scenarios.splice(index, 1)
        },
        setPublisherId(state, id) {
            state.id = id
        },


    },
    actions: {
        async fetchPublisher({commit, dispatch, getters}, id) {
            if (id === getters.publisherId) return
            commit("clearPublisher")
            commit("clearApcData")

            commit("startLoading")
            commit("setPublisherId", id)
            dispatch("fetchPublisherApcData") // not waiting for this one
            await dispatch("fetchPublisherMainData", id)
            commit("finishLoading")
        },

        async refreshPublisher({commit, dispatch, getters}) {
            commit("startLoading")
            commit("clearApcData")
            dispatch("fetchPublisherApcData") // not waiting for this one
            await dispatch("fetchPublisherMainData", getters.publisherId)
            commit("finishLoading")
        },


        async fetchPublisherMainData({commit, dispatch, getters}, id) {
            const url = `publisher/${id}`
            const resp = await api.get(url)
            const pubData = resp.data

            // this sets everything, but the scenarios aren't hydrated yet.
            // it's a hacky way to be able to show the publisher name without having to wait
            // for (up to) dozens of scenarios to finish hydrating.
            // commit("setSelectedPublisher", pubData)

            console.log("got publisher back. hydrating scenarios")
            clearScenarioCache()
            const myScenarioPromises = pubData.scenarios.map(apiScenario => {
                return fetchScenario(apiScenario.id)
            });
            pubData.scenarios = await Promise.all(myScenarioPromises)
            console.log("done hydrating all the scenarios")

            commit("setSelectedPublisher", pubData)
            return resp
        },

        async fetchPublisherApcData({commit, state, dispatch, getteaars}, id) {
            state.apcIsLoading = true

            const url = `publisher/${state.id}/apc`

            let resp
            try {
                resp = await api.get(url)
            } catch (e) {
                console.log("error loading publisher APC", e.response)
                resp = null
            } finally {
                state.apcIsLoading = false
            }

            if (resp) {
                state.apcPapersCount = resp.data.headers.find(h => h.value === "num_apc_papers").raw
                state.apcAuthorsFractionalCount = resp.data.headers.find(h => h.value === "fractional_authorship").raw
                state.apcCost = resp.data.headers.find(h => h.value === "cost_apc").raw
                state.apcHeaders = resp.data.headers
                state.apcJournals = resp.data.journals
                return resp
            }
            return

        },

        async refreshPublisherScenario({dispatch, commit}, scenarioId) {
            const newScenario = await fetchScenario(scenarioId)
            commit("replaceScenario", newScenario)
        },

        async refreshPublisherFileStatus({dispatch, getters, commit}, fileType) {
            const serverKey = getPublisherFileServerKey(fileType)
            const url = `publisher/${getters.publisherId}/${serverKey}/status`
            const resp = await api.get(url)
            const myFileStatus = makePublisherFileStatus(resp.data)
            commit("replaceFile", myFileStatus)
            return myFileStatus
        },

        async createScenario({state, getters}, {name}) {
            const newScenario = await createScenario(getters.publisherId, name)
            state.scenarios.push(newScenario)
            return newScenario
        },
        async copyScenario({commit, getters, state}, {id, newName}) {
            const newScenario = await copyScenario(getters.publisherId, id, newName)
            state.scenarios.push(newScenario)
            return newScenario
        },
    },
    getters: {
        selectedPublisher(state) {
            return state.selected
        },
        publisherName: (state) => {
            return state.name
        },
        publisherLogo: (state) => {
            return publisherLogoFromId(state.publisher)
        },

        publisherId: (state) => state.id,
        publisherPublisher: (state) => state.publisher,
        publisherScenariosCount: (state) => state.scenarios.length,
        publisherScenario: (state) => (id) => {
            return state.scenarios.find(s => s.id === id)
        },
        getPublisherDataFile: (state) => (dataFileKey) => {
            return state.dataFiles.find(d => d.id === dataFileKey)
        },
        publisherPriceDataFileIsLive: (state) => {
            return state.dataFiles.find(d => d.id === "price")?.isLive
        },
        publisherScenariosAreAllLoaded: (state) => {
            // make sure we don't have any scenarios that are still dehydrated:
            return state.scenarios.filter(s => s.saved).length === state.scenarios.length
        },
        publisherScenarios: (state) => state.scenarios,
        isPublisherDemo: (state) => state.isDemo,
        publisherBigDealCost: (state) => state.bigDealCost,
        publisherIsLoading: (state) => state.isLoading,
        getPublisherWarning: (state) => (id) => state.warnings.find(w => w.id === id),
        publisherWarnings: (state) => state.warnings ?? [],


        // @todo get rid of this
        publisherFilesDict: (state) => {
            const ret = {}
            state.dataFiles.forEach(f => {
                const val = {
                    ...f,
                    id: _.camelCase(f.name),
                }
                ret[val.id] = val
            })
            return ret
        },

        getPublisherDataIsComplete: (state) => (dataType) => {
            if (dataType === "counter") {
                return state.hasCompleteCounterData
            }
            else if (dataType === "currency") {
                return !!state.currency
            }
            else if (dataType === "bigDealCosts") {
                return !!state.bigDealCost && state.isBigDealCostIncreaseDefined
            }
            else if (dataType === "pta") {
                return state.warnings.findIndex(w => w.id === "missingPerpetualAccess") === -1
            }
            else if (dataType === "pricelist") {
                return state.warnings.findIndex(w => w.id === "missingPrices") === -1
            }
        },
        publisherHalp: (state) => {
            return {
                hasCompleteCounterData: state.hasCompleteCounterData,
                currency: state.currency,
                bigDealCost: state.bigDealCost,
                bigDealCostIncrease: state.bigDealCostIncrease,
            }
        },

        publisherRequiredDataIsLoaded: (state) => {
            return state.hasCompleteCounterData &&
                !!state.currency &&
                !!state.bigDealCost &&
                state.isBigDealCostIncreaseDefined
        },

        // @todo get rid of this
        publisherFiles: (state) => {
            return state.dataFiles.map(f => {
                return {
                    ...f,
                    id: _.camelCase(f.name),
                }
            })
        },
        publisherCounterVersion: (state) => {
            if (state.dataFiles.filter(f => f.counterVersion === 5).some(f => f.isLive)) {
                return 5
            }
            if (state.dataFiles.filter(f => f.counterVersion === 4).some(f => f.isLive)) {
                return 4
            }
        },

        publisherBigDeal5YearAnnualCost: (state) => {
            if (!state.bigDealCost || !state.isBigDealCostIncreaseDefined) return
            return bigDealAnnualCost(state.bigDealCost, state.bigDealCostIncrease / 100)
        },


        publisherCounterIsLive: (state) => {
            if (state.dataFiles.filter(f => f.counterVersion === 4).every(f => f.isLive)) {
                return true
            }
            if (state.dataFiles.filter(f => f.counterVersion === 5).every(f => f.isLive)) {
                return true
            }
            return false
        },
        publisherIsOwnedByConsortium: (state) => state.isOwnedByConsortium,
        publisherIsConsortialProposalSet: (state) => state.isConsortialProposalSet,
        publisherIsFeeder: (state) => state.isOwnedByConsortium, // new terminology for above
        publisherCurrency: (state) => state.currency,
        publisherCurrencySymbol: (state) => {
            const symbols = {
                USD: "$",
                CAD: "$",
                AUS: "$",
                NZD: "$",
                HKD: "$",
                GBP: "£",
                EUR: "€",
            }
            return symbols[state.currency]
        },
        publisherCurrencyIconName: (state) => {
            const symbols = {
                USD: "mdi-currency-usd",
                CAD: "mdi-currency-usd",
                AUS: "mdi-currency-usd",
                NZD: "mdi-currency-usd",
                HKD: "mdi-currency-usd",
                GBP: "mdi-currency-gbp",
                EUR: "mdi-currency-eur",
            }
            return symbols[state.currency]
        },
        publisherIconName: (state) => {
            return publisherIcon(state)
        },
        publishersBigDealCostIncrease: (state) => state.bigDealCostIncrease,
        publisherIsBigDealCostIncreaseDefined: (state) => state.isBigDealCostIncreaseDefined,



        // apc stuff
        publisherApcIsLoading: (state) => state.apcIsLoading,
        publisherApcPapersCount: (state) => state.apcPapersCount,
        publisherApcAuthorsFractionalCount: (state) => state.apcAuthorsFractionalCount,
        publisherApcCost: (state) => state.apcCost,
        publisherApcJournals: (state) => state.apcJournals,
        publisherApcHeaders: (state) => state.apcHeaders,

    }
}