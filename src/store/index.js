import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'


Vue.use(Vuex)

// https://www.npmjs.com/package/short-uuid
const short = require('short-uuid');


const demoConfigs = {
    cost_alacart_increase: 8,
    cost_bigdeal: 2100000,
    cost_bigdeal_increase: 5,
    cost_content_fee_percent: 5.7,
    cost_ill: 17,
    ill_request_percent_of_delayed: 5,
    include_bronze: true,
    include_submitted_version: true,
    include_backfile: true,
    include_social_networks: true,
    package: "demo",
    weight_authorship: 100,
    weight_citation: 10,
}

const journalViews = [
    {value: "journals", displayName: "Overview", icon: "mdi-person"},
    {value: "fulfillment", displayName: "Fulfillment", icon: "mdi-person"},
    {value: "oa", displayName: "Open Access", icon: "mdi-person"},
    {value: "impact", displayName: "Impact", icon: "mdi-person"},
    {value: "costs", displayName: "Subscription cost", icon: "mdi-person"},
    {value: "apc", displayName: "APC cost", icon: "mdi-person"},
    {value: "report", displayName: "Export", icon: "mdi-person"},
]


const demoScenarios = [{
    id: "1",
    name: "My First Scenario",
    pkgId: "demo-pkg-123",
    summary: {
        cost_percent: 0,
        use_instant_percent: 0,
        num_journals_subscribed: 0,
    },
    subrs: [],
    customSubrs: [],
    configs: {...demoConfigs}
}
]

const demoPkgs = [
    {
        id: "demo-pkg-123",
        name: "my Elsevier Freedom Package",
        hasCounterData: true,
        numJournals: 1851,
        numPerpAccessJournals: 1851,
    }
]

const demoUser = {
    id: "demo-user",
    name: "Demo 1",
    selectedPkgId: null,
    selectedScenarioId: null,
}


// looks useful: https://scotch.io/tutorials/handling-authentication-in-vue-using-vuex

const summaryUrl = "https://unpaywall-jump-api.herokuapp.com/scenario/summary?package=demo"
const tabDataBaseUrl = "https://unpaywall-jump-api.herokuapp.com/scenario/{key}?package=demo"

