import _ from "lodash"
import {api} from "../../api";



export const scenarioEditDialogs = {
    state: {
        isCopyDialogOpen: false,
        isRenameDialogOpen: false,
        isDeleteDialogOpen: false,

        scenarioSavedToEdit: null,
        scenarioEditRenameNewName: "",
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
            state.scenarioEditRenameNewName = scenarioSaved.name + " copy"
            state.isCopyDialogOpen = true
        },
        openRenameDialog(state, scenarioSaved){
            state.scenarioSavedToEdit = scenarioSaved
            state.scenarioEditRenameNewName = scenarioSaved.name + " copy"
            state.isRenameDialogOpen = true
        },
        openDeleteDialog(state, scenarioSaved){
            state.scenarioSavedToEdit = scenarioSaved
            state.isDeleteDialogOpen = true
        },


        setScenarioSavedToEdit(state, scenario){
            state.setScenarioSavedToEdit = scenario
        },
        setScenarioEditRenameNewName(state, newName){
            state.scenarioEditRenameNewName = newName
        },


        setScenarioEditDialogsAllClosed(state){
            state.scenarioSavedToEdit = null
            state.scenarioEditRenameNewName = ""
            state.isDeleteDialogOpen = false
            state.isCopyDialogOpen = false
            state.isRenameDialogOpen = false
        },
    },
    actions: {


        async confirmRenameScenario({commit, getters, dispatch, state}) {
            console.log("confirmRenameScenario()", state)
            state.scenarioSavedToEdit.name = state.scenarioEditRenameNewName

            state.scenarioEditDialogIsSaving = true
            const url = `scenario/${state.scenarioSavedToEdit.id}`
            await api.post(url, state.scenarioSavedToEdit)
            await dispatch("refreshPkg")

            state.scenarioEditDialogIsSaving = false
            commit("setScenarioEditDialogsAllClosed")
            return true
        },


        async confirmDeleteScenario({commit, getters, dispatch}) {
            console.log("confirmDeleteScenario()")
            // commit("clearSelectedScenario")
            // const url = `scenario/${scenarioId}`
            // await api.delete(url)
            // const fetchResp = await dispatch("refreshPkg")
            // return fetchResp.data
        },
    },
    getters: {
        isCopyDialogOpen: (state) => state.isCopyDialogOpen,
        isRenameDialogOpen: (state) => state.isRenameDialogOpen,
        isDeleteDialogOpen: (state) => state.isDeleteDialogOpen,
        scenarioEditDialogIsSaving: (state) => state.scenarioEditDialogIsSaving,
        scenarioEditRenameNewName: (state) => state.scenarioEditRenameNewName,

    }
}