<template>
  <v-card flat class="">
    <div class="pa-3">
      <div class="text-h6">Active warnings</div>
      <v-list>
        <v-list-item
          v-for="warning in publisherWarningsActive"
        >
          <v-list-item-icon>
            <v-icon>mdi-alert-outline</v-icon>
<!--            <v-icon>mdi-alert-remove-outline</v-icon>-->
          </v-list-item-icon>
          <v-list-item-title>
            {{warning.displayName}}
          </v-list-item-title>
        </v-list-item>
      </v-list>

      <pre>{{ publisherWarnings }}</pre>
    </div>
  </v-card>


</template>


<script>
import _ from "lodash"
import {mapGetters, mapMutations, mapActions} from 'vuex'
import PublisherSetupTabFileUpload from "./PublisherSetupTabFileUpload";


export default {
  name: "PublisherSetupTabWarnings",
  components: {
    PublisherSetupTabFileUpload,
  },
  props: {},
  data() {
    return {}
  },
  methods: {},
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