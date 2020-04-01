<template>
    <v-container class="publisher" v-if="publisherName">
        <router-link class="text--secondary low-key-link" :to="`/i/${institutionId}`">
            <strong>‹</strong>
            Back <span v-if="institutionName">to {{institutionName}}</span>
        </router-link>
        <div class="page-title mt-8 mb-4 d-flex">
            <img class="mt-1 mr-2" height="60px" src="https://i.imgur.com/Qt1sOqp.png">
            <div class="text">
                <div class="body-2">
                    <v-icon small>mdi-book-multiple-outline</v-icon>
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


        <v-row>
            <v-col cols="4">
                <v-card>
                    <v-card-title>
                        <div>
                            Publisher details
                        </div>
                    </v-card-title>
                    <v-divider></v-divider>

                    <v-list two-line>
                        <v-list-item>
                            <v-list-item-avatar>
                                <v-icon>mdi-bank</v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <div class="">
                                    {{publisherName}}
                                </div>
                                <v-list-item-subtitle>
                                    Name
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-btn icon disabled>
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>

                    </v-list>


                    <v-card-title class="mt-10">
                        <div>
                            OA publication costs
                        </div>
                        <v-spacer></v-spacer>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-list two-line dense>
                        <v-list-item>
                            <v-list-item-avatar>
                                <v-icon>mdi-cash</v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <div class="">
                                    $424,242
                                </div>
                                <v-list-item-subtitle>
                                    Est. APC Spend
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-btn icon>
                                    <v-icon>mdi-information-outline</v-icon>
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>

                        <v-list-item>
                            <v-list-item-avatar>
                                <v-icon>mdi-account-multiple</v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <div class="">
                                    534
                                </div>
                                <v-list-item-subtitle>
                                    Number of authorships (fractional)
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-btn icon>
                                    <v-icon>mdi-information-outline</v-icon>
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>

                    </v-list>
                    <v-btn text>
                        See more details
                    </v-btn>

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
                                    :to="`/i/${institutionId}/p/${publisherId}/s/${scenario.id}`"
                                    :disabled="scenario.isLoading"
                            >

                                <v-list-item-avatar size="50">
                                    <jazzicon v-if="!scenario.isLoading" :address="scenario.id" :diameter="50"/>
                                    <v-progress-circular v-if="scenario.isLoading" color="grey" indeterminate/>
                                </v-list-item-avatar>

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
                                <v-list-item-action v-if="scenario.saved.name">
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
                                    @click=""
                                    key="add-scenario"
                                    v-if="publisherScenariosAreAllLoaded"
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


        <v-row v-if="0" class="fill-height">
            <v-col cols="7">
                <h2 class="display-1 my-2">Your dashboards</h2>
                <v-card class="mb-2">
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
                                :disabled="scenario.isLoading"
                                @click="goToScenario(scenario.id)"
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

                                    <v-btn v-if="publisherScenariosCount > 1" icon
                                           @click.stop="openDeleteDialog(scenario)">
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
        name: "Publisher",
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
            goToScenario(scenarioId) {
                const url = `/i/${this.institutionId}/p/${this.pkg.id}/s/${this.scenario.id}`
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
            }
        },

        created() {
        },
        mounted() {
            console.log("publisher: mount up", this.$route.params)
            this.$store.commit("clearSelectedScenario")


            if (!this.publisherName) {
                this.$store.dispatch("fetchPublisher", this.$route.params.publisherId)
            }


        },
    }
</script>

<style lang="scss">
    .v-toolbar__extension {
        border-top: none !important;
    }

</style>