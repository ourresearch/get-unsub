<template>
  <v-card flat class="publisher">

    <template>
      <v-card flat class="pa-5">
        <div class="text-h4 mb-6 font-weight-bold">
            Lookup an institution
        </div>
        <v-form
            v-model="formIsValid"
            ref="form"
            class="pa-3"
            :disabled="formIsLoading"
        >
            <v-row>
                <v-col cols="12" md="4">
                    <v-text-field
                        v-model="formData.name"
                        label="Institution Name"
                        outlined
                        :rules="stringRules"
                        required
                        hint="e.g., 'Arizona' or 'University of Arizona'"
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
                        Search
                    </v-btn>
                </v-col>
            </v-row>
        </v-form>
        <!-- <div :dense="institutionsSearched.length == 0" v-if="formIsSubmitted">
            No matches
        </div> -->
        <v-list>
            <v-list-item>
                <v-list-item-content>
                    Institution ID
                </v-list-item-content>
                <v-list-item-content>
                    Institution Name
                </v-list-item-content>
            </v-list-item>
        </v-list>
        <v-list :dense="institutionsSearched.length > 1">
            <v-list-item v-for="(item, index) in institutionsSearched">
                <v-list-item-avatar>
                    <v-icon small left>mdi-bank-outline</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                    <v-list-item-title class="" style="font-family: Monaco, monospace;" v-html="item.id"/>
                </v-list-item-content>
                <v-list-item-content>
                    <v-list-item-title class="" style="font-family: Monaco, monospace;" v-html="item.display_name"/>
                </v-list-item-content>
            </v-list-item>
        </v-list>
      </v-card>
    </template>

  </v-card>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex'
import {api} from "../../api";

export default {
  name: "LookupInstitution",
  components: {},
  data() {
    return {
      formData: {
          name: "",
      },
      formIsValid: false,
      formIsLoading: false,
      formIsSubmitted: false,
      institutionsSearched: [],
      stringRules: [
          v => !!v || "This field is required."
      ],
    }
  },
  computed: {},
  methods: {
    async submit() {
        this.$refs.form.validate()
        if (!this.formIsValid) {
            console.log("lookup institution form is not ready")
            return
        }
        const url = `institution/search` + "?" + "name=" + this.formData.name
        console.log("searching for institution via", url)
        this.formIsLoading = true
        const resp = await api.get(url)
        this.institutionsSearched = resp.data.matches
        console.log(this.institutionsSearched)
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
