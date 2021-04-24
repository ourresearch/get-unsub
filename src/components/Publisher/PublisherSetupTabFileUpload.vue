<template>
        <v-card flat class="pa-6">
            <v-row>
                <v-col cols="1">
                    <v-icon>mdi-check</v-icon>
                </v-col>
                <v-col cols="5">
                    {{fileType}}
                </v-col>
                <v-col cols="4">
                    <v-file-input
                            label="Select your file"
                            show-size
                            counter
                            v-model="fileSelected"
                            :disabled="isUploadFileLoading"
                            @change="errorMsg=''"
                            :error-messages="errorMsg"
                    />
                </v-col>
                <v-col cols="2">
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
                </v-col>
            </v-row>
        </v-card>




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
        },
        data() {
            return {
                isUploadFileLoading: false, // temporary to silence console errors
                fileSelected: null,
                errorMsg: null,
                dialogIsShowing: false,

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
                "snackbar",
            ]),
            close(){
                this.errorMsg = null
                this.fileSelected = null
                this.dialogIsShowing = false
            },
            async uploadFile() {
                console.log("uploadFile() file", this.fileSelected)
                // console.log("HI HEATHER :)")
                this.isUploadFileLoading = true
                const snakeCaseFileType = _.kebabCase(this.fileType)
                // const path = `publisher/${this.publisherId}/${snakeCaseFileType}`
                // const path = `publisher/${this.publisherId}/${this.fileType}`

                const path = `publisher/${this.publisherId}/counter/trj4`
                // const path = `publisher/${this.publisherId}/counter5_trj1`
                const data = {
                    file: await toBase64(this.fileSelected),
                    name: this.fileSelected.name,
                    type: this.fileSelected.type,
                    size: this.fileSelected.size,
                }
                try {
                    await api.postFile(path, data)
                    await this.$store.dispatch("refreshPublisher")
                    this.snackbar("File uploaded.")
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