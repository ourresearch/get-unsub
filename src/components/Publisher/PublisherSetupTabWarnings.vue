<template>
  <v-card flat class="">
    <div class="pt-2 px-12">
      <div class="text-h6 warning--text">Active warnings ({{ publisherWarningsActive.length }})</div>
      <v-list>
        <v-list-item
            v-for="warning in publisherWarningsActive"
            :key="'displayed-' + warning.id"
        >
          <v-list-item-icon>
            <v-icon color="warning">mdi-alert-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <div class="font-weight-bold">
              {{ warning.displayName }}
            </div>
            <div class="body-2" v-html="warning.msg"></div>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn
                text
                :disabled="isLoading"
                @click="setWarningIsDismissed(warning.id, true)"
            >
              mute
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <div v-if="!publisherWarningsActive.length" class="pa-3 grey--text">
        There are no muted warnings.
      </div>

      <div class="text-h6 mt-10">Muted warnings ({{ publisherWarningsDismissed.length }})</div>
      <v-list>
        <v-list-item
            v-for="warning in publisherWarningsDismissed"
            :key="'not-displayed-' + warning.id"
        >
          <v-list-item-icon>
            <v-icon>mdi-alert-remove-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <div class="font-weight-bold">
              {{ warning.displayName }}
            </div>
            <div class="body-2" v-html="warning.msg"></div>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn
                text
                :disabled="isLoading"
                @click="setWarningIsDismissed(warning.id, false)"
            >
              unmute
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <div v-if="!publisherWarningsDismissed.length" class="pa-3 grey--text">
        There are no muted warnings.
      </div>

    </div>
  </v-card>


</template>


<script>
import _ from "lodash"
import {mapGetters, mapMutations, mapActions} from 'vuex'
import PublisherSetupTabFileUpload from "./PublisherSetupTabFile";
import {api} from "@/api";


export default {
  name: "PublisherSetupTabWarnings",
  components: {
    PublisherSetupTabFileUpload,
  },
  props: {},
  data() {
    return {
      isLoading: false
    }
  },
  methods: {
    async muteWarning(id) {
      await this.setWarningIsDismissed(id, true)

    },
    async unmuteWarning(id) {
      await this.setWarningIsDismissed(id, false)
    },
    async setWarningIsDismissed(id, newVal) {
      console.log("editWarning()", id, newVal)
      this.isLoading = true
      this.$store.commit("startGlobalLoading")
      const path = `publisher/${this.publisherId}`
      const postData = {
        warnings: [
          {id: _.snakeCase(id),  is_dismissed: newVal,},
        ]
      }
      const snackbarMsg = (newVal) ? "Warning muted." : "Warning unmuted."
      try {
        await api.postFile(path, postData)
        await this.$store.dispatch("refreshPublisher")
        this.$store.commit("snackbar", snackbarMsg)
      } catch (e) {
        console.log("there was an error.")
      } finally {
        this.isLoading = false
        this.$store.commit("finishGlobalLoading")
      }
    }
  },
  computed: {
    ...mapGetters([
      "publisherId",
      "publisherWarningsDismissed",
      "publisherWarningsActive",
    ]),
  },
  created() {
  },
  mounted() {

  },
  watch: {}
}
</script>

<style lang="scss">


</style>