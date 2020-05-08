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
                    Loading publisher {{ publisherName }}
                </div>
        </div>









        <div class="loaded" v-if="!publisherIsLoading">
            <router-link class="text--secondary low-key-link" :to="`/i/${institutionId}`">
                <strong>‹</strong>
                Back <span v-if="institutionName">to {{institutionName}}</span>
            </router-link>
            <div class="page-title mt-8 mb-4 d-flex">
                <v-avatar tile size="60" class="mt-1 mr-3">
                    <img height="60px" src="https://i.imgur.com/Qt1sOqp.png">
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
                <v-col cols="4">
                    <v-card>
                        <v-card-title>
                            <div>
                                Publisher costs <span class="body-2">(historical)</span>
                            </div>
                        </v-card-title>
                        <v-divider></v-divider>

                        <v-list two-line>
                            <v-list-item v-if="publisherApcCost === 0 || publisherApcCost > 0">
                                <v-list-item-avatar>
                                    <v-icon v-if="!publisherApcIsLoading">mdi-pen</v-icon>
                                    <v-progress-circular
                                            v-if="publisherApcIsLoading"
                                            indeterminate
                                            color="grey"
                                    />
                                </v-list-item-avatar>
                                <v-list-item-content>
                                    <div class="">
                                        <span v-show="publisherApcIsLoading" class="cost text--secondary">Loading...</span>
                                        <span v-show="!publisherApcIsLoading"
                                              class="cost">{{ publisherApcCost | currency }}</span>

                                    </div>
                                    <v-list-item-subtitle>
                                        <v-tooltip
                                                bottom
                                                color="#333"
                                                max-width="400"
                                        >
                                            <template v-slot:activator="{on}">
                                                <span v-on="on">
                                                    OA <strong>Publish</strong> cost (2019)
                                                    <v-icon small>mdi-information-outline</v-icon>
                                                </span>
                                            </template>
                                            <div>{{ publisherApcCost | currency }} is the sum total total OA publication
                                                fees (APCs) paid to
                                                {{publisherName}} by your faculty last year (est).
                                            </div>
                                        </v-tooltip>
                                    </v-list-item-subtitle>
                                </v-list-item-content>
                                <v-list-item-action>
                                    <v-tooltip
                                            bottom
                                            color="#333"
                                    >
                                        <template v-slot:activator="{on}">
                                            <v-btn :to="`/i/${institutionId}/p/${publisherId}/apc`" icon v-on="on">
                                                <v-icon>mdi-table-eye</v-icon>
                                            </v-btn>
                                        </template>
                                        <div>Explore your {{publisherName}} publication costs.</div>
                                    </v-tooltip>
                                </v-list-item-action>
                            </v-list-item>

                            <v-list-item v-if="0">
                                <v-list-item-avatar>
                                    <v-icon>mdi-book-open</v-icon>
                                </v-list-item-avatar>
                                <v-list-item-content>
                                    <div class="">
                                        {{ publisherBigDealCost | currency }}
                                    </div>
                                    <v-list-item-subtitle>
                                        <v-tooltip
                                                bottom
                                                color="#333"
                                                max-width="400"
                                        >
                                            <template v-slot:activator="{on}">
                                                <span v-on="on">
                                                    Big Deal <strong>Read</strong> cost (2019)
                                                    <v-icon small v-on="on">mdi-information-outline</v-icon>
                                                </span>
                                            </template>
                                            <div>{{ publisherBigDealCost | currency }} is the current annual cost of your {{ publisherName }} Big Deal package.
                                            </div>
                                        </v-tooltip>


                                    </v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>

                        </v-list>
                    </v-card>
                    <v-card class="mt-4" v-if="publisherUploadsDict.prices">
                        <v-card-title dark color="#333">
                            <div>
                                Publisher datasets
                            </div>
                        </v-card-title>
                        <v-divider />
                        <v-card v-if="publisherJournalCounts" tile flat class="pb-2">
                            <v-subheader class="text--primary subtitle-1">
                                <v-icon class="mr-2">mdi-file-eye-outline</v-icon>
                                Usage data
                            </v-subheader>
                            <v-card-text class="pt-0">
                                You're using the usage data from your uploaded <strong>COUNTER JR1</strong> file.
                                <div class="mt-2">
                                    This file included {{ publisherJournalCounts.oa | round}} OA journals,  {{ publisherJournalCounts.missingPrices | round}} journals without pricing info, and   {{ publisherJournalCounts.leftOrStopped | round}} journals that left {{publisherName}} or have stopped publishing. Our analysis focuses on the remaining <strong>{{ publisherJournalCounts.analyzed | round }}</strong> journals.

                                </div>
                            </v-card-text>
                        </v-card>
                        <v-divider />


                        <v-card tile flat class="pb-2">
                            <v-subheader class="text--primary subtitle-1">
                                <v-icon class="mr-2">mdi-cash-multiple</v-icon>
                                A-la-carte journal prices
                            </v-subheader>
                            <v-card-text class="pt-0" v-if="!publisherUploadsDict.prices.isUploaded">
                                You're using data from the {{publisherName}} public pricelist.
                            </v-card-text>
                            <v-card-text class="pt-0" v-if="publisherUploadsDict.prices.isUploaded">
                                You're using your custom uploaded title-level pricelist, rather than the public list price, to determine the price of each journal.
                            </v-card-text>
                            <v-card-actions>
                                <v-btn small text @click="openPublisherFileUploadDialog('prices')"> Upload custom data </v-btn>
                            </v-card-actions>
                        </v-card>
                        <v-divider />


                        <v-card tile flat class="pb-2">
                            <v-subheader class="text--primary subtitle-1">
                                <v-icon class="mr-2">mdi-briefcase-clock-outline</v-icon>
                                Perpetual Access
                            </v-subheader>
                            <v-card-text class="pt-0" v-if="publisherUploadsDict['perpetual-access'].isUploaded">
                                You're using your custom uploaded title-level perpetual access list, with date ranges for each journal.
                            </v-card-text>
                            <v-card-text class="pt-0" v-if="!publisherUploadsDict['perpetual-access'].isUploaded">
                                You're using the default, which is to assume full perpetual access for all your {{publisherName}} titles.
                            </v-card-text>
                            <v-card-actions>
                                <v-btn small text @click="openPublisherFileUploadDialog('perpetual-access')"> Upload custom data </v-btn>
                            </v-card-actions>
                        </v-card>



                        <v-list v-if="false">
                            <v-list-item>
                                <v-list-item-avatar>
                                    <v-icon>mdi-file-eye-outline</v-icon>
                                </v-list-item-avatar>
                                <v-list-item-content>
                                    <v-list-item-title>
                                        COUNTER JR1 uploaded
                                    </v-list-item-title>
                                    <v-list-item-subtitle>
                                        Your institutional usage data
                                    </v-list-item-subtitle>

                                    <div class="d-none body-2 text--secondary">
                                        Your COUNTER JR1 file has been uploaded.
                                    </div>
                                </v-list-item-content>
                                <v-list-item-action>
                                    <v-btn icon @click="openPublisherFileUploadDialog('counter')"> <v-icon>mdi-pencil</v-icon> </v-btn>
                                </v-list-item-action>
                            </v-list-item>

                            <v-list-item>
                                <v-list-item-avatar>
                                    <v-icon>mdi-cash-multiple</v-icon>
                                </v-list-item-avatar>
                                <v-list-item-content>
                                    <v-list-item-title>
                                        Public pricelist
                                    </v-list-item-title>
                                    <v-list-item-subtitle>
                                        Source for a-la-carte journal costs
                                    </v-list-item-subtitle>
                                    <div class="d-none body-2 text--secondary">
                                        You'll pay list price for any a-la-carte subscriptions you make.
                                    </div>
                                </v-list-item-content>
                                <v-list-item-action>
                                    <v-btn icon @click="openPublisherFileUploadDialog('prices')"> <v-icon>mdi-pencil</v-icon> </v-btn>
                                </v-list-item-action>
                            </v-list-item>

                            <v-list-item>
                                <v-list-item-avatar>
                                    <v-icon>mdi-briefcase-clock-outline</v-icon>
                                </v-list-item-avatar>
                                <v-list-item-content>
                                    <v-list-item-title>
                                        Full perpetual access
                                    </v-list-item-title>
                                    <v-list-item-subtitle>
                                        Backfile perpetual access rights
                                    </v-list-item-subtitle>
                                    <div class="d-none body-2 text--secondary">
                                        You have perpetual access rights to the last 10yrs of content for all {{publisherName}} titles.
                                    </div>
                                </v-list-item-content>
                                <v-list-item-action>
                                    <v-btn icon @click="openPublisherFileUploadDialog('perpetual-access')"> <v-icon>mdi-pencil</v-icon> </v-btn>
                                </v-list-item-action>
                            </v-list-item>




                        </v-list>
                    </v-card>


                </v-col>

                <v-col cols="8">
                    <v-card>

                        <v-card-title>
                            <div>
                                Cancellation scenarios
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


    export default {
        name: "Publisher",
        components: {
            ScenarioEditDialogs,
            PublisherFileUploadDialog,
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