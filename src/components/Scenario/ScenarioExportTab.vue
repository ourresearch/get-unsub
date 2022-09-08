<template>
  <v-card flat class="px-6">
    <p>
      You can export all of the data in this scenario as a CSV file. You can find <a
        href="https://docs.unsub.org/reference/data-export" target="_blank">documentation
      for the column names here.</a>
    </p>
    <p>
       To further explore and visualize your exported data,
      check out
      <a href="https://unsubextender.lib.iastate.edu/" target="_blank">Unsub Extender,</a> a free third-party tool created by Eric
      Schares, a librarian at Iowa State University.
    </p>
    <v-btn color="primary" @click="" :href="csvUrl">
      <v-icon left>mdi-download</v-icon>
      Download
    </v-btn>

    <template v-if="institutionIsConsortium && institutionIsJisc">
      <div class="mt-10 text-h5">
         Member subscription requests (beta)
      </div>
      <p>
        Pull a list of subscriptions that your member institutions have requested you include in this scenario.
      </p>

      <v-btn
        :loading="isLoading"
        @click="sendSubRequestsEmail"
        color="primary"
      >
        <v-icon left v-if="subRequestsText.includes('Download')">mdi-download</v-icon>
        {{ subRequestsText }}
      </v-btn>

    </template>


  </v-card>


</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import {urlBase, api} from "../../api";


export default {
  name: "ScenarioExportTab",
  components: {},
  props: {
    myRole: String,
    isConsortialFeeder: Boolean,
    publishers: Array,
  },
  data() {
    return {
      dialogs: {
        createGroupMember: false,
      },
      isLoading: false,
      subRequestsText: 'Download (via email)'
    }
  },
  methods: {
    ...mapMutations([
      "snackbar",
    ]),
    async sendSubRequestsEmail() {
        console.log("send the sub requests email")
        this.subRequestsText = "You'll get an email soon"
        const postData = {email: this.userEmail}
        this.isLoading = true
        try {
            api.post(this.memberSubscriptionRequestsCsvUrl, postData)
        }
        catch(e) {
            if (e.response.status === 404) {
                this.errorMsg = "Sorry, we couldn't find that account."
                return
            }
            else {
                this.errorMsg = "Sorry, something went wrong"
            }
        }
        finally {
            this.isLoading = false
        }
        this.requestState = "success"
    },
  },
  computed: {
    ...mapGetters([
      'institutionId',
      'institutionName',
      'institutionIsDemo',
      "institutionIsConsortium",
      "institutionUsersWithRoles",
      "institutionIsJisc",
      'userConsortia',
      'userInstitutions',
      'userEmail',
    ]),
    csvUrl() {
      let scenarioId = this.$store.getters.scenarioId
      let url = `${urlBase}scenario/${scenarioId}/export.csv`; // urlBase ends with a slash
      url += "?timestamp=" + `${new Date().getTime()}`
      url += "&jwt=" + localStorage.getItem("token")
      return url
    },
    memberSubscriptionRequestsCsvUrl() {
      let scenarioId = this.$store.getters.scenarioId
      let url = `scenario/${scenarioId}/member-institutions/consortial-scenarios.csv`;
      url += "?timestamp=" + `${new Date().getTime()}`
      url += "&jwt=" + localStorage.getItem("token")
      return url
    },
  },
  created() {
  },
  mounted() {
  },
  watch: {
    "foo": {
      immediate: true,
      handler: function (to, from) {
      }
    }
  }
}
</script>

<style lang="scss">


</style>
