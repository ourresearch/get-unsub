<template>
  <v-list-item flat class="" style="max-width: 700px;">


    <v-fab-transition>
      <v-list-item-icon v-if="fileStatus==='parsing'" key="parsingIcon">
        <v-icon color="info">mdi-timer-sand</v-icon>
      </v-list-item-icon>
      <v-list-item-icon v-if="fileStatus==='error'" key="errorIcon">
        <v-icon color="error">mdi-close-outline</v-icon>
      </v-list-item-icon>
      <v-list-item-icon v-if="fileStatus==='live'" key="LiveIcon">
        <v-icon color="success">mdi-check-outline</v-icon>
      </v-list-item-icon>
    </v-fab-transition>


    <!------  READY --------->
    <template v-if="fileStatus==='ready'">
      <v-list-item-content>
        <v-file-input
            class="pt-3"
            :label="`Select your ${myDataFile.displayName} file`"
            v-model="fileSelected"
            :disabled="isSyncingToServer"
            @change="errorMsg=''"
            :error-messages="errorMsg"
            dense
        />
      </v-list-item-content>
      <v-list-item-action>
        <v-fab-transition>
          <v-btn
              @click="uploadFile"
              color="primary"
              :loading="isSyncingToServer"
              :disabled="!fileSelected || disabled"
              :fab="!!fileSelected"
              :small="!!fileSelected"
              :icon="!fileSelected"
              :key="fileSelectedKey"
          >
            <v-icon>mdi-upload</v-icon>
          </v-btn>

        </v-fab-transition>
      </v-list-item-action>
    </template>


    <!------  PARSING  --------->
    <template v-if="fileStatus==='parsing'">

      <v-list-item-content>
        <div class="font-weight-bold">
          {{ myDataFile.displayName }} processing...
        </div>
        <div class="body-2">This may take up to ten minutes.</div>
      </v-list-item-content>
      <v-list-item-action>
        <publisher-file-setup-tab-file-delete
            :file-type="fileType"
            disabled
        />
      </v-list-item-action>
      <v-list-item-action>
        <v-btn icon disabled>
          <v-icon>mdi-download</v-icon>
        </v-btn>
      </v-list-item-action>
    </template>


    <!------  ERROR  --------->
    <template v-if="fileStatus==='error'">

      <v-list-item-content>
        <div class="font-weight-bold">
          {{ myDataFile.displayName }} error.
        </div>
        <div class="body-2">
          <strong>{{ myDataFile.parseError }}: </strong> {{ myDataFile.parseErrorDetails }}
        </div>
      </v-list-item-content>
      <v-list-item-action>
        <publisher-file-setup-tab-file-delete
            :file-type="fileType"
        />
      </v-list-item-action>
      <v-list-item-action>
        <v-btn icon disabled>
          <v-icon>mdi-download</v-icon>
        </v-btn>
      </v-list-item-action>
    </template>


    <!------  LIVE  --------->
    <template v-if="fileStatus==='live'">

      <v-list-item-content>
        <div class="font-weight-bold">
          {{ myDataFile.displayName }} uploaded.
        </div>
        <div class="body-2">This data is now live in all this package's scenarios.</div>
      </v-list-item-content>
      <v-list-item-action>
        <publisher-file-setup-tab-file-delete
            :file-type="fileType"
        />
      </v-list-item-action>
      <v-list-item-action>
        <v-btn icon @click="download" :loading="isSyncingToServer">
          <v-icon>mdi-download</v-icon>
        </v-btn>
      </v-list-item-action>
    </template>


  </v-list-item>


</template>

