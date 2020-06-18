<template>
    <v-card flat class="">
        <v-card-title>
            <div>
                {{publisherName}} Setup
            </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-row class="section pa-6 d-none">
            <v-col cols="4">
                <div class="headline">
                    Big Deal Cost
                </div>
                <div class="body-2">
                    The annual cost of your <em>current</em> {{publisherName}} Big Deal. This is used as the default for
                    new Forecast Scenarios.
                </div>
            </v-col>
            <v-col>
                <div class="option-row d-flex">
                    <div class="title pl-7">
                        {{publisherBigDealCost | currency}}
                    </div>
                    <v-spacer></v-spacer>
                    <v-btn text>Edit</v-btn>
                </div>
            </v-col>
        </v-row>
        <v-divider></v-divider>


        <v-row class="section py-6 pl-4 pr-8">
            <v-col cols="4">
                <div class="headline">
                    Download counts
                </div>
                <div class="body-2">
                    Downloads by journal, last year
                </div>
            </v-col>
            <v-col>
                <publisher-file-counter />
            </v-col>
        </v-row>
        <v-divider></v-divider>

        <v-row class="section py-6 pl-4 pr-8">
            <v-col cols="4">
                <div class="headline">
                    A-la-carte prices
                </div>
                <div class="body-2">
                    Costs of journal-by-journal subscriptions
                </div>
            </v-col>
            <v-col>
                <publisher-file-price v-if="counterIsUploaded" />
                <div v-if="!counterIsUploaded">
                    Upload your COUNTER report in order to set prices.
                </div>
            </v-col>
        </v-row>
        <v-divider></v-divider>

        <v-row class="section py-6 pl-4 pr-8">
            <v-col cols="4">
                <div class="headline">
                    Perpetual Access
                </div>
                <div class="body-2">
                    Each journal's date ranges for which you have perpetual access to articles. Only dates after 2010 affect forecasting
                </div>
            </v-col>
            <v-col>
                <publisher-file-perpetual-access v-if="counterIsUploaded" />
                <div v-if="!counterIsUploaded">
                    Upload your COUNTER report in order to set perpetual access dates.
                </div>
            </v-col>
        </v-row>
        <v-divider></v-divider>


    </v-card>


</template>


<script>
    import _ from "lodash"
    import appConfigs from "../../appConfigs";
    import {mapGetters, mapMutations, mapActions} from 'vuex'
    import {api} from "../../api";
    import PublisherFileUploadDialog from "../PublisherFile/PublisherFileUpload";
    import publisherFileUploadConfigs from "../PublisherFile/publisherFileConfigs";
    import PublisherFile from "../PublisherFile/PublisherFile";

    import PublisherFileCounter from "../PublisherFile/PublisherFileCounter";
    import PublisherFilePrice from "../PublisherFile/PublisherFilePrice";
    import PublisherFilePerpetualAccess from "../PublisherFile/PublisherFilePerpetualAccess";


    export default {
        name: "PublisherSetupTab",
        components: {
            PublisherFileUploadDialog,
            PublisherFile,
            PublisherFileCounter,
            PublisherFilePrice,
            PublisherFilePerpetualAccess,
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
                uploadFileType: null,
                fileConfigs: publisherFileUploadConfigs,

                deleteFileType: null,
                isDeleteFileLoading: false,

            }
        },
        methods: {
            uploadFileDialogSuccess() {
                this.uploadFileType = null
                this.dialogs.uploadFile = false
                this.snackbars.uploadSuccess = true
            },
            uploadFileDialogCancel() {
                this.uploadFileType = null
                this.dialogs.uploadFile = false
            },
            uploadFileDialogOpen(fileType) {
                this.uploadFileType = fileType
                this.dialogs.uploadFile = true
            },

            deleteFileDialogCancel() {
                this.dialogs.deleteFile = false
                this.deleteFileType = null
            },
            deleteFileDialogOpen(fileType) {
                this.deleteFileType = fileType
                this.dialogs.deleteFile = true
            },

            async deleteFile() {
                this.isDeleteFileLoading = true
                const path = `publisher/${this.publisherId}/${this.deleteFileType}`
                console.log("delete, using this page", path, this.publisherId)
                await api.delete(path)
                await this.$store.dispatch("refreshPublisher")
                this.isDeleteFileLoading = false
                this.dialogs.deleteFile = false
                this.snackbars.deleteSuccess = true
            },
        },
        computed: {
            ...mapGetters([
                "publisherName",
                "publisherId",
                "publisherBigDealCost",
                "publisherFiles",
            ]),
            counterIsUploaded(){
                return this.publisherFiles.find(f => f.id === "counter").uploaded
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


</style>