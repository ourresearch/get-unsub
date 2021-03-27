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
                        Unsub gives you the data to reevaluate your deal's value, and understand your cancellation
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


        <v-card v-if="0" flat tile color="blue" class="selling-point-card pb-12">
            <div class="text-center text-h4 text-sm-h3 white--text pt-12">
                Take the guided tour:
            </div>
            <div class=""
                 style="width: 100% !important; max-width: 1280px; margin: 20px auto; background: #fff; border: 3px solid #444;">
                <vimeo-player ref="player" :video-id="420183913" :options="{'responsive':true}"></vimeo-player>

            </div>
        </v-card>


        <div v-if="0" class="old-selling-points">

            <v-card flat tile color="blue" class="selling-point-card">
                <div class="selling-point-container">
                    <div class="selling-point-text">
                        <h2 class="text-h4 text-sm-h3">
                            Get all the data you need, in one place
                        </h2>
                        <div class="text-sm-h6  mt-8">
                            Upload your COUNTER JR1s and we take care of the rest...for every journal, we gather
                            citations
                            and authorship from your faculty, OA percentages, à la carte pricing, and more. Setup takes
                            just
                            a few hours.

                        </div>
                    </div>
                    <div class="d-none d-sm-block">
                        <img src="../../assets/illustrations/gather.png" style="transform: scaleX(-1); width: 300px;"
                             alt="">
                    </div>
                </div>
            </v-card>
            <v-card flat tile color="blue" class="selling-point-card">
                <div class="selling-point-container">
                    <div class="d-none d-sm-block">
                        <img src="../../assets/illustrations/prediction.png" style="width: 400px;" alt="">
                    </div>
                    <div class="selling-point-text">
                        <h2 class="text-h4 text-sm-h3">
                            Forecast with confidence
                        </h2>
                        <div class="text-sm-h6 mt-8">
                            Predict your costs and fulfillment in different cancellation scenarios, and find the best
                            value
                            for you. Our forecasting model is trained on data from thousands of universities, then
                            customized using your unique data.

                        </div>
                    </div>
                </div>
            </v-card>
            <v-card flat tile color="blue" class="selling-point-card">
                <div class="selling-point-container">
                    <div class="selling-point-text">
                        <h2 class="text-h4 text-sm-h3">
                            Customize everything
                        </h2>
                        <div class="text-sm-h6 mt-8">
                            Try out different assumptions to compare best-case and worst-case scenarios...everything in
                            the
                            model can be modified, from per-transaction ILL costs, to exclusion of subtypes of Open
                            Access.
                        </div>
                    </div>
                    <div class="d-none d-sm-block">
                        <img src="../../assets/illustrations/customize.png" style="width: 300px;" alt="">
                    </div>
                </div>
            </v-card>
            <v-card flat tile color="blue" class="selling-point-card">
                <div class="selling-point-container">
                    <div class="d-none d-sm-block">
                        <img src="../../assets/illustrations/presentation.png" style="width: 400px;" alt="">
                    </div>
                    <div class="selling-point-text">
                        <h2 class="text-h4 text-sm-h3">
                            Communicate your message
                        </h2>
                        <div class="text-sm-h6 mt-8">
                            Use our PowerPoint-ready graphics and stats to help you share a positive, well-researched
                            message to campus stakeholders.


                        </div>
                    </div>
                </div>
            </v-card>
        </div>


    </div>


</template>

<script>
    import HomepageUserLogos from "./HomepageUserLogos";
    import HomepageSellingPoints from "./HomepageSellingPoints";

    // https://www.npmjs.com/package/vue-vimeo-player
    import {vueVimeoPlayer} from 'vue-vimeo-player'


    export default {
        name: 'home',
        components: {
            vimeoPlayer: vueVimeoPlayer,
            HomepageUserLogos,
            HomepageSellingPoints,
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
        background: linear-gradient(0deg, #eee 20%, #fff 20%,);
    }




</style>
