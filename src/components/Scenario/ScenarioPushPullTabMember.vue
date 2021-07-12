<template>
  <v-card flat class="px-6">
    <p>
      Your consortium last sent this scenario to you on <strong>{{
        scenarioSentDate | moment("dddd, MMMM Do YYYY")
      }}.</strong>
    </p>
    <p v-if="scenarioReturnDate">
      You sent it back to them on <strong>{{ scenarioReturnDate | moment("dddd, MMMM Do YYYY") }}.</strong> If you've made
      changes since then, you can resend it, which will to update your response and notify consortium staff.
    </p>
    <p v-if="!scenarioReturnDate">
      You haven't yet sent your response back. When you do, your consortium will get an email notification, and be able
      to see your title-by-title subscription requests.
    </p>
    <v-btn
        color="primary"
        @click="sendToConsortium"
        :loading="isLoading"
    >
      <!--        <v-icon left>mdi-download</v-icon>-->
      Send to consortium
    </v-btn>


  </v-card>


</template>

<script>
import {mapActions, mapGetters, mapMutations} from 'vuex'
import {urlBase} from "../../api";


export default {
  name: "ScenarioPushPullMemberTab",
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
    }
  },
  methods: {
    ...mapMutations([
      "snackbar",
        "startGlobalLoading",
        "finishGlobalLoading",
    ]),
    ...mapActions([]),
    async sendToConsortium() {
      this.isLoading = true
      this.startGlobalLoading()
      await this.$store.dispatch("sendScenarioToConsortium")
      this.isLoading = false
      this.finishGlobalLoading()
    }
  },
  computed: {
    ...mapGetters([
      'institutionId',
      'institutionName',
      'institutionIsDemo',
      "institutionIsConsortium",
      "institutionUsersWithRoles",
      'userConsortia',
      'userInstitutions',
      'scenarioLastEditedDate',
      'scenarioReturnDate',
      'scenarioSentDate',

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
      let url = `${urlBase}scenario/${scenarioId}/member-institutions/consortial-scenarios.csv`;
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