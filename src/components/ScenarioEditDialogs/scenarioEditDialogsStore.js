
export const scenarioEditDialogs = {
    state: {
        isCopyDialogOpen: false,
        isRenameDialogOpen: false,
        isDeleteDialogOpen: false,
        isOpenScenarioDialogOpen: false,

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
        setOpenScenarioDialog(state, newVal){
            state.isOpenScenarioDialogOpen = newVal
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
        openOpenScenarioDialog(state){
            state.scenarioToEdit = null
            state.isOpenScenarioDialogOpen = true
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
            state.isOpenScenarioDialogOpen = false
        },
    },
    actions: {
    },
    getters: {
        scenarioToEdit: (state) => state.scenarioToEdit,

        isCopyDialogOpen: (state) => state.isCopyDialogOpen,
        isRenameDialogOpen: (state) => state.isRenameDialogOpen,
        isDeleteDialogOpen: (state) => state.isDeleteDialogOpen,
        isOpenScenarioDialogOpen: (state) => state.isOpenScenarioDialogOpen,

        scenarioEditNewName: (state) => state.scenarioEditNewName,

    }
}