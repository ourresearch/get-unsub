<template>
    <div >
        <!-- default -->
        <v-row class="option-row d-flex mb-8">
            <v-col cols="1" class="option-icon text-right">
                <v-icon class="mt-4" color="gray">mdi-check</v-icon>
            </v-col>
            <v-col cols="9">
                <div class="option-top-content d-flex">
                    <div class="option-top-content-left">
                        <div class="title mb-2">
                            <div class="caption">Default</div>
                            <div style="line-height: 1">
                                <span v-if="defaultToFull">
                                    Full perpetual access
                                </span>
                                <span v-if="!defaultToFull">
                                    No perpetual access
                                </span>
                            </div>
                        </div>
                        <div class="body-2">
                            <span v-if="defaultToFull">
                                    These journals have full perpetual access rights since 2010
                            </span>
                            <span v-if="!defaultToFull">
                                    These journals have no perpetual access rights since 2010
                            </span>
                        </div>

                    </div>
                </div>
            </v-col>
            <v-col cols="2" class="text-right mt-3">
                <publisher-file-journals-list
                        v-if="defaultToFull"
                        :rows="myJournalsBySource.defaultFull"
                        :extra-headers="myJournalHeaders"
                        success-journals
                />
                <publisher-file-journals-list
                        v-if="!defaultToFull"
                        :rows="myJournalsBySource.defaultNone"
                        :extra-headers="myJournalHeaders"
                        success-journals
                />
            </v-col>
        </v-row>

        <!-- custom not uploaded -->
        <v-row class="option-row d-flex mb-8" v-if="!isUploaded">
            <v-col cols="1" class="option-icon text-right">
                <v-icon class="mt-4" v-if="!isUploaded">mdi-close</v-icon>
            </v-col>
            <v-col cols="9">
                <div class="title mb-2">
                    <div class="caption">Optional</div>
                    <div style="line-height: 1">
                        Custom perpetual access dates
                    </div>
                </div>
                <div class="body-2">
                    These journals have custom dates that override the defaults.
                </div>
                <publisher-file-upload class="mt-4" file-type="perpetualAccess"/>
            </v-col>
            <v-col cols="2" class="text-right mt-3">
                <div class="title">0</div>
                <div class="body-2">Journals</div>
            </v-col>
        </v-row>


        <!-- custom has been uploaded -->
        <v-row class="option-row d-flex mb-8" v-if="isUploaded">
            <v-col cols="1" class="option-icon text-right">
                <v-icon class="mt-4" color="gray">mdi-check</v-icon>
            </v-col>
            <v-col cols="9" class="option-content">
                <div class="option-top-content d-flex">
                    <div class="option-top-content-left">
                        <div class="title mb-2">
                            <div class="caption">Optional</div>
                            <div style="line-height: 1">
                                Custom perpetual access dates
                            </div>
                        </div>
                        <div class="body-2">
                            These journals have custom dates that override the defaults.
                        </div>
                    </div>
                </div>


                <div class="option-file-info body-2">
                    <div>
                        <div>
                            {{ myUploadedRowsCount }} rows uploaded, with {{ numRowsIgnored }} rows ignored:
                        </div>
                        <ul>
                            <li v-if="errorRows.length">
                                <publisher-file-journals-list
                                        :rows="errorRows"
                                        :headers="myFileInfo.error_rows.headers"
                                        :error-rows="true"
                                        label="with input errors"
                                />
                            </li>
                            <li v-if="journalsWithPerpetualAccessButNoCounter.length">
                                <publisher-file-journals-list
                                        :rows="journalsWithPerpetualAccessButNoCounter"
                                        :extra-headers="myJournalHeaders"
                                        label="journals not in your COUNTER report"
                                />
                            </li>
                        </ul>
                    </div>
                    <div class="mt-4">
                        <publisher-file-delete file-type="perpetualAccess"/>
                    </div>

                </div>


            </v-col>
            <v-col cols="2" class="text-right">
                <publisher-file-journals-list
                        :rows="myJournalsBySource.custom"
                        :extra-headers="myJournalHeaders"
                        success-journals
                />
            </v-col>

        </v-row>


        <v-dialog
                persistent
                v-model="dialogIsShowing"
                max-width="300"
        >
            <v-card>
                <v-card-title>
                    Change Perpetual Access Defaults
                </v-card-title>
                <v-card-text>
                    Change default perpetual access (since 2010) to
                    <span v-if="defaultValue==='none'">
                        <strong>None</strong>?
                    </span>
                    <span v-if="defaultValue==='full'">
                        <strong>Complete</strong>?
                    </span>
                </v-card-text>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn
                            depressed
                            :disabled="isLoading"
                            @click="cancel"
                    >
                        Cancel
                    </v-btn>
                    <v-btn
                            depressed
                            color="primary"
                            :loading="isLoading"
                            @click="changeDefault"
                    >
                        Change
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>


        <v-snackbar
                v-model="snackbars.success"
                :timeout="3000"
                bottom left
        >
            Perpetual access default updated
            <v-btn dark icon @click="snackbars.success = false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-snackbar>


    </div>
