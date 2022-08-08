<template>
  <v-container class="user mt-12 pt-6">
    <v-card flat class="py-3 pt-6">
      <v-list two-line>
        <v-list-item>
          <v-list-item-avatar>
            <v-icon>mdi-account-outline</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <div class="">
              Package Name
            </div>
            <v-list-item-subtitle>
              Scott Chamberlain
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon @click="openDialogToEditPackageInfo('name')">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>

        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-avatar>
            <v-icon>mdi-email-outline</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class=""/>
                Package Description
            </v-list-item-title>
            <v-list-item-subtitle>
              Your email
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon @click="openDialogToEditPackageInfo('description')">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card>

    <v-dialog v-model="dialogs.editPackageInfo" max-width="500">
        <v-card :loading="editPackageInfoLoading">
          <v-card-title>
            <v-icon v-if="editPackageInfoType==='name'">mdi-account-edit-outline</v-icon>
            <v-icon v-if="editPackageInfoType==='description'">mdi-email-edit-outline</v-icon>
            <span class="text ml-3">
              Edit {{ editPackageInfoType }}
            </span>
          </v-card-title>
          <v-card-text class="pt-4">
            <v-text-field
                outlined
                autofocus
                clearable
                v-if="editPackageInfoType==='name'"
                label="Package name"
                v-model="editPackageInfoStr"
                @keydown.enter="editPackageInfo"
            />
            <v-text-field
                outlined
                autofocus
                clearable
                v-if="editPackageInfoType==='description'"
                label="Package description"
                v-model="editPackageInfoStr"
                @keydown.enter="editPackageInfo"
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                :disabled="editPackageInfoLoading"
                depressed
                @click="closeEditPackageInfo"
            >
              <v-icon>mdi-close</v-icon>
              Cancel
            </v-btn>
            <v-btn depressed
                   @click="editPackageInfo"
                   color="primary"
                   :loading="editPackageInfoLoading"
            >
              <v-icon>mdi-check</v-icon>
              Ok
            </v-btn>

          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
</template>

<script>
import _ from "lodash"
import {mapGetters, mapMutations, mapActions} from 'vuex'

export default {
  name: "EditDetailsTab",
  components: {
  },
  props: {},
  data() {
    return {
      editPackageInfoType: null,
      editPackageInfoStr: "",
      editPackageInfoLoading: false,
      dialogs: {
        editPackageInfo: false,
      },
    }
  },
  computed: {
    ...mapGetters([
      "packageName",
      "packageDescription",
    ])
  },
  methods: {
    ...mapMutations([
      "snackbar",
    ]),
    openDialogToEditPackageInfo(infoType) {
      console.log("openDialogToEditPackageInfo", infoType)
      this.dialogs.editPackageInfo = true
      this.editPackageInfoType = infoType
      if (infoType === 'name') this.editPackageInfoStr = this.packageName
      else if (infoType === 'description') this.editPackageInfoStr = this.packageDescription
      else this.editPackageInfoStr = ""
    },
    closeEditPackageInfo() {
      this.editPackageInfoType = null
      this.editPackageInfoStr = ""
      this.editPackageInfoLoading = false
      this.dialogs.editPackageInfo = false
    },
    async editPackageInfo() {
      console.log("edit package info!", this.editPackageInfoType, this.editPackageInfoStr)
      this.editPackageInfoLoading = true
      const methodName = _.camelCase(`change ${this.editPackageInfoType}`)
      await this.$store.dispatch(methodName, this.editPackageInfoStr)

      this.snackbar(`${_.capitalize(this.editPackageInfoType)} updated`)
      this.closeEditPackageInfo()
    }
  },
  created() {
  },
  mounted() {
  },
  watch: {}
}
</script>

<style lang="scss">
.setup-subtab-content {
  margin-top: 36px;
}
</style>
