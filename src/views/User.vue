<template>
  <v-container class="user mt-12 pt-6">
    <v-alert v-if="userIsDemo && !isLoading" color="info" text dense icon="mdi-information-outline">
      <div class="d-flex align-center">
        <div>
          This is a demo account; some functionality is restricted.
        </div>
        <v-spacer></v-spacer>
        <div>
          <v-btn color="info" text small to="/purchase">Purchase full account</v-btn>
        </div>
      </div>
    </v-alert>

    <div class="d-flex entity-title">
<!--      empty div because no button, but need the padding for design to work-->
      <div class="ml-11"></div>

      <v-icon color="primary" large left>
        mdi-account-circle-outline
      </v-icon>

      <div>
        <div class="caption primary--text">
          User
        </div>
        <div class="text-h5 font-weight-bold primary--text">
          Your Account
        </div>
      </div>
    </div>
    <app-bar-ext-user/>
    <v-tabs-items v-model="userTabShowing">
      <v-divider></v-divider>


      <!--            INSTITUTIONS                                            -->
      <!--*****************************************************************-->
      <v-tab-item>
        <v-card flat>

          <v-list>
            <v-list-item
                v-for="insti in userInstitutions"
                :key="insti.institution_id"
                @click="goToInstitution(insti.institution_id)"
            >
              <v-list-item-icon>
                <v-icon>mdi-bank-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <div class="headline font-weight-bold">
                  {{ insti.institution_name }}
                </div>

                <v-list-item-subtitle>
                                    <span>
                                        Your're a<template
                                        v-if="insti.permissions.includes('admin')">n</template>  <strong>{{
                                        roleFromPermissions(insti.permissions)
                                      }}</strong> for this institution
                                    </span>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-tab-item>


      <!--            CONSORTIA                                            -->
      <!--*****************************************************************-->
      <v-tab-item v-if="userConsortia.length">
        <v-card flat>

          <v-list>
            <v-list-item
                v-for="insti in userConsortia"
                :key="insti.institution_id"
                @click="goToInstitution(insti.institution_id)"
            >

              <v-list-item-icon>
                <v-icon>mdi-lan</v-icon>

              </v-list-item-icon>
              <v-list-item-content>
                <div class="headline font-weight-bold">
                  {{ insti.institution_name }}
                </div>

                <v-list-item-subtitle>
                                    <span>
                                        Your're a<template
                                        v-if="insti.permissions.includes('admin')">n</template>  <strong>{{
                                        roleFromPermissions(insti.permissions)
                                      }}</strong> for this consortium
                                    </span>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-tab-item>


      <!--            ACCOUNT DETAILS                                     -->
      <!--*****************************************************************-->
      <v-tab-item>
        <v-card flat>

          <v-list two-line>
            <v-list-item>
              <v-list-item-avatar>
                <v-icon>mdi-account-outline</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <div class="">
                  {{ userName }}
                </div>
                <v-list-item-subtitle>
                  Your name
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon @click="openDialogToEditUserInfo('name')">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>

            <v-divider></v-divider>
            <v-list-item>
              <v-list-item-avatar>
                <v-icon v-if="userEmail">mdi-email-outline</v-icon>
                <v-icon v-if="!userEmail" color="warning">mdi-email-alert-outline</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-if="userEmail" v-html="userEmail" class=""/>
                <v-list-item-title v-if="!userEmail" color="warning">
                  <em class="warning--text">
                    None set
                  </em>
                </v-list-item-title>
                <v-list-item-subtitle>
                  Your email
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon @click="openDialogToEditUserInfo('email')">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>


            <v-divider></v-divider>
            <v-list-item>
              <v-list-item-avatar>
                <v-icon v-if="!userPasswordIsSet">mdi-shield-alert-outline</v-icon>
                <v-icon v-if="userPasswordIsSet">mdi-shield-check-outline</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="">
                  <span v-if="!userPasswordIsSet"><em>None set</em></span>
                  <span v-if="userPasswordIsSet">••••••••</span>
                </v-list-item-title>
                <v-list-item-subtitle>
                  Your password
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon @click="openDialogToEditUserInfo('password')">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card>
      </v-tab-item>

    </v-tabs-items>


    <v-dialog v-model="dialogs.editUserInfo" max-width="500">
      <v-card :loading="editUserInfoLoading">
        <v-card-title>
          <v-icon v-if="editUserInfoType==='name'">mdi-account-edit-outline</v-icon>
          <v-icon v-if="editUserInfoType==='email'">mdi-email-edit-outline</v-icon>
          <v-icon v-if="editUserInfoType==='password'">mdi-shield-edit-outline</v-icon>
          <span class="text ml-3">
                        Edit {{ editUserInfoType }}
                    </span>
        </v-card-title>
        <v-card-text class="pt-4">
          <v-alert
              :value="editUserErrors.emailIsTaken"
              type="error"
              icon="mdi-alert"
              transition="slide-x-transition"
          >
            Sorry, that email is taken.
          </v-alert>
          <v-text-field
              outlined
              autofocus
              clearable
              v-if="editUserInfoType==='name'"
              label="Your name"
              v-model="editUserInfoStr"
              @keydown.enter="editUserInfo"
          />
          <v-text-field
              outlined
              autofocus
              clearable
              v-if="editUserInfoType==='email'"
              label="Your email"
              v-model="editUserInfoStr"
              @keydown.enter="editUserInfo"
          />
          <v-text-field
              outlined
              autofocus
              v-if="editUserInfoType==='password'"
              label="Your password"
              v-model="editUserInfoStr"
              :append-icon="editUserShowPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="editUserShowPassword ? 'text' : 'password'"
              @click:append="editUserShowPassword = !editUserShowPassword"
              @keydown.enter="editUserInfo"
          />


        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              :disabled="editUserInfoLoading"
              depressed
              @click="closeEditUserInfo"
          >
            <v-icon>mdi-close</v-icon>
            Cancel
          </v-btn>
          <v-btn depressed
                 @click="editUserInfo"
                 color="primary"
                 :loading="editUserInfoLoading"
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
import {mapGetters, mapMutations, mapActions} from 'vuex'
import {roleFromPermissions} from "../shared/userPermissions";

