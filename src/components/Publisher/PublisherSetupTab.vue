<template>
    <v-card flat class="pa-3">
        <v-card-title>
            {{publisherName}} Setup
        </v-card-title>
        <v-row class="section py-6">
            <v-col cols="4">
                <div class="title">
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

        <template v-for="fileConfig in fileConfigs">
            <v-row class="section py-6" :key="fileConfig.id">
                <v-col cols="4">
                    <div class="title">
                        {{fileConfig.displayName}}
                    </div>
                    <div class="body-2">
                        {{ fileConfig.descr }}
                    </div>
                </v-col>
                <v-col>
                    <v-row class="option-row d-flex align-start" v-if="!publisherUploadsDict[fileConfig.id].isUploaded">
                        <v-icon class="px-2 pt-1">{{fileConfig.options.default.icon}}</v-icon>
                        <div class="text" style="max-width: 500px;">
                            <div class="title">
                                {{fileConfig.options.default.heading}}
                                <span class="body-2 font-weight-bold">(default)</span>
                            </div>
                            <div class="body-2">
                                {{fileConfig.options.default.body}}
                            </div>
                            <div class="body-2">
                                {{fileConfig.options.default.cta}}
                            </div>
                        </div>
                        <v-spacer />
                        <div>
                            <v-btn text @click="uploadFileDialogOpen(fileConfig.id)">Upload</v-btn>
                        </div>
                    </v-row>

                    <v-row class="option-row d-flex align-start" v-if="publisherUploadsDict[fileConfig.id].isUploaded">
                        <v-icon class="px-2 pt-1">{{fileConfig.options.custom.icon}}</v-icon>
                        <div class="text" style="max-width: 500px;">
                            <div class="title">
                                {{fileConfig.options.custom.heading}}
                            </div>
                            <div class="body-2">
                                {{fileConfig.options.custom.body}}
                            </div>
                        </div>
                        <v-spacer></v-spacer>
                        <v-btn
                                icon
                                :loading="isDeleteFileLoading"
                                @click="deleteFile(fileConfig.id)"
                        >
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </v-row>
                </v-col>
            </v-row>
            <v-divider></v-divider>
        </template>


        <v-dialog
                persistent
                v-model="dialogs.uploadFile"
                max-width="600"
        >
            <publisher-file-upload-dialog
                    :file-type="uploadFileType"
                    @cancel="uploadFileDialogCancel"
                    @success="uploadFileDialogSuccess"
            />
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
    import appConfigs from "../../appConfigs";
    import {mapGetters, mapMutations, mapActions} from 'vuex'
    import {api} from "../../api";
    import PublisherFileUploadDialog from "../PublisherFileUpload/PublisherFileUploadDialog";
    import publisherFileUploadConfigs from "../PublisherFileUpload/publisherFileUploadConfigs";


    export default {
        name: "PublisherSetupTab",
        components: {
            PublisherFileUploadDialog,
        },
        props: {},
        data() {
            return {
                dialogs: {
                    uploadFile: false,
                },
                snackbars: {
                    uploadSuccess: false,
                    deleteSuccess: false
                },
                uploadFileType: null,
                fileConfigs: publisherFileUploadConfigs,

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
            uploadFileDialogOpen(fileType, deleteFile) {
                this.uploadFileType = fileType
                this.dialogs.uploadFile = true
            },
            async deleteFile(fileType) {
                this.isDeleteFileLoading = true
                const path = `publisher/${this.publisherId}/${fileType}`
                console.log("delete, using this page", path, this.publisherId)
                await api.delete(path)
                this.isDeleteFileLoading = false
                this.snackbars.deleteSuccess = true

            },
        },
        computed: {
            ...mapGetters([
                "publisherName",
                "publisherId",
                "publisherBigDealCost",
                "publisherUploadsDict",
            ]),
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