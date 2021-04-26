<template>
    <span>
        <v-btn
            @click="open"
            :disabled="disabled"
        >
            <v-icon>mdi-upload</v-icon>
            Upload
        </v-btn>

        <v-dialog
            persistent
            v-model="dialogIsShowing"
            max-width="600"
        >
            <v-card>
                <v-card-title>
                    Upload {{myDataFile.displayName}}
                </v-card-title>
                <div class="pa-3">
                    Upload stuff here
                </div>
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
                        @click="uploadFile"
                    >
                        Upload
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
  name: "PublisherFileSetupTabFileUpload",
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
    myDataFile() {
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

    async uploadFile() {
      console.log("uploadFile() file", this.fileSelected)
      this.isLoading = true
      const path = `publisher/${this.publisherId}/${this.myDataFile.serverKey}`

      // const path = `publisher/${this.publisherId}/counter/trj4`
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
        this.errorMsg = e?.response?.data?.message?.message ?? "Sorry, we encountered an unknown error!"
      } finally {
        this.isLoading = false
        this.closeSuccessfully()
      }
    },
  },


}
</script>

<style scoped>

</style>