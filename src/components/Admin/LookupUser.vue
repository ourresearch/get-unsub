<template>
  <v-card flat class="publisher">

    <template>
      <v-card flat class="pa-5">
        <div class="text-h4 mb-6 font-weight-bold">
            Lookup a user
        </div>
        <v-form
            ref="form"
            class="pa-3"
            :disabled="formIsLoading"
        >
            <v-row>
                <v-col cols="12" md="4">
                    <v-text-field
                        v-model="formData.email"
                        label="User email"
                        outlined
                        hint="e.g., 'jane@uarizona.edu'"
                        persistent-hint
                        @keydown.enter="submit"
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
        <v-list>
            <v-list-item>
                <v-list-item-content>
                    User ID
                </v-list-item-content>
                <v-list-item-content>
                    User Email
                </v-list-item-content>
            </v-list-item>
        </v-list>
        <v-list :dense="usersSearched.length > 1">
            <v-list-item v-for="(item, index) in usersSearched" :key="item.id">
                <v-list-item-avatar>
                    <v-icon small left>mdi-account</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                    <v-list-item-title class="" style="font-family: Monaco, monospace;" v-html="item.id"/>
                </v-list-item-content>
                <v-list-item-content>
                    <v-list-item-title class="" style="font-family: Monaco, monospace;" v-html="item.email"/>
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
  name: "LookupUser",
  components: {},
  data() {
    return {
      formData: {
          email: "",
      },
      formIsLoading: false,
      formIsSubmitted: false,
      usersSearched: [],
    }
  },
  computed: {},
  methods: {
    async submit() {
        const url = `user/search` + "?" + "email=" + this.formData.email
        console.log("searching for user via", url)
        this.formIsLoading = true
        const resp = await api.get(url)
        this.usersSearched = resp.data.matches
        console.log(this.usersSearched)
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
