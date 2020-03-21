
export const scenarioEditDialogs = {
    state: {
        isCopyDialogOpen: false,
        isRenameDialogOpen: false,
        isDeleteDialogOpen: false,

        scenarioToEdit: null,
        scenarioEditNewName: "",
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


        openCopyDialog(state, scenario){
            state.scenarioToEdit = scenario
            state.scenarioEditNewName = scenario.saved.name + " COPY"
            state.isCopyDialogOpen = true
        },
        openRenameDialog(state, scenario){
            state.scenarioToEdit = scenario
            state.scenarioEditNewName = scenario.saved.name
            state.isRenameDialogOpen = true
        },
        openDeleteDialog(state, scenario){
            state.scenarioToEdit = scenario
            state.isDeleteDialogOpen = true
        },

        setScenarioEditNewName(state, newName){
            state.scenarioEditNewName = newName
        },

        setScenarioEditDialogsAllClosed(state){
            state.scenarioToEdit = null
            state.scenarioEditNewName = ""
            state.isDeleteDialogOpen = false
            state.isCopyDialogOpen = false
            state.isRenameDialogOpen = false
        },
    },
    actions: {
    },
    getters: {
        scenarioToEdit: (state) => state.scenarioToEdit,

        isCopyDialogOpen: (state) => state.isCopyDialogOpen,
        isRenameDialogOpen: (state) => state.isRenameDialogOpen,
        isDeleteDialogOpen: (state) => state.isDeleteDialogOpen,

        scenarioEditNewName: (state) => state.scenarioEditNewName,

    }
}