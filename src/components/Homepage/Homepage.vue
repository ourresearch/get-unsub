<template>
    <div class="home">
        <div class="pt-10 above-the-fold">
            <v-container class="text-center mt-10">
                <div class="tagline mt-10">
                    <h1 class="text-h2 mb-6 font-weight-bold">
                        A better way to analyze your Big Deal.
                    </h1>
                </div>
                <div class="text-h5 d-flex justify-center">
                    <p style="max-width: 600px;">
                        The Unsub dashboard helps you reevaluate your deal's value, and understand your cancellation
                        options.

                    </p>

                </div>
                <div class="mb-10 ">
                    <v-btn
                            to="./request-demo"
                            x-large
                            class=""
                            color="primary">
                        Get demo
                    </v-btn>

                </div>

                <!--                       src="https://i.imgur.com/ddWJutv.png"-->
                <!--                this thing is handy: https://browserframe.com/-->
                <v-img
                        src="../../assets/screenshot-in-frame.png"
                        width="100%"
                        alt=""></v-img>
            </v-container>

        </div>


        <homepage-user-logos/>

        <homepage-selling-points />

        <homepage-testimonials />

        <v-card flat tile class=""  style="margin-bottom: -50px; padding: 150px 0;">
            <v-container class="text-center my-12 py-6">
                <div class="text-h4 py-2">
                    Want to learn more?
                </div>
                <div class="text-h5">
                    Schedule a free custom demo, or watch our video guided tour.
                </div>
                <div class="mt-4">
                    <v-btn
                            to="./request-demo"
                            x-large
                            class="ma-4"
                            dark
                            color="primary"
                    >
                        Get your demo
                    </v-btn>
                    <v-btn
                            href="https://vimeo.com/420183913"
                            target="_blank"
                            x-large
                            class="ma-4">
                        Watch video
                        <v-icon small class="ml-2">mdi-open-in-new</v-icon>
                    </v-btn>

                </div>
            </v-container>

        </v-card>


        <v-card v-if="0" flat tile color="blue" class="selling-point-card pb-12">
            <div class="text-center text-h4 text-sm-h3 white--text pt-12">
                Take the guided tour:
            </div>
            <div class=""
                 style="width: 100% !important; max-width: 1280px; margin: 20px auto; background: #fff; border: 3px solid #444;">
                <vimeo-player ref="player" :video-id="420183913" :options="{'responsive':true}"></vimeo-player>

            </div>
        </v-card>




    </div>


</template>

<script>
    import HomepageUserLogos from "./HomepageUserLogos";
    import HomepageSellingPoints from "./HomepageSellingPoints";
    import HomepageTestimonials from "./HomepageTestimonials";

    // https://www.npmjs.com/package/vue-vimeo-player
    import {vueVimeoPlayer} from 'vue-vimeo-player'


    export default {
        name: 'home',
        components: {
            vimeoPlayer: vueVimeoPlayer,
            HomepageUserLogos,
            HomepageSellingPoints,
            HomepageTestimonials,
        },
        metaInfo: {
            // title: "Unsub: Get the data you need to reassess your library's Big Deal",
            // title: "Unsub: Library journals assessment dashboard for your Big Deal.",
            title: "Unsub: Library journals assessment tool for your Big Deal",
            titleTemplate: undefined, // have to override this or it'll get the site title template
        },
        data() {
            return {
                userEmail: "",
                errorMsg: ""
            }
        },
        computed: {
            count() {
                return this.$store.getters.count
            },
            productTourEmailSubject() {
                return encodeURIComponent("I'd like to schedule an Unsub product tour")
            },
        },
        methods: {},
        mounted() {
            if (this.$store.getters.userId) this.$router.push("/u")
            this.$store.commit("setIsLandingPage", true)
        },
        destroyed() {
            this.$store.commit("setIsLandingPage", false)
        },
    }
</script>

<style lang="scss">

    .above-the-fold {
        /*background: linear-gradient(0deg, rgba(230,230,230,1) 0%, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 100%);*/
        background: linear-gradient(0deg, #eee 20%, #fff 20%);
    }




</style>
