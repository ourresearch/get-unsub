<template>
    <div>
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
                                Default dates
                            </div>
                        </div>
                        <div class="body-2">
                            These journals use a default date range (note: this control doesn't do anything right now, everything is always default to full PA):
                        </div>
                        <v-radio-group v-model="defaultValue" class="mt-2 pt-0">
                            <v-radio value="full">
                                <template v-slot:label>
                                    <div>
                                        <strong>Complete</strong>: full perpetual access rights since 2010.
                                    </div>
                                </template>
                            </v-radio>
                            <v-radio value="none">
                                <template v-slot:label>
                                    <div>
                                        <strong>None</strong>: No perpetual access rights since 2010.
                                    </div>
                                </template>
                            </v-radio>
                        </v-radio-group>
                    </div>
                </div>
            </v-col>
            <v-col cols="2" class="text-right mt-3">
                <publisher-file-journals-list
                        :rows="myJournalsBySource.defaultFull"
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
                <v-icon class="mt-4" color="gray">mdi-checkbox-marked</v-icon>
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
                defaultValue: "full"
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
            journalsTest(){
                return this.publisherJournals.filter(j => {
                    return j.dataSourcesDict.perpetualAccess.source == "custom"
                }).map(j => j.name)
            },
            myJournalsBySource() {
                const groups = _.groupBy(this.myJournals, (j) => {
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


            journalsWithPerpetualAccessButNoCounter() {
                return this.publisherJournals.filter(j => {
                    return j.dataSourcesDict.perpetualAccess.source && !j.dataSourcesDict.counter.source
                })
            },

            numRowsIgnored() {
                const customRows = this.myJournalsBySource.custom
                const numCustomRows = (customRows) ? customRows.length : 0
                return this.myFileInfo.rows_count - numCustomRows
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


</style>