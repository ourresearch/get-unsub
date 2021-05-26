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
      <v-list-item-action class="align-self-start">
        <publisher-file-delete
            :file-type="fileType"
            disabled
        />
      </v-list-item-action>
      <v-list-item-action class="align-self-start">
        <v-btn icon disabled>
          <v-icon>mdi-download</v-icon>
        </v-btn>
      </v-list-item-action>
    </template>


    <!------  ERROR  --------->
    <template v-if="fileStatus==='error'">

      <v-list-item-content class="">
        <div class="font-weight-bold">
          {{ myDataFile.displayName }} uploaded but has error!
        </div>
        <div class="body-2">
          There was something wrong with the file, and it can't be used. Please delete it, correct the error, and try
          again. This was the error message that was generated:
          <div class="error--text mt-2">
            <code>
              <strong>{{ myDataFile.parseError }}: </strong> {{ myDataFile.parseErrorDetails }}

            </code>

          </div>
        </div>
      </v-list-item-content>
      <v-list-item-action class="align-self-start">
        <publisher-file-delete
            :file-type="fileType"
        />
      </v-list-item-action>
    </template>


    <!------  LIVE  --------->
    <template v-if="fileStatus==='live'">

      <v-list-item-content>
        <div class="font-weight-bold">
          <span v-if="myDataFile.id == 'pricePublic' && publisherCurrency === 'GBP'">UK</span>
          <span v-if="myDataFile.id == 'pricePublic' && publisherCurrency === 'USD'">US</span>
          {{ myDataFile.displayName }} uploaded.
        </div>
        <div class="body-2">
          We extracted <strong>{{ myDataFile.rowsCount }}</strong> rows of useful data. This data is now in use for the
          scenarios belonging to this package.
        </div>
      </v-list-item-content>
      <v-list-item-action class="align-self-start">
        <publisher-file-delete
            :file-type="fileType"
            v-if="!disabled"
        />
      </v-list-item-action>
      <v-list-item-action class="align-self-start">
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
import axios from "axios";
import {ExportToCsv} from 'export-to-csv'
import {mapGetters, mapMutations, mapActions} from 'vuex'
import {api, toBase64} from "../../api";
import Publisher from "@/views/Publisher";
import PublisherFileDelete from "@/components/PulisherFile/PublisherFileDelete";

const queryString = require('query-string');

export default {
  name: "PublisherFile",
  props: {
    "fileType": String,
    "disabled": Boolean,
  },
  components: {
    Publisher,
    PublisherFileDelete,
  },
  data() {

    return {
      // syncing to server
      isSyncingToServer: false,  // currently trying to change fileStatus on the server
      
      // sometimes we want to pretend the file is parsing, even though it's not, while 
      // we are waiting for the server to sync various things.
      pretendThatFileIsParsing: false,

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
        "publisherCurrency",
    ]),
    myDataFile() {
      return this.getPublisherDataFile(this.fileType)
    },
    fileStatus() {
      return (this.pretendThatFileIsParsing) ? "parsing" :  this.myDataFile.status
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
      "refreshPublisher",
    ]),
    ...mapMutations([
      "snackbar",
    ]),
    close() {
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
      console.log("this.myDataFile.status", this.myDataFile.status)
        await this.refreshPublisherFileStatus(this.fileType)
        await sleep(1000)
      }
    },


    // fileStatusFromApiData(apiData) {
    //
    //   // if it's done parsing, there are only two possible outcomes:
    //   if (apiData.is_live) return "live"
    //   if (!!apiData.error) return "error"
    //
    //   // must not be done parsing
    //   if (apiData.is_uploaded) return "parsing"
    //   return "ready"
    // },

    async uploadFile() {
      console.log("uploadFile() file", this.fileSelected)
      this.isSyncingToServer = true

      const fileExtMatch = /\.csv$|\.xls$|\.xlsx$/.exec(this.fileSelected.name)
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
        this.pretendThatFileIsParsing = true

        // great, we're up on S3 now.
        // but we need to give our heroku server a chance to get the file from s3
        await sleep(1000)

        // refresh the File from the server so we can show "parsing" status. if we don't do this,
        // UI reverts back to "ready" since the FileStatus obj still says that.
        await this.refreshPublisherFileStatus(this.fileType)

        // now we're fully synced and can finally hide the loading spinner
        this.isSyncingToServer = false


      } catch (e) {
        this.errorMsg = "Upload failed"
        this.snackbar("File upload failed.")
        return
      }
      await this.pollServer()

      await this.refreshPublisher()
      this.pretendThatFileIsParsing = false
      this.snackbar("File uploaded.", "success")


    },
  },
  async created() {
    // this.myDataFile = this.getPublisherDataFile(this.fileType)
    if (this.myDataFile.status === "parsing") {
      this.pretendThatFileIsParsing = true
      await this.pollServer()
      await this.refreshPublisher()
      this.pretendThatFileIsParsing = false
      this.snackbar("File uploaded.", "success")
    }
  }
}
</script>

<style scoped>

</style>