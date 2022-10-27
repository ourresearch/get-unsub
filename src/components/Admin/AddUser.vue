<template>
  <v-card flat class="publisher">

    <template>
      <v-card flat class="pa-5">
        <div class="text-h4 mb-6 font-weight-bold">
            Add a user to an institution
        </div>
        <p>
            Two separate use cases for this form:
            <ul>
                <li>Add a user to a Jisc institution. <strong>Only fill in email, Jisc ID, and permissions</strong></li>
                <li>Add a user to any other institution. <strong>Fill in email, institution id, permissions</strong></li>
            </ul>
        </p>
        <p>Person's name and password are optional, and typically we don't fill these out</p>
        <p>Unless otherwise specified by the user, choose "Admin" for Permissions</p>
        <v-form
            v-model="formIsValid"
            ref="form"
            class="pa-3"
            :disabled="formIsLoading"
            v-if="!formIsSubmitted"
        >
            <v-row>
                <v-col cols="12" md="4">
                    <v-text-field
                        v-model="formData.email"
                        type="email"
                        label="Email"
                        outlined
                        :rules="emailRules"
                        required
                    />
                </v-col>
                <v-col cols="12" md="4">
                    <v-text-field
                        v-model="formData.institution"
                        label="Institution ID"
                        outlined
                        hint="e.g., institution-qfB9zhq5upVN"
                        persistent-hint
                    />
                </v-col>
                <v-col cols="12" md="3">
                    <v-text-field
                        v-model="formData.jiscid"
                        label="3 letter Jisc ID"
                        outlined
                        :rules="stringRules"
                        hint='e.g., "hul" for University of Hull'
                        persistent-hint
                    />
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="3">
                    <v-select
                        v-model="formData.permissions"
                        :items="permission_levels"
                        item-text="role"
                        item-value="role_values"
                        label="Permissions"
                        outlined
                    />
                </v-col>
                <v-col cols="12" md="3">
                    <v-text-field
                        v-model="formData.name"
                        type="name"
                        label="Person's Name"
                        outlined
                    />
                </v-col>
                <v-col cols="12" md="3">
                    <v-text-field
                        v-model="formData.password"
                        label="Password"
                        outlined
                    />
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="2">
                    <v-btn
                        @click="submit"
                        color="primary"
                        x-large
                        :loading="formIsLoading"
                    >
                        Add user
                    </v-btn>
                </v-col>
            </v-row>
        </v-form>
        <div v-if="formIsSubmitted" class="pa-3 ">
            <v-alert type="success" prominent>
                <div class="text-h5 mb-4">User created!</div>
                <div>User ID: <strong>{{createdUserID}}</strong></div>
            </v-alert>
        </div>

        </v-card>
    </template>
  </v-card>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex'
import {api} from "../../api";

export default {
  name: "AddUser",
  components: {},
  data() {
    return {
      formData: {
        email: "",
        institution: "",
        name: "",
        permissions: "",
        password: "",
        jiscid: "",
      },
      formIsValid: false,
      formIsLoading: false,
      formIsSubmitted: false,
      createdUserID: "",
      stringRules: [
          v => !!v || "This field is required."
      ],
      emailRules: [
          v => !!v || "This field is required.",
          v => /.+@.+/.test(v) || 'This email isn\'t valid.',
          v => {
              if (/gmail|hotmail|yahoo|inbox\.ru|qq\.com/.test(v)) {
                  return 'This looks like a personal email address.'
              }
              else return true
          }
      ],
    }
  },
  computed: {
    permission_levels() {
        return [
            {
                role: "Admin",
                role_values: "admin,modify,view",
            },
            {
                role: "Collaborator",
                role_values: "modify,view",
            },
            {
                role: "Viewer",
                role_values: "view",
            },
        ]
    }
  },
  methods: {
    async submit() {
        this.$refs.form.validate()
        if (!this.formIsValid) {
            console.log("add user form is not ready")
            return
        }
        const url = `user`
        console.log("adding a user to an institution", url)
        const postData = {
            name: this.formData.name,
            email: this.formData.email,
            institution_id: this.formData.institution,
            permissions: this.formData.permissions,
            password: this.formData.password,
            jiscid: this.formData.jiscid,
        }
        this.formIsLoading = true
        const resp = await api.post(url, postData)
        this.createdUserID = resp.data.id
        this.formIsLoading = false
        this.formIsSubmitted = true
    },
  },
  created() {},
  async mounted() {},
}
</script>

<style lang="scss">
</style>
