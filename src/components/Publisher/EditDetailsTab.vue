<template>
  <v-container class="publisher">
      <v-list two-line>
        
        <v-list-item>
          <v-list-item-content>
            <div class="">
              {{ publisherName }}
            </div>
            <v-list-item-subtitle class="pt-2">
              Package Name
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon @click="openDialogToEditPackageInfo('PackageName')">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>

        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-content>
            <div class="">
              {{ publisherDescription || "No description" }}
            </div>
            <v-list-item-subtitle class="pt-2">
              Package Description
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon @click="openDialogToEditPackageInfo('description')">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      
      </v-list>

    <v-dialog v-model="dialogs.editPackageInfo" max-width="500">
        <v-card :loading="editPackageInfoLoading">
          <v-card-title>
            <v-icon v-if="editPackageInfoType==='PackageName'">mdi-account-edit-outline</v-icon>
            <v-icon v-if="editPackageInfoType==='description'">mdi-email-edit-outline</v-icon>
            <span class="text ml-3">
              Edit {{ editPackageInfoType }}
            </span>
          </v-card-title>
          <v-card-text class="pt-4">
            <v-text-field
                counter="125"
                outlined
                autofocus
                clearable
                v-if="editPackageInfoType==='PackageName'"
                label="Package name"
                v-model="editPackageInfoStr"
                @keydown.enter="editPackageInfo"
                :rules="packageRules"
            />
            <v-textarea
                counter="1000"
                outlined
                autofocus
                clearable
                type="text"
                v-if="editPackageInfoType==='description'"
                label="Package description"
                v-model="editPackageInfoStr"
                @keydown.enter="editPackageInfo"
                :rules="descriptionRules"
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
                   v-if="editPackageInfoType==='PackageName'"
                   :loading="editPackageInfoLoading"
                   :disabled="!editPackageInfoStr || editPackageInfoStr.length > 125"
            >
              <v-icon>mdi-check</v-icon>
              Ok
            </v-btn>
            <v-btn depressed
                   @click="editPackageInfo"
                   color="primary"
                   v-if="editPackageInfoType==='description'"
                   :loading="editPackageInfoLoading"
                   :disabled="!editPackageInfoStr || editPackageInfoStr.length > 1000"
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
      descriptionRules: [v => v.length <= 1000 || 'Max 1000 characters'],
      packageRules: [v => v.length <= 125 || 'Max 125 characters'],
    }
  },
  computed: {
    ...mapGetters([
      "publisherName",
      "publisherDescription",
    ])
  },
  methods: {
    ...mapMutations([
      "snackbar",
    ]),
    truncate(value, words) {
      const new_value = value.split(" ").splice(0, words).join(" ")
      const max_length = 200
      if (new_value.length > max_length) {
        return new_value.slice(0, max_length) + " ..."
      }
      return new_value
    },
    openDialogToEditPackageInfo(infoType) {
      console.log("openDialogToEditPackageInfo", infoType)
      this.dialogs.editPackageInfo = true
      this.editPackageInfoType = infoType
      if (infoType === 'PackageName') this.editPackageInfoStr = this.publisherName
      else if (infoType === 'description') this.editPackageInfoStr = this.publisherDescription
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
