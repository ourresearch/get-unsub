<template>
  <v-card flat>
    <v-card-title class="text-h5" :class="{'warning--text': !scenarioMemberInstitutions.length}">
      <div>
        Institutions
        <span class="body-2 ml-2">({{ scenarioMemberInstitutions.length }})</span>
      </div>
      <v-spacer/>
      <div class="mr-3">
        <v-text-field
            class="d-none"
            hide-details
            clearable
            outlined
            dense
            label="Search institutions"
            v-model="search"
            append-icon="mdi-magnify"
            full-width
        />
      </div>
    </v-card-title>
    <div v-if="!scenarioMemberInstitutions.length" class="ml-5 body-1 font-weight-bold warning--text">
      <v-icon color="warning">
        mdi-alert-outline
      </v-icon>
      Please select at least one institution.
    </div>

    <div class="d-flex mb-6">
      <v-btn dark color="primary" class="mr-2">send</v-btn>
      <v-btn dark color="primary" class="mr-2" @click="openIncludeExcludeDialog">include/exclude</v-btn>
      <v-spacer/>
      <v-text-field
          hide-details
          clearable
          outlined
          dense
          label="Search by name or tags"
          v-model="search"
          append-icon="mdi-magnify"
          full-width
      />
    </div>

    <div>
      <v-data-table
          v-model="selectedInstitutions"
          :items="sortedInstitutions"
          :headers="tableHeaders"
          :items-per-page="300"
          show-select
          item-key="institution_id"
          disable
      >
      </v-data-table>
    </div>






<v-dialog v-model="dialogs.includeExclude" max-width="400">
            <v-card>
              <v-card-title>
                  <v-icon left>mdi-bank-outline</v-icon>
                  Include/exclude members
              </v-card-title>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn depressed
                           @click="dialogs.includeExclude = false"
                    >
                        Cancel
                    </v-btn>
                    <v-btn depressed
                           @click="createPublisher"
                           color="primary"
                           :loading="newPublisherLoading"
                           :disabled="institutionIsDemo"

                    >
                        OK
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

  </v-card>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from 'vuex'
import {api, urlBase} from "../../api";
import {saveScenarioInstitutions} from "../../shared/scenario";


export default {
  name: "ScenarioInstitutionsTab",
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
      dialogs: {
        send: false,
        includeExclude: false,
      },
      tableHeaders: [
        {value: "included", text: "Included"},
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
    multiSelectClick() {
      const myInstitutionPackageIds = this.sortedInstitutions.map(i => i.package_id)
      if (this.includedIds.length > 0) { // anything selected
        this.includedIds = []
      } else { // nothing selected
        this.includedIds = myInstitutionPackageIds
      }
    },
    openIncludeExcludeDialog(){
      this.dialogs.includeExclude = true
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
      this.selectedInstitutions = this.institutions.filter(i => i.included)
    },
    async saveDialog() {
      this.isSaving = true
      this.startGlobalLoading()

      console.log("POSTing institution IDs to server", this.selectedInstitutions)
      const resp = await saveScenarioInstitutions(this.scenarioId, this.selectedInstitutions)

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
      let searchStr = (this.search) ? this.search.toLowerCase() : ""
      return this.institutions.filter(i => {
        return i.institution_name.toLowerCase().indexOf(searchStr) > -1 ||
            i.tags.toLowerCase().indexOf(searchStr) > -1
      })
    },

  },
  created() {
  },
  mounted() {
    this.openDialog()
  },
  watch: {
    // includedIds: {
    //   immediate: false,
    //   handler: function (to, from) {
    //     if (to.length === 0) { // none selected
    //       this.someSelected = false
    //       this.multiSelect = false
    //     } else if (to.length === this.institutions.length) { // all selected
    //       this.someSelected = false
    //       this.multiSelect = true
    //     } else { // some selected
    //       this.someSelected = true
    //       this.multiSelect = true
    //     }
    //   }
    // },
  }
}
</script>

<style lang="scss">


</style>