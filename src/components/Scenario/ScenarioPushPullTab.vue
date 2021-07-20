<template>
  <v-card flat>
    <v-card-title class="text-h5" :class="{'warning--text': !scenarioMemberInstitutions.length}">
      <div>
        Push/pull
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

    <div class="d-flex mb-6 ml-4">
      <v-btn
          color="primary"
          class="mr-2"
          @click="openSendDialog"
          :disabled="!selectedInstitutions.length"
      >
        send
      </v-btn>
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

    <v-dialog v-model="dialogs.send" persistent max-width="600">
      <v-card>
        <v-card-title>
          <v-icon left>mdi-table-arrow-right</v-icon>
          Send scenario to members
        </v-card-title>
        <div class="pa-4">
          <div>
            You've selected {{ selectedInstitutions.length }} member institutions, and you're about to send a copy of
            this scenario to them. Clicking "Send" below will do two things:
          </div>
          <ol>
            <li>
              Send a copy of this scenario to the selected institution. They will be able to see your proposed
              title-by-title subscriptions and parameter settings. However, they won't be able to modify them, since
              they are just getting a copy. In their own dashboard, they can add some proposed title-by-title
              subscriptions, and then send these back to you. You can download their proposed additional subscriptions
              in the "export" tab of this scenario.
            </li>
          </ol>

        </div>
        <v-card-actions>
          <v-spacer/>
          <v-btn depressed
                 @click="dialogs.send = false"
          >
            Cancel
          </v-btn>
          <v-btn depressed
                 @click="saveSend"
                 color="primary"
                 :loading="isSaving"
          >
            send
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-card>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from 'vuex'
import {api, urlBase} from "../../api";
import {sendScenarioToMemberInstitutions} from "../../shared/scenario";


const makeMemberInstitution = function (moment, apiInstitution) {
  const ret = {...apiInstitution};
  ["sent_date", "changed_date", "return_date"].forEach(k => {
    const camelCaseKey = _.camelCase(k)
    if (apiInstitution[k]){
      ret[camelCaseKey] = moment(apiInstitution[k]).format("hh:mm DD MMM, YYYY")
    }
    else {
      ret[camelCaseKey] = null
    }
  })
  return ret

}

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
      },
      tableHeaders: [
        {value: "included", text: "Included"},
        {value: "institution_name", text: "Institution name"},
        {value: "usage", text: "Usage"},
        {value: "tags", text: "Tags"},
        {value: "sentDate", text: "Sent"},
        {value: "changedDate", text: "Last Changed"},
        {value: "returnDate", text: "Last Returned"},
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
    openSendDialog() {
      this.dialogs.send = true
    },
    async saveSend() {
      console.log("save send")
      this.isSaving = true

      console.log("POSTing institution IDs to server", this.selectedInstitutions)
      const selectedPackageIds = this.selectedInstitutions.map(i => i.package_id)
      const resp = await sendScenarioToMemberInstitutions(this.scenarioId, selectedPackageIds)
      console.log("institution IDs POSTed successfully. refreshing scenario.", resp)

      // refresh our current scenario, and also refresh this row on the publisher page
      await this.getInstitutions()
      await this.refreshSelectedScenario()
      await this.$store.dispatch("refreshPublisherScenario", this.scenarioId)
      console.log("scenario updated w new institutions.", resp)

      this.isSaving = false
      this.snackbar("Scenario shared and notifications sent.")
      this.dialogs.send = false
    },
    async getInstitutions() {
      this.isLoading = true
      this.startGlobalLoading()
      console.log("getInstitutions getting this url", this.apiUrl)
      try {
        const resp = await api.get(this.apiUrl)
        this.institutions = resp.data.institutions.map(i => {
          return makeMemberInstitution(this.$moment, i)
        })
      } finally {
        this.isLoading = false
        this.finishGlobalLoading()
      }
    },
  },
  computed: {
    ...mapGetters([
      "scenarioId",
      "scenarioMemberInstitutions",
    ]),
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
    this.getInstitutions()
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