<template>
  <v-card flat class="">
    <v-card flat class="">


      <v-list dense class="py-0">
        <v-list-item style="height: 20px; padding-top: 20px">
          <v-list-item-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-row align="center" class="caption">
              <v-col cols="5" class="py-0">
                Name
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="1" class="text-right py-0">
                Cost
              </v-col>
              <v-col cols="1" class="text-right py-0">
                Access
              </v-col>
              <v-col cols="1" class="text-right py-0">
                Titles
              </v-col>
              <v-col cols="1" class="py-0"></v-col>
            </v-row>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon disabled></v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card>
    <!--        <v-divider />-->
    <v-list class="py-0">
      <publisher-scenario-row
          v-for="scenario in publisherScenarios"
          :scenario="scenario"
      >
      </publisher-scenario-row>

    </v-list>


    <v-fade-transition v-if="showNewScenarioButton">
      <v-list-item
          @click="openCreateDialog"
          key="add-scenario"
          id="new-scenario-button"
      >
        <v-list-item-avatar size="50">
          <v-btn icon>
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title class="body-2 text--secondary">
            New scenario
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-fade-transition>


  </v-card>


</template>


<script>
import _ from "lodash"
import appConfigs from "../../appConfigs";
import {mapGetters, mapMutations, mapActions} from 'vuex'
import {api} from "../../api";

import PublisherScenarioRow from "./PublisherScenarioRow";


export default {
  name: "PublisherScenariosTab",
  components: {
    PublisherScenarioRow,
  },
  props: {},
  data() {
    return {}
  },
  methods: {
    ...mapMutations([
      "openCreateDialog",
    ]),
  },
  computed: {
    ...mapGetters([
      "institutionId",

      "pkgId",
      "publisherName",
      "publisherScenarios",
      "publisherScenariosAreAllLoaded",
      "publisherId",
      "publisherBigDealCost",
      "publisherFiles",
        "publisherIsConsortialProposalSet",
    ]),
    showNewScenarioButton(){
      return !this.publisherIsConsortialProposalSet
    },
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