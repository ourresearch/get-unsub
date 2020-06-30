<template>
    <v-container class="publisher">
        <div
                style="height: 85vh"
                class="loading d-flex flex-column align-center justify-center"
                v-if="loadingPercent < 100"
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


        <div class="loaded" v-if="loadingPercent === 100">
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

            <v-card>
                <v-tabs dark v-model="tabModel">
                    <v-tab
                            v-for="tabName in tabItems"
                            :key="tabName"
                            :disabled="tabName==='Forecasts' && !publisherCounterIsUploaded"
                    >
                        {{tabName}}
                    </v-tab>
                    <v-tab-item>
                        <v-card>
                            <v-card-title>
                                <div>
                                    <div>
                                        Forecast scenarios
                                        <span class="body-2">({{publisherScenarios.length}})</span>
                                    </div>
                                    <div class="body-2">Model and explore the impact of Big Deal cancellation.</div>
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
                    </v-tab-item>

                    <v-tab-item>
                        <v-card>
                            <v-card-title>
                                <div>
                                    Article Publication Costs last year, by journal
                                    <span class="body-2">({{publisherScenarios.length}})</span>
                                </div>
                            </v-card-title>
                            <v-divider></v-divider>
                            <apc-tab></apc-tab>
                        </v-card>
                    </v-tab-item>

                    <v-tab-item>
                        <publisher-setup-tab/>
                    </v-tab-item>

                    <v-tab-item>
                        not sure if we want this.
<!--                        <publisher-journals-tab/>-->
                    </v-tab-item>

                </v-tabs>


            </v-card>


        </div>


        <scenario-edit-dialogs/>
    </v-container>
</template>

<script>
    import {api, toBase64} from "../api";
    import {mapGetters, mapMutations, mapActions} from 'vuex'
    import ScenarioEditDialogs from "../components/ScenarioEditDialogs/ScenarioEditDialogs";
    import PublisherFileUploadDialog from "../components/PublisherFile/PublisherFileUpload";
    import ApcTab from "../components/Publisher/ApcTab";
    import PublisherJournalsTab from "../components/Publisher/PublisherJournalsTab";
    import PublisherSetupTab from "../components/PublisherSetupTab/PublisherSetupTab";


    export default {
        name: "Publisher",
        components: {
            ScenarioEditDialogs,
            PublisherFileUploadDialog,
            ApcTab,
            PublisherJournalsTab,
            PublisherSetupTab
        },
        data() {
            return {
                fileSelected: null,
                errorMsg: "",
                tabModel: 0,
                loadingPercent: 0,
                tabItems: [
                    "Forecasts",
                    "APCs",
                    "Setup",
                    // "Journals",
                ],
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
                "publisherJournalCounts",
                "publisherLogo",
                "publisherCounterIsUploaded",

                // apc stuff
                "publisherApcPapersCount",
                "publisherApcAuthorsFractionalCount",
                "publisherApcCost",
                "publisherApcIsLoading",

            ]),
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
            ...mapActions([]),
            createScenario() {
                this.$store.dispatch("createScenario")
            },
            goToScenario(scenarioId) {
                const url = `/i/${this.institutionId}/p/${this.pkg.id}/s/${scenarioId}`
                console.log("go to scenario!", url)
                this.$router.push(url)

            },
        },

        created() {
        },
        destroyed() {

        },
        watch:{

        },
        async mounted() {
            console.log("publisher: mount up", this.$route.params)
            this.$store.commit("clearSelectedScenario")
            this.$store.dispatch("fetchInstitution", this.$route.params.institutionId)


            this.loadingPercent = 0
            const estSecondsToLoad = 10
            let secondsSincePageLoad = 0
            const that = this
            const interval = setInterval(function () {
                if (!that.publisherIsLoading) {
                    that.loadingPercent = 100
                    setTimeout(() => clearInterval(interval), 500)
                    return
                }
                secondsSincePageLoad += 1
                let secondsRemaining = estSecondsToLoad - secondsSincePageLoad
                if (secondsRemaining < 1) secondsRemaining = 1
                that.loadingPercent = 100 * secondsSincePageLoad / estSecondsToLoad
            }, 1000)


            await this.$store.dispatch("fetchPublisher", this.$route.params.publisherId)
            console.log("publisher done loading", this.publisherCounterIsUploaded)
            if (!this.publisherCounterIsUploaded){
                this.tabModel = 2
            }
        },
    }
</script>

<style lang="scss">
    .v-toolbar__extension {
        border-top: none !important;
    }

</style>