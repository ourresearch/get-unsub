<template>
  <v-list-item
      v-if="scenario.saved"
      :key="scenario.id + scenario.saved.name"
      @click="goToScenario"
  >
    <v-list-item-icon>
      <v-icon>mdi-chart-box-outline</v-icon>
    </v-list-item-icon>

    <v-list-item-content>
      <v-row align="center">
        <v-col cols="5">
          <div class="title font-weight-bold">
            {{ scenario.saved.name }}
          </div>
          <div class="body-2">
            {{ scenario.saved.description }}
          </div>
          <div class="body-2" v-if="institutionIsConsortium">
            <v-icon small>mdi-bank-outline</v-icon>
            {{ scenario.memberInstitutions.length }} institutions
          </div>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="2" class="text-right">
          {{ costTotal | currency(publisherCurrencySymbol) }}
        </v-col>
        <v-col cols="1" class="text-right">
          {{ libraryFulfillmentPercent | percent(0) }}
        </v-col>
        <v-col cols="1" class="text-right">
          {{ scenario.saved.subrs.length }}
        </v-col>
        <v-col cols="1"></v-col>
      </v-row>


      <!--            <v-list-item-title-->
      <!--                    class="title font-weight-bold"-->
      <!--                    v-text="scenario.saved.name"-->
      <!--            />-->
      <!--            <v-list-item-subtitle>-->
      <!--                <span>ID: {{scenario.id}}</span>-->
      <!--                &lt;!&ndash;                                    <strong>{{ scenario.saved.subrs.length }}</strong> title-by-title journal subscriptions&ndash;&gt;-->
      <!--            </v-list-item-subtitle>-->
    </v-list-item-content>

    <v-list-item-action>
      <v-menu
          offset-y
          v-if="!publisherIsConsortialProposalSet"
      >
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click.stop="openCopyDialog(scenario)">
            <v-list-item-icon>
              <v-icon>mdi-content-copy</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              Make a copy
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click.stop="openRenameDialog(scenario)">
            <v-list-item-icon>
              <v-icon>mdi-pencil</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              Rename
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click.stop="openDeleteDialog(scenario)">
            <v-list-item-icon>
              <v-icon>mdi-delete-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              Delete
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-list-item-action>

  </v-list-item>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import {costTotal, libraryFulfillmentPercent} from "../../shared/scenarioSummary";

export default {
  name: "PublisherScenarioRow",
  components: {},
  props: {
    scenario: Object,
  },
  data() {
    return {}
  },
  methods: {
    ...mapMutations([
      "openCopyDialog",
      "openCreateDialog",
      "openRenameDialog",
      "openDeleteDialog",
      "openPublisherFileUploadDialog",
    ]),

    async goToScenario() {
      const url = `/i/${this.institutionId}/p/${this.publisherId}/s/${this.scenario.id}`
      await this.$router.push(url)
    },
  },
  computed: {
    ...mapGetters([
      "institutionId",
      "institutionIsConsortium",

      "publisherName",
      "publisherScenarios",
      "publisherScenariosAreAllLoaded",
      "publisherId",
      "publisherBigDealCost",
      "publisherFiles",
      "publisherCurrencySymbol",
      "publisherIsConsortialProposalSet",
    ]),
    costTotal() {
      return costTotal(this.scenario.journals)
    },
    libraryFulfillmentPercent() {
      return libraryFulfillmentPercent(this.scenario.journals);
    }
  },
  created() {
  },
  mounted() {
  },
  watch: {}
}
</script>

<style scoped>

</style>