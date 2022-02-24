<template>
    <v-container class="mt-3">
        <v-card-title flat class="pa-6">        
            <div class="text-h3 mb-6 font-weight-bold">
                Webinars
            </div>
        </v-card-title>

        <v-card flat class="pa-6">
            <div class="text-h4 mb-6 font-weight-bold">
                Upcoming
            </div>
            <template class="my-2 py-2" v-for="article in webinars_future">
                <v-row class="my-2 py-2">
                  <v-col cols="6">
                    <div class="content">
                        <div class="text-h5">{{ article.headline }}</div>
                        <div class="mb-3">
                            <span class="font-italic">
                                {{ article.version }},
                            </span>
                            <span class="">
                                {{ article.date }}
                            </span>
                        </div>
                    </div>
                  </v-col>
                  <v-col cols="2">
                    <div class="action">
                      <v-btn
                          :href="article.link"
                          target="_blank"
                          small
                          text
                          class="mt-4"
                      >
                        register
                        <v-icon small right>mdi-open-in-new</v-icon>
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>

            </template>
        </v-card>
           
        <v-card flat class="pa-6">
            <div class="text-h4 mb-6 font-weight-bold">
                Past
            </div>
            <template class="my-4 py-4" v-for="article in webinars_past">
                <v-row class="my-2 py-2">
                  <v-col cols="6">
                    <div class="content">
                      <div class="text-h5">{{ article.headline }}</div>
                      <div class="mb-3">
                        <span class="font-italic">
                            {{ article.version }},
                        </span>
                        <span class="">
                            {{ article.date }}
                        </span>
                      </div>
                    </div>
                    </v-col>
                    <v-col cols="2">
                    <div class="action">
                      <v-btn
                          :href="article.link"
                          target="_blank"
                          small
                          text
                          class="mt-4"
                      >
                        watch
                        <v-icon small right>mdi-open-in-new</v-icon>
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>
            </template>
        </v-card>


    </v-container>
</template>

<script>
    import appConfigs from "../appConfigs";

    const webinars_future = [
      {
        version: "830 am PST",
        date: "8 Mar 2022",
        headline: "Deep dive on scenarios",
        quote: "In the third installment of the Unsub webinar, I'll do a deep dive on Unsub scenarios. Scenarios are the heart of what you do with Unsub - where you see your forecast, toggle parameters, and subscribe title by title. This webinar builds on the first webinar by going into more detail with Unsub scenarios.",
        link: "https://us02web.zoom.us/webinar/register/WN_cwys8_ycTfOWk03wBtnzBg",
      },
      {
        version: "330 pm PST",
        date: "10 Mar 2022",
        headline: "Deep dive on scenarios",
        quote: "In the third installment of the Unsub webinar, I'll do a deep dive on Unsub scenarios. Scenarios are the heart of what you do with Unsub - where you see your forecast, toggle parameters, and subscribe title by title. This webinar builds on the first webinar by going into more detail with Unsub scenarios.",
        link: "https://us02web.zoom.us/webinar/register/WN_99sirXH-T9u3xdxdFHT_ug",
      },
    ]

    const webinars_past = [
      {
        version: "130 pm PST",
        date: "24 Feb 2022",
        headline: "Unsub Extender",
        quote: "In the second topic of the Unsub webinar series Eric Schares talked about Unsub Extender, a tool that takes an Unsub .csv data export file and automates the creation of useful plots and interactive visualizations. This webinar was targeted mostly at current Unsub users who want to do more with the data powering Unsub. However, if you are just curious about, but not subscribing to Unsub, this webinar will provide plenty to think about.",
        link: "https://vimeo.com/681619823",
      },
      {
        version: "830 am PST",
        date: "22 Feb 2022",
        headline: "Unsub Extender",
        quote: "In the second topic of the Unsub webinar series Eric Schares talked about Unsub Extender, a tool that takes an Unsub .csv data export file and automates the creation of useful plots and interactive visualizations. This webinar was targeted mostly at current Unsub users who want to do more with the data powering Unsub. However, if you are just curious about, but not subscribing to Unsub, this webinar will provide plenty to think about.",
        link: "https://vimeo.com/680578098",
      },
      {
        version: "330 pm PST",
        date: "10 Feb 2022",
        headline: "Unsub Demo – An Overview",
        quote: "In the first installment of the Unsub webinar, a demo of Unsub - a walk-through of the product. It was targeted at both current Unsub users and folks interested in Unsub but not currently subscribing.",
        link: "https://vimeo.com/676110085",
      },
      {
        version: "830 am PST",
        date: "8 Feb 2022",
        headline: "Unsub Demo – An Overview",
        quote: "In the first installment of the Unsub webinar, a demo of Unsub - a walk-through of the product. It was targeted at both current Unsub users and folks interested in Unsub but not currently subscribing.",
        link: "https://vimeo.com/675596736",
      },
    ]

    export default {
        name: "Webinars",
        metaInfo() {
            return {
                title: `Webinars`
            }
        },
        data() {
            return {}
        },
        computed: {
            testimonialsToShow() {
                return appConfigs.testimonials.filter(t => {
            return t.displayOnPage.includes("demo")
            })
        },
        webinars_past() {
          return webinars_past
        },
        webinars_future() {
          return webinars_future
        },

        }
    }
</script>

<style scoped>

</style>
