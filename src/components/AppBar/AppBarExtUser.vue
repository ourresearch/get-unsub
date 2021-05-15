<template>
  <v-container class="pa-0">
    <v-tabs class="ml-1" v-model="currentTab">
        <v-tab class="low-key-button">
          <v-icon small left>mdi-bank-outline</v-icon>
          Institutions
          <span class="caption ml-2">({{userInstitutions.length}})</span>
        </v-tab>
        <v-tab v-if="userConsortia.length" class="low-key-button">
          <v-icon small left>mdi-lan</v-icon>
          Consortia
          <span class="caption ml-2">({{userConsortia.length}})</span>
        </v-tab>
        <v-tab class="low-key-button">
          <v-icon small left>mdi-cog-outline</v-icon>
          Settings
        </v-tab>
    </v-tabs>

  </v-container>
</template>

<script>
    import {mapGetters, mapMutations} from 'vuex'

    export default {
        name: "AppBarExtUser",
        components: {},
        data() {
            return {
                foo: 42,
            }
        },
        methods: {},
        computed: {
            ...mapGetters([
                "userEmail",
                "userInstitutions",
                "userConsortia",
            ]),
            currentTab: {
                get() {
                    console.log("get currentTab")
                    return this.$store.getters.userTabShowing
                },
                set(newVal) {
                    this.$store.commit("setUserTabShowing", newVal)
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