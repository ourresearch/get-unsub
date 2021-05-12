<template>
    <span>
        <v-btn
            @click="open"
            :disabled="disabled"
            icon
        >
            <v-icon>mdi-delete-outline</v-icon>
        </v-btn>

        <v-dialog
            persistent
            v-model="dialogIsShowing"
            max-width="300"
        >
            <v-card>
                <v-card-title>
                    Delete file
                </v-card-title>
                <v-card-text>
                    Are you sure you want to delete this file?
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

    </span>


</template>

<script>
import _ from "lodash"
import {mapGetters, mapMutations, mapActions} from 'vuex'
import {api, toBase64} from "../../api";


export default {
  name: "PublisherFileSetupTabFileDelete",
  props: {
    "fileType": String,
    "disabled": Boolean,
  },
  data() {
    return {
      isLoading: false, // temporary to silence console errors
      fileSelected: null,
      errorMsg: null,
      dialogIsShowing: false,

    }
  },
  computed: {
    ...mapGetters([
      "publisherId",
      "institutionIsDemo",
      "getPublisherDataFile",
    ]),
    myDataFile(){
       return this.getPublisherDataFile(this.fileType)
    },
  },
  methods: {
    ...mapActions([]),
    ...mapMutations([
      "snackbar",
    ]),
    open() {
      this.close() // clear everything out
      if (this.institutionIsDemo) {
        this.snackbar("Demo accounts can't delete data.")
      } else {
        this.dialogIsShowing = true
      }
    },
    close() {
      this.errorMsg = null
      this.fileSelected = null
      this.dialogIsShowing = false
    },
    cancel() {
      this.close()
    },
    closeSuccessfully() {
      this.close()
      this.snackbar("File deleted.")
    },
    async deleteFile() {
      this.isLoading = true
      const path = `publisher/${this.publisherId}/${this.myDataFile.serverKey}`
      await api.delete(path)

      await this.$store.dispatch("refreshPublisher")
      this.isLoading = false
      this.closeSuccessfully()
    },

  }
}
</script>

<style scoped>

</style>