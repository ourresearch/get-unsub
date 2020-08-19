<template>
    <span>
        <v-btn class="mt-4" v-if="!linkText" :color="color" small depressed @click="open">
            <v-icon>mdi-upload</v-icon>
<!--            <v-icon>mdi-file-upload-outline</v-icon>-->
<!--            <v-icon>mdi-table-arrow-up</v-icon>-->
<!--            <v-icon>mdi-cloud-upload-outline</v-icon>-->
            Upload
        </v-btn>
        <a
                v-if="linkText"
                @click="open"
        >
            {{linkText}}
        </a>

        <v-dialog
                persistent
                v-model="dialogIsShowing"
                max-width="600"
        >

            <v-card>
                <v-card-title class="headline">
                    <div>
                        Upload
                        <span v-if="fileType==='counter'">
                            <span class="date" v-if="publisherPublisher === 'Wiley'">2018</span>
                            <span class="date" v-if="publisherPublisher === 'Elsevier'">2019</span>
                            COUNTER JR1 Report
                        </span>
                        <span v-if="fileType==='price'"> Custom journals prices</span>
                        <span v-if="fileType==='perpetualAccess'"> Perpetual access dates</span>
                    </div>
                </v-card-title>
                <v-card-text>
                    <div v-if="fileType==='price'">
                        Upload your title-level pricelist as a spreadsheet with two columns:<strong>ISSN</strong> and
                        <strong>Price</strong>.


                    </div>
                    <div v-if="fileType==='perpetualAccess'">
                        Upload your perpetual access dates as a spreadsheet with three columns: <strong>ISSN</strong>,
                        <strong>Start date</strong>, and
                        <strong>End date</strong>.
                    </div>
                    <div v-if="0 && fileType==='counter'">
                        Upload your
                        <span class="date" v-if="publisherPublisher === 'Wiley'">2018</span>
                        <span class="date" v-if="publisherPublisher === 'Elsevier'">2019</span>
                        COUNTER JR1 report.
                    </div>
                    <div>
                        <div class="body-2 mt-4">
                            Tips:
                        </div>
                        <ul>
                            <li>
                                    Accepted formats: .csv, .xlsx, .xls
                            </li>
                            <li v-if="fileType === 'counter'">
                                Only COUNTER 4 JR1 reports are supported; COUNTER 5 support launches September 2020.
                            </li>
                            <li v-if="fileType === 'counter' && publisherPublisher === 'Wiley'">
                                    Unfortunately Wiley doesn't generate COUNTER 4 JR1s for 2019 data, so we need to use 2018 for now. However, forecast results are generally about the same.
                            </li>
                            <li v-if="fileType === 'price'">
                                 Prices must be in USD.
                            </li>
                            <li v-if="fileType === 'perpetualAccess'">
                                 You can ignore any dates before 10yrs ago, as these are not
                            considered in the forecasting model.
                            </li>
                            <li v-if="fileType === 'perpetualAccess'">
                                Leave end_date blank for journals where perpetual access is ongoing
                            </li>
                        </ul>
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
                                :error-messages="errorMsg"
                        />
                    </div>
                </v-card-text>




                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                            :disabled="isUploadFileLoading"
                            depressed
                            @click="cancel"
                    >
                        <v-icon>mdi-close</v-icon>
                        Cancel
                    </v-btn>
                    <v-btn
                            v-if="0"
                            depressed
                            color="primary"
                            @click="close"
                            href="mailto:team@ourresearch.org"
                            target="_blank"
                    >
                        <v-icon>mdi-email-outline</v-icon>
                        Email file
                    </v-btn>


                    <v-btn
                            depressed
                            @click="uploadFile"
                            color="primary"
                            :loading="isUploadFileLoading"
                            :disabled="!fileSelected"
                    >
                        <v-icon>mdi-upload</v-icon>
                        Upload
                    </v-btn>

                </v-card-actions>

            </v-card>
        </v-dialog>



        <v-snackbar
                v-model="snackbars.success"
                :timeout="3000"
                bottom left
        >
            File uploaded
            <v-btn dark icon @click="snackbars.success = false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-snackbar>

        <v-snackbar v-model="snackbars.demoNotAllowed" bottom>
            Demo accounts can't upload files
            <v-btn dark icon @click="snackbars.demoNotAllowed = false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-snackbar>



    </span>








</template>

<script>
    import _ from "lodash"
    import {mapGetters, mapMutations, mapActions} from 'vuex'
    import {api, toBase64} from "../../api";


    export default {
        name: "PublisherFileUpload",
        props: {
            "fileType": String,
            "disabled": Boolean,
            linkText: String,
            color: String,
        },
        data() {
            return {
                isUploadFileLoading: false, // temporary to silence console errors
                fileSelected: null,
                errorMsg: null,
                dialogIsShowing: false,
                snackbars: {
                    success: false,
                    demoNotAllowed: false,
                }

            }
        },
        computed: {
            ...mapGetters([
                "publisherId",
                "institutionIsDemo",
                "publisherPublisher"
            ]),

        },
        methods: {
            ...mapActions([]),
            ...mapMutations([
            ]),
            open(){
                this.close() // clear everything out
                if (this.institutionIsDemo){
                    this.snackbars.demoNotAllowed = true
                }
                else {
                    this.dialogIsShowing = true
                }
            },
            close(){
                this.errorMsg = null
                this.fileSelected = null
                this.dialogIsShowing = false
            },
            cancel(){
                this.close()
            },
            closeSuccessfully(){
                this.close()
                this.snackbars.success = true
            },
            async uploadFile() {
                console.log("uploadFile() file", this.fileSelected)
                this.isUploadFileLoading = true
                const snakeCaseFileType = _.kebabCase(this.fileType)
                const path = `publisher/${this.publisherId}/${snakeCaseFileType}`
                const data = {
                    file: await toBase64(this.fileSelected),
                    name: this.fileSelected.name,
                    type: this.fileSelected.type,
                    size: this.fileSelected.size,
                }
                try {
                    await api.postFile(path, data)
                    await this.$store.dispatch("refreshPublisher")
                    this.closeSuccessfully()
                } catch (e) {
                    this.errorMsg = (e.response && e.response.data && e.response.data.message) ?
                        e.response.data.message.message :
                        "Sorry, we encountered an unknown error!"
                } finally {
                    this.isUploadFileLoading = false
                }
            },

        }
    }
</script>

<style scoped>

</style>