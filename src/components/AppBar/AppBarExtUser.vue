<template>
  <v-container>
    <v-tabs class="ml-1" v-model="currentTab">
        <v-tab class="low-key-button">Institutions</v-tab>
        <v-tab class="low-key-button">Consortia</v-tab>
        <v-tab class="low-key-button">Account</v-tab>
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
                "userEmail"
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