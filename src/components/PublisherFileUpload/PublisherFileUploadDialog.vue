<template>
    <div>
        <v-dialog v-model="isOpen" max-width="400">
            <v-card v-if="isOpen">
                <v-card-title class="headline">
                    <div>
                        Upload
                        <span v-if="publisherFileUploadDialogFileType==='counter'"> COUNTER file</span>
                        <span v-if="publisherFileUploadDialogFileType==='prices'"> Custom journals prices</span>
                        <span v-if="publisherFileUploadDialogFileType==='perpetual-access'"> Perpetual access dates</span>
                    </div>
                </v-card-title>
                <v-card-text>
                    <v-alert type="info" text icon="mdi-information-outline">
                        <div v-if="publisherFileUploadDialogFileType==='prices'">
                            We'll be launching self-serve editing of custom pricelists soon. In the meantime, please
                            email us your custom pricelist, in spreadsheet format. The spreadsheet just needs two
                            columns: <code>ISSN</code> and <code>Price</code>.
                        </div>
                        <div v-if="publisherFileUploadDialogFileType==='perpetual-access'">
                            We'll be launching self-serve editing of custom perpetual access dates soon. In the
                            meantime, please email us your custom perpetual access date ranges, in spreadsheet format.
                            The spreadsheet just needs three columns: <code>ISSN</code>, <code>Start date</code>, and
                            <code>End date</code>.
                        </div>
                    </v-alert>
                </v-card-text>


                <v-card-text v-if="0">
                    <v-alert
                            :value="!!errorMsg && !!fileSelected"
                            type="error"
                            icon="mdi-alert"
                            transition="slide-x-transition"
                    >
                        <span class="body-2" v-html="errorMsg"/>
                    </v-alert>
                    <div class="descr">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                        voluptate velit esse cillum dolore eu fugiat nulla pariatur
                    </div>
                    <div>
                        <v-file-input
                                class="my-5"
                                label="Select your file"
                                show-size
                                counter
                                v-model="fileSelected"
                                :disabled="isUploadFileLoading"
                                @change="errorMsg=''"
                        />
                    </div>
                </v-card-text>


                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                            :disabled="isUploadFileLoading"
                            depressed
                            @click="closePublisherFileUploadDialog"
                    >
                        <v-icon>mdi-close</v-icon>
                        Cancel
                    </v-btn>
                    <v-btn
                            depressed
                            color="primary"
                            @click="closePublisherFileUploadDialog"
                            href="mailto:team@ourresearch.org"
                            target="_blank"
                    >
                        <v-icon>mdi-email-outline</v-icon>
                        Email file
                    </v-btn>


                    <v-btn
                            v-if="0"
                            depressed
                            @click="uploadFile"
                            color="primary"
                            :loading="isUploadFileLoading"
                            :disabled="isUploadFileLoading || !fileSelected"
                    >
                        <v-icon>mdi-upload</v-icon>
                        Upload
                    </v-btn>

                </v-card-actions>

            </v-card>


        </v-dialog>


        <v-snackbar
                v-if="false"
                v-model="isDeleteSnackbarOpen"
                :timeout="3000"
                bottom left
        >
            Scenario deleted
            <v-btn dark icon @click="isDeleteSnackbarOpen = false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-snackbar>


    </div>
</template>

<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex'

    export default {
        name: "PublisherFileUploadDialog",
        props: {
        },
        data() {
            return {
                isUploadFileLoading: false, // temporary to silence console errors
            }
        },
        computed: {
            ...mapGetters([
                "publisherFileUploadDialogIsOpen",
                "publisherFileUploadDialogFileType",
                "publisherFileUploadDialogFileSelected",
                "publisherFileUploadDialogIsLoading",
                "publisherFileUploadDialogErrorMsg",
            ]),
            isOpen: {
                get: function(){
                    return this.$store.getters.publisherFileUploadDialogIsOpen
                },
                set: function(){
                    // from within the component, you can only close, not open, so only need to handle that.
                    this.$store.commit("closePublisherFileUploadDialog")
                }
            }
        },
        methods: {
            ...mapActions([]),
            ...mapMutations([
                "closePublisherFileUploadDialog",
            ]),

        }
    }
</script>

<style scoped>

</style>