</template>


<script>
    import _ from "lodash"
    import {mapGetters, mapMutations, mapActions} from 'vuex'
    import {api} from "../../api";
    import PublisherFileUpload from "../PublisherFile/PublisherFileUpload";
    import PublisherFileDelete from "./PublisherFileDelete";
    import PublisherFileJournalsList from "./PublisherFileJournalsList";
    import PublisherFileOption from "./PublisherFileOption";


    export default {
        name: "PublisherFileCounter",
        components: {
            PublisherFileUpload,
            PublisherFileDelete,
            PublisherFileJournalsList,
            PublisherFileOption,
        },
        props: {},
        data() {
            return {
                defaultValue: "full",
                dialogIsShowing: false,
                snackbars: {
                    success: false,
                },
                isLoading: false,
            }
        },
        computed: {
            ...mapGetters([
                "publisherName",
                "publisherId",
                "publisherBigDealCost",
                "publisherJournals",
                "publisherJournalsValid",
                "publisherFiles",
            ]),
            myFileInfo() {
                return this.publisherFiles.find(f => f.id === "perpetualAccess")
            },
            isUploaded() {
                return this.myFileInfo.uploaded
            },
            myJournals() {
                return this.publisherJournalsValid
            },
            myCustomJournalsRaw(){ // this includes journals with no counter data
                return this.publisherJournals.filter(j => {
                    return j.dataSourcesDict.perpetualAccess.source === "custom"
                })
            },
            myUploadedRowsCount() {
                return this.myCustomJournalsRaw.length + this.errorRows.length
            },

            myJournalsBySource() {
                const groups = _.groupBy(this.publisherJournalsValid, (j) => {
                    return j.dataSources.find(ds => ds.id === 'perpetualAccess').source
                })


                return {
                    null: groups.null || [],
                    defaultFull: groups.default_full || [],
                    defaultNone: groups.default_none || [],
                    custom: groups.custom || [],
                }
            },
            myJournalHeaders() {
                return [
                    {text: "Perpetual access start", value: "perpetualAccessStart"},
                    {text: "Perpetual access end", value: "perpetualAccessEnd"},
                ]
            },
            defaultToFull() {
                return this.myFileInfo.default_to_full
            },


            journalsWithPerpetualAccessButNoCounter() {
                return this.publisherJournals.filter(j => {
                    return j.dataSourcesDict.perpetualAccess.source === 'custom' && !j.isValid
                })
            },
            errorRows(){
                return (this.myFileInfo.error_rows) ? this.myFileInfo.error_rows.rows : []
            },

            numRowsIgnored() {
                return _.sum([
                    this.journalsWithPerpetualAccessButNoCounter.length,
                    this.errorRows.length,
                ])
            },
        },
        methods: {
            cancel() {
                if (this.defaultValue === "full") this.defaultValue = "none"
                else if (this.defaultValue === "none") this.defaultValue = "full"
                console.log("changed in cancel", this.dialogIsShowing)
                const that = this
                setTimeout(function () {
                    that.dialogIsShowing = false
                    console.log("close")
                }, 200)
            },
            closeSuccessfully() {
                this.dialogIsShowing = false
                this.snackbars.success = true
            },
            showDialog() {
                this.dialogIsShowing = true
            },
            async changeDefault() {
                this.isLoading = true
                const path = `publisher/${this.publisherId}/perpetual-access`
                console.log("perpetual-access changeDefault, using this data", path, this.publisherId)
                const data = {
                    default_to_full: this.defaultValue === "full"
                }

                await api.post(path, data)
                await this.$store.dispatch("refreshPublisher")
                this.isLoading = false
                this.closeSuccessfully()
            },
        },
        created() {
        },
        mounted() {
        },
        watch: {
            defaultValue: function (to) {
                console.log("watch:", this.dialogIsShowing)
                if (!this.dialogIsShowing) {
                    this.showDialog()
                } else {

                }
            }
        }
    }
</script>

<style lang="scss">


</style>