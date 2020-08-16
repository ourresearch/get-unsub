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
                Loading package
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
                        <span v-if="publisherIsOwnedByConsortium">Consortial Data</span>
                        Package
                    </div>
                    <div class="display-2">
                        {{ publisherName }}
                        <span v-if="publisherIsOwnedByConsortium" class="font-weight-light">(consortial)</span>
                    </div>
                </div>
            </div>


            <v-alert v-if="publisherIsOwnedByConsortium"
                     color="warning"
                     prominent
                     dark
                     icon="mdi-alert"
            >
                <div class="d-flex align-center">
                    <div>
                        This <strong>Consortial Data Package</strong> feeds data into your consortium's global
                        forecasting model. Please don't edit it without permission of consortium staff!
                    </div>
                </div>
            </v-alert>
            <v-alert v-if="isPublisherDemo" color="info" text dense icon="mdi-information-outline">
                <div class="d-flex align-center">
                    <div>
                        This package belongs to a demo institution; some functionality is restricted.
                    </div>
                    <v-spacer></v-spacer>
                    <div>
                        <v-btn color="info" text small to="/purchase">Purchase full account</v-btn>
                    </div>
                </div>
            </v-alert>

            <v-card>
                <div v-if="publisherIsOwnedByConsortium">
                    <publisher-setup-tab/>
                </div>

                <v-tabs v-if="!publisherIsOwnedByConsortium" dark v-model="tabModel">
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


                            <v-list id="scenarios-list">

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
                                            @click="createScenarioHandler"
                                            key="add-scenario"
                                            :disabled="!publisherScenariosAreAllLoaded"
                                            id="new-scenario-button"
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


        <v-dialog v-model="dialogs.confirmCreateScenario" max-width="400" >
            <v-card>
                <v-toolbar dark flat color="primary">
                    <v-toolbar-title>
                        <v-icon>mdi-timer-sand</v-icon>
                        Confirm slow operation
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon text @click="dialogs.confirmCreateScenario = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text class="pt-4">
                    <p>
                        Blank-slate scenarios are created quickly, but it takes a long time before they are fully calculated and ready for use -- up to an hour.
                    </p>
                     <p>We'll send an email to <strong>{{ userEmail }} </strong> when the scenario is ready to use (don't forget to check your spam).</p>
                    <p>If you're feeling impatient, you can copy an existing scenario...that only takes a few seconds.</p>


                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn depressed @click="dialogs.confirmCreateScenario = false">Cancel</v-btn>
                    <v-btn
                            depressed
                            @click="createScenario"
                            color="primary"
                    >
                        Create
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>


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
                dialogs: {
                    confirmCreateScenario: false
                },
                // tabItems: [
                //     "Forecasts",
                //     "APCs",
                //     "Setup",
                //     // "Journals",
                // ],
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
                "publisherIsOwnedByConsortium",
                "userCanEditActivePublisher",
                "institutionIsConsortium",
                "userEmail",

                // apc stuff
                "publisherApcPapersCount",
                "publisherApcAuthorsFractionalCount",
                "publisherApcCost",
                "publisherApcIsLoading",

            ]),
            tabItems() {
                if (this.institutionIsConsortium) {
                    return ["Forecasts"]
                } else {
                    return [
                        "Forecasts",
                        "APCs",
                        "Setup",
                        // "Journals",
                    ]
                }
            },
            account() {
                return this.$store.state.user
            },
            pkg() {
                return this.$store.getters.selectedPublisher
            },
        },
        methods: {
            ...mapMutations([
                "openCopyDialog",
                "openRenameDialog",
                "openDeleteDialog",
                "openPublisherFileUploadDialog",
            ]),
            ...mapActions([]),
            createScenarioHandler(){
                if (this.institutionIsConsortium){
                    this.dialogs.confirmCreateScenario = true
                }
                else {
                    this.createScenario()
                }
            },
            createScenario() {
                this.$store.dispatch("createScenario")
                this.dialogs.confirmCreateScenario = false
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
        watch: {},
        async mounted() {
            console.log("publisher: mount up", this.$route.params)
            this.$store.commit("clearSelectedScenario")
            this.$store.dispatch("fetchInstitution", this.$route.params.institutionId)


            this.loadingPercent = 0
            const estSecondsToLoad = 10
            let secondsSincePageLoad = 0
            const that = this
            const interval = setInterval(function () {
                console.log("publisher loading bar: tick", that.loadingPercent)
                if (!that.publisherIsLoading) {
                    console.log("publisher loading bar: publisher is done loading")
                    that.loadingPercent = 100
                    setTimeout(() => clearInterval(interval), 500)
                    return
                }
                secondsSincePageLoad += 1
                let loadingPercent = 100 * secondsSincePageLoad / estSecondsToLoad

                if (loadingPercent >= 100) {
                    // based on our time estimate, we should be done. but unfortunately, we haven't broken out of the loop
                    // yet, which means that actually the publisher is still loading.
                    // so, set the progress bar to "nearly done!"
                    loadingPercent = 95
                }
                that.loadingPercent = loadingPercent
            }, 1000)


            await this.$store.dispatch("fetchPublisher", this.$route.params.publisherId)
            console.log("publisher done loading", this.publisherCounterIsUploaded)
            if (!this.publisherCounterIsUploaded) {
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