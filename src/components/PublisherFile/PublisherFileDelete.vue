<template>
    <span>
        <v-btn
                depressed
                small
            @click="open"
            :disabled="disabled"
                v-if="!linkText"
        >
            <v-icon>mdi-delete-outline</v-icon>
            Delete
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
                            :disabled="isLoading"
                            @click="cancel"
                    >
                        Cancel
                    </v-btn>
                    <v-btn
                            depressed
                            color="primary"
                            :loading="isLoading"
                            @click="deleteFile"
                    >
                        Delete
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>



        <v-snackbar
                v-model="snackbars.success"
                :timeout="3000"
                bottom left
        >
            File deleted
            <v-btn dark icon @click="snackbars.success = false">
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
        name: "PublisherFileDelete",
        props: {
            "fileType": String,
            "disabled": Boolean,
            linkText: null,
        },
        data() {
            return {
                isLoading: false, // temporary to silence console errors
                fileSelected: null,
                errorMsg: null,
                dialogIsShowing: false,
                snackbars: {
                    success: false,
                }

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
            open(){
                this.close() // clear everything out
                this.dialogIsShowing = true
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
            async deleteFile() {
                this.isLoading = true
                const kebabCaseFileType = _.kebabCase(this.fileType)
                const path = `publisher/${this.publisherId}/${kebabCaseFileType}`
                console.log("delete, using this page", path, this.publisherId)
                await api.delete(path)

                if (this.fileType === "perpetualAccess") {
                    const path = `publisher/${this.publisherId}/perpetual-access`
                    const data = {default_to_full: true}
                    await api.post(path, data)
                }


                await this.$store.dispatch("refreshPublisher")
                this.isLoading = false
                this.closeSuccessfully()
            },

        }
    }
</script>

<style scoped>

</style>