<template>
    <div>


        <v-dialog v-model="isCopyDialogOpen" max-width="500" persistent>
            <v-card v-if="isCopyDialogOpen">
                <v-card-title>
                    <v-icon left>mdi-content-copy</v-icon>
                    Copy this scenario
                </v-card-title>
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
                           :disabled="isScenarioEditDialogLoading"
                    >
                        Cancel
                    </v-btn>
                    <v-btn depressed
                           @click="confirmCopyScenario"
                           color="primary"
                           :loading="isScenarioEditDialogLoading"
                    >
                        Copy
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>




        <v-dialog v-model="isCreateDialogOpen" max-width="500" persistent>
            <v-card v-if="isCreateDialogOpen">
              <v-card-title>
                        <v-icon left>mdi-chart-box-plus-outline</v-icon>
                        Create new scenario
              </v-card-title>

                <v-alert type="warning" v-if="institutionIsConsortium">
                    <div>
                        <p>
                            New scenarios are created quickly, but it takes <strong>up to one hour</strong> before they are fully provisioned and ready for use.
                        </p>
                         <p>We'll send an email to <strong>{{ userEmail }} </strong> when the scenario is ready to use (don't forget to check your spam).</p>
                        <p>If don't want to wait, you can copy an existing scenario instead...that only takes a few seconds.</p>

                    </div>

                </v-alert>

                <v-card-text class="pt-8">
                    <div>
                        <v-text-field
                                outlined
                                label="Name for the new scenario:"
                                type="text"
                                @keydown.enter="confirmCreateScenario"
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
                           @click="confirmCreateScenario"
                           color="primary"
                           :loading="isScenarioEditDialogLoading"
                    >
                        Create
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>





        <v-dialog v-model="isRenameDialogOpen" max-width="500" persistent>
            <v-card v-if="isRenameDialogOpen">
              <v-card-title>
                        <v-icon left>mdi-pencil</v-icon>
                        Rename this scenario

              </v-card-title>
                <v-card-text class="pt-8">
                    <div>
                        <v-text-field
                                outlined
                                type="text"
                                label="New name:"
                                @keydown.enter="confirmRenameScenario"
                                v-model="scenarioEditNewName"
                        />
                        <v-textarea
                                v-if="false"
                                outlined
                                label="Description:"
                                @keydown.enter="confirmRenameScenario"
                                v-model="scenarioEditNewDescription"
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





        <v-dialog v-model="isDeleteDialogOpen" max-width="500">
            <v-card v-if="isDeleteDialogOpen">
                    <v-card-title>
                        <v-icon>mdi-delete-outline</v-icon>
                        Delete this scenario
                    </v-card-title>
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
                                    <!--                                    <strong>{{ scenario.saved.subrs.length }}</strong> title-by-title journal subscriptions-->
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
    import {newScenario, deleteScenario, saveScenario} from "../../shared/scenario";

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
            isCreateDialogOpen: {
                get() {
                    return this.$store.getters.isCreateDialogOpen
                },
                set(newVal) {
                    this.$store.commit("setCreateDialog", newVal)
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
                    this.$store.commit("setOpenScenarioDialog", newVal)
                },
            },
            scenarioEditNewName: { // contents of the "name"  field for copy, create, rename
                get() {
                    return this.$store.getters.scenarioEditNewName
                },
                set(newVal) {
                    this.$store.commit("setScenarioEditNewName", newVal)
                },
            },
            scenarioEditNewDescription: { // contents of the "description"  field for copy, create, rename
                get() {
                    return this.$store.getters.scenarioEditNewDescription
                },
                set(newVal) {
                    this.$store.commit("setScenarioEditNewDescription", newVal)
                },
            },
        },
        methods: {
            ...mapActions([
            ]),
            ...mapMutations([
                "scenarioEditDialogLoadingStart",
                "scenarioEditDialogLoadingFinish",
                "setScenarioEditDialogsAllClosed",
            ]),
            async goToScenario(id){
                this.scenarioEditDialogLoadingFinish()
                this.setScenarioEditDialogsAllClosed()

                const url = `/i/${this.institutionId}/p/${this.selectedPublisher.id}/s/${id}`
                console.log("go to new scenario!", url)
                await this.$router.push(url)
            },
            async confirmCopyScenario() {
                this.scenarioEditDialogLoadingStart()
                const myNewScenario = await  this.$store.dispatch("copyScenario", {
                    id: this.scenarioToEdit.id,
                    newName: this.scenarioEditNewName,
                })
                await this.goToScenario(myNewScenario.id)
            },
            async confirmCreateScenario() {
                this.scenarioEditDialogLoadingStart()
                const myNewScenario = await this.$store.dispatch(
                    "createScenario",
                    {name: this.scenarioEditNewName}
                )
                await this.goToScenario(myNewScenario.id)
            },
            async confirmRenameScenario() {
                this.scenarioEditDialogLoadingStart()
                const payload = _.cloneDeep(this.scenarioToEdit)
                payload.saved.name = this.scenarioEditNewName
                // payload.saved.description = this.scenarioEditNewDescription
                await saveScenario(payload)
                await this.$store.dispatch("refreshSelectedScenario")
                await this.$store.dispatch("refreshPublisherScenario", this.scenarioToEdit.id)

                this.scenarioEditDialogLoadingFinish()
                this.isRenameSnackbarOpen = true
                this.setScenarioEditDialogsAllClosed()
            },
            async confirmDeleteScenario() {
                this.scenarioEditDialogLoadingStart()
                await deleteScenario(this.scenarioToEdit.id)
                this.$store.commit("deleteScenario", this.scenarioToEdit.id)

                this.scenarioEditDialogLoadingFinish()
                this.setScenarioEditDialogsAllClosed()
                this.isDeleteSnackbarOpen = true

                // if there is a selectedScenario, you are there right now, and you are clicking delete on yourself.
                if (this.$store.getters.scenarioId){
                    this.$store.commit("clearSelectedScenario")
                    const url = `/i/${this.institutionId}/p/${this.selectedPublisher.id}`
                    await this.$router.push(url)
                }
            },
            cancelOpenScenario(){
                this.scenarioIndexToOpen = null
                this.setScenarioEditDialogsAllClosed()
            },
            async openNewScenario(){
                if (this.scenarioIndexToOpen === null) return
                const scenarioId = this.publisherScenarios[this.scenarioIndexToOpen].id
                this.cancelOpenScenario()
                await this.goToScenario(scenarioId)
            }
        }
    }
</script>

<style scoped>

</style>