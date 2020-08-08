<template>
    <div >
        <!-- missing prices -->
        <v-row class="option-row d-flex mb-8" v-if="myJournalsBySource.null">
            <v-col cols="1" class="option-icon text-right">
                <v-icon
                        class="mt-4"
                        color="gray"
                >mdi-alert</v-icon>
            </v-col>
            <v-col cols="9">
                <div class="title mb-2">
                    <div class="caption">Warning</div>
                    <div style="line-height: 1">
                        Journals without price data
                    </div>
                </div>
                <div class="body-2">
                    These journals have no public list price, and no custom price uploaded. They will not be
                    included in forecasting.
                    <span v-if="!publisherIsOwnedByConsortium">
                        You can set a price for them by
                        <span v-if="isUploaded">
                            <publisher-file-upload
                                    file-type="price"
                                    link-text="uploading a new custom pricelist"
                            /> that includes prices for these journals.
                        </span>
                        <span v-if="!isUploaded">
                            <publisher-file-upload
                                    file-type="price"
                                    link-text="uploading a custom pricelist"
                            /> with prices for these journals.
                        </span>

                    </span>

                </div>
            </v-col>
            <v-col cols="2" class="text-right">
                <publisher-file-journals-list
                        :rows="myJournalsBySource.null"
                        success-journals
                />
            </v-col>

        </v-row>


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
                                Public price
                            </div>
                        </div>
                        <div class="body-2">
                            These journals use the publicly posted a-la-carte list price
                        </div>
                    </div>
                </div>
            </v-col>
            <v-col cols="2" class="text-right">
                <publisher-file-journals-list
                        :rows="myJournalsBySource.default"
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
                        Custom price
                    </div>
                </div>
                <div class="body-2">
                    These journals have custom prices that override and extend the defaults.
                </div>
                <publisher-file-upload v-if="!publisherIsOwnedByConsortium" class="mt-4" file-type="price"/>
            </v-col>
            <v-col cols="2" class="text-right">
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
                                Custom Pricelist
                            </div>
                        </div>
                        <div class="body-2">
                            These journals have custom prices that override and extend the defaults.
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
                            <li v-if="journalsWithPriceButNoCounter.length">
                                <publisher-file-journals-list
                                        :rows="journalsWithPriceButNoCounter"
                                        :extra-headers="myJournalHeaders"
                                        label="journals not in your COUNTER report"
                                />
                            </li>
                        </ul>
                    </div>
                    <div class="mt-4">
                        <publisher-file-delete v-if="!publisherIsOwnedByConsortium" file-type="price"/>
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


    </div>
</template>


<script>
    import _ from "lodash"
    import {mapGetters, mapMutations, mapActions} from 'vuex'
    import {api} from "../../api";
    import PublisherFileUpload from "../PublisherFile/PublisherFileUpload";
    import PublisherFileJournalsList from "./PublisherFileJournalsList";
    import PublisherFileDelete from "./PublisherFileDelete";


    export default {
        name: "PublisherFilePrice",
        components: {
            PublisherFileUpload,
            PublisherFileJournalsList,
            PublisherFileDelete,
        },
        props: {},
        data() {
            return {}
        },
        computed: {
            ...mapGetters([
                "publisherName",
                "publisherId",
                "publisherBigDealCost",
                "publisherJournals",
                "publisherJournalsValid",
                "publisherFiles",
                "publisherIsOwnedByConsortium",
            ]),
            myFileInfo() {
                return this.publisherFiles.find(f => f.id === "price")
            },
            errorRows(){
                return (this.myFileInfo.error_rows) ? this.myFileInfo.error_rows.rows : []
            },
            isUploaded() {
                return this.myFileInfo.uploaded
            },
            myJournals() {
                return this.publisherJournalsValid
            },
            myCustomJournalsRaw(){ // this includes journals with no counter data
                return this.publisherJournals.filter(j => {
                    return j.dataSourcesDict.price.source === "custom"
                })
            },
            myUploadedRowsCount() {
                return this.myCustomJournalsRaw.length + this.errorRows.length
            },
            myJournalsBySource() {
                const groups = _.groupBy(this.publisherJournalsValid, (j) => {
                    return j.dataSources.find(ds => ds.id === 'price').source
                })

                return {
                    null: groups.null || [],
                    default: groups.default || [],
                    custom: groups.custom || [],
                }
            },
            myJournalHeaders() {
                return [
                    {text: "price", value: "price"},
                ]
            },


            journalsWithPriceButNoCounter() {
                return this.publisherJournals.filter(j => {
                    return j.dataSourcesDict.price.source === 'custom' && !j.isValid
                })
            },

            numRowsIgnored() {
                return _.sum([
                    this.errorRows.length,
                    this.journalsWithPriceButNoCounter.length
                ])
            },


        },
        methods: {},
        created() {
        },
        mounted() {
        },
        watch: {}
    }
</script>

<style lang="scss">
    .option-row.warn {
        background: #FFF0E2;
        /*color: #ff8002;*/
        border-radius: 3px;
    }


</style>