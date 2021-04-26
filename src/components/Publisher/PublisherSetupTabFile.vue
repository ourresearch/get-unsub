<template>
  <v-list-item flat class="py-2">
    <v-list-item-icon v-if="isUploaded">
      <v-icon color="success">mdi-table-check</v-icon>
    </v-list-item-icon>
    <v-list-item-content>
      <template v-if="isUploaded">
        <div class="font-weight-bold green--text">
          {{ myDataFile.displayName }} uploaded.
        </div>
        <div class="body-2 green--text">This data is now live in all this package's scenarios.</div>
      </template>
      <template v-if="!isUploaded">
        <v-file-input
            :label="`Select your ${myDataFile.displayName} file`"
            show-size
            counter
            v-model="fileSelected"
            :disabled="isLoading"
            @change="errorMsg=''"
            :error-messages="errorMsg"
            dense
        />
      </template>
    </v-list-item-content>
    <v-list-item-action>
      <publisher-file-setup-tab-file-delete
          :file-type="fileType"
          v-if="isUploaded"
      />
      <v-btn
          @click="uploadFile"
          color="primary"
          :loading="isLoading"
          :disabled="!fileSelected"
          v-if="!isUploaded"
          text
      >
        <v-icon>mdi-upload</v-icon>
        Upload
      </v-btn>

    </v-list-item-action>

  </v-list-item>


</template>

<script>
import _ from "lodash"
import {mapGetters, mapMutations, mapActions} from 'vuex'
import {api, toBase64} from "../../api";
import PublisherFileSetupTabFileDelete from "@/components/Publisher/PublisherFileSetupTabFileDelete";
import PublisherFileSetupTabFileUpload from "@/components/Publisher/PublisherFileSetupTabFileUpload";
import Publisher from "@/views/Publisher";


export default {
  name: "PublisherFileUpload",
  props: {
    "fileType": String,
    "disabled": Boolean,
  },
  components: {
    Publisher,
    PublisherFileSetupTabFileDelete,
    PublisherFileSetupTabFileUpload,
  },
  data() {
    return {
      isLoading: false, // temporary to silence console errors
      fileSelected: null,
      errorMsg: null,
      isDialogShowing: false,

    }
  },
  computed: {
    ...mapGetters([
      "publisherId",
      "institutionIsDemo",
      "publisherPublisher",
      "getPublisherDataFile",
    ]),
    myDataFile() {
      return this.getPublisherDataFile(this.fileType)
    },
    isUploaded() {
      return this.myDataFile.uploaded
    }


  },
  methods: {
    ...mapActions([]),
    ...mapMutations([
      "snackbar",
    ]),
    close() {
      this.errorMsg = null
      this.fileSelected = null
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
      }
    },
  },
  mounted() {

  }
}
</script>

<style scoped>

</style>