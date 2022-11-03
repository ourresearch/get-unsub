<template>
  <v-card flat class="publisher">
    
    <template>
      <v-card flat class="pa-5">
        <div class="text-h4 mb-6 font-weight-bold">
            Add an institution
        </div>
        <p>Before adding an institution, check if we already have it in the <strong>Lookup Institution</strong> tab to the left</p>
        <p>Look up the institution's ROR ID at <a href="https://ror.org/" target="_blank">ror.org</a></p>
        <p>Adding an institution requires some steps (adding citation, authorship and APC data) that can take longer than the Heroku 30 sec time limit - so we don't do all the work required to setup an institution when you click the buttom below. Every 30 min (on the top and bottom of the hour) a Heroku task (see the Advanced Scheduler in <i>unpaywall-jump-api</i> app) runs <a href="https://github.com/ourresearch/jump-api/blob/master/institutional_new_data.py" target="_blank">a script</a> that checks for new institutions and adds the citation, authorship and APC data for those institutions. Thus, the process of adding a new institution takes at most 30 minutes, and possibly less depending on how close your button click is to the top or bottom of the hour. If you add an institution via the script <a href="https://github.com/ourresearch/jump-api/blob/master/init.py" target="_blank">init.py</a>, there is no Heroku 30 sec limit, and so the long running steps of adding citation, authorship and APC data is done while the script runs.</p>
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
                        v-model="formData.institution"
                        label="Institution Name"
                        outlined
                        :rules="stringRules"
                        required
                        hint="e.g., University of Arizona"
                        persistent-hint
                    />
                </v-col>
                <v-col cols="12" md="4">
                    <v-text-field
                        v-model="formData.ror"
                        label="ROR ID(s)"
                        outlined
                        required
                        hint="Single ID (e.g. 01wka8n18) or many (e.g. 01wka8n18,03kk7td41)"
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
                        Add institution
                    </v-btn>
                </v-col>
            </v-row>
        </v-form>
        <div v-if="formIsSubmitted && !formIsLoading" class="pa-3">
            <v-alert type="success" prominent dense v-if="!errorMsg">
                <div class="text-h5 mb-4">Institution created!</div>
                <div>Institution ID: <strong>{{createdInstitutionID}}</strong></div>
            </v-alert>
            <v-alert type="error" prominent dense v-else>
                <div class="text-h5 mb-4">Error</div>
                <div>Woopsy! <strong>{{errorMsg}}</strong></div>
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
  name: "AddInstitution",
  components: {},
  data() {
    return {
      formData: {
          institution: "",
          ror: "",
      },
      formIsValid: false,
      formIsLoading: false,
      formIsSubmitted: false,
      createdInstitutionID: "",
      errorMsg: "",
      institutionsSearched: [],
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
            console.log("add institution form is not ready")
            return
        }
        const url = `institution`
        console.log("adding an institution", url)
        const postData = {
            institution_name: this.formData.institution,
            ror_ids: this.formData.ror,
            submitter_email: this.userEmail,
        }
        this.formIsLoading = true
        try {
            const resp = await api.post(url, postData)
            this.createdInstitutionID = resp.data.id
        }
        catch(e) {
            if (e.response.status === 409) {
                this.errorMsg = e.response.data.message
                // return
            }
            else {
                this.errorMsg = "Sorry, something went wrong"
            }
        }
        finally {
            this.formIsLoading = false
            this.formIsSubmitted = true
        }
    },
  },
  created() {},
  async mounted() {},
}
</script>

<style lang="scss">
</style>
