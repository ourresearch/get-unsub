<template>
  <v-container class="pa-0">
    <v-tabs class="ml-1" v-model="currentTab">
      <v-tab class="low-key-button">
        <v-icon small left>mdi-magnify</v-icon>
        Lookup Institution
      </v-tab>
      <v-tab class="low-key-button">
        <v-icon small left>mdi-bank-outline</v-icon>
        Add Institution
      </v-tab>
      <v-tab class="low-key-button">
        <v-icon small left>mdi-account-outline</v-icon>
        Add User
      </v-tab>
      <v-tab class="low-key-button">
        <v-icon small left>mdi-account-off</v-icon>
        Remove User
      </v-tab>
    </v-tabs>
  </v-container>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'

export default {
  name: "AppBarExtAdmin",
  components: {},
  data() {
    return {
      foo: 42,
    }
  },
  methods: {},
  computed: {
    currentTab: {
      get() {
        console.log("get currentTab")
        return this.$store.getters.adminTabShowing
      },
      set(newVal) {
        this.$store.commit("setAdminTabShowing", newVal)
      }
    }
  },
  created() {
    this.currentTab = 0
  },
  watch: {
    "foo": {
      immediate: true,
      handler: function (to, from) {
      }
    }
  }
}
</script>

<style lang="scss">


</style>
