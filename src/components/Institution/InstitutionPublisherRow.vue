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
      <v-list-item-subtitle class="list-width">
        {{ pub.description ? truncate(pub.description, 40) : "No description" }}
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
              Edit package name
            </v-list-item-title>
          </v-list-item>
          <v-list-item
            @click.stop="openEditDescriptionDialog()"
            :disabled="!iCanEdit"
          >
            <v-list-item-icon>
              <v-icon>mdi-pencil</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              Edit description
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
              Delete package
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
              counter="125"
              :rules="packageRules"
              outlined
              autofocus
              clearable
              type="text"
              label="New package name"
              @keydown.enter="renamePublisher"
              v-model="publisherNewName"
              required
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
                 :disabled="!publisherNewName || publisherNewName.length > 125"
                 color="primary"
          >
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogs.editDescription" max-width="400">
      <v-card>
        <v-card-title class="">
          <v-icon left>mdi-pencil</v-icon>
          Edit Description
        </v-card-title>
        <div class="pt-4 pa-5">
          <v-textarea
              counter="1000"
              :rules="descriptionRules"
              outlined
              autofocus
              clearable
              type="text"
              label="Description"
              v-model="descriptionEdited"
              @keydown.ctrl.enter="editDescription"
              @keydown.meta.enter="editDescription"
          />
        </div>
        <v-card-actions>
          <v-spacer/>
          <v-btn text
                 @click="closeEditDescriptionDialog"
                 :disabled="editDescriptionIsLoading"
          >
            Cancel
          </v-btn>
          <v-btn depressed
                 @click="editDescription"
                 :loading="editDescriptionIsLoading"
                 :disabled="!descriptionEdited || descriptionEdited.length > 1000"
                 color="primary"
          >
            Update
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
    pubName: String,
    pubDescription: String,
  },
  data() {
    return {
      deletePublisherId: null,
      deletePublisherLoading: false,
      renamePublisherIsLoading: false,
      editDescriptionIsLoading: false,
      publisherNewName: this.pubName,
      descriptionEdited: this.pubDescription,
      dialogs: {
        deletePublisher: false,
        renamePublisher: false,
        editDescription: false,
      },
      snackbars: {
        deletePublisherSuccess: false,
      },
      descriptionRules: [v => v.length <= 1000 || 'Max 1000 characters'],
      packageRules: [v => v.length <= 125 || 'Max 125 characters'],
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
    truncate(value, words) {
      const new_value = value.split(" ").splice(0, words).join(" ")
      const max_length = 200
      if (new_value.length > max_length) {
        return new_value.slice(0, max_length) + " ..."
      }
      return new_value
    },
    openRenamePublisherDialog() {
      this.dialogs.renamePublisher = true
    },
    openEditDescriptionDialog() {
      this.dialogs.editDescription = true
    },
    closeRenamePublisherDialog() {
      this.dialogs.renamePublisher = false
      this.publisherNewName = false
    },
    openDeletePublisherDialog(id) {
      this.deletePublisherId = id
      this.dialogs.deletePublisher = true
    },
    closeEditDescriptionDialog() {
      this.dialogs.editDescription = false
      this.descriptionEdited = false
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
    async editDescription() {
      this.editDescriptionIsLoading = true
      const arg = {
        publisherId: this.pub.id,
        description: this.descriptionEdited,
      }
      await this.$store.dispatch("editDescription", arg)
      this.editDescriptionIsLoading = false
      this.closeEditDescriptionDialog()
      this.snackbar("Description edited.")
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
.list-width {
  max-width: 600px;
  max-height: 600px;
  white-space: break-spaces;
}

</style>
