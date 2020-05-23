<template>
    <v-container class="publisher">

        <div
             style="height: 85vh"
             class="loading d-flex flex-column align-center justify-center"
             v-if="publisherIsLoading"
        >
                <div style="width: 300px;">
                    <v-progress-linear
                            v-model="loadingPercent"
                    />

                </div>
                <div class="mt-3">
                    Loading publisher
                </div>
        </div>









        <div class="loaded" v-if="!publisherIsLoading">
            <router-link class="text--secondary low-key-link" :to="`/i/${institutionId}`">
                <strong>‹</strong>
                Back <span v-if="institutionName">to {{institutionName}}</span>
            </router-link>
            <div class="page-title mt-8 mb-4 d-flex">
                <v-avatar tile size="60" class="mt-1 mr-3">
                    <img height="60px" :src="publisherLogo">
                </v-avatar>
                <div class="text">
                    <div class="body-2">
                        Publisher
                    </div>
                    <div class="display-2">
                        {{ publisherName }}
                    </div>
                </div>
            </div>


            <v-alert v-if="isPublisherDemo" color="info" text dense icon="mdi-information-outline">
                <div class="d-flex align-center">
                    <div>
                        This publisher belongs to a demo institution; the data is real, but some functionality is
                        restricted.
                    </div>
                    <v-spacer></v-spacer>
                    <div>
                        <v-btn color="info" text small to="/purchase">upgrade</v-btn>
                    </div>
                </div>
            </v-alert>


            <v-row v-if="!publisherIsLoading">
                <v-col cols="2">
                    <v-card>
                        <v-tabs vertical v-model="tabSelected">
                            <v-tab
                                    v-for="tabName in tabItems"
                                    :key="tabName"
                            >
                                {{tabName}}
                            </v-tab>
                        </v-tabs>
                    </v-card>
                </v-col>

                <v-col cols="10">
                    <v-card v-if="tabSelected===0">

                        <v-card-title>
                            <div>
                                Forecast scenarios
                                <span class="body-2">({{publisherScenarios.length}})</span>
                            </div>
                        </v-card-title>
                        <v-divider></v-divider>


                        <v-list>

                            <template
                                    v-for="scenario in publisherScenarios"
                            >

                                <v-list-item
                                        two-line
                                        :key="scenario.id"
                                        @click="goToScenario(scenario.id)"
                                        :disabled="scenario.isLoading"
                                >


                                    <v-list-item-content>
                                        <v-list-item-title
                                                class="headline font-weight-bold"
                                                :class="{'text--secondary': scenario.isLoading}"
                                                v-text="scenario.saved.name"
                                        />
                                        <v-list-item-subtitle>
                                            <span v-if="scenario.isLoading">Scenario loading...</span>
                                            <span v-if="!scenario.isLoading">ID: {{scenario.id}}</span>
                                            <!--                                    <strong>{{ scenario.saved.subrs.length }}</strong> à la carte journal subscriptions-->
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                    <v-list-item-action v-show="!scenario.isLoading">
                                        <div>
                                            <v-btn icon @click.stop="openCopyDialog(scenario)">
                                                <v-icon>mdi-content-copy</v-icon>
                                            </v-btn>
                                            <v-btn icon @click.stop="openRenameDialog(scenario)">
                                                <v-icon>mdi-pencil</v-icon>
                                            </v-btn>

                                            <v-btn icon @click.stop="openDeleteDialog(scenario)">
                                                <v-icon>mdi-delete</v-icon>
                                            </v-btn>
                                        </div>
                                    </v-list-item-action>
                                </v-list-item>

                            </template>

                            <v-fade-transition>
                                <v-list-item
                                         @click="createScenario"
                                        key="add-scenario"
                                        :disabled="!publisherScenariosAreAllLoaded"
                                >
                                    <v-list-item-avatar size="50">
                                        <v-btn icon>
                                            <v-icon>mdi-plus</v-icon>
                                        </v-btn>
                                    </v-list-item-avatar>

                                    <v-list-item-content>
                                        <v-list-item-title class="body-2 text--secondary">
                                            New scenario
                                        </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-fade-transition>


                        </v-list>


                    </v-card>


                    <v-card v-if="tabSelected===1">

                        <v-card-title>
                            <div>
                                Article Publication Costs last year, by journal
                                <span class="body-2">({{publisherScenarios.length}})</span>
                            </div>
                        </v-card-title>
                        <v-divider></v-divider>
                        <apc-tab></apc-tab>



                    </v-card>


                </v-col>

            </v-row>
        </div>




        <v-dialog v-model="uploadDialogIsOpen" max-width="500" persistent>

        </v-dialog>

        <publisher-file-upload-dialog
        />


        <scenario-edit-dialogs/>
    </v-container>