import AppBarExtUser from "@/components/AppBar/AppBarExtUser";

export default {
  name: "User",

  metaInfo() {
    return {
      title: "My Account"
    }
  },
  components: {
    AppBarExtUser,
  },
  data() {
    return {

      editUserInfoType: null,
      editUserInfoStr: "",
      editUserInfoLoading: false,
      editUserShowPassword: true,
      editUserErrors: {
        emailIsTaken: false,
      },
      dialogs: {
        editUserInfo: false,
      },
    }
  },
  computed: {
    ...mapGetters([
      "userId",
      "userEmail",
      "userName",
      "userTabShowing",
      "userPasswordIsSet",
      "userInstitutions",
      "userConsortia",
      "institutionId",
      "userIsDemo",
      "gravatarStr",
    ]),
    isLoading() {
      return !this.userId
    }
  },
  methods: {
    ...mapMutations([
      "snackbar",
    ]),
    ...mapActions([]),
    goToInstitution(id) {
      const url = `/i/${id}`
      this.$router.push(url)
    },
    roleFromPermissions,
    async selectInstitution(id) {
      this.$store.commit("clearInstitution")
      await this.$store.dispatch("fetchInstitution", id)
    },
    openDialogToEditUserInfo(infoType) {
      console.log("openDialogToEditUserInfo", infoType)
      this.dialogs.editUserInfo = true
      this.editUserInfoType = infoType
      if (infoType === 'name') this.editUserInfoStr = this.userName
      else if (infoType === 'email') this.editUserInfoStr = this.userEmail
      else this.editUserInfoStr = ""
    },
    closeEditUserInfo() {
      this.editUserInfoType = null
      this.editUserInfoStr = ""
      this.editUserInfoLoading = false
      this.editUserErrors.emailIsTaken = false
      this.dialogs.editUserInfo = false
    },
    async editUserInfo() {
      console.log("edit user info!", this.editUserInfoType, this.editUserInfoStr)
      this.editUserInfoLoading = true
      const methodName = _.camelCase(`change ${this.editUserInfoType}`)
      await this.$store.dispatch(methodName, this.editUserInfoStr)

      this.snackbar(`${_.capitalize(this.editUserInfoType)} updated`)
      this.closeEditUserInfo()
    }
  },
  created() {
    this.$store.commit("clearInstitution")
    this.$store.commit("clearPublisher")
  },
}
</script>

<style scoped>

</style>