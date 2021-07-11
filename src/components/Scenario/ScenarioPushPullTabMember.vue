<template>
  <v-card flat class="px-6">
    <p>
      Your consortium last pushed this scenario to you on ________.
    </p>
    <p>
      You haven't yet pushed your response back. When you do, your consortium will get an email notification, and be able to see your title-by-title subscription requests.
    </p>
<v-btn color="primary" @click="" >
<!--        <v-icon left>mdi-download</v-icon>-->
        Push to consortium
      </v-btn>


  </v-card>


</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
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
      }
    }
  },
  methods: {
    ...mapMutations([
      "snackbar",
    ]),
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
    isJisc() {
      return this.institutionName === "Jisc"
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