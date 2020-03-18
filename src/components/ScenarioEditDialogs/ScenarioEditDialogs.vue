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
                                :disabled="scenarioEditDialogIsSaving"
                                @keydown.enter="confirmCopyScenario"
                                v-model="scenarioEditNewName"
                        />
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-btn depressed
                           @click="confirmCopyScenario"
                           color="primary"
                           :loading="scenarioEditDialogIsSaving"
                    >
                        Copy
                    </v-btn>
                    <v-btn depressed @click="setScenarioEditDialogsAllClosed">
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
                                :disabled="scenarioEditDialogIsSaving"
                                @keydown.enter="confirmRenameScenario"
                                v-model="scenarioEditNewName"
                        />
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-btn depressed
                           @click="confirmRenameScenario"
                           color="primary"
                           :loading="scenarioEditDialogIsSaving"
                    >
                        Rename
                    </v-btn>
                    <v-btn depressed @click="setScenarioEditDialogsAllClosed">
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
                           :loading="scenarioEditDialogIsSaving"
                    >
                        Delete scenario
                    </v-btn>
                    <v-btn depressed @click="setScenarioEditDialogsAllClosed">
                        Cancel
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>


        <v-snackbar
                v-model="isCopySnackbarOpen"
                :timeout="5000"
        >
            Scenario copied!
            <v-btn
                    color="blue"
                    text
                    @click="isCopySnackbarOpen = false"
            >
                Stay here
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
            ...mapActions([
                "confirmCopyScenario",
                "confirmRenameScenario",
                "confirmDeleteScenario",
            ]),
            ...mapMutations([
                "setScenarioEditDialogsAllClosed",
            ]),
        }
    }
</script>

<style scoped>

</style>