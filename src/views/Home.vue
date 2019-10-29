<template>
    <v-container class="home">
        <v-row>
            <v-col>
                <h1 class="display-2 mb-6">
                    Get more value from your serials budget.
                </h1>
                <div class="headline">
                    Unpaywall Journals helps librarians confidently manage their serials collections using journal-level citations, downloads, Open Access statistics, and more.
                </div>
                <div class="my-3">
                    <v-btn class="mr-3" depressed large color="primary">Purchase</v-btn>
                    <v-btn @click="loginDemo" outlined large color="primary">View Demo</v-btn>
                </div>
            </v-col>
            <v-col>
                <vue-vimeo-player ref="player" :video-id="367935705"></vue-vimeo-player>

            </v-col>


        </v-row>



    </v-container>


</template>

<script>
    // https://www.npmjs.com/package/vue-vimeo-player
    import { vueVimeoPlayer } from 'vue-vimeo-player'

    export default {
        name: 'home',
        components: {vueVimeoPlayer},
        methods: {
            loginDemo(){
                this.$store.dispatch("loginDemo")
                    .then(()=>this.$router.push("/a/"+this.$store.state.user.id))
                    .catch(err => console.log("error", err))
            }
        },
        computed: {
            count() {
                return this.$store.getters.count
            }
        },
        mounted(){
            console.log("mount up")
        },
    }
</script>
