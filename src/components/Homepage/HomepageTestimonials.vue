<template>
    <v-card color="blue" style="padding: 100px 0;">
        <v-container fluid style="max-width: 1500px;">
            <div class="text-h3 text-center white--text ">Users ❤︎ Unsub</div>
            <div class="white--text text-center mb-6 text-body-1" >
                But you don't have to take our word for it! Here's a sample of feedback we've received:
            </div>
            <div class="d-flex flex-wrap">
                <v-card
                        v-for="testimonial in testimonialsToShow"
                        :key="testimonial.img"
                        class="my-2 pa-3 mx-1 d-flex flex-column"
                        style="flex: 1; min-width: 200px;"

                >
                    <div class="top-of-card">
                        <div class="d-flex justify-center">
                            <v-avatar class="my-3" size="80">
                                <v-img :src="testimonial.img"></v-img>
                            </v-avatar>

                        </div>
                        <div class="" v-html='`<q>${testimonial.quote}</q>`'>
                        </div>

                    </div>
                    <v-spacer></v-spacer>
                    <v-divider class="my-1"></v-divider>
                    <div class="bottom-of-card">
                            <div class="body-2">
                                <em>

                                    &mdash;{{testimonial.name}}, {{testimonial.job}} at
                                    {{testimonial.institution}}
                                </em>
                            </div>
                    </div>


                </v-card>

            </div>


        </v-container>
    </v-card>
</template>

<script>
    import appConfigs from "../../appConfigs";

    export default {
        name: "HomepageTestimonials",

        metaInfo() {
            return {
                title: `Request Demo`
            }
        },
        data() {
            return {
                formIsSubmitted: false,
            }
        },
        computed: {
            testimonialsToShow() {
                return appConfigs.testimonials.filter(t => {
                    return t.displayOnPage.includes("homepage")
                })
            },

        },
    }
</script>

<style scoped>

</style>