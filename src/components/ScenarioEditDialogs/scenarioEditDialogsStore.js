import _ from "lodash"

import router from '../../router'

import {api} from "../../api";



export const scenarioEditDialogs = {
    state: {
        isCopyDialogOpen: false,
        isRenameDialogOpen: false,
        isDeleteDialogOpen: false,

        scenarioSavedToEdit: null,
        scenarioEditNewName: "",
        scenarioEditDialogIsSaving: false
    },
    mutations: {
        setCopyDialog(state, newVal){
            state.isCopyDialogOpen = newVal
        },
        setRenameDialog(state, newVal){
            state.isRenameDialogOpen = newVal
        },
        setDeleteDialog(state, newVal){
            state.isDeleteDialogOpen = newVal
        },


        openCopyDialog(state, scenarioSaved){
            state.scenarioSavedToEdit = scenarioSaved
            state.scenarioEditNewName = scenarioSaved.name + " COPY"
            state.isCopyDialogOpen = true
        },
        openRenameDialog(state, scenarioSaved){
            state.scenarioSavedToEdit = scenarioSaved
            state.scenarioEditNewName = scenarioSaved.name
            state.isRenameDialogOpen = true
        },
        openDeleteDialog(state, scenarioSaved){
            state.scenarioSavedToEdit = scenarioSaved
            state.isDeleteDialogOpen = true
        },

        setScenarioEditNewName(state, newName){
            state.scenarioEditNewName = newName
        },


        setScenarioEditDialogsAllClosed(state){
            state.scenarioSavedToEdit = null
            state.scenarioEditNewName = ""
            state.isDeleteDialogOpen = false
            state.isCopyDialogOpen = false
            state.isRenameDialogOpen = false
        },
    },
    actions: {


        async confirmRenameScenario({commit, getters, dispatch, state}) {
            console.log("confirmRenameScenario()", state)
            state.scenarioSavedToEdit.name = state.scenarioEditNewName

            state.scenarioEditDialogIsSaving = true
            const url = `scenario/${state.scenarioSavedToEdit.id}`
            await api.post(url, state.scenarioSavedToEdit)
            await dispatch("refreshPkg")

            state.scenarioEditDialogIsSaving = false
            commit("setScenarioEditDialogsAllClosed")
            return true
        },

        async confirmCopyScenario({commit, getters, dispatch, state}) {
            console.log("confirmCopyScenario()", state)

            state.scenarioEditDialogIsSaving = true
            const url = `package/${getters.pkgId}/scenario?copy=${state.scenarioSavedToEdit.id}`
            await api.post(url, {name: state.scenarioEditNewName})
            await dispatch("refreshPkg")

            state.scenarioEditDialogIsSaving = false
            commit("setScenarioEditDialogsAllClosed")
            return true
        },


        async confirmDeleteScenario({commit, getters, state, dispatch}) {
            if (getters.pkgScenariosCount < 2) return
            const url = `scenario/${state.scenarioSavedToEdit.id}`

            state.scenarioEditDialogIsSaving = true
            await api.delete(url)
            await dispatch("refreshPkg")
            commit("clearSelectedScenario")

            state.scenarioEditDialogIsSaving = false
            commit("setScenarioEditDialogsAllClosed")
            await router.push(`/a/${getters.pkgId}`)
            return true
        },
    },
    getters: {
        isCopyDialogOpen: (state) => state.isCopyDialogOpen,
        isRenameDialogOpen: (state) => state.isRenameDialogOpen,
        isDeleteDialogOpen: (state) => state.isDeleteDialogOpen,
        scenarioEditDialogIsSaving: (state) => state.scenarioEditDialogIsSaving,
        scenarioEditNewName: (state) => state.scenarioEditNewName,

    }
}