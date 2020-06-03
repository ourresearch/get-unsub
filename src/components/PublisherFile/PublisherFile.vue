<template>
    <v-card flat class="pa-3">

        <v-row class="section py-6">
            <v-col cols="4">
                <div class="title">
                    {{config.displayName}}
                </div>
                <div class="body-2">
                    {{ config.descr }}
                </div>
            </v-col>
            <v-col cols="8">
                <v-row
                        class="option-row d-flex align-start pb-5"
                        v-for="option in config.options"
                >
                    <v-icon class="px-2 pt-1">
                        {{(option.isSelected) ? 'mdi-radiobox-marked' : 'mdi-radiobox-blank'}}
                    </v-icon>
                    <div class="text">
                        <div
                                class="title"
                                @click="clickOption(option)"
                                style="cursor: pointer;"
                        >
                            {{option.heading}}
                            <span class="body-2 font-weight-bold" v-if="option.isDefault && !option.isProblem">(default)</span>
                        </div>
                        <div class="">
                            {{(option.isSelected) ? option.selectedText : option.unselectedText}}
                        </div>
                        <div v-if="config.id==='counter'">
                            {{ forecastableJournals.length }} journals
                        </div>
                        <div>
                            File uploaded with {{ publisherJournals.length }} rows. Of these, {{ignoredJournalsSum}} were ignored:
                            <span
                                    v-for="ignoredType in ignoredJournals"
                                    :key="ignoredType.displayName"
                            >
                                {{ignoredType.value}} {{ignoredType.displayName}},
                            </span>
                        </div>


                        <div class="journals" v-if="0 && option.isSelected">
                            <div v-if="journalsBySource.default && journalsBySource.default.length" @click="showJournalsBySource('default')">
                                {{journalsBySource.default.length}} journals with default data
                            </div>
                            <div v-if="journalsBySource.custom && journalsBySource.custom.length" @click="showJournalsBySource('custom')">
                                {{journalsBySource.custom.length}} journals with custom data
                            </div>
                            <div v-if="journalsBySource.null && journalsBySource.null.length" @click="showJournalsBySource('null')">
                                {{journalsBySource.null.length}} journals with no data
                            </div>
                        </div>

                    </div>
                </v-row>
            </v-col>
        </v-row>
        <v-divider></v-divider>


        <v-dialog
                persistent
                v-model="dialogs.uploadFile"
                max-width="600"
        >
            <publisher-file-upload
                    :file-type="config.id"
                    @cancel="uploadFileDialogCancel"
                    @success="uploadFileDialogSuccess"
            />
        </v-dialog>

        <v-dialog
                persistent
                v-model="dialogs.deleteFile"
                max-width="300"
        >
            <v-card>
                <v-card-title>
                    Delete data
                </v-card-title>
                <v-card-text>
                    Are you sure you want to delete this data?
                </v-card-text>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn
                            depressed
                            :disabled="isDeleteFileLoading"
                            @click="deleteFileDialogCancel"
                    >
                        Cancel
                    </v-btn>
                    <v-btn
                            depressed
                            color="primary"
                            :loading="isDeleteFileLoading"
                            @click="deleteFile"
                    >
                        Delete
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-snackbar
                v-model="snackbars.uploadSuccess"
                :timeout="3000"
                bottom left
        >
            File uploaded
            <v-btn dark icon @click="snackbars.uploadSuccess = false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-snackbar>
        <v-snackbar
                v-model="snackbars.deleteSuccess"
                :timeout="3000"
                bottom left
        >
            File deleted
            <v-btn dark icon @click="snackbars.deleteSuccess = false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-snackbar>


    </v-card>


</template>


<script>
    import _ from "lodash"
    import {mapGetters, mapMutations, mapActions} from 'vuex'
    import {api} from "../../api";
    import PublisherFileUpload from "../PublisherFile/PublisherFileUpload";
    import publisherFileUploadConfigs from "../PublisherFile/publisherFileConfigs";
    import PublisherFileJournalsList from "./PublisherFileJournalsList";


    export default {
        name: "PublisherSetupTab",
        components: {
            PublisherFileUpload,
            PublisherFileJournalsList,
        },
        props: {
            config: Object,
        },
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
                configs: publisherFileUploadConfigs,

                isDeleteFileLoading: false,

            }
        },
        computed: {
            ...mapGetters([
                "publisherName",
                "publisherId",
                "publisherBigDealCost",
                "publisherJournals",
            ]),
            journalsBySource(){
                return _.groupBy(this.forecastableJournals, (j)=> {
                    return j.dataSources.find(ds => ds.id === this.config.id).source
                })
            },

            forecastableJournals(){
                return this.publisherJournals.filter(j => j.isForecastable)
            },
            ignoredJournals(){

                const ret = [
                    {
                        id: "isInactive",
                        displayName: "ceased publication",
                        value: this.publisherJournals.filter(j => j.isInactive).length,
                    },
                    {
                        id: "isMoved",
                        displayName: "changed publishers",
                        value: this.publisherJournals.filter(j => j.isMoved).length,
                    },
                    {
                        id: "isOa",
                        displayName: "are fully Open Access",
                        value: this.publisherJournals.filter(j => j.isOa).length,
                    },
                    {
                        id: "isError",
                        displayName: "have an input error",
                        value: this.publisherJournals.filter(j => j.isError).length,
                    },
                ]
                return ret.filter(j => !!j.value)
            },
            ignoredJournalsSum(){
                return _.sum(this.ignoredJournals.map(j=>j.value))
            }




        },
        methods: {
            clickOption(option){
                console.log("clickOption", option)
                if (option.isSelected) return
                if (option.isDefault) this.dialogs.deleteFile = true
                else this.dialogs.uploadFile = true
            },

            uploadFileDialogSuccess() {
                this.dialogs.uploadFile = false
                this.snackbars.uploadSuccess = true
            },
            uploadFileDialogCancel() {
                this.dialogs.uploadFile = false
            },
            uploadFileDialogOpen() {
                this.dialogs.uploadFile = true
            },

            deleteFileDialogCancel() {
                this.dialogs.deleteFile = false
            },
            deleteFileDialogOpen() {
                this.dialogs.deleteFile = true
            },

            async deleteFile() {
                this.isDeleteFileLoading = true
                const path = `publisher/${this.publisherId}/${this.config.id}`
                console.log("delete, using this page", path, this.publisherId)
                await api.delete(path)
                await this.$store.dispatch("refreshPublisher")
                this.isDeleteFileLoading = false
                this.dialogs.deleteFile = false
                this.snackbars.deleteSuccess = true
            },
            showJournalsBySource(source){
                const myJournals = this.journalsBySource[source]
                console.log("showJournalsBySource", source, myJournals)
                return false
            }
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