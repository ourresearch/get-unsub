<template>
  <v-dialog scrollable max-width="1100" v-model="dialogIsOpen">
    <v-card flat v-if="scenarioZoomedJournal.issn_l">

      <v-toolbar
          flat
          dark
          :color="myColor"
      >
        <v-icon dark v-if="scenarioZoomedJournal.subscribed">mdi-cart</v-icon>
        <v-icon v-if="!scenarioZoomedJournal.subscribed">mdi-cart-outline</v-icon>

        <v-toolbar-title class="pl-3">
          <div class="">
            <div class="caption" style="line-height: 1">
              {{ mySubscriptionStatus }} journal
            </div>
            <div>
            {{ scenarioZoomedJournal.title }}
            </div>
          </div>
        </v-toolbar-title>

        <v-spacer></v-spacer>
        <v-btn icon @click="dialogIsOpen = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>

        <template v-slot:extension>
          <v-tabs
              v-model="tab"
              align-with-title
          >
            <v-tabs-slider
                :color="(scenarioZoomedJournal.subscribed) ? 'white' : 'white'"
            >

            </v-tabs-slider>

            <v-tab v-for="item in items" :key="item">
              {{ item }}
            </v-tab>
          </v-tabs>
        </template>

      </v-toolbar>
      <v-divider/>
      <v-card-text>

        <v-tabs-items v-model="tab">
          <v-tab-item
              v-for="item in items"
              :key="item"
          >
            <div flat v-if="item==='overview'">
              <v-row class="mt-6">
                <v-col cols="4">
                  <div>
                    <div class="headline mb-3">
                      Journal metadata
                    </div>
                    <single-journal-key-number-row
                        :value="scenarioZoomedJournal.subject"
                        value-is-string
                        label="Subject"
                        tooltip-text="Journal subject, as categorized by the publisher."
                    />
                    <single-journal-key-number-row
                        :value="scenarioZoomedJournal.issn_l"
                        value-is-string
                        label="ISSN"
                        tooltip-text="Unique ID for this journal"
                    />
                    <single-journal-key-number-row
                        :value="(scenarioZoomedJournal.is_society_journal) ? 'Yes' : 'No'"
                        value-is-string
                        label="Society journal"
                        tooltip-text='"Yes" indicates this journal is published by a scholarly society (data manually collected)'
                    />
                    <single-journal-key-number-row
                        :value="(scenarioZoomedJournal.bronze_oa_embargo_months) ? 'Yes' : 'No'"
                        value-is-string
                        label="Delayed OA"
                        tooltip-text='"Yes" indicates this is a "Delayed OA" journal, which makes content free to read after an embargo period has passed.'
                    />
                    <single-journal-key-number-row
                        v-if="scenarioZoomedJournal.bronze_oa_embargo_months"
                        :value="`${scenarioZoomedJournal.bronze_oa_embargo_months} months`"
                        value-is-string
                        label="OA embargo length"
                        tooltip-text='Length of the wait, after publication, for Delayed OA content to become free-to-read.'
                    />
                    <single-journal-key-number-row
                        :value="displayPerpetualAccessYears"
                        value-is-string
                        label="PTA (Post-Termination Access) rights"
                        tooltip-text="You have access to content from these years, even after you cancel your subscription."
                    />
                  </div>
                </v-col>

                <v-col cols="4">
                  <div>
                    <div class="headline mb-3">
                      Annual Usage
                    </div>

                    <single-journal-key-number-row
                        overline
                        :value="scenarioZoomedJournal.downloads"
                        operation="+"
                        label="Downloads <br> @ 1x"
                        tooltip-text="Projected annual downloads over the next five years."
                    />
                    <single-journal-key-number-row
                        :value="scenarioZoomedJournal.citations"
                        operation="+"
                        :label="`Citations <br> @ ${citationWeight}x`"
                        tooltip-text="Annual citations to this journal by your faculty, times a weighting factor (the weighting factor can be modified or removed in the Parameters menu)"
                    />
                    <single-journal-key-number-row
                        :value="scenarioZoomedJournal.authorships"
                        operation="+"
                        :label="`Authorships <br> @ ${authorshipWeight}x`"
                        tooltip-text="Annual authorships in this journal by your faculty, times a weighting factor (the weighting factor can be modified or removed in the Parameters menu)"
                    />
                    <single-journal-key-number-row
                        :value="scenarioZoomedJournal.usage"
                        operation="="
                        overline
                        large
                        label="Weighted overall uses"
                        tooltip-text="Sum of weighted downloads, citations, and authorship."
                    />
                    <single-journal-key-number-row
                        :value="scenarioZoomedJournal.use_groups_free_instant.oa"
                        operation="-"
                        :label="`Open Access (${scenarioZoomedJournal.use_oa_percent}%)`"
                        tooltip-text="Projected annual uses that can be fulfilled via Open Access. This accounts for readership patterns specific to this journal."
                    />
                    <single-journal-key-number-row
                        :value="displayBackfile"
                        operation="-"
                        :label="`Backfile (${displayBackfilePercent}%)`"
                        tooltip-text="Projected annual uses that can be fulfilled via your PTA (Post-Termination Access) rights to existing content. This accounts for readership patterns specific to this journal."
                    />
                    <single-journal-key-number-row
                        :value="negotiablUses"
                        operation="="
                        large
                        overline
                        label="Paywalled uses"
                        tooltip-text="Projected annual uses of paywalled content that lacks any free alternative source. These can be fulfilled via ILL or title-by-title subscription."
                    />
                  </div>


                </v-col>

                <v-col cols="4">
                  <div>
                    <div class="headline mb-3">
                      Annual Cost
                    </div>

                    <single-journal-key-number-row
                        :value="scenarioZoomedJournal.subscription_cost"
                        is-currency
                        overline
                        operation="+"
                        label="Base subscription cost"
                        tooltip-text="Title-by-title cost if you do subscribe."
                    />
                    <single-journal-key-number-row
                        :value="scenarioZoomedJournal.ill_cost"
                        is-currency
                        operation="-"
                        label="ILL cost"
                        tooltip-text="Annual ILL costs over the next five years, if you <em>don't</em> subscribe."
                    />
                    <single-journal-key-number-row
                        :value="scenarioZoomedJournal.subscription_minus_ill_cost"
                        is-currency
                        large
                        overline
                        operation="="
                        label="Net subscription cost"
                        tooltip-text="Annual <em>marginal</em> cost of subscribing over the next five years, compared to projected ILL cost."
                    />
                    <single-journal-key-number-row
                        :value="negotiablUses"
                        operation="÷"
                        label="Paywalled uses"
                        tooltip-text="Projected annual uses of paywalled content that lacks any free alternative source. These can be fulfilled via ILL or title-by-title subscription."
                    />
                    <single-journal-key-number-row
                        :value="scenarioZoomedJournal.cpu"
                        is-currency
                        operation="="
                        :round-to-places="2"
                        large
                        overline
                        label="Cost Per Use"
                        tooltip-text="Net Cost divided by Paywalled Uses. This version of Cost Per Use accounts for alternative access paths, multiple use types (downloads, citations, authorship), and the potential cost of ILL fulfillment."
                    />
                  </div>
                </v-col>


              </v-row>
            </div>
            <div v-if="item==='timelines'">
              <div v-if="loading" style="height: 300px;" class="d-flex align-center justify-center flex-column">
                <v-progress-linear style="width: 300px;" indeterminate/>
                <div>
                  Loading Journal detail
                </div>
              </div>
              <single-journal-by-year-tables :journal="journalDetail"/>
            </div>

            <div v-if="item==='institutions'">
              <div v-if="loading" style="height: 300px;" class="d-flex align-center justify-center flex-column">
                <v-progress-linear style="width: 300px;" indeterminate/>
                <div>
                  Loading Institution detail
                </div>
              </div>
              <v-data-table
                  v-if="!loading"
                  :headers="institutionsTableHeaders"
                  :items="institutions"
                  :hide-default-footer="true"
                  must-sort
                  :items-per-page="500"
              />
            </div>


          </v-tab-item>
        </v-tabs-items>
      </v-card-text>


      <v-divider></v-divider>
      <v-card-actions v-if="!publisherIsConsortialProposalSet">
        <v-spacer/>
        <v-btn text @click="dialogIsOpen = false">
          Close
        </v-btn>
        <v-btn depressed dark color="#555" @click="unsubscribe" v-if="scenarioZoomedJournal.subscribed">
          <v-icon>mdi-cart-arrow-up</v-icon>
          Unsubscribe
        </v-btn>
        <v-btn depressed dark color="blue" @click="subscribe" v-if="!scenarioZoomedJournal.subscribed">
          <v-icon>mdi-cart-arrow-down</v-icon>
          Subscribe
        </v-btn>
      </v-card-actions>

      <v-card-actions v-if="publisherIsConsortialProposalSet">
        <v-spacer/>
        <v-btn text @click="dialogIsOpen = false">
          Close
        </v-btn>
        <v-btn color="blue" disabled v-if="scenarioZoomedJournal.subscribed">
          <v-icon>mdi-cart-arrow-up</v-icon>
          Unsubscribe
        </v-btn>
        <v-btn depressed dark color="#ef6c00" @click="unrequest" v-if="scenarioZoomedJournal.requested">
          <v-icon>mdi-cart-arrow-up</v-icon>
          Unrequest
        </v-btn>
        <v-btn depressed dark color="#ef6c00" @click="request" v-if="!scenarioZoomedJournal.subscribed && !scenarioZoomedJournal.requested">
          <v-icon>mdi-cart-arrow-down</v-icon>
          Request
        </v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>
