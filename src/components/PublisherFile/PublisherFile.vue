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
                        @click="clickOption(option)"
                >
                    <v-icon class="px-2 pt-1">
                        {{(option.isSelected) ? 'mdi-radiobox-marked' : 'mdi-radiobox-blank'}}
                    </v-icon>
                    <div class="text">
                        <div class="title">
                            {{option.heading}}
                            <span class="body-2 font-weight-bold" v-if="option.isDefault && !option.isProblem">(default)</span>
                        </div>
                        <div class="body-2">
                            {{(option.isSelected) ? option.selectedText : option.unselectedText}}
                        </div>

                        <div v-if="0">
                            <v-btn
                                    outlined
                                    v-if="!option.isSelected"
                                    @click="uploadFileDialogOpen(config.id)"
                            >
                                Upload
                            </v-btn>
                            <div>
                                <v-btn
                                        outlined
                                        v-if="option.isSelected"
                                        @click="deleteFileDialogOpen(config.id)"
                                >
                                    <v-icon>mdi-delete</v-icon>
                                    Delete
                                </v-btn>
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
    import appConfigs from "../../appConfigs";
    import {mapGetters, mapMutations, mapActions} from 'vuex'
    import {api} from "../../api";
    import PublisherFileUpload from "../PublisherFile/PublisherFileUpload";
    import publisherFileUploadConfigs from "../PublisherFile/publisherFileConfigs";


    export default {
        name: "PublisherSetupTab",
        components: {
            PublisherFileUpload,
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