<template>
  <v-card flat class="">
    <div class="pa-3">
      <div class="text-h6">Active warnings ({{ publisherWarningsActive.length }})</div>
      <v-list>
        <v-list-item
            v-for="warning in publisherWarningsActive"
            :key="'displayed-' + warning.id"
        >
          <v-list-item-icon>
            <v-icon>mdi-alert-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>

            <div>
              {{ warning.displayName }}
            </div>
            <div class="body-2" v-html="warning.msg"></div>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn
                text
                @click="muteWarning(warning.id)"
            >
              mute
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <div v-if="!publisherWarningsActive.length" class="pa-3 grey--text">
        There are no muted warnings.
      </div>

      <div class="text-h6">Muted warnings ({{ publisherWarningsDismissed.length }})</div>
      <v-list>
        <v-list-item
            v-for="warning in publisherWarningsDismissed"
            :key="'not-displayed-' + warning.id"
        >
          <v-list-item-icon>
            <v-icon>mdi-alert-remove-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-title>
            {{ warning.displayName }}
          </v-list-item-title>
          <v-list-item-action>
            <v-btn
                text
                @click="muteWarning(warning.id)"
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


export default {
  name: "PublisherSetupTabWarnings",
  components: {
    PublisherSetupTabFileUpload,
  },
  props: {},
  data() {
    return {}
  },
  methods: {
    muteWarning(id) {
      console.log("muteWarning()", id)
    },
    unmuteWarning(id) {
      console.log("unmuteWarning()", id)
    },
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