<template>
  <v-list-item
      :key="pub.id"
      @click="goToPackage(pub.id)"
  >
    <v-list-item-icon>
      <v-icon>
        {{ myIcon }}
      </v-icon>
    </v-list-item-icon>

    <v-list-item-content>
      <v-list-item-title
          class="headline font-weight-bold"
      >
        {{ pub.name }}
      </v-list-item-title>
      <v-list-item-subtitle>
        <strong>
          {{ pub.publisher }}
        </strong>
        {{ mySubtitle }}
      </v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action>
      <v-menu
          offset-y
      >
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
              @click.stop="openRenamePublisherDialog()"
              :disabled="!iCanEdit"
          >
            <v-list-item-icon>
              <v-icon>mdi-pencil</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              Rename
            </v-list-item-title>
          </v-list-item>
          <v-list-item
              @click.stop="openDeletePublisherDialog(pub.id)"
              :disabled="!iCanEdit || institutionIsConsortium"
          >
            <v-list-item-icon>
              <v-icon>mdi-delete-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              Delete
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-list-item-action>

    <v-snackbar v-model="snackbars.deletePublisherSuccess" bottom left>
      Package deleted
      <v-btn dark icon @click="snackbars.deletePublisherSuccess = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>

    <v-dialog v-model="dialogs.deletePublisher" max-width="400">
      <v-card v-if="dialogs.deletePublisher">
        <v-card-title class="">
          <v-icon left>mdi-delete-outline</v-icon>
          Delete Package
        </v-card-title>
        <div class="pt-4 pa-5">
          Are you sure you want to delete this package?
        </div>
        <v-card-actions>
          <v-spacer/>
          <v-btn text
                 @click="closeDeletePublisherDialog"
                 :disabled="deletePublisherLoading"
          >
            Cancel
          </v-btn>
          <v-btn depressed
                 @click="deletePublisher"
                 :loading="deletePublisherLoading"
                 color="primary"
          >
            Yes, delete it
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogs.renamePublisher" max-width="400">
      <v-card>
        <v-card-title class="">
          <v-icon left>mdi-pencil</v-icon>
          Rename Package
        </v-card-title>
        <div class="pt-4 pa-5">
          <v-text-field
              outlined
              type="text"
              label="New name"
              @keydown.enter="renamePublisher"
              v-model="publisherNewName"
          />
        </div>
        <v-card-actions>
          <v-spacer/>
          <v-btn text
                 @click="closeRenamePublisherDialog"
                 :disabled="renamePublisherIsLoading"
          >
            Cancel
          </v-btn>
          <v-btn depressed
                 @click="renamePublisher"
                 :loading="renamePublisherIsLoading"
                 color="primary"
          >
            Rename
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-list-item>

</template>

<script>
import {mapGetters, mapMutations} from 'vuex'


export default {
  name: "InstitutionPublisherRow",
  components: {},
  props: {
    pub: Object,
    myRole: String,
    isConsortialFeeder: Boolean,
    isConsortialProposalSet: Boolean,
  },
  data() {
    return {
      deletePublisherId: null,
      deletePublisherLoading: false,
      renamePublisherIsLoading: false,
      publisherNewName: "",
      dialogs: {
        deletePublisher: false,
        renamePublisher: false,
      },
      snackbars: {
        deletePublisherSuccess: false,
      }
    }
  },
  methods: {
    ...mapMutations([
      "snackbar",
    ]),
    async goToPackage(packageId) {
      const url = `/i/${this.institutionId}/p/${packageId}`
      await this.$router.push(url)
    },
    openRenamePublisherDialog() {
      this.dialogs.renamePublisher = true
    },
    closeRenamePublisherDialog() {
      this.dialogs.renamePublisher = false
      this.publisherNewName = false

    },
    openDeletePublisherDialog(id) {
      this.deletePublisherId = id
      this.dialogs.deletePublisher = true

    },
    closeDeletePublisherDialog() {
      this.deletePublisherId = null
      this.dialogs.deletePublisher = false
    },
    async renamePublisher() {
      this.renamePublisherIsLoading = true
      const arg = {
        publisherId: this.pub.id,
        name: this.publisherNewName,
      }
      await this.$store.dispatch("renamePublisher", arg)
      this.renamePublisherIsLoading = false
      this.closeRenamePublisherDialog()
      this.snackbar("Package renamed.")
    },
    async deletePublisher() {
      console.log("delete publisher", this.deletePublisherId)
      this.deletePublisherLoading = true
      await this.$store.dispatch("deletePublisher", this.deletePublisherId)
      this.deletePublisherLoading = false
      this.closeDeletePublisherDialog()
      this.snackbar("Package deleted.")
    },
  },
  computed: {
    ...mapGetters([
      "institutionId",
      "institutionIsConsortium",
      "institutionOwnPublishers",
      "institutionConsortialFeederPublishers",
    ]),
    iCanEdit() {
      if (this.isConsortialFeeder) {
        // only ConsortiumAdmin can edit consortial feeder packages
        return this.myRole === "ConsortiumAdmin"
      } else {
        return ["ConsortiumAdmin", "Admin", "Collaborator"].includes(this.myRole)
      }
    },
    myIcon(){
      if (this.isConsortialFeeder) return "mdi-package-up"
      if (this.isConsortialProposalSet)  return "mdi-swap-horizontal"
      return "mdi-package-variant"
    },
    mySubtitle(){
      if (this.isConsortialFeeder) return "consortial feeder"
      if (this.isConsortialProposalSet)  return "consortial proposal set"
      if (!this.iCanEdit) return "package (read-only)"
      return "package"
    }

  },
  watch: {}
}
</script>

<style lang="scss">


</style>