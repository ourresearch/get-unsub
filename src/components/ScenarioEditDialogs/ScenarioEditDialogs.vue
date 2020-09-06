<template>
    <div>


        <v-dialog v-model="isCopyDialogOpen" max-width="400" persistent>
            <v-card v-if="isCopyDialogOpen">
                <v-toolbar dark flat color="primary">
                    <v-toolbar-title>
                        <v-icon>mdi-content-copy</v-icon>
                        Copy this scenario
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon text @click="setScenarioEditDialogsAllClosed">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text class="pt-8">
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
                    <v-spacer/>
                    <v-btn depressed
                           @click="setScenarioEditDialogsAllClosed"
                    >
                        Cancel
                    </v-btn>
                    <v-btn depressed
                           @click="confirmCopyScenario"
                           color="primary"
                    >
                        Copy
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>


        <v-dialog v-model="isRenameDialogOpen" max-width="400" persistent>
            <v-card v-if="isRenameDialogOpen">
                 <v-toolbar dark flat color="primary">
                    <v-toolbar-title>
                        <v-icon>mdi-pencil</v-icon>
                        Rename this scenario
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon text @click="setScenarioEditDialogsAllClosed">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text class="pt-8">
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
                    <v-spacer/>
                    <v-btn depressed
                           @click="setScenarioEditDialogsAllClosed"
                           :disabled="isScenarioEditDialogLoading"
                    >
                        Cancel
                    </v-btn>
                    <v-btn depressed
                           @click="confirmRenameScenario"
                           color="primary"
                           :loading="isScenarioEditDialogLoading"
                    >
                        Rename
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>


        <v-dialog v-model="isDeleteDialogOpen" max-width="400">
            <v-card v-if="isDeleteDialogOpen">
                 <v-toolbar dark flat color="primary">
                    <v-toolbar-title>
                        <v-icon>mdi-content-copy</v-icon>
                        Delete this scenario
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon text @click="setScenarioEditDialogsAllClosed">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text class="pt-8">
                    <div>
                        Are you sure you want to delete this scenario? This can't be undone.
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn depressed
                           @click="setScenarioEditDialogsAllClosed"
                           :disabled="isScenarioEditDialogLoading"
                    >
                        Cancel
                    </v-btn>
                    <v-btn depressed
                           @click="confirmDeleteScenario"
                           color="primary"
                           :loading="isScenarioEditDialogLoading"
                    >
                        Delete scenario
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>


        <v-dialog v-model="isOpenScenarioDialogOpen" max-width="600">
            <v-card v-if="isOpenScenarioDialogOpen">
                 <v-toolbar dark flat color="primary">
                    <v-toolbar-title>
                        <v-icon>mdi-folder-open-outline</v-icon>
                        Open scenario
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon text @click="cancelOpenScenario">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <div class="mt-1" style="min-height: 300px;">
                    <v-list-item-group v-model="scenarioIndexToOpen">
                        <v-list-item
                                two-line
                                :key="scenario.id"
                                v-for="scenario in publisherScenarios"
                                :disabled="scenario.isLoading"
                                v-show="scenario.id !== scenarioId"
                        >

                            <v-list-item-content>
                                <v-list-item-title
                                        class="headline font-weight-bold"
                                        :class="{'text--secondary': scenario.isLoading}"
                                >
                                    {{scenario.saved.name}}
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                    <span v-if="scenario.isLoading">Scenario loading...</span>
                                    <span v-if="!scenario.isLoading">ID: {{scenario.id}}</span>
                                    <!--                                    <strong>{{ scenario.saved.subrs.length }}</strong> à la carte journal subscriptions-->
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>

                    </v-list-item-group>
                </div>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn depressed
                           @click="cancelOpenScenario"
                    >
                        Cancel
                    </v-btn>
                    <v-btn depressed
                           @click="openNewScenario"
                           color="primary"
                           :disabled="scenarioIndexToOpen === null"
                    >
                        Open scenario
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>


        <v-snackbar
                v-model="isCopySnackbarOpen"
                :timeout="3000"
                bottom left
        >
            Scenario copied
            <v-btn dark icon @click="isCopySnackbarOpen = false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-snackbar>


        <v-snackbar
                v-model="isRenameSnackbarOpen"
                :timeout="3000"
                bottom left
        >
            Scenario renamed
            <v-btn dark icon @click="isRenameSnackbarOpen = false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-snackbar>

        <v-snackbar
                v-model="isDeleteSnackbarOpen"
                :timeout="3000"
                bottom left
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
                scenarioIndexToOpen: null,
            }
        },
        computed: {
            ...mapGetters([
                "scenarioEditDialogIsSaving",
                "isScenarioEditDialogLoading",
                "scenarioToEdit",
                "userEmail",
                "institutionIsConsortium",
                "publisherScenarios",
                "institutionId",
                "selectedPublisher",
                "scenarioId",
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
            isOpenScenarioDialogOpen: {
                get() {
                    return this.$store.getters.isOpenScenarioDialogOpen
                },
                set(newVal) {
                    this.$store.commit("isOpenScenarioDialogOpen", newVal)
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
            ]),
            ...mapMutations([
                "scenarioEditDialogLoadingStart",
                "scenarioEditDialogLoadingFinish",
                "setScenarioEditDialogsAllClosed",
            ]),
            confirmCopyScenario() {
                this.$store.dispatch("copyScenario", {
                    id: this.scenarioToEdit.id,
                    newName: this.scenarioEditNewName,
                })
                this.isCopySnackbarOpen = true
                this.setScenarioEditDialogsAllClosed()
            },
            async confirmRenameScenario() {
                this.scenarioEditDialogLoadingStart()
                await this.$store.dispatch("renameScenario", {
                    id: this.scenarioToEdit.id,
                    newName: this.scenarioEditNewName,
                })

                this.scenarioEditDialogLoadingFinish()
                this.isRenameSnackbarOpen = true
                this.setScenarioEditDialogsAllClosed()
            },
            async confirmDeleteScenario() {
                this.scenarioEditDialogLoadingStart()
                await this.$store.dispatch("deleteScenario", this.scenarioToEdit.id)
                this.scenarioEditDialogLoadingFinish()
                this.setScenarioEditDialogsAllClosed()
                this.isDeleteSnackbarOpen = true
            },
            cancelOpenScenario(){
                this.scenarioIndexToOpen = null
                this.setScenarioEditDialogsAllClosed()
            },
            openNewScenario(){
                if (this.scenarioIndexToOpen === null) return
                const scenarioId = this.publisherScenarios[this.scenarioIndexToOpen].id
                this.cancelOpenScenario()

                const url = `/i/${this.institutionId}/p/${this.selectedPublisher.id}/s/${scenarioId}`
                console.log("go to scenario!", url)
                this.$router.push(url)
            }
        }
    }
</script>

<style scoped>

</style>