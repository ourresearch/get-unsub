import axios from "axios";
import Vue from "vue"


const dataFilesConfig = {
    counter: {
        displayName: "COUNTER JR1 report",
        counterVersion: 4,
    },
    "counterTrj2": {
        displayName: "COUNTER TRJ_2 report",
        counterVersion: 5,
    },
    "counterTrj3": {
        displayName: "COUNTER TRJ_3 report",
        counterVersion: 5,
    },
    "counterTrj4": {
        displayName: "COUNTER TRJ_4 report",
        counterVersion: 5,
    },
    "price": {
        displayName: "Title-by-title pricelist",
    },
    "perpetualAccess": {
        displayName: "Post-termination access (PTA) list",
    },
    "coreJournals": {
        displayName: "Core journals list",
    },
}


import {api} from "../api"
import {
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
import publisherFileConfigs from "../components/PublisherFile/publisherFileConfigs";
import {publisherLogoFromId} from "../shared/publisher";

// https://www.npmjs.com/package/short-uuid
const short = require('short-uuid');


export const publisher = {
    state: {
        selected: null,

        isLoading: false,
        apcIsLoading: false,
        tabShowing: 0,

        id: null,
        publisher: "",
        name: "",
        isDemo: false,
        scenarios: [],
        journalDetail: {},
        journals: [],
        dataFiles: [],
        counterIsUploaded: false,
        bigDealCost: 0,
        isOwnedByConsortium: false,
        currency: "USD",

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
            state.tabShowing = 0
            state.id = null
            state.publisher = ""
            state.name = ""
            state.isDemo = false
            state.scenarios = []
            state.journalDetail = {}
            state.journals = []
            state.dataFiles = []
            state.counterIsUploaded = false
            state.bigDealCost = 0

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
            state.scenarios = apiPublisher.scenarios.map(s => {
                const ret = s
                // if (s.saved){
                    // s.saved.description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                // }
                return ret
            })

            state.journalDetail = apiPublisher.journal_detail
            state.journals = []
            state.journals = apiPublisher.journals.map(j => {
                return makePublisherJournal(j)
            })
            state.dataFiles = apiPublisher.data_files.map(dataFile => {
                dataFile.name = dataFile.name.replace("prices", "price")
                dataFile.id = _.camelCase(dataFile.name)
                return dataFile
            })
            state.counterIsUploaded = state.dataFiles.findIndex(f => f.name === 'counter' && f.uploaded) > -1
            state.bigDealCost = apiPublisher.cost_bigdeal
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

        deleteScenario(state, id) {
            const index = state.scenarios.findIndex(s => s.id === newScenario.id)
            state.scenarios.splice(index, 1)
        },
        setPublisherId(state, id) {
            state.id = id
        },
        setPublisherTabShowing(state, index) {
            state.tabShowing = index
        },


    },
    actions: {
        async fetchPublisher({commit, dispatch, getters}, id) {
            if (id === getters.publisherId) return
            commit("clearPublisher")
            commit("startLoading")
            commit("setPublisherId", id)
            await dispatch("fetchPublisherMainData", id)
            commit("finishLoading")
        },

        async fetchPublisherLazy({commit, dispatch, getters}, id) {
            commit("startLoading")
            const url = `publisher/${id}`
            const resp = await api.get(url)
            const pubData = resp.data
            commit("setSelectedPublisher", pubData)
            commit("finishLoading")
        },
        async refreshPublisher({commit, dispatch, getters}) {
            commit("startLoading")
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
            commit("setSelectedPublisher", pubData)

            console.log("got publisher back. hydrating scenarios")
            const myScenarioPromises = pubData.scenarios.map(apiScenario => {
                return fetchScenario(apiScenario.id)
            });
            pubData.scenarios = await Promise.all(myScenarioPromises)
            console.log("done hydrating all the scenarios")

            commit("setSelectedPublisher", pubData) // set everything AGAIN now that scenarios are hydrated.
            return resp
        },

        async fetchPublisherApcData({commit, state, dispatch, getters}, id) {
            state.apcIsLoading = true

            const url = `publisher/${id}/apc`

            return state.apcIsLoadingfoo

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

        async refreshPublisherScenario({dispatch, commit}, scenarioId){
            const newScenario = await fetchScenario(scenarioId)
            commit("replaceScenario", newScenario)
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
        publisherTabShowing: (state) => state.tabShowing,
        publisherPublisher: (state) => state.publisher,
        publisherJournals: (state) => state.journals,
        publisherJournalsValid: (state) => state.journals.filter(j => j.isValid),
        publisherScenariosCount: (state) => state.scenarios.length,
        publisherScenario: (state) => (id) => {
            return state.scenarios.find(s => s.id === id)
        },
        getPublisherDataFile: (state) => (dataFileKey) => {
            const myDataFile = state.dataFiles.find(d => d.id === dataFileKey)
            if (!myDataFile) return
            const myDataFileCopy = {...myDataFile}
            return Object.assign(myDataFileCopy, dataFilesConfig[myDataFileCopy.id])
        },
        publisherScenariosAreAllLoaded: (state) => {
            // make sure we don't have any scenarios that are still dehydrated:
            return state.scenarios.filter(s => s.saved).length === state.scenarios.length
        },
        publisherScenarios: (state) => state.scenarios,
        isPublisherDemo: (state) => state.isDemo,
        publisherBigDealCost: (state) => state.bigDealCost,
        publisherIsLoading: (state) => state.isLoading,


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

        // @todo get rid of this
        publisherFiles: (state) => {
            return state.dataFiles.map(f => {
                return {
                    ...f,
                    id: _.camelCase(f.name),
                }
            })
        },


        publisherCounterIsUploaded: (state) => state.counterIsUploaded,
        publisherIsOwnedByConsortium: (state) => state.isOwnedByConsortium,
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


        // apc stuff
        publisherApcIsLoading: (state) => state.apcIsLoading,
        publisherApcPapersCount: (state) => state.apcPapersCount,
        publisherApcAuthorsFractionalCount: (state) => state.apcAuthorsFractionalCount,
        publisherApcCost: (state) => state.apcCost,
        publisherApcJournals: (state) => state.apcJournals,
        publisherApcHeaders: (state) => state.apcHeaders,
    }
}