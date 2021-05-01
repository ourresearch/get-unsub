<template>
  <v-list-item flat class="">
    <v-list-item-icon v-if="isUploaded">
      <v-icon color="success">mdi-check-outline</v-icon>
    </v-list-item-icon>
    <v-list-item-content>
      <template v-if="isUploaded">
        <div class="font-weight-bold">
          {{ myDataFile.displayName }} uploaded.
        </div>
        <div class="body-2">This data is now live in all this package's scenarios.</div>
      </template>
      <template v-if="!isUploaded">
        <v-file-input
            class="pt-3"
            :label="`Select your ${myDataFile.displayName} file`"
            v-model="fileSelected"
            :disabled="isLoading"
            @change="errorMsg=''"
            :error-messages="errorMsg"
            dense
        />
      </template>
    </v-list-item-content>
    <v-list-item-action v-if="!isUploaded">
      <v-btn
          @click="uploadFile"
          color="primary"
          :loading="isLoading"
          :disabled="!fileSelected || disabled"
          :text="!fileSelected"
      >
        <v-icon>mdi-upload</v-icon>
        Upload
      </v-btn>
    </v-list-item-action>

    <v-list-item-action v-if="isUploaded">
      <publisher-file-setup-tab-file-delete
          :file-type="fileType"
          :disabled="disabled"
          v-if="isUploaded"
      />
    </v-list-item-action>

    <v-list-item-action v-if="isUploaded">
      <v-btn icon @click="download">
        <!--          <download-csv-->
        <!--              :data="rowsForDownload"-->
        <!--              :labels="findKey"-->
        <!--          >-->
        <v-icon>mdi-download</v-icon>
        <!--          </download-csv>-->
      </v-btn>
    </v-list-item-action>

  </v-list-item>


</template>

<script>
import _ from "lodash"
const queryString = require('query-string');
import axios from "axios";

import {ExportToCsv} from 'export-to-csv'
import {mapGetters, mapMutations, mapActions} from 'vuex'
import {api, toBase64} from "../../api";
import PublisherFileSetupTabFileDelete from "@/components/Publisher/PublisherFileSetupTabFileDelete";
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
    },
    fileApiUrl() {
      return `publisher/${this.publisherId}/${this.myDataFile.serverKey}`
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
    async download() {
      console.log("download!")
      const resp = await api.get(this.fileApiUrl)
      console.log("download api resp rows", resp?.data?.rows)
      // const rows = resp.data.rows.map(row => {
      //   return {
      //     "ISSN": row.issn_l,
      //     "Name": row.journal_name,
      //   }
      // })
      const rows = resp?.data?.rows
      const csvExporter = new ExportToCsv({
        useKeysAsHeaders: true,
      });
      csvExporter.generateCsv(rows);
    },


    async getS3Info() {
      const fileExtMatch = /\.csv$|\.xsl$|\.xslx$/.exec(this.fileSelected.name)
      if (!fileExtMatch.length) {
        this.errorMsg = "Unrecognized file extension"
        return
      }

      // this exact format is required by the server
      const fileName = `${this.publisherId}_${this.myDataFile.serverKey}${fileExtMatch[0]}`

      const urlBase = `/publisher/${this.publisherId}/sign-s3`
      const urlParamsStr =  queryString.stringify({
        filetype: "text/text",
        filename: fileName,
      })
      const url = urlBase + "?" + urlParamsStr
      const resp = await api.get(url)
      console.log("getUploadToken resp", resp)
      return resp.data.data
    },

    // from https://devcenter.heroku.com/articles/s3-upload-python
    async uploadFileToS3(file, s3Data){
      const postData = new FormData();
      for(let key in s3Data.fields){

        postData.append(key, s3Data.fields[key]);
      }
      postData.append('file', file);

      const resp = await axios.post(s3Data.url, postData)
      console.log("amazon upload successful", resp)
    },


    async uploadFile() {
      console.log("uploadFile() file", this.fileSelected)
      const s3Info = await this.getS3Info()
      await this.uploadFileToS3(this.fileSelected, s3Info)


      return




      this.isLoading = true

      const data = {
        file: await toBase64(this.fileSelected),
        name: this.fileSelected.name,
        type: this.fileSelected.type,
        size: this.fileSelected.size,
      }

      try {





        await api.postFile(this.fileApiUrl, data)
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