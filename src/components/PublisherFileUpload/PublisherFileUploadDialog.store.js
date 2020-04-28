
export const publisherFileUploadDialog = {
    state: {
        isOpen: false,
        fileType: null,
        fileSelected: null,
        isLoading: false,
        errorMsg: null,
    },
    mutations: {
        setPublisherFileUploadDialogIsOpen(state, newVal){
            state.isOpen = newVal
        },

        openPublisherFileUploadDialog(state, fileType){
            state.isOpen = true
            state.fileType = fileType
            state.fileSelected = null
            state.isLoading = false
            state.errorMsg = null
        },
        closePublisherFileUploadDialog(state){
            state.isOpen = false
            state.fileType = null
            state.fileSelected = null
            state.isLoading = false
            state.errorMsg = null
        },


        setPublisherFileUploadDialogFileType(state, newVal){
            state.fileType = newVal
        },
        setPublisherFileUploadDialogIsLoading(state, newVal){
            state.isLoading = newVal
        },
        setPublisherFileUploadDialogErrorMsg(state, newVal){
            state.errorMsg = newVal
        },

    },
    actions: {

    },
    getters: {
        publisherFileUploadDialogIsOpen: (state) => state.isOpen,
        publisherFileUploadDialogFileType: (state) => state.fileType,
        publisherFileUploadDialogFileSelected: (state) => state.fileSelected,
        publisherFileUploadDialogIsLoading: (state) => state.isLoading,
        publisherFileUploadDialogErrorMsg: (state) => state.errorMsg,

    }
}