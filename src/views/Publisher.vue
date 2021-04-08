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
                        <v-icon small>mdi-package-variant</v-icon>
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
                            <publisher-scenarios-tab/>
                        </v-card>
                    </v-tab-item>

                    <v-tab-item>
                        <v-card>
                            <v-card-title>
                                <div>
                                    Article Publication Costs last year <span v-if="!isJisc">, by journal</span>

                                </div>
                            </v-card-title>
                            <v-divider></v-divider>
                            <apc-tab v-if="!isJisc"></apc-tab>
                            <v-card v-if="isJisc" class="pa-5">
                                <div class="text-h1">£7,125,925</div>
                                <div>Total APC expenditure, Gold and Hybrid</div>
                            </v-card>
                        </v-card>
                    </v-tab-item>


                    <v-tab-item>
                        <publisher-setup-tab/>
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
    import PublisherSetupTab from "../components/Publisher/PublisherSetupTab";
    import PublisherScenariosTab from "../components/Publisher/PublisherScenariosTab";

    export default {
        name: "Publisher",
        metaInfo() {
            return {
                title: `${this.publisherName}`
            }
        },
        components: {
            ScenarioEditDialogs,
            PublisherFileUploadDialog,
            ApcTab,
            PublisherSetupTab,
            PublisherScenariosTab,
        },
        data() {
            return {
                fileSelected: null,
                errorMsg: "",
                tabModel: 0,
                loadingPercent: 0,
                dialogs: {},
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
                if (this.isJisc) {
                    return ["Forecasts", "APCs"]
                }

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
            isJisc(){
                return this.institutionName === "Jisc"
            },
        },
        methods: {
            ...mapMutations([
                "openCopyDialog",
                "openCreateDialog",
                "openRenameDialog",
                "openDeleteDialog",
                "openPublisherFileUploadDialog",
                "clearPublisher",
            ]),
            ...mapActions([]),

        },

        created() {
        },
        destroyed() {

        },
        watch: {},
        async mounted() {
            console.log("publisher: mount up", this.$route.params)
            this.$store.dispatch("fetchInstitution", this.$route.params.institutionId)


            this.loadingPercent = 0
            const estSecondsToLoad = 20
            let secondsSincePageLoad = 0
            const that = this
            const interval = setInterval(function () {
                if (!that.publisherIsLoading) {
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


            // if we have any dehydrated scenarios, then clear the publisher; we'll update the whole thing.
            if (!this.publisherScenariosAreAllLoaded) this.clearPublisher()

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