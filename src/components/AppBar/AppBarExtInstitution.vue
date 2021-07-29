<template>
  <v-container class="pa-0">
    <v-tabs v-if="institutionName" class="ml-1" v-model="currentTab">
      <v-tab class="low-key-button">
        <v-icon small left>mdi-package-variant</v-icon>
        Packages
      </v-tab>
      <v-tab class="low-key-button">
        <v-icon small left>mdi-account-outline</v-icon>
        Users
        <span class="ml-1 caption">({{ institutionUsersWithRoles.length }})</span>
      </v-tab>
      <v-tab class="low-key-button">
        <v-icon small left>mdi-map-marker-outline</v-icon>
        ROR IDs
        <span class="ml-1 caption">({{ institutionRorIds.length }})</span>
      </v-tab>
      <v-tab class="low-key-button" v-if="institutionConsortialFeederPublishers.length && !institutionConsortialProposalSets.length&& !institutionIsJisc">
        <v-icon small left>mdi-package-up</v-icon>
        Consortial feeders
      </v-tab>
      <v-tab class="low-key-button" v-if="institutionConsortialProposalSets.length">
        <v-icon small left>mdi-swap-horizontal</v-icon>
        Consortial proposals
      </v-tab>
    </v-tabs>

  </v-container>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'

export default {
  name: "AppBarExtInstitution",
  components: {},
  data() {
    return {
      foo: 42,
    }
  },
  methods: {},
  computed: {
    ...mapGetters([
      "institutionName",
      "institutionConsortialFeederPublishers",
      "institutionUsersWithRoles",
      "institutionRorIds",
      "institutionIsJisc",
        "institutionConsortialProposalSets",
    ]),
    currentTab: {
      get() {
        console.log("get currentTab")
        return this.$store.getters.institutionTabShowing
      },
      set(newVal) {
        this.$store.commit("setInstitutionTabShowing", newVal)
      }
    }
  },
  created() {
    this.currentTab = 0
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