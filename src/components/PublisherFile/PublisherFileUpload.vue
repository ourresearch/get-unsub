<template>
            <v-card>
                <v-card-title class="headline">
                    <div>
                        Upload
                        <span v-if="fileType==='counter'"> COUNTER file</span>
                        <span v-if="fileType==='prices'"> Custom journals prices</span>
                        <span v-if="fileType==='perpetualAccess'"> Perpetual access dates</span>
                    </div>
                </v-card-title>
                <v-card-text>
                    <div v-if="fileType==='prices'">
                        Upload your title-level pricelist as a spreadsheet with two columns:<code>ISSN</code> and
                        <code>Price</code>.
                    </div>
                    <div v-if="fileType==='perpetualAccess'">
                        Upload your perpetual access dates as a spreadsheet with three columns: <code>ISSN</code>,
                        <code>Start date</code>, and
                        <code>End date</code>. You can ignore any dates before 10yrs ago, as these are not
                        considered in the forecasting model.
                    </div>
                    <div v-if="fileType==='counter'">
                        Upload your COUNTER JR1 file:
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






</template>

<script>
    import _ from "lodash"
    import {mapGetters, mapMutations, mapActions} from 'vuex'
    import {api, toBase64} from "../../api";


    export default {
        name: "PublisherFileUploadDialog",
        props: {
            "fileType": String,
        },
        data() {
            return {
                isUploadFileLoading: false, // temporary to silence console errors
                fileSelected: null,
                errorMsg: null,

            }
        },
        computed: {
            ...mapGetters([
                "publisherId",
            ]),
        },
        methods: {
            ...mapActions([]),
            ...mapMutations([
            ]),
            close(){
                this.errorMsg = null
                this.fileSelected = null
            },
            cancel(){
                this.close()
                this.$emit("cancel")
            },
            closeSuccessfully(){
                this.close()
                this.$emit("success")
            },
            async uploadFile() {
                console.log("uploadFile() file", this.fileSelected)
                this.isUploadFileLoading = true
                const snakeCaseFileType = _.snakeCase(this.fileType)
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
                        e.response.data.message :
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