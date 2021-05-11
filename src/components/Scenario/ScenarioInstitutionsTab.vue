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
    <div class="pa-3 mt-5">

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
    async openDialog() {
      this.isLoading = true
      this.startGlobalLoading()
      console.log("openDialog getting this url", this.apiUrl)
      try {
        const resp = await api.get(this.apiUrl)
        this.institutions = resp.data.institutions
        console.log("api get member institutions resp", resp)
      }
      finally {
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
      let searchStr = (this.search) ? this.search : ""
      return this.institutions.filter(i => {
        return i.institution_name.toLowerCase().indexOf(searchStr.toLowerCase()) > -1
      })
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