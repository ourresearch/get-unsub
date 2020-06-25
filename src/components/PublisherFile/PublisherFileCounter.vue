<template>
    <div>
        <!-- file not uploaded -->
        <v-row class="option-row err d-flex mb-8" v-if="!isUploaded">
            <v-col cols="1" class="option-icon text-right">
                <v-icon class="mt-4" color="error">mdi-alert-circle</v-icon>
            </v-col>
            <v-col cols="9">
                <div class="title mb-2">
                    <div class="caption">Error</div>
                    <div style="line-height: 1">
                        No COUNTER data
                    </div>
                </div>
                <div class="body-2">
                    Forecasting is unavailable until you upload your COUNTER report.
                </div>
                <publisher-file-upload file-type="counter" color="primary" />
            </v-col>
            <v-col cols="2" class="text-right">
                <div class="title">0</div>
                <div class="body-2">Journals</div>
            </v-col>

        </v-row>





        <!-- file uploaded -->
        <v-row class="option-row mb-6" v-if="isUploaded">
            <v-col cols="1" class="option-icon text-right">
                <v-icon color="gray" class="mt-1">mdi-check</v-icon>
            </v-col>
            <v-col cols="9" class="option-content">
                <div class="option-top-content d-flex">
                    <div class="option-top-content-left">
                        <div class="title">
                            COUNTER report
                        </div>
                        <div class="body-2">
                            Forecasting is customized based on your institution's downloads.
                        </div>
                    </div>
                </div>
                <div class="option-file-info body-2">
                    <div>
                        <div>
                            <span v-if="numRowsIgnored.length">
                                {{ myUploadedRowsCount }} rows uploaded, with {{ numRowsIgnored }} rows ignored:
                            </span>
                            <span v-if="!numRowsIgnored.length">
                                {{ myUploadedRowsCount }} rows uploaded.
                            </span>
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
                            <li v-if="ignoredOa.length">
                                <publisher-file-journals-list
                                    :rows="ignoredOa"
                                    label="fully Open-Access journals"
                                />
                            </li>
                            <li v-if="ignoredInactive.length">
                                <publisher-file-journals-list
                                    :rows="ignoredInactive"
                                    :label="'journals no longer published by ' + publisherPublisher"
                                />
                            </li>
                            <li v-if="ignoredInactive.length">
                                <publisher-file-journals-list
                                    :rows="ignoredMoved"
                                    label="journals no longer published at all"
                                />
                            </li>
                        </ul>
                    </div>
                    <div class="mt-4">
                        <publisher-file-delete file-type="counter"/>
                    </div>

                </div>


            </v-col>
            <v-col cols="2">
                <publisher-file-journals-list
                    :rows="myJournals"
                    :extra-headers="myJournalHeaders"
                    success-journals
                />

            </v-col>

        </v-row>

    </div>
</template>


<script>
    import _ from "lodash"
    import {mapGetters, mapMutations, mapActions} from 'vuex'
    import {api} from "../../api";
    import PublisherFileUpload from "../PublisherFile/PublisherFileUpload";
    import PublisherFileJournalsList from "./PublisherFileJournalsList";
    import PublisherFileOption from "./PublisherFileOption";
    import PublisherFileDelete from "./PublisherFileDelete";


    export default {
        name: "PublisherFileCounter",
        components: {
            PublisherFileUpload,
            PublisherFileJournalsList,
            PublisherFileOption,
            PublisherFileDelete,
        },
        props: {},
        data() {
            return {
                dialogs: {
                    uploadFile: false,
                    deleteFile: false,
                },
                snackbars: {
                    uploadSuccess: false,
                    deleteSuccess: false
                },
            }
        },
        computed: {
            ...mapGetters([
                "publisherName",
                "publisherPublisher",
                "publisherId",
                "publisherBigDealCost",
                "publisherJournals",
                "publisherJournalsValid",
                "publisherFiles",
            ]),
            myFileInfo() {
                return this.publisherFiles.find(f => f.id === "counter")
            },
            isUploaded() {
                return this.myFileInfo.uploaded
            },
            myJournals() {
                return this.publisherJournalsValid.map(j => {
                    const myDownloadsCount = j.dataSources.find(ds => ds.id==="counter").value
                    return {
                        ...j,
                        value: myDownloadsCount,
                    }
                })
            },
            myCustomJournalsRaw(){ // this includes ALL journals
                return this.publisherJournals.filter(j => {
                    return j.dataSourcesDict.counter.source === "custom"
                })
            },

            myUploadedRowsCount() {
                return this.myCustomJournalsRaw.length + this.errorRows.length
            },
            errorRows(){
                return (this.myFileInfo.error_rows) ? this.myFileInfo.error_rows.rows : []
            },
            myJournalHeaders(){
                return [
                    {text: "Downloads", value: "counter"},
                ]
            },
            numRowsIgnored() {
                return _.sum([
                    this.errorRows.length,
                    this.ignoredOa.length,
                    this.ignoredMoved.length,
                    this.ignoredInactive.length,
                ])
            },
            ignoredOa() {
                return this.publisherJournals.filter(j => j.isOa)
            },
            ignoredMoved() {
                return this.publisherJournals.filter(j => j.isMoved)
            },
            ignoredInactive() {
                return this.publisherJournals.filter(j => j.isInactive)
            },


        },
        methods: {
            clickOption(option) {
                console.log("clickOption", option)
                if (option.isSelected) return
                if (option.isDefault) this.dialogs.deleteFile = true
                else this.dialogs.uploadFile = true
            },
        },
        created() {
        },
        mounted() {
        },
        watch: {}
    }
</script>

<style lang="scss">
    .option-row.err {
        background: #FED4D3;
        /*color: #ff8002;*/
        border-radius: 3px;
    }

</style>