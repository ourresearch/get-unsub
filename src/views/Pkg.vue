<template>
    <v-container class="pkg" v-if="pkg">
        <!--        <h1 class="display-3 py-6">{{ pkg.name }}</h1>-->
        <v-row class="fill-height">
            <v-col cols="7">
                <h2 class="display-1 my-2">Your dashboards</h2>
                <v-card  class="mb-2">
                    <v-toolbar dark color="#555">
                        <v-toolbar-title>
                            <div class="body-2">5yr forecast</div>
                            <div class="headline">Cancellation scenarios</div>
                        </v-toolbar-title>
                        <template v-slot:extension>
                            <v-btn
                                    absolute
                                    dark
                                    color="black"
                                    fab
                                    bottom
                                    left
                                    small
                                    @click="createScenario"
                            >
                                <v-icon>mdi-plus</v-icon>
                            </v-btn>
                        </template>
                    </v-toolbar>

                    <v-list class="pb-8 pt-4">
                        <v-list-item
                                two-line
                                v-for="scenario in pkg.scenarios"
                                :key="scenario.id"
                                @click="$router.push(`/a/${pkg.id}/${scenario.id}`)"
                        >
                            <v-list-item-content v-if="scenario.isLoading">
                                <v-list-item-title class="title grey--text d-flex align-center">
                                    <v-progress-circular class="mr-2" indeterminate size="20"/>
                                    Scenario loading...
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                    &nbsp;
                                </v-list-item-subtitle>

                            </v-list-item-content>


                            <v-list-item-content v-if="!scenario.isLoading">
                                <v-list-item-title class="title" v-text="scenario.saved.name"/>
                                <v-list-item-subtitle>
                                    id: {{scenario.id}}
                                    <!--                                    <strong>{{ scenario.saved.subrs.length }}</strong> à la carte journal subscriptions-->
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action v-if="scenario.saved.name">
                                <div>
                                    <v-btn icon @click.stop="openCopyDialog(scenario)">
                                        <v-icon>mdi-content-copy</v-icon>
                                    </v-btn>
                                    <v-btn icon @click.stop="openRenameDialog(scenario)">
                                        <v-icon>mdi-pencil</v-icon>
                                    </v-btn>

                                    <v-btn v-if="publisherScenariosCount > 1" icon @click.stop="openDeleteDialog(scenario)">
                                        <v-icon>mdi-delete</v-icon>
                                    </v-btn>
                                </div>
                            </v-list-item-action>
                        </v-list-item>

                    </v-list>
                </v-card>
                <v-card outlined>
                    <v-card-title>
                        <div>
                            <div class="body-2">"Publish" dashboard</div>
                            <div class="headline">Your APC costs</div>
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-btn large outlined :to="'/a/' + publisherId + '/apc'">
                            View your APC costs
                        </v-btn>
                    </v-card-text>
                </v-card>

            </v-col>

            <v-col cols="5">
                <h2 class="display-1 my-2">Your data</h2>
                <v-card outlined class="mb-2">
                    <v-card-title>
                        <div>
                            <div class="body-2">Required</div>
                            <div class="headline">Your COUNTER JR1</div>
                        </div>
                        <v-spacer/>
                        <div>
                            <div class="green--text">
                                <v-icon color="green">mdi-checkbox-marked</v-icon>
                                Uploaded!
                            </div>
                        </div>
                    </v-card-title>
                    <v-card-text class="details">
                        <div v-if="pkg.hasCoreJournalList">
                            Your core journal list has been uploaded. It included:
                            <ul>
                                <li>{{ pkg.journal_detail.diff_counts.diff_not_in_counter }} journals not in
                                    your COUNTER file
                                </li>
                                <li>{{ pkg.journal_detail.diff_counts.diff_not_published_in_2019 }} discontinued
                                    journals
                                </li>
                                <li>{{ pkg.journal_detail.diff_counts.diff_changed_publisher }} journals now
                                    with a new publisher
                                </li>
                                <li>{{ pkg.journal_detail.diff_counts.diff_no_price }} journals without an
                                    available ala carte price
                                </li>
                            </ul>
                            The subscription analysis in this package focuses on the remaining <strong>{{
                            pkg.journal_detail.counts.in_scenario }}</strong> journals.
                        </div>
                        <div v-if="!pkg.hasCoreJournalList">
                            Your COUNTER file has been uploaded. It includes:
                            <ul>
                                <li>{{ pkg.journal_detail.diff_counts.diff_open_access_journals }} fully open
                                    access journals
                                </li>
                                <li>{{ pkg.journal_detail.diff_counts.diff_not_published_in_2019 }} discontinued
                                    journals
                                </li>
                                <li>{{ pkg.journal_detail.diff_counts.diff_changed_publisher }} journals now
                                    with a new publisher
                                </li>
                                <li>{{ pkg.journal_detail.diff_counts.diff_no_price }} journals without an
                                    available ala carte price
                                </li>
                            </ul>
                            The subscription analysis in this package focuses on the remaining <strong>{{
                            pkg.journal_detail.counts.in_scenario }}</strong> journals.
                        </div>
                    </v-card-text>


                </v-card>


                <v-card outlined class="mb-2">
                    <v-card-title>
                        <div>
                            <div class="body-2">Optional</div>
                            <div class="headline">Custom journal prices</div>
                        </div>
                        <v-spacer/>
                        <div>
                            <div class="green--text">
                                <v-btn
                                        v-if="!pkg.hasCustomPrices"
                                        text
                                        @click="openUploadDialog('prices')"
                                >
                                    <v-icon>mdi-upload</v-icon>
                                    Upload
                                </v-btn>
                                <div class="green--text" v-if="pkg.hasCustomPrices">
                                    <v-icon color="green">mdi-checkbox-marked</v-icon>
                                    Uploaded!
                                </div>
                            </div>
                        </div>
                    </v-card-title>
                    <v-card-text class="details" v-if="!pkg.hasCustomPrices">
                        We are using the <em>public list price</em> for each a la carte journal. If you have custom
                        prices from your {{pkg.name}} rep, you can upload them as a spreadsheet and we'll use them
                        instead.
                    </v-card-text>
                    <v-card-text class="details" v-if="pkg.hasCustomPrices">
                        We are using your custom uploaded price list.
                    </v-card-text>
                </v-card>

                <v-card outlined class="mb-2">
                    <v-card-title>
                        <div>
                            <div class="body-2">Optional</div>
                            <div class="headline">Perpetual access dates</div>
                        </div>
                        <v-spacer/>
                        <div>
                            <div class="green--text">
                                <v-btn
                                        v-if="!pkg.hasCustomPerpetualAccess"
                                        text
                                        @click="openUploadDialog('perpetual-access')"
                                >
                                    <v-icon>mdi-upload</v-icon>
                                    Upload
                                </v-btn>
                                <div class="green--text" v-if="pkg.hasCustomPerpetualAccess">
                                    <v-icon color="green">mdi-checkbox-marked</v-icon>
                                    Uploaded!
                                </div>
                            </div>
                        </div>
                    </v-card-title>
                    <v-card-text class="details" v-if="!pkg.hasCustomPerpetualAccess">
                        We are assuming <em>full perpetual access</em> for the last 10 years of each journal's backfile.
                        If there are some date ranges for some journals where you <em>don't</em> have perpetual access,
                        you can upload them as a spreadsheet and we'll use them instead.
                    </v-card-text>
                    <v-card-text class="details" v-if="pkg.hasCustomPerpetualAccess">
                        We are using your custom uploaded perpetual access dates for each journal.
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <v-dialog v-model="uploadDialogIsOpen" max-width="500" persistent>
            <v-card v-if="uploadDialogIsOpen">
                <v-card-title class="headline">
                    <div>
                        Upload
                        <span v-if="uploadFileType==='counter'"> COUNTER file</span>
                        <span v-if="uploadFileType==='prices'"> Custom journals prices</span>
                        <span v-if="uploadFileType==='perpetual-access'"> Perpetual access dates</span>
                    </div>
                </v-card-title>


                <!--                <v-slide-y-transition :leave-absolute="true">-->
                <!--                        <div v-if="errorMsg && fileSelected">-->
                <!--                            <span v-html="errorMsg"></span>-->
                <!--                        </div>-->
                <!--                    </v-slide-y-transition>-->
                <v-card-text>
                    <!--                    <v-scale-transition>-->
                    <!--                        <div style="height:100px;" v-if="foo">-->
                    <!--                            foo-->
                    <!--                        </div>-->
                    <!--                    </v-scale-transition>-->
                    <!--                    <v-btn x-small @click="foo=!foo">toggle</v-btn>-->
                    <v-alert
                            :value="!!errorMsg && !!fileSelected"
                            type="error"
                            icon="mdi-alert"
                            transition="slide-x-transition"
                    >
                        <span class="body-2" v-html="errorMsg"/>
                    </v-alert>
                    <div class="descr">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                        voluptate velit esse cillum dolore eu fugiat nulla pariatur
                    </div>
                    <div>
                        <v-file-input
                                class="my-5"
                                label="Select your file"
                                show-size
                                counter
                                v-model="fileSelected"
                                :disabled="isUploadFileLoading"
                                @change="errorMsg=''"
                        />
                    </div>
                </v-card-text>


                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                            :disabled="isUploadFileLoading"
                            depressed
                            @click="closeUploadDialog"
                    >
                        <v-icon>mdi-close</v-icon>
                        Cancel
                    </v-btn>
                    <v-btn depressed
                           @click="uploadFile"
                           color="primary"
                           :loading="isUploadFileLoading"
                           :disabled="isUploadFileLoading || !fileSelected"
                    >
                        <v-icon>mdi-upload</v-icon>
                        Upload
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

    export default {
        name: "Pkg",
        components: {
            ScenarioEditDialogs,
        },
        data() {
            return {
                uploadDialogIsOpen: false,
                uploadFileType: "",
                fileSelected: null,
                isUploadFileLoading: false,
                errorMsg: "",
                foo: false,
            }
        },
        methods: {
            ...mapMutations([
                "openCopyDialog",
                "openRenameDialog",
                "openDeleteDialog",
            ]),
            ...mapActions([
                "createScenario",
            ]),
            openUploadDialog(fileType) {
                this.uploadDialogIsOpen = true
                this.uploadFileType = fileType
            },
            closeUploadDialog() {
                this.uploadDialogIsOpen = false
                this.uploadFileType = ""
                this.errorMsg = ""
                this.fileSelected = null
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
            }
        },
        computed: {
            ...mapGetters([
                "publisherName",
                "publisherId",
                "publisherScenariosCount",
                "isPublisherDemo",
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
        created() {
        },
        mounted() {
            console.log("pkg: mount up", this.$route.params)
            this.$store.commit("clearSelectedScenario")

            if (!this.publisherName) {
                this.$store.dispatch("fetchPublisher", this.$route.params.publisherId)
            }


            if (!(this.$store.getters.getScenario.saved && this.$store.getters.getScenario.saved.name)) {
            }

        },
    }
</script>

<style  lang="scss">
    .v-toolbar__extension {
        border-top: none !important;
    }

</style>