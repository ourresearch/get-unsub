<template>
    <div>

        <!-- default -->
        <v-row class="option-row d-flex mb-8">
            <v-col cols="1" class="option-icon text-right">
                <v-icon class="mt-1" color="success">mdi-checkbox-marked</v-icon>
            </v-col>
            <v-col cols="9">
                <div class="title">
                    Public pricelist
                </div>
                <div class="body-2" v-if="isUploaded && myJournalsBySource.default">
                    Using the publicly-posted a-la-carte prices for {{ myJournalsBySource.default.length}} journals.
                </div>
                <div class="body-2" v-if="isUploaded && !myJournalsBySource.default">
                    Using the publicly-posted a-la-carte prices for 0 journals.
                </div>
                <div class="body-2" v-if="!isUploaded">
                    Using the publicly-posted a-la-carte prices for {{ myJournalsBySource.default.length }} journals.
                </div>
            </v-col>
            <v-col cols="2" class="text-right">
                <div class="title">{{ (myJournalsBySource.default) ? myJournalsBySource.default.length : 0}}</div>
                <div class="body-2">Journals</div>
            </v-col>
        </v-row>

        <!-- custom not uploaded -->
        <v-row class="option-row d-flex mb-8" v-if="!isUploaded">
            <v-col cols="1" class="option-icon text-right">
                <v-icon class="mt-1" v-if="!isUploaded">mdi-checkbox-blank-outline</v-icon>
            </v-col>
            <v-col cols="9">
                <div class="title">
                    Custom pricelist
                </div>
                <div class="body-2">
                    You can upload custom a-la-carte prices for journals where you want to override the default public list price.
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
                <v-icon class="mt-1" color="success">mdi-checkbox-marked</v-icon>
            </v-col>
            <v-col cols="9">
                <div class="title">
                    Custom pricelist
                </div>
                <div class="body-2">
                    Your uploaded custom prices are overriding the public price for {{ myJournalsBySource.custom.length }} journals.
                </div>
                <v-divider class="my-2" />
                <div class="option-file-info">
                    <div class="body-2">
                        {{ myFileInfo.rows_count }} journals uploaded. Of these, {{ numRowsIgnored }} were ignored:
                        <span>
                            {{ 42 }} with input errors,
                            {{ 21 }} not found in COUNTER file.
                        </span>
                    </div>
                    <div class="mt-4">
                        <publisher-file-delete file-type="price"/>
                    </div>
                </div>
            </v-col>
            <v-col cols="2" class="text-right">
                <div class="title"> {{ (myJournalsBySource.custom) ? myJournalsBySource.custom.length : 0}}</div>
                <div class="body-2">Journals</div>
            </v-col>

        </v-row>


        <!-- missing prices -->
        <v-row class="option-row d-flex mb-8" v-if="myJournalsBySource.null">
            <v-col cols="1" class="option-icon text-right">
                <v-icon class="mt-1" color="warning">mdi-alert</v-icon>
            </v-col>
            <v-col cols="9">
                <div class="title">
                    Missing prices
                </div>
                <div class="body-2">
                    We're missing price data for {{ myJournalsBySource.null.length }} journals; these will not be included in forecasting. You can fix this by uploading custom prices for them.
                </div>
            </v-col>
            <v-col cols="2" class="text-right">
                <div class="title"> {{ myJournalsBySource.null.length }}</div>
                <div class="body-2">Journals</div>
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
                return _.groupBy(this.myJournals, (j) => {
                    return j.dataSources.find(ds => ds.id === 'price').source
                })
            },

            numRowsIgnored() {
                return 42
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

    .v-radio {
        align-items: flex-start;
        padding: 0 0 20px 0;
    }

    .v-input--selection-controls .v-radio > .v-label {
        display: block;
        margin-top: -7px;
    }

</style>