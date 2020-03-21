<template>
    <div>


        <v-dialog v-model="isCopyDialogOpen" max-width="400" persistent>
            <v-card v-if="isCopyDialogOpen">
                <v-card-title class="headline">
                    Copy scenario
                </v-card-title>
                <v-card-text class="pt-4">
                    <div>
                        <v-text-field
                                outlined
                                label="Name for the new scenario:"
                                type="text"
                                @keydown.enter="confirmCopyScenario"
                                v-model="scenarioEditNewName"
                        />
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-btn depressed
                           @click="confirmCopyScenario"
                           color="primary"
                    >
                        Copy
                    </v-btn>
                    <v-btn depressed
                           @click="setScenarioEditDialogsAllClosed"
                    >
                        Cancel
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>


        <v-dialog v-model="isRenameDialogOpen" max-width="400" persistent>
            <v-card v-if="isRenameDialogOpen">
                <v-card-title class="headline">
                    Rename scenario
                </v-card-title>
                <v-card-text class="pt-4">
                    <div>
                        <v-text-field
                                outlined
                                type="text"
                                label="New name:"
                                @keydown.enter="confirmRenameScenario"
                                v-model="scenarioEditNewName"
                        />
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-btn depressed
                           @click="confirmRenameScenario"
                           color="primary"
                    >
                        Rename
                    </v-btn>
                    <v-btn depressed
                           @click="setScenarioEditDialogsAllClosed"
                    >
                        Cancel
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>


        <v-dialog v-model="isDeleteDialogOpen" max-width="400">
            <v-card v-if="isDeleteDialogOpen">
                <v-card-title class="headline">
                    Delete scenario
                </v-card-title>
                <v-card-text class="pt-4">
                    <div>
                        Are you sure you want to delete this scenario? This can't be undone.
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-btn depressed
                           @click="confirmDeleteScenario"
                           color="primary"
                    >
                        Delete scenario
                    </v-btn>
                    <v-btn depressed
                           @click="setScenarioEditDialogsAllClosed"
                    >
                        Cancel
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>


        <v-snackbar
                v-model="isCopySnackbarOpen"
                :timeout="3000"
                top
        >
            Scenario copied
            <v-btn dark icon @click="isCopySnackbarOpen = false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-snackbar>


        <v-snackbar
                v-model="isRenameSnackbarOpen"
                :timeout="3000"
                top
        >
            Scenario renamed
            <v-btn dark icon @click="isRenameSnackbarOpen = false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-snackbar>

        <v-snackbar
                v-model="isDeleteSnackbarOpen"
                :timeout="3000"
                top
        >
            Scenario deleted
            <v-btn dark icon @click="isDeleteSnackbarOpen = false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-snackbar>


    </div>
</template>

<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex'

    export default {
        name: "ScenarioEditDialogs",
        data() {
            return {
                isCopySnackbarOpen: false,
                isRenameSnackbarOpen: false,
                isDeleteSnackbarOpen: false,
            }
        },
        computed: {
            ...mapGetters([
                "scenarioEditDialogIsSaving",
                "scenarioToEdit",
            ]),
            isCopyDialogOpen: {
                get() {
                    return this.$store.getters.isCopyDialogOpen
                },
                set(newVal) {
                    this.$store.commit("setCopyDialog", newVal)
                },
            },
            isRenameDialogOpen: {
                get() {
                    return this.$store.getters.isRenameDialogOpen
                },
                set(newVal) {
                    this.$store.commit("setRenameDialog", newVal)
                },
            },
            isDeleteDialogOpen: {
                get() {
                    return this.$store.getters.isDeleteDialogOpen
                },
                set(newVal) {
                    this.$store.commit("setDeleteDialog", newVal)
                },
            },
            scenarioEditNewName: {
                get() {
                    return this.$store.getters.scenarioEditNewName
                },
                set(newVal) {
                    this.$store.commit("setScenarioEditNewName", newVal)
                },

            }
        },
        methods: {
            ...mapActions([]),
            ...mapMutations([
                "setScenarioEditDialogsAllClosed",
            ]),
            confirmCopyScenario() {
                this.$store.dispatch("copyScenario", {
                    id: this.scenarioToEdit.id,
                    newName: this.scenarioEditNewName,
                })
                this.isCopySnackbarOpen = true
                this.$store.commit("setScenarioEditDialogsAllClosed")
            },
            confirmRenameScenario() {
                this.$store.dispatch("renameScenario", {
                    id: this.scenarioToEdit.id,
                    newName: this.scenarioEditNewName,
                })
                this.isRenameSnackbarOpen = true
                this.$store.commit("setScenarioEditDialogsAllClosed")
            },
            confirmDeleteScenario() {
                this.$store.dispatch("deleteScenario", this.scenarioToEdit.id)
                this.$store.commit("setScenarioEditDialogsAllClosed")
                this.isDeleteSnackbarOpen = true
            },
        }
    }
</script>

<style scoped>

</style>