<script>
import _ from "lodash"
import {sleep} from "@/shared/util";
import {makePublisherFileStatus} from "@/shared/publisherFileStatus";

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
      // syncing to server
      isSyncingToServer: false,  // currently trying to change fileStatus on the server


      // information from the server's File object
      // createdDate: "",
      // rowsCount: 0,
      // parseError: "",
      // parseErrorDetails: "",
      // percentParsed: 0, // 0 or 100 unless fileStatus == "parsing"

      // for file selection
      fileSelected: null,
      errorMsg: null,  // only displayed if fileStatus == "ready" and fileSelected == true

      // other
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
    fileStatus() {
      return this.myDataFile.status
    },
    fileApiUrl() {
      return `publisher/${this.publisherId}/${this.myDataFile.serverKey}`
    },
    fileSelectedKey() {
      return (this.fileSelected) ? "yes" : "no"
    },
  },
  methods: {
    ...mapActions([
      "refreshPublisherFileStatus",
    ]),
    ...mapMutations([
      "snackbar",
    ]),
    close() {
      this.errorMsg = null
      this.fileSelected = null
    },
    async download() {
      this.isSyncingToServer = true
      const resp = await api.get(this.fileApiUrl)
      console.log("download api resp rows", resp?.data?.rows)
      const rows = resp?.data?.rows
      const csvExporter = new ExportToCsv({
        useKeysAsHeaders: true,
      });
      csvExporter.generateCsv(rows);
      this.isSyncingToServer = false
      this.snackbar(`${this.myDataFile.displayName} downloaded.`)

    },


    async pollServer() {
      console.log("pollServer")
      await this.refreshPublisherFileStatus(this.fileType)
      while (this.myDataFile.status === "parsing") {
        await this.refreshPublisherFileStatus(this.fileType)
        await sleep(1000)
      }
    },

    async updateFileStatus() {
      const resp = await api.get(this.fileApiUrl + "/status")
      const serverFile = makePublisherFileStatus(resp.data)
      if (serverFile.status !== this.myDataFile.status) {
        console.log("file status is changed!", this.fileType)
        this.myDataFile = serverFile
      }

      console.log("updateFileStatus response", resp.data)
      this.fileStatus = this.fileStatusFromApiData(resp.data)

      this.createdDate = resp.data.created_date
      this.rowsCount = resp.data.rows_count
      this.parseError = resp.data.error
      this.parseErrorDetails = resp.data.error_details
      this.percentParsed = resp.data.percent_parsed
    },

    fileStatusFromApiData(apiData) {

      // if it's done parsing, there are only two possible outcomes:
      if (apiData.is_live) return "live"
      if (!!apiData.error) return "error"

      // must not be done parsing
      if (apiData.is_uploaded) return "parsing"
      return "ready"
    },

    async uploadFile() {
      console.log("uploadFile() file", this.fileSelected)
      this.isSyncingToServer = true

      const fileExtMatch = /\.csv$|\.xsl$|\.xlsx$/.exec(this.fileSelected.name)
      if (!fileExtMatch) {
        this.errorMsg = "Unrecognized file extension"
        this.isSyncingToServer = false
        return
      }

      // this exact format is required by the server
      const fileName = `${this.publisherId}_${this.myDataFile.serverKey}${fileExtMatch[0]}`

      const path = `publisher/${this.publisherId}/sign-s3`
      const urlParamsStr = queryString.stringify({
        filename: fileName
      })
      const url = path + "?" + urlParamsStr
      const resp = await api.get(url)
      const s3Data = resp.data.data
      console.log("got s3 data back", s3Data)


      const postData = new FormData();
      for (let key in s3Data.fields) {
        postData.append(key, s3Data.fields[key]);
      }
      postData.append('file', this.fileSelected);

      try {
        await axios.post(s3Data.url, postData)

        // great, we're up on S3 now.
        // but we need to give our heroku server a chance to get the file from s3
        await sleep(1000)

        // refresh the File from the server so we can show "parsing" status. if we don't do this,
        // UI reverts back to "ready" since the FileStatus obj still says that.
        await this.refreshPublisherFileStatus(this.fileType)

        // now we're fully synced and can finally hide the loading spinner
        this.isSyncingToServer = false
        this.snackbar("File uploaded.")

      } catch (e) {
        this.errorMsg = "Upload failed"
        this.snackbar("File upload failed.")
        return
      }
      this.pollServer()
    },
  },
  async created() {
    console.log("data file from publisher store", this.getPublisherDataFile(this.fileType))
    // this.myDataFile = this.getPublisherDataFile(this.fileType)
  }
}
</script>

<style scoped>

</style>