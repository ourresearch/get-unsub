<template>
  <v-container v-if="institutionName" class="institution mt-12 pt-6">

    <v-alert v-if="institutionIsDemo" color="info" text dense icon="mdi-information-outline">
      <div class="d-flex align-center">
        <div>
          This is a demo institution; some functionality is restricted.
        </div>
        <v-spacer></v-spacer>
        <div>
          <v-btn color="info" text small to="/purchase">Purchase full account</v-btn>
        </div>
      </div>
    </v-alert>

    <div class="d-flex entity-title">
      <v-btn icon class="mr-2" to="/u">
        <v-icon color="primary">
          mdi-chevron-left
        </v-icon>
      </v-btn>
      <v-icon color="primary" large left>
        {{ institutionIsConsortium ? "mdi-lan" : "mdi-bank-outline" }}
      </v-icon>

      <div>
        <div class="caption primary--text">
          {{ (institutionIsConsortium) ? "Consortium" : "Institution" }}
        </div>
        <div class="text-h5 font-weight-bold primary--text">
          {{ institutionName }}
        </div>
      </div>
    </div>
    <app-bar-ext-institution/>
    <v-divider/>
    <v-tabs-items v-model="institutionTabShowing">
      <v-tab-item>
        <institution-publishers-list :my-role="myRole" :is-consortial-feeder="false"/>
      </v-tab-item>
      <v-tab-item>
        <institution-users-list :my-role="myRole"/>
      </v-tab-item>
      <v-tab-item>
        <institution-ror-list/>
      </v-tab-item>
      <v-tab-item v-if="institutionConsortialFeederPublishers.length && !institutionConsortialProposalSets.length">
        <institution-publishers-list
            :my-role="myRole"
            :is-consortial-feeder="true"
        />
      </v-tab-item>
      <v-tab-item v-if="institutionConsortialProposalSets.length">
        <institution-publishers-list
            :my-role="myRole"
            :is-consortial-proposal-set="true"
        />
      </v-tab-item>
    </v-tabs-items>


  </v-container>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex'
import InstitutionPublisherRow from "../components/Institution/InstitutionPublisherRow";
import InstitutionUsersList from "../components/Institution/InstitutionUsersList";
import InstitutionRorList from "../components/Institution/InstitutionRorList";
import InstitutionPublishersList from "../components/Institution/InstitutionPublishersList";
import AppBarExtInstitution from "@/components/AppBar/AppBarExtInstitution";

const short = require('short-uuid');

export default {
  name: "Institution",
  metaInfo() {
    return {
      title: `${this.institutionName}`
    }
  },
  components: {
    AppBarExtInstitution,
    InstitutionUsersList,
    InstitutionRorList,
    InstitutionPublishersList,
    InstitutionPublisherRow,
  },
  data() {
    return {
      foo: 42,
    }
  },
  computed: {
    ...mapGetters([
      "institutionName",
      "institutionRorIds",
      "institutionPublishers",

      "institutionUsersWithRoles",
      "institutionIsDemo",
      "institutionTabShowing",
      "userId",
      "institutionIsLoading",
      "institutionIsConsortium",
      "institutionConsortialProposalSets",
      "institutionConsortialFeederPublishers",
    ]),
    institutionId() {
      return this.$route.params.institutionId
    },

    myRole() {
      const authenticatedUserPermissisonObject = this.institutionUsersWithRoles.find(u => {
        return u.user_id === this.userId
      })

      if (authenticatedUserPermissisonObject) {
        return authenticatedUserPermissisonObject.role
      } else {
        return "viewer"
      }
    },
  },
  methods: {
    ...mapMutations([
      "snackbar",
    ]),
    ...mapActions([]),

    async goToPackage(packageId) {
      const url = `/i/${this.institutionId}/p/${packageId}`
      await this.$router.push(url)
    },

    async copyPassword() {
      const copyText = document.querySelector("#pw");
      copyText.select();
      document.execCommand("copy");
      // await this.$copyText(this.newGroupMember.password)
    },

  },
  async mounted() {
    console.log("Institution mount up!", this.institutionId)
    this.$store.commit("clearPublisher")
    this.$store.commit("setInstitutionTabShowing", 0)
    await this.$store.dispatch("fetchInstitution", this.institutionId)
  },
  destroyed() {
    // this.$store.commit("clearInstitution")
  }
}
</script>

<style scoped>

</style>