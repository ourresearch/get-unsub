<template>
  <v-card flat>
    <!--        <v-card-title v-if="!isConsortialFeeder">-->
    <!--            <div>-->
    <!--                Subscription packages-->
    <!--                <span class="body-2">({{myPublishers.length}})</span>-->
    <!--            </div>-->
    <!--        </v-card-title>-->
    <div class="pa-3" v-if="isConsortialFeeder">
      <div class="body-2">
        These function exclusively as a <em>data source</em> for your consortium's central Unsub dashboard.
      </div>
    </div>
    <div class="pa-3" v-if="isConsortialProposalSet">
      <div class="body-2">
        Your consortium has proposed these scenarios, and would like your feedback. Each scenario contains a set of Core title-by-title subscriptions. Your mission is to select a few additional titles that you'd like to add to those Core titles.
      </div>
    </div>

    <v-list>
      <institution-publisher-row
          v-for="pub in myPublishers"
          :key="pub.id"
          :pub="pub"
          :my-role="myRole"
          :is-consortial-feeder="isConsortialFeeder"
          :is-consortial-proposal-set="isConsortialProposalSet"
      />
      <v-list-item
          v-if="!institutionIsConsortium && !isConsortialFeeder && !isConsortialProposalSet"
          @click="openCreatePublisherDialog"
      >
        <v-list-item-avatar size="50">
          <v-btn icon>
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title class="body-2 text--secondary">
            New package
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>


    <v-dialog v-model="dialogs.createPublisher" max-width="400">
      <v-card>
        <v-card-title>
          <v-icon left>mdi-package-variant</v-icon>
          Add subscription package
        </v-card-title>
        <v-card-text>
          <v-alert text type="warning" class="mt-8" rounded="0" v-if="institutionIsDemo">
            Demo profiles can't add packages.
          </v-alert>
        </v-card-text>

        <v-card-text class="pt-4">
          <div>
            <v-select
                outlined
                label="Select publisher"
                v-model="newPublisherItemSelected"
                :items="newPublisherItems"
                return-object
                item-text="name"
                item-value="name"
            >
              <template v-slot:item="{item}">
                <img :src="item.logo" class="mr-3" style="height:30px; width: 30px;">
                {{ item.name }}
              </template>
            </v-select>
            <v-text-field
                outlined
                clearable
                label="Package display name"
                @keydown.enter="createPublisher"
                v-model="newPublisherDisplayName"
            />
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn depressed
                 @click="cancelCreatePublisher"
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
import {mapGetters, mapMutations} from 'vuex'
import InstitutionPublisherRow from "./InstitutionPublisherRow";
import {publisherConfig} from "../../shared/publisher";


export default {
  name: "InstitutionPublishersList",
  components: {
    InstitutionPublisherRow,
  },
  props: {
    myRole: String,
    isConsortialFeeder: Boolean,
    isConsortialProposalSet: Boolean,
  },
  data() {
    return {
      newPublisherDisplayName: "",
      newPublisherItems: Object.values(_.cloneDeep(publisherConfig)),
      newPublisherItemSelected: _.cloneDeep(publisherConfig.Elsevier),
      newPublisherLoading: false,
      dialogs: {
        createPublisher: false,
      }
    }
  },
  methods: {
    ...mapMutations([
      "snackbar",
    ]),
    async createPublisher() {
      console.log("create publisher!")
      this.newPublisherLoading = true

      const name = this.newPublisherDisplayName || "My " + this.newPublisherItemSelected.name
      const publisher = this.newPublisherItemSelected.id
      await this.$store.dispatch("createPublisher", {publisher, name})
      this.newPublisherLoading = false
      this.snackbar("Package created.")
      this.dialogs.createPublisher = false
    },

    cancelCreatePublisher() {
      this.newPublisherLoading = false
      this.newPublisherDisplayName = ""
      this.dialogs.createPublisher = false
    },
    openCreatePublisherDialog() {
      this.cancelCreatePublisher()
      this.dialogs.createPublisher = true

    }
  },
  computed: {
    ...mapGetters([
      'institutionId',
      'institutionName',
      'institutionIsDemo',
      "institutionIsConsortium",
      "institutionOwnPublishers",
      "institutionConsortialFeederPublishers",
      "institutionConsortialProposalSets",
      'userConsortia',
      'userInstitutions',
    ]),
    myPublishers() {
      if (this.isConsortialFeeder) return this.institutionConsortialFeederPublishers
      if (this.isConsortialProposalSet) return this.institutionConsortialProposalSets
      return this.institutionOwnPublishers
    }

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