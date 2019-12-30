import Vue from 'vue'
import Vuex from 'vuex'

import {account} from "./account.module.js"
import {pkg} from "./pkg.module.js"
import {scenario} from "./scenario.module"
import configs from "../appConfigs"


Vue.use(Vuex)

// https://www.npmjs.com/package/short-uuid
const short = require('short-uuid');




// looks useful: https://scotch.io/tutorials/handling-authentication-in-vue-using-vuex

export default new Vuex.Store({
    state: {
        user: null,

        summaryLoading: false,

        notSupportedMsgOpen: false,
        snackbarMsg: "",
        snackbarIsOpen: false,
        snackbarColor: "success",

        scenarios: [],
        selectedScenario: null,


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

        loading: 0,

        showColInfo: false,
        colInfo: null,

        showInfo: false,
        infoKey: null,


    },
    modules: {
        account,
        pkg,
        scenario,
    },


    mutations: {
        // stuff stuff
        summaryLoading(state) {
            state.summaryLoading = true
        },
        summaryDoneLoading(state) {
            state.summaryLoading = false
        },
        startLoading(state){
            // state.loading = true
        },
        finishLoading(state){
            // state.loading = false
        },

        showColInfo(state, name){
            state.colInfo = configs.journalCols.find(c => {
                return c.value === name
            })
            state.showColInfo = true
        },
        clearColInfo(state){
            state.showInfo = false
            state.info = null
        },

        showInfo(state, infoKey){
            state.infoKey = infoKey
            state.showInfo = true
        },
        clearInfo(state){
            state.showInfo = false
            state.infoKey = null
        },






        // auth stuff
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
            localStorage.setItem("startupTutorialFinished", "true")


        },
        openStartupTutorial(state){
            if (!localStorage.getItem("startupTutorialFinished")){
                state.startupTutorialOpen = true
            }

        },



        // config stuff
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
        toggleConfigsOpen(state){
            console.log("toggle configs open")

            if (state.configsOpen){
                state.configsOpen = false
            }
            else { // configs are closed
                if(state.editMode){
                    state.editMode = false

                    // console.log("edit mode bro")
                    // state.snackbarIsOpen = true
                    // state.snackbarMsg = "You can't change configs when you're Edit Mode"
                    // state.snackbarColor = "info"
                    // return
                }
                state.configsOpen = true

            }

        },




        // scenario stuff
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


        setSummary(state, summary) {
            // state.selectedScenario.summary = summary
            Vue.set(state.selectedScenario, "summary", summary)
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
        async loginDemo({dispatch, state, commit}){
            const userCreds = {
                username: "demo",
                password: "demo"
            }
            await dispatch("login", userCreds)
            const firstPkgId = state.account.selected.packages[0].id

            await dispatch("fetchPkg", firstPkgId)
            const firstScenarioId = state.pkg.selected.scenarios[0].id

            await dispatch("fetchScenario", firstScenarioId)
            commit("openStartupTutorial")
            return `/a/${firstPkgId}/${firstScenarioId}`
        },









    },

    getters: {
        count: state => state.count,
        // selectedScenario(state) {
        //     return state.selectedScenario
        // },

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

        journalViews(state) {
            return journalViews
        },
        wizardLoading(state){
            return state.wizardOpen && !state.wizardData
        },
        singleJournalLoading(state){
            return state.singleJournalId && !state.singleJournalData
        },
        loading(state){return state.loading > 0},
        colInfo(state){return state.colInfo},
        infoKey(state){return state.infoKey},






    }
})




































