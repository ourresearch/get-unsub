<template>
    <v-container class="publisher" >
        <router-link class="text--secondary low-key-link" :to="`/i/${institutionId}`">
            <strong>‹</strong>
            Back <span v-if="institutionName">to {{institutionName}}</span>
        </router-link>
        <div class="page-title mt-8 mb-4 d-flex">
            <v-avatar tile size="60" class="mt-1 mr-3">
                <img v-if="!publisherIsLoading" height="60px" src="https://i.imgur.com/Qt1sOqp.png">
                <v-progress-circular
                        size="60"
                        v-show="publisherIsLoading"
                        indeterminate
                />
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

        <v-alert v-if="publisherIsLoading" color="info" text dense icon="mdi-information-outline">
            Publisher loading (this takes a minute)...
        </v-alert>


        <v-alert v-if="isPublisherDemo && !publisherIsLoading" color="info" text dense icon="mdi-information-outline">
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
                        <v-list-item>
                            <v-list-item-avatar>
                                <v-icon>mdi-pen</v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <div class="">
                                    {{ publisherApcCost | currency }}
                                </div>
                                <v-list-item-subtitle>
                                    OA <strong>Publish</strong> cost (2019)
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-tooltip
                                        bottom
                                        color="#333"
                                >
                                    <template v-slot:activator="{on}">
                                        <v-btn :to="`/i/${institutionId}/p/${publisherId}/apc`" icon v-on="on">
                                            <v-icon>mdi-file-find-outline</v-icon>
                                        </v-btn>
                                    </template>
                                    <div>Explore your {{publisherName}} publication costs.</div>
                                </v-tooltip>
                            </v-list-item-action>
                            <v-list-item-action>
                                <v-tooltip
                                        bottom
                                        color="#333"
                                        max-width="400"
                                >
                                    <template v-slot:activator="{on}">
                                        <v-icon v-on="on">mdi-information-outline</v-icon>
                                    </template>
                                    <div>This is the sum total total OA publication fees (APCs) paid to
                                        {{publisherName}} by your faculty last year (est).
                                    </div>
                                </v-tooltip>
                            </v-list-item-action>
                        </v-list-item>

                        <v-list-item>
                            <v-list-item-avatar>
                                <v-icon>mdi-book-open</v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <div class="">
                                    {{ publisherBigDealCost | currency }}
                                </div>
                                <v-list-item-subtitle>
                                    Big Deal <strong>Read</strong> cost (2019)
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-btn icon>
                                    <v-icon>mdi-information-outline</v-icon>
                                </v-btn>
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

                                <v-list-item-avatar size="50">
                                    <jazzicon v-show="!scenario.isLoading" :address="scenario.idHash" :diameter="50"/>
                                    <v-progress-circular v-show="scenario.isLoading" color="grey" indeterminate/>
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
                                    <v-list-item-title @click="createScenario" class="body-2 text--secondary">
                                        New scenario
                                    </v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-fade-transition>


                    </v-list>


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
                "publisherBigDealCost",
                "publisherIsLoading",

                // apc stuff
                "publisherApcPapersCount",
                "publisherApcAuthorsFractionalCount",
                "publisherApcCost",

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
            this.$store.dispatch("fetchPublisher", this.$route.params.publisherId)
            this.$store.dispatch("fetchInstitution", this.$route.params.institutionId)


        },
    }
</script>

<style lang="scss">
    .v-toolbar__extension {
        border-top: none !important;
    }

</style>