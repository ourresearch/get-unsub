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
                        :rows="myJournalsBySource.default"
                        :extra-headers="myJournalHeaders"
                        success-journals
                />
                <publisher-file-journals-list
                        v-if="!defaultToFull"
                        :rows="myJournalsBySource.null"
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
                        Perpetual access between given dates
                    </div>
                </div>
                <div class="body-2">
                    These journals have custom dates that override the defaults.
                </div>
                <publisher-file-upload v-if="!publisherIsOwnedByConsortium" class="mt-4" file-type="perpetualAccess"/>
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
                        <publisher-file-delete v-if="!publisherIsOwnedByConsortium" file-type="perpetualAccess"/>
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
                "publisherIsOwnedByConsortium",
            ]),
            myFileInfo() {
                return this.publisherFiles.find(f => f.id === "perpetualAccess")
            },
            isUploaded() {
                return this.myFileInfo.uploaded
            },
            // myJournals() {
            //     return this.publisherJournalsValid.map(j => {
            //
            //         const ret = {...j}
            //         const paDataSource = ret.dataSources.find(ds => ds.id === 'perpetualAccess')
            //
            //         // hack around an API error...
            //         // if (!this.defaultToFull && /default/.test(paDataSource.source)) {
            //         //     paDataSource.source = "default_none"
            //         //      ret.perpetualAccessStart = null
            //         //     paDataSource.value[0] = null
            //         // }
            //         return ret
            //     })
            // },
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

                console.log("myJournalsBySource groups", groups)

                return {
                    null: groups.null || [],
                    // defaultFull: groups.default_full || [],
                    // defaultNone: groups.default_none || [],
                    default: groups.default || [],
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
                return !this.myFileInfo.uploaded
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
        },
        created() {
        },
        mounted() {
        },
        watch: {
        }
    }
</script>

<style lang="scss">


</style>