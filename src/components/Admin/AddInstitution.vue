<template>
  <v-card flat class="publisher">
    
    <template>
      <v-card flat class="pa-5">
        <div class="text-h4 mb-6 font-weight-bold">
            Add an institution
        </div>
        <p>Before adding an institution, check if we already have it in the <strong>Lookup Institution</strong> tab to the left</p>
        <p>Look up the institution's ROR ID at <a href="https://ror.org/">ror.org</a></p>
        <p>Grab a coffee <v-icon small left>mdi-coffee-outline</v-icon>! This can take a few minutes or more as this step requires populating a database table <br><pre>(jump_apc_institutional_authorships)</pre></p>
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
            <v-alert type="success" prominent dense>
                <div class="text-h5 mb-4">Institution created!</div>
                <div>Institution ID: <strong>{{createdInstitutionID}}</strong></div>
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
  computed: {},
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
        }
        this.formIsLoading = true
        const resp = await api.post(url, postData)
        console.log("added institution response", resp)
        this.createdInstitutionID = resp.data.id
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