</template>

<script>
import {api} from "../../api";
import {mapGetters, mapActions, mapMutations} from 'vuex'
import SingleJournalByYearTables from "./SingleJournalByYearTables";
import SingleJournalKeyNumberRow from "./SingleJournalKeyNumberRow";


export default {
  name: 'SingleJournal',
  components: {
    SingleJournalByYearTables,
    SingleJournalKeyNumberRow
  },
  data: () => ({
    drawerRight: false,
    switch: false,
    showApi: false,
    journal: null,
    journalDetail: null,
    loading: false,
    tab: null,
    institutionsTableHeaders: [
      {
        text: "Name",
        value: "institution_name",
      },
      {
        text: "Cost Per Use ($)",
        value: "cpu",
        align: "end",
      },
      {
        text: "Usage (weighted)",
        value: "usage",
        align: "end",
      },
    ]
  }),
  computed: {
    ...mapGetters([
      "scenarioId",
      "scenarioZoomedJournal",
      "citationWeight",
      "authorshipWeight",
      "institutionIsConsortium",
      "publisherIsConsortialProposalSet",
    ]),
    items() {
      if (this.institutionIsConsortium) {
        return [
          "overview",
          "institutions",
        ]
      } else {
        return [
          "overview",
          "timelines",
        ]
      }
    },
    institutions() {
      if (!(this.journalDetail && this.journalDetail.member_institutions)) return []
      return this.journalDetail.member_institutions.map(i => {
        const ret = {...i}
        if (i.cpu) i.cpu = i.cpu.toFixed(2)
        return i
      })
    },
    dialogIsOpen: {
      get() {
        return !!this.$store.getters.zoomIssnl
      },
      set(val) {
        if (!val) {
          this.$store.commit("closeZoom")
        } else {
          // pass
        }
      }
    },
    summary() {
      return this.$store.getters.summary
    },
    subscribed() {
      if (this.$store.state.singleJournalData) {
        return this.$store.state.singleJournalData.journal.subscribed
      }
    },
    issnl() {
      return this.$store.getters.zoomIssnl
    },
    displayPerpetualAccessYears() {
      return this.scenarioZoomedJournal.perpetual_access_years_text
          .replace("-", " — ")
          .replace("<", "")
    },
    negotiablUses() {
      const freeUses = this.scenarioZoomedJournal.use_groups_free_instant.backfile +
          this.scenarioZoomedJournal.use_groups_free_instant.oa
      return this.scenarioZoomedJournal.usage - freeUses
    },
    displayBackfile() {
      return Math.max(
          this.scenarioZoomedJournal.use_groups_free_instant.backfile,
          0
      )
    },
    displayBackfilePercent() {
      return Math.max(
          this.scenarioZoomedJournal.use_backfile_percent,
          0
      )
    },
    myColor(){
      if (this.scenarioZoomedJournal.subscribed) return "blue"
      if (this.scenarioZoomedJournal.requested) return "#ef6c00"
      return "#555"
    },
    mySubscriptionStatus(){
      if (this.scenarioZoomedJournal.subscribed) return "Subscribed"
      if (this.scenarioZoomedJournal.requested) return "Requested"
      return "Unsubscribed"
    }

  },
  methods: {
    ...mapActions([
      "subscribeCustom",
      "unsubscribeCustom",
    ]),
    ...mapMutations([
        "snackbar",
    ]),
    async subscribe() {
      this.subscribeCustom(this.issnl)
      this.$store.commit("closeZoom")
      this.$store.getters.scenarioSnackbars.customSubrSuccess = true
    },
    async unsubscribe() {
      this.unsubscribeCustom(this.issnl)
      this.$store.commit("closeZoom")
      this.$store.getters.scenarioSnackbars.customUnsubrSuccess = true
    },
    async request() {
      this.$store.dispatch("requestCustom", this.issnl)
      this.$store.commit("closeZoom")
      this.snackbar("Journal requested")
    },
    async unrequest() {
      this.$store.dispatch("unrequestCustom", this.issnl)
      this.$store.commit("closeZoom")
      this.snackbar("Journal unrequested")
    },
    clearSingleJournal() {
      this.$store.commit('closeZoom')
      this.journal = null
      this.journalDetail = null
    },
    async getData() {
      this.loading = true

      const url = `scenario/${this.scenarioId}/journal/${this.issnl}`
      console.log("getting journal zoom detail data", url)

      const resp = await api.get(url)
      this.journalDetail = resp.data.journal
      this.loading = false
    }
  },
  watch: {
    issnl: function (to) {
      console.log("zoom issnl has changed", this.issnl)
      if (!this.issnl) return
      this.getData()
      this.tab = null
    }
  }
};
</script>

<style scoped lang="scss">
table {
  width: 100%;


}

</style>