</template>

<script>
    import {api, toBase64} from "../api";
    import {mapGetters, mapMutations, mapActions} from 'vuex'
    import ScenarioEditDialogs from "../components/ScenarioEditDialogs/ScenarioEditDialogs";
    import PublisherFileUploadDialog from "../components/PublisherFileUpload/PublisherFileUploadDialog";
    import ApcTab from "../components/Publisher/ApcTab";


    export default {
        name: "Publisher",
        components: {
            ScenarioEditDialogs,
            PublisherFileUploadDialog,
            ApcTab,
        },
        data() {
            return {
                uploadDialogIsOpen: false,
                uploadFileType: "",
                fileSelected: null,
                isUploadFileLoading: false,
                errorMsg: "",
                foo: false,
                loadingPercent: 0,
                tabItems: [
                    "Forecasts",
                    "APCs",
                    "Setup",
                    "Journals",
                ],
                tabSelected: "Forecasts"
            }
        },
        computed: {
            ...mapGetters([
                "publisherName",
                "publisherId",
                "publisherScenarios",
                "publisherScenariosCount",
                "isPublisherDemo",
                "institutionId",
                "institutionName",
                "publisherScenariosAreAllLoaded",
                "publisherBigDealCost",
                "publisherIsLoading",
                "publisherUploadsDict",
                "publisherJournalCounts",
                "publisherLogo",

                // apc stuff
                "publisherApcPapersCount",
                "publisherApcAuthorsFractionalCount",
                "publisherApcCost",
                "publisherApcIsLoading",

            ]),
            // fileSelected() {
            //     return !!this.$refs.fileSelected.files && this.$refs.fileSelected.files.length[0]
            // },
            account() {
                return this.$store.state.user
            },
            pkg() {
                return this.$store.getters.selectedPublisher
            }
        },
        methods: {
            ...mapMutations([
                "openCopyDialog",
                "openRenameDialog",
                "openDeleteDialog",
                "openPublisherFileUploadDialog",
            ]),
            ...mapActions([

            ]),
            createScenario(){
                this.$store.dispatch("createScenario")
            },
            goToScenario(scenarioId) {
                const url = `/i/${this.institutionId}/p/${this.pkg.id}/s/${scenarioId}`
                console.log("go to scenario!", url)
                this.$router.push(url)

            },
            async uploadFile() {
                console.log("uploadFile() file", this.fileSelected)
                this.isUploadFileLoading = true
                const path = `package/${this.publisherId}/${this.uploadFileType}`
                const data = {
                    file: await toBase64(this.fileSelected),
                    name: this.fileSelected.name,
                    type: this.fileSelected.type,
                    size: this.fileSelected.size,
                }
                try {
                    await api.postFile(path, data)
                } catch (e) {
                    this.errorMsg = (e.response && e.response.data) ?
                        e.response.data.msg :
                        "Sorry, we encountered an unknown error!"
                } finally {
                    this.isUploadFileLoading = false
                }
            },
        },

        created() {
        },
        mounted() {
            console.log("publisher: mount up", this.$route.params)
            this.$store.commit("clearSelectedScenario")
            this.$store.dispatch("fetchPublisherAsync", this.$route.params.publisherId)
            this.$store.dispatch("fetchInstitution", this.$route.params.institutionId)


            this.loadingPercent = 0
            const estSecondsToLoad = 25
            let secondsSincePageLoad = 0
            const that = this
            const interval = setInterval(function(){
                if (!that.publisherIsLoading) {
                    that.loadingPercent = 100
                    setTimeout(()=> clearInterval(interval), 500)
                    return
                }
                secondsSincePageLoad += 1
                let secondsRemaining = estSecondsToLoad - secondsSincePageLoad
                if (secondsRemaining < 1) secondsRemaining = 1
                that.loadingPercent = 100 * secondsSincePageLoad / estSecondsToLoad
            }, 1000)


        },
    }
</script>

<style lang="scss">
    .v-toolbar__extension {
        border-top: none !important;
    }

</style>