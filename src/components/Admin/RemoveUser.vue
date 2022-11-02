<template>
  <v-card flat class="publisher">
    <template>
      <v-card flat class="pa-5">
            <div class="text-h4 mb-6 font-weight-bold">
                Remove user access from an institution
            </div>
            <p>This action does not delete the user or the institution. This action removes all permissions for the user and institution pair. Access can be given back by going to the <strong>Add User</strong> tab.</p>
            <p>You can look up institution IDs in the <strong>Lookup Institution</strong> tab to the left, in the Unsub database, or the <a href="https://docs.google.com/spreadsheets/d/1QRHMFxr9KyTjnmmk9uubCPP80RRcXald-MButhp2ZwQ/edit#gid=1782987841" target="_blank">institution level summary spreadsheet</a>.</p>
            <p>The blue button will spin while the action is underway; you'll get a green alert under the blue button when it's done</p>
            <v-form
                v-model="formIsValid"
                ref="form"
                class="pa-3"
                :disabled="formIsLoading"
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
                            :rules="stringRules"
                            required
                            hint="e.g., institution-qfB9zhq5upVN"
                            persistent-hint
                        />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="4">
                        <v-btn
                            @click="submit"
                            color="primary"
                            x-large
                            :loading="formIsLoading"
                        >
                            Remove user
                        </v-btn>
                    </v-col>
                </v-row>
            </v-form>
            <div v-if="formIsSubmitted && !formIsLoading" class="pa-3 ">
                <v-alert type="success" prominent dense>
                    <div class="text-h5 mb-4">User access removed.</div>
                    <div>Access to <strong>{{ formData.institution }}</strong> removed for <strong>{{ formData.email }}</strong></div>
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
  name: "RemoveUser",
  components: {},
  data() {
    return {
      formData: {
          email: "",
          institution: "",
      },
      formIsValid: false,
      formIsLoading: false,
      formIsSubmitted: false,
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
    ...mapGetters([
        "userEmail",
    ]),
  },
  methods: {
    async submit() {
        this.$refs.form.validate()
        if (!this.formIsValid) {
            console.log("remove user form is not ready")
            return
        }
        const url = `user/remove-access`
        console.log("removing a user from an institution", url)
        const postData = {
            email: this.formData.email,
            institution_id: this.formData.institution,
            submitter_email: this.userEmail,
        }
        this.formIsLoading = true
        const resp = await api.post(url, postData)
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
