import Vue from 'vue'
import Vuex from 'vuex'

import {publisher} from "./publisher.store.js"
import {scenario} from "./scenario.store"
import {scenarioEditDialogs} from "../components/ScenarioEditDialogs/scenarioEditDialogsStore";
import {institution} from "./institution.store";
import {user} from "./user.store";
import configs from "../appConfigs"
import {roleFromPermissions} from "../shared/userPermissions";
import {saveScenario} from "../shared/scenario";


Vue.use(Vuex)

// https://www.npmjs.com/package/short-uuid
const short = require('short-uuid');




// looks useful: https://scotch.io/tutorials/handling-authentication-in-vue-using-vuex

export default new Vuex.Store({
    state: {
        notSupportedMsgOpen: false,
        snackbarMsg: "",
        snackbarIsOpen: false,
        snackbarColor: null,

        editMode: false,

        configsOpen: false,

        startupTutorialOpen: false,

        loading: 0,

        showColInfo: false,
        colInfo: null,

        infoKey: null,
        isLandingPage: false,


    },
    modules: {
        scenarioEditDialogs,
        institution,
        user,
        publisher,
        scenario,
    },


    mutations: {
        startGlobalLoading(state){
            state.loading += 1
        },
        setIsLandingPage(state, val){
            state.isLandingPage = !!val
        },
        finishGlobalLoading(state){
            if (state.loading > 0 ) state.loading -= 1
        },

        showColInfo(state, name){
            state.colInfo = configs.journalCols.find(c => {
                return c.value === name
            })
            state.showColInfo = true
        },
        clearColInfo(state){
            state.showColInfo = false
            state.colInfo = null
        },








        // UI stuff
        closeNotSupportedMsg(state) {
            state.notSupportedMsgOpen = false
        },
        openNotSupportedMsg(state) {
            state.notSupportedMsgOpen = true
        },
        snackbar(state, msg, color="#111"){
            state.snackbarMsg = msg
            state.snackbarColor = color
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
    },

    getters: {
        isGlobalLoading(state){return state.loading > 0},
        colInfo(state){return state.colInfo},
        infoKey(state){return state.infoKey},
        isLandingPage(state){return state.isLandingPage},
        userCanEditActivePublisher: (state) => {

            const activeInstitution = state.institution
            const activePublisher = state.publisher

            const myUserInstitutionData = activeInstitution.institutionUsers.find(iu => {
                return iu.is_authenticated_user
            })
            if (!myUserInstitutionData) return

            const userRole = roleFromPermissions(myUserInstitutionData.permissions)


            if (userRole === "Admin") return true
            if (userRole === "Collaborator") return true
            return false


        },






    }
})




































