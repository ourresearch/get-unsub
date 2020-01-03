import Vue from 'vue'
import Vuex from 'vuex'
import configs from "../appConfigs"


// looks useful: https://scotch.io/tutorials/handling-authentication-in-vue-using-vuex

export default new Vuex.Store({
    state: {
        notSupportedMsgOpen: false,
        snackbarMsg: "",
        snackbarIsOpen: false,
        snackbarColor: "success",

        scenarios: [],
        selectedScenario: null,


        tabData: null,
        tabDataEndpointName: "journals",
        tabDataIndex: null,

        singleJournalData: null,
        singleJournalId: null,



        editMode: false,

        configsOpen: false,

        startupTutorialOpen: false,

        loading: 0,

        showColInfo: false,
        colInfo: null,

        showInfo: false,
        infoKey: null,


    },


    mutations: {
        // stuff stuff
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


        // edit mode
        setEditMode(state){
            state.editMode = true
            state.configsOpen = false
        },
        clearEditMode(state){
            state.editMode = false
        },
    },

    getters: {
        loading(state){return state.loading > 0},
        colInfo(state){return state.colInfo},
        infoKey(state){return state.infoKey},






    }
})




































