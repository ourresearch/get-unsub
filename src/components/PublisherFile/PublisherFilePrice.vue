<template>
    <div>


        <!-- missing prices -->
        <v-row class="option-row warn d-flex mb-8" v-if="myJournalsBySource.null">
            <v-col cols="1" class="option-icon text-right">
                <v-icon class="mt-4" color="warning">mdi-alert</v-icon>
            </v-col>
            <v-col cols="9">
                <div class="title mb-2">
                    <div class="caption">Warning</div>
                    <div style="line-height: 1">
                        Journals without price data
                    </div>
                </div>
                <div class="body-2">
                    These journals will <em>not</em> be
                    included in forecasting. You can fix this by
                    <span v-if="isUploaded">
                        <publisher-file-upload
                                file-type="price"
                                link-text="uploading a more complete custom pricelist"
                        /> that includes prices for these journals.
                    </span>
                    <span v-if="!isUploaded">
                        <publisher-file-upload
                                file-type="price"
                                link-text="uploading a custom pricelist"
                        /> with prices for these journals.
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
                <v-icon class="mt-4" color="gray">mdi-checkbox-marked</v-icon>
            </v-col>
            <v-col cols="9">
                <div class="option-top-content d-flex">
                    <div class="option-top-content-left">
                        <div class="title mb-2">
                            <div class="caption">Default</div>
                            <div style="line-height: 1">
                                Public pricelist
                            </div>
                        </div>
                        <div class="body-2">
                            These journals use the posted a-la-carte list price
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
                <v-icon class="mt-4" v-if="!isUploaded">mdi-checkbox-blank-outline</v-icon>
            </v-col>
            <v-col cols="9">
                <div class="title mb-2">
                    <div class="caption">Optional</div>
                    <div style="line-height: 1">
                        Custom Pricelist
                    </div>
                </div>
                <div class="body-2">
                    These journals have custom prices that override and extend the defaults.
                </div>
                <publisher-file-upload class="mt-4" file-type="price"/>
            </v-col>
            <v-col cols="2" class="text-right">
                <div class="title">0</div>
                <div class="body-2">Journals</div>
            </v-col>
        </v-row>

        <!-- custom has been uploaded -->
        <v-row class="option-row d-flex mb-8" v-if="isUploaded">
            <v-col cols="1" class="option-icon text-right">
                <v-icon class="mt-4" color="gray">mdi-checkbox-marked</v-icon>
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
                            {{ myFileInfo.rows_count }} rows uploaded, with {{ numRowsIgnored }} rows ignored:
                        </div>
                        <ul>
                            <li v-if="myFileInfo.error_rows.rows.length">
                                <publisher-file-journals-list
                                        :rows="myFileInfo.error_rows.rows"
                                        :headers="myFileInfo.error_rows.headers"
                                        :error-rows="true"
                                        label="with input errors"
                                />
                            </li>
                            <li v-if="journalsWithPriceButNoCounter.length">
                                <publisher-file-journals-list
                                        :rows="journalsWithPriceButNoCounter"
                                        :headers="myJournalHeaders"
                                        label="journals not in your COUNTER report"
                                />
                            </li>
                        </ul>
                    </div>
                    <div class="mt-4">
                        <publisher-file-delete file-type="price"/>
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
            ]),
            myFileInfo() {
                return this.publisherFiles.find(f => f.id === "price")
            },
            isUploaded() {
                return this.myFileInfo.uploaded
            },
            myJournals() {
                return this.publisherJournalsValid
            },
            myJournalsBySource() {
                const groups = _.groupBy(this.myJournals, (j) => {
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
                    this.myFileInfo.error_rows.rows.length,
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