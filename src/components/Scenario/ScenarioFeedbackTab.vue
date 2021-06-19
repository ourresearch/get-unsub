<template>
  <v-card flat>
    <p>You can send a copy of scenario to your {{scenarioMemberInstitutions.length}} selected member institutions; they can respond with their own modifications. Download their responses in the Export tab.</p>

    <div class="pa-3 mt-5">

      <v-data-table
          v-model="selectedInstitutions"
          :items="sortedInstitutions"
          :headers="tableHeaders"
          :items-per-page="300"
          show-select
          item-key="institution_id"
      >
      </v-data-table>
      <div v-if="0">
        <v-row>
          <v-col cols="5" class="d-flex">
            <v-checkbox
                @change="multiSelectClick"
                @click="saveDialog"
                hide-details
                value
                v-model="multiSelect"
                :indeterminate="someSelected"
                :disabled="isSaving || isLoading"
                class="py-0 my-0 mr-6 ml-2"
            />
            <span class="ml-12 pl-3">
                                      Title
                                  </span>
          </v-col>
          <v-col cols="2">
            Usage
          </v-col>
          <v-col cols="4">
            Tags
          </v-col>
        </v-row>
        <v-divider class="my-2"/>

        <v-row
            v-for="institution in sortedInstitutions"
            class="px-2"
            :key="institution.package_id"
        >
          <v-col cols="5" class="d-flex">
            <v-checkbox
                hide-details
                class="my-1 py-0 mr-6"
                v-model="includedIds"
                :value="institution.package_id"
                :disabled="isSaving || isLoading"
                @click="saveDialog"
            />
            <span class="title">
                                          {{ institution.institution_name }}
                                      </span>

          </v-col>
          <v-col cols="2">
            {{ institution.usage | round }}
          </v-col>
          <v-col cols="4">
            {{ institution.tags }}
          </v-col>
        </v-row>
      </div>



    </div>


  </v-card>
</template>

<script>
const momentRandom = require('moment-random');

import {mapActions, mapGetters, mapMutations} from 'vuex'
import {api, urlBase} from "../../api";
import {saveScenarioInstitutions} from "../../shared/scenario";

// https://www.joshwcomeau.com/snippets/javascript/random/
const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;


const foo = {
    "num_journals": 1973,
    "usage": 1706306,
    "institution_name": "King's College London",
    "included": true,
    "institution_short_name": "kcl",
    "institution_id": "institution-jisckcl",
    "tags": "Band 2, JUSP ID kcl",
    "package_id": "package-jiscelskcl",
  "sent_date": 12,
  "opened_date": 12,
  "returned_date": 12,
  }

export default {
  name: "ScenarioFeedbackTab",
  components: {},
  props: {
    myRole: String,
    isConsortialFeeder: Boolean,
    publishers: Array,
  },
  data() {
    return {
      isLoading: false,
      isSaving: false,
      institutions: [],
      search: "",
      includedIds: [],
      multiSelectState: "none",
      multiSelect: false,
      someSelected: false,
      selectedInstitutions: [],
      tableHeaders: [
        {value: "institution_name", text: "Institution name"},
        {value: "usage", text: "Usage"},
        {value: "tags", text: "Tags"},
        {value: "sentDate", text: "Sent"},
        {value: "changedDate", text: "Last Changed"},
        {value: "returnedDate", text: "Returned"},
      ]
    }
  },
  methods: {
    ...mapActions([
      "refreshSelectedScenario",
    ]),
    ...mapMutations([
      "snackbar",
      "startGlobalLoading",
      "finishGlobalLoading",
    ]),
    randomDate(){

    },
    multiSelectClick() {
      const myInstitutionPackageIds = this.sortedInstitutions.map(i => i.package_id)
      if (this.includedIds.length > 0) { // anything selected
        this.includedIds = []
      } else { // nothing selected
        this.includedIds = myInstitutionPackageIds
      }
    },
    async openDialog() {
      this.isLoading = true
      this.startGlobalLoading()
      console.log("openDialog getting this url", this.apiUrl)
      try {
        const resp = await api.get(this.apiUrl)
        this.institutions = resp.data.institutions
        console.log("api get member institutions resp", resp)
      } finally {
        this.isLoading = false
        this.finishGlobalLoading()
      }
      this.includedIds = this.institutions.filter(i => i.included).map(i => i.package_id)
      if (this.includedIds.length) {
        this.multiSelect = true
      }
    },
    async saveDialog() {
      this.isSaving = true
      this.startGlobalLoading()

      console.log("POSTing institution IDs to server", this.includedIds)
      const resp = await saveScenarioInstitutions(this.scenarioId, this.includedIds)

      console.log("institution IDs POSTed successfully. refreshing scenario.", resp)

      // refresh our current scenario, and also refresh this row on the publisher page
      await this.refreshSelectedScenario()
      await this.$store.dispatch("refreshPublisherScenario", this.scenarioId)

      console.log("scenario updated w new institutions.", resp)

      this.isSaving = false
      this.finishGlobalLoading()
      this.snackbar("Institutions updated.")
    },
  },
  computed: {
    ...mapGetters([
      "scenarioId",
      "scenarioMemberInstitutions",
    ]),
    csvUrl() {
      let url = `${urlBase}scenario/${this.scenarioId}/export.csv`; // urlBase ends with a slash
      url += "?timestamp=" + `${new Date().getTime()}`
      url += "&jwt=" + localStorage.getItem("token")
      return url
    },
    apiUrl() {
      return `scenario/${this.scenarioId}/member-institutions`
    },
    sortedInstitutions() {
      // let searchStr = (this.search) ? this.search : ""

      const startDateStr = "2021-07-08"
      const withMockDates = this.institutions.map(institution => {
        if (institution.tags.indexOf("Band 1") > -1) {
          const date = this.$moment(startDateStr)
          institution.sentDate = date.format("D MMM, YYYY")

          date.add(random(1, 14), "days")
          institution.changedDate = date.format("D MMM, YYYY")

          date.add(random(0, 2), "days")
          institution.returnedDate =  date.format("D MMM, YYYY")
        }
        // Imperial hasn't sent theirs back yet!
        if (institution.institution_short_name === "icl") {
          institution.changedDate =  undefined
          institution.returnedDate =  undefined

        }



        return institution
      })


      return withMockDates

      // return withMockDates.filter(i => {
      //   return i.institution_name.toLowerCase().indexOf(searchStr.toLowerCase()) > -1
      // })
    },

  },
  created() {
  },
  mounted() {
    this.openDialog()
  },
  watch: {
    includedIds: {
      immediate: false,
      handler: function (to, from) {
        if (to.length === 0) { // none selected
          this.someSelected = false
          this.multiSelect = false
        } else if (to.length === this.institutions.length) { // all selected
          this.someSelected = false
          this.multiSelect = true
        } else { // some selected
          this.someSelected = true
          this.multiSelect = true
        }
      }
    },
  }
}
</script>

<style lang="scss">


</style>