export default new Vuex.Store({
    state: {
        user: null,

        summaryLoading: false,
        tabDataLoading: false,

        authState: "ready",
        notSupportedMsgOpen: false,
        snackbarMsg: "",
        snackbarIsOpen: false,
        snackbarColor: "success",

        scenarios: [],
        selectedScenario: null,

        pkgs: [],
        selectedPkg: null,

        tabData: null,
        tabDataDigest: "",
        tabDataEndpointName: "journals",
        tabDataIndex: null,

        singleJournalData: null,
        singleJournalId: null,


        wizardOpen: null,
        wizardData: null,

        editMode: false,

        configsOpen: false,

        startupTutorialOpen: false,
        startupTutorialFinished: false,



    },
    mutations: {
        // stuff stuff
        summaryLoading(state) {
            state.summaryLoading = true
        },
        summaryDoneLoading(state) {
            state.summaryLoading = false
        },
        tabDataLoading(state) {
            state.tabDataLoading = true
        },
        tabDataDoneLoading(state) {
            state.tabDataLoading = false
        },


        // auth stuff
        authLoading(state) {
            state.authState = "loading"
        },
        authSuccess(state, account) {
            state.authState = "success"
            // state.account = account
            // state.account.pkgs = demoPkgs
            //
            // state.scenarios = demoScenarios
            // state.pkgs = demoPkgs
        },
        setUser(state, user) {
            state.user = user
        },


        // UI stuff
        closeNotSupportedMsg(state) {
            state.notSupportedMsgOpen = false
        },
        openNotSupportedMsg(state) {
            state.notSupportedMsgOpen = true
        },
        snackbar(state, msg, color="success"){
            state.snackbarMsg = msg
            state.snackbarIsOpen = true
        },
        closeSnackbar(state){
            state.snackbarMsg = ""
            state.snackbarIsOpen = false
        },
        clearStartupTutorial(state){
            state.startupTutorialOpen = false
            state.startupTutorialFinished = true
        },
        openStartupTutorial(state){
            if (!state.startupTutorialFinished){
                state.startupTutorialOpen = true
            }

        },


        // pkg stuff
        selectPkg(state, id) {
            state.selectedPkg = state.pkgs.find(p => {
                return p.id === id
            })
        },
        setPkgs(state, pkgs) {
            state.pkgs = pkgs
        },
        clearPkg(state) {
            state.selectedPkg = null
            state.selectedScenario = null
            state.tabData = null
            state.tabDataEndpointName = "journals"
            state.tabDataIndex = null
        },


        // config stuff
        setConfig(state, config) {
            state.selectedScenario.configs[config.k] = config.v

            // @todo: wtf is this? i think ununsed. i hope.
            state.obj = {
                ...state.selectedScenario.configs,
                [config.k]: config.v
            }


            console.log("saved config", config, state.selectedScenario.configs)
        },
        setConfigsOpen(state){
            if(state.editMode){
                console.log("edit mode bro")
                state.snackbarIsOpen = true
                state.snackbarMsg = "You can't change configs when you're Edit Mode"
                state.snackbarColor = "info"
                return
            }
            state.configsOpen = true
        },
        clearConfigsOpen(state){
            state.configsOpen = false
        },




        // scenario stuff
        selectScenario(state, id) {
            state.selectedScenario = state.scenarios.find(s => {
                return s.id === id
            })
        },
        setScenarios(state, scenarios) {
            state.scenarios = scenarios
        },
        clearScenario(state) {
            state.selectedScenario = null
        },
        saveScenario(state) {
            // fake saving this to the server
            return new Promise((resolve, reject) => {
                setTimeout(function () {
                    resolve()
                }, 500)
            })
        },
        setSubrs(state, subrIssnls) {
            state.selectedScenario.subrs = subrIssnls
        },
        addSubr(state, issnl) {
            if (!state.selectedScenario.subrs.includes(issnl)) {
                state.selectedScenario.subrs.push(issnl)
            }
        },
        removeSubr(state, issnl) {
            this.state.selectedScenario.subrs = this.state.selectedScenario.subrs.filter(j => j !== issnl)
        },
        setSummary(state, summary) {
            // state.selectedScenario.summary = summary
            Vue.set(state.selectedScenario, "summary", summary)
        },

        setTabData(state, newTabData) {
            state.tabData = newTabData
            state.tabDataIndex = journalViews.findIndex(v=>{
                return v.value === newTabData.key
            })


            state.tabDataDigest = Object.values(newTabData._summary).join()
            console.log("setting tab data", newTabData, state.tabDataDigest)
        },


        // scenario UI stuff
        setTabDataEndPointName(state, name) {
            state.tabDataEndpointName = name
        },

        // single journal stuff
        setSingleJournalData(state, data){
            state.singleJournalData = data
        },
        setSingleJournalId(state, issnl){
            state.singleJournalId = issnl
        },
        clearSingleJournal(state){
            state.singleJournalId = null
            state.singleJournalData = null

        },


        // wizard stuff
        setWizardData(state, data){
            state.wizardData = data
        },
        setWizardOpen(state){
            console.log("set wizard open")
            state.wizardOpen = true
        },
        clearWizard(state){
            state.wizardOpen = null
            state.wizardData = null
        },

        // edit mode
        setEditMode(state){
            state.editMode = true
            state.configsOpen = false
        },
        clearEditMode(state){
            state.editMode = false
        },


    },
    actions: {
        login({commit}, userCreds) {
            // implement later
        },
        loginDemo({commit}) {
            const dummyPkgs = demoPkgs.map(p => {
                return {...p}
            })
            const dummyScenarios = demoScenarios.map(s => {
                return {...s}
            })
            const dummyUser = {...demoUser}

            return new Promise((resolve, reject) => {
                commit('authLoading')
                commit('authSuccess', demoUser)

                commit('setUser', dummyUser)
                commit('setPkgs', dummyPkgs)
                commit('setScenarios', dummyScenarios)
                commit("openStartupTutorial")


                resolve()
            })
        },
        async updateTabData({commit, state}) {
            commit("tabDataLoading")
            const url = tabDataBaseUrl.replace("{key}", state.tabDataEndpointName)
            return axios.post(url, state.selectedScenario)
                .then(resp => {
                    resp.data.key = state.tabDataEndpointName
                    commit("setTabData", resp.data)
                    console.log("got tab data", resp.data)
                })
                .catch(err => {
                    console.log("got error from updateTabData()", url, err)
                })
                .finally(() => commit("tabDataDoneLoading"))
        },
        async updateSummary({commit, state}) {
            commit("summaryLoading")
            return axios.post(summaryUrl, state.selectedScenario)
                .then(r => {
                    commit("setSummary", r.data._summary)
                })
                .finally(() => commit("summaryDoneLoading"))
        },


        async setSubrs({commit, dispatch}, subrIssnls) {
            commit("setSubrs", subrIssnls)
            dispatch("updateSummary")
            await dispatch("updateTabData")
            return true
        },
        async addSubr({commit, dispatch}, issnl) {
            commit("addSubr", issnl)
            dispatch("updateSummary")
            await dispatch("updateTabData")
            commit("snackbar", "Subscribed to the item!")
            return true
        },
        async removeSubr({commit, dispatch}, issnl) {
            commit("removeSubr", issnl)
            dispatch("updateSummary")
            await dispatch("updateTabData")
            commit("snackbar", "Article unsubscribed!")
            return true
        },
        async setConfig({commit, dispatch}, config) {
            commit("setConfig", config)
            dispatch("updateSummary")
            await dispatch("updateTabData")
            commit("snackbar", "Config changed!")
            return true
        },

        async setTabData({commit, dispatch}, endpointName) {
            commit("setTabDataEndPointName", endpointName)
            await dispatch("updateTabData")
            return true
        },


        async openSingleJournal({commit, state, dispatch}, issnl){
            console.log("open single journal", issnl)
            commit("setSingleJournalId", issnl)

            const url = "https://unpaywall-jump-api.herokuapp.com/journal/issn_l/" + issnl
            return axios.post(url, state.selectedScenario)
                .then(resp => {
                    commit("setSingleJournalData", resp.data)
                    console.log("set the single journal data", resp.data)
                })
                .catch(err => {
                    console.log("got error from openSingleJournal()", url, err)
                })


        },


        async openWizard({commit, state, dispatch}){
            console.log("open wizard")
            commit("setWizardOpen")

            const url = "https://unpaywall-jump-api.herokuapp.com/scenario/slider?package=demo"
            return axios.post(url, state.selectedScenario)
                .then(resp => {
                    commit("setWizardData", resp.data)
                    console.log("set the wizard data", resp.data)
                })
                .catch(err => {
                    console.log("got error from openWizard()", url, err)
                })


        },




    },
    modules: {},
    getters: {
        count: state => state.count,
        isLoggedIn: state => !!state.user,
        selectedPkg: state => {
            const myPkg = state.selectedPkg
            if (!myPkg) return null

            myPkg.scenarios = state.scenarios.filter(s => {
                return s.pkgId === myPkg.id
            })
            return myPkg

        },
        selectedScenario(state) {
            return state.selectedScenario
        },
        summary(state) {
            if (state.selectedScenario) {
                return state.selectedScenario.summary
            }
        },
        tabDataDigest(state) {
            return state.tabDataDigest
        },
        subrs(state) {
            if (state.selectedScenario) {
                return state.selectedScenario.subrs
            } else {
                return []
            }
        },
        configs(state) {
            if (state.selectedScenario) {
                return state.selectedScenario.configs
            }
        },
        config: (state) => (k) => {
            if (state.selectedScenario) {
                return state.selectedScenario.configs[k]
            }
        },
        journalViews(state) {
            return journalViews
        },
        wizardLoading(state){
            return state.wizardOpen && !state.wizardData
        },
        singleJournalLoading(state){
            return state.singleJournalId && !state.singleJournalData
        }




    }
})




































