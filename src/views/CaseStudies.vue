<template>
  <v-container class="mt-3">
    <v-card flat class="pa-6">
      <div class="text-h3 font-weight-bold">
        Case Studies
      </div>

      <template class="my-4 py-4" v-for="article in articles">
        <v-row class="my-4 py-4">
          <v-col cols="2">
            <v-img
                :src="require(`../assets/press/${article.img}`)"
                width="150px"
                class="elevation-2"
                alt=""/>
          </v-col>
          <v-col cols="10" class="d-flex flex-column justify-space-between">
            <div class="content">
              <div class="text-h5">{{ article.headline }}</div>
              <div class="mb-3">
                                <span class="font-italic">
                                    {{ article.venue }},
                                </span>
                <span class="">
                                    {{ article.date }}
                                </span>

              </div>
              <q class="">{{ article.quote }}</q>

            </div>
            <div class="action">
              <v-btn
                  :href="article.link"
                  target="_blank"
                  small
                  text
                  class="mt-4"
              >
                read
                <v-icon small right>mdi-open-in-new</v-icon>
                <v-icon small right v-if="article.isPaywalled">mdi-lock-outline</v-icon>
              </v-btn>
            </div>


          </v-col>
        </v-row>

        <v-divider></v-divider>
      </template>

    </v-card>


  </v-container>
</template>

<script>
import appConfigs from "../appConfigs";

const articles = [
  {
    venue: "N8+ Consortium",
    date: "10 Jun 2022",
    headline: "N8+ Consortium: How Unsub helped UK university libraries strengthen their bargaining position in negotiations with Elsevier",
    img: "n8.png",
    quote: "Unsub showed that article availability, even after cancellation, would be so high across the " +
        "consortium that it gave N8+ members the confidence to take a robust stance in negotiations.",
    link: "n8-case-study.pdf",
  },
]


export default {
  name: "CaseStudies",
  metaInfo() {
    return {
      title: `Case Studies`
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
    articles() {
      return articles
    }

  },
}
</script>

<style scoped>

</style>