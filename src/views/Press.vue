<template>
  <v-container class="mt-3">
    <v-card flat class="pa-6">
      <div class="text-h3 font-weight-bold">
        Press
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
    venue: "Research Information",
    date: "7 May 2021",
    headline: "Tilting the balance back towards libraries",
    img: "research-information-2.png",
    quote: "The growing prevalence of open access (OA), however, offers a solution to the captivity of libraries at the hands of these big deals. Because much of the content of the big deal is now available as OA, there is now  a smoother ‘off-ramp’ to cancellation than ever before. That is, after cancellation, faculty can still access a large percentage of the relevant literature. Librarians are increasingly aware of this. ",
    link: "https://www.researchinformation.info/interview/tilting-balance-back-towards-libraries",
  },

  {
    venue: "Charleston Hub",
    date: "19 April 2021",
    headline: "Unsub: Part 1: From Big Deals to Real Deals for Academic Publishing & Libraries",
    img: "charleston-hub.png",
    quote: "Although Unsub was not created to deal with the financial crisis created by the COVID pandemic, it has been a key analytic tool as institutions face their financial futures.",
    link: "https://www.charleston-hub.com/2021/04/unsub-part-1-from-big-deals-to-real-deals-for-academic-publishing-libraries/",
  },

  {
    venue: "Research Information",
    date: "30 March 2021",
    headline: "Deal will evaluate UK journal subscriptions",
    img: "research-information.png",
    quote: "Jisc has announced that it will be using Unsub, an analytics dashboard, to help evaluate journal agreements that UK universities hold with publishers....the new partnership will allow Jisc to extend Unsub’s data-driven insights beyond these individual universities, to encompass the entire UK higher education sector.",
    link: "https://www.researchinformation.info/news/deal-will-evaluate-uk-journal-subscriptions",
  },

  {
    venue: "SPARC News",
    date: "2 September 2020",
    headline: "Unsub Gives Libraries Powerful Evidence to Walk Away from Big Deals",
    img: "sparc.png",
    quote: "Unsub...provid[es] institutions with the leverage they need when negotiating with publishers over journal subscription packages....leveling the playing field for the first time for libraries when conducting negotiations with publishers.",
    link: "https://sparcopen.org/news/2020/unsub-gives-libraries-powerful-evidence-to-walk-away-from-big-deals/",
  },
  {
    venue: "The Charleston Advisor",
    date: "2 September 2020",
    headline: "Unsub (review)",
    img: "charleston-advisor.png",
    quote: "Unsub effectively streamlines a typically arduous process....The user-friendly interface allows teams to interact with multiple data points to make well-informed decisions....★★★★",
    link: "https://doi.org/10.5260/chara.22.2.55",
    isPaywalled: true,
  },
  {
    venue: "Science",
    date: "9 July 2020",
    headline: "This tool is saving universities millions of dollars in journal subscriptions",
    img: "science.png",
    quote: 'Unsub is a “game changer,” says Mark McBride, SUNY’s library senior strategist in Albany, and “I don’t think I’m the only one who thinks that.” Like many universities chafing at high subscription fees and fearing the budget impact of the COVID-19 pandemic, SUNY was looking for savings. And with the help of Unsub, McBride says, it concluded “a big deal is no longer necessary in order for a library to function effectively.”',
    link: "https://www.sciencemag.org/news/2020/07/tool-saving-universities-millions-dollars-journal-subscriptions",
  },
  {
    venue: "The Scholarly Kitchen",
    date: "19 May 2020",
    headline: "Taking a big bite out of the Big Deal",
    img: "scholarly-kitchen.png",
    quote: "Unsub is the game-changing data analysis service that is helping librarians forecast, explore, and optimize their alternatives to the Big Deal....Librarians breaking away from the Big Deal often credit Unsub as a critical component of their strategy.",
    link: "https://scholarlykitchen.sspnet.org/2020/05/19/taking-a-big-bite-out-of-the-big-deal/",
  },


]


export default {
  name: "Press",
  metaInfo() {
    return {
      title: `Press`
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