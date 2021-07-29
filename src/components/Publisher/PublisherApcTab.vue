<template>
  <v-card flat class="publisher">
    <template v-if="institutionIsConsortium && institutionIsJisc">
      <v-card class="pa-5">
        <v-card-title>
          Article Publication Costs last year
        </v-card-title>
        <div class="pa-3">
          <div class="text-h1">£7,125,925</div>
          <div>Total APC expenditure, Gold and Hybrid</div>
        </div>
      </v-card>

    </template>
    <template v-if="!(institutionIsConsortium && institutionIsJisc)">
      <v-card flat v-if="publisherApcIsLoading" class="d-flex align-center justify-center" style="height: 200px;">
        <div>
          <v-progress-circular size="20" class="mr-4" indeterminate></v-progress-circular>
          APC data loading...
        </div>
      </v-card>

      <v-card flat class="my-4" v-if="!publisherApcIsLoading">

        <div class="pa-3">
          <span class="k">Authors from your institution paid an estimated </span>
          <span class="font-weight-bold">{{ publisherApcCost | currency(publisherCurrencySymbol) }}</span> in APCs (Article Processing Costs) to {{ publisherPublisher }} last year. This sum includes APCs paid to gold and hybrid OA journals. Because we do not have access to corresponding author information, this is an estimate only; it assumes that any author on a given paper has an equal likelihood of being the corresponding author.

        </div>

        <div class="d-flex px-3 pb-6 pt-12">
          <div class="text-h6">
            {{tableRows.length}} journals paid by authors from your institution
          </div>
          <v-spacer/>
          <v-text-field
              class="mb-1"
              hide-details
              outlined
              dense
              label="Search journals"
              v-model="search"
              append-icon="mdi-magnify"
              full-width
          />
          <v-btn icon @click="" class="ml-3">
            <download-csv
                :data="rowsForDownload"
                :labels="findKey"
            >
              <v-icon >mdi-download</v-icon>
            </download-csv>
          </v-btn>
        </div>

<!--        <v-divider></v-divider>-->
        <v-card flat>
          <v-data-table
              :headers="tableHeaders"
              :items="tableRows"
              :items-per-page="100"
              :search="search"
              :footer-props="{disableItemsPerPage:true}"
              :must-sort="true"
              :fixed-header="true"

          >
            <template v-slot:item="{ item }">
              <tr>
                <td>
                  <v-row class="" style="width:400px;">

                    <v-col style="flex-grow:222;">
                      <div>{{ item.title }}</div>

                    </v-col>
                  </v-row>
                </td>

                <td v-for="(v,k) in item"
                    v-if="!['issnl', 'title', 'subject',].includes(k)"
                    :key="item.issnl + k">
                                        <span v-if="getColDisplayType(k)==='number'">
                                            {{ v.toLocaleString() }}
                                        </span>
                  <span v-if="getColDisplayType(k)==='percent'">
                                            {{ v | round }}%
                                        </span>
                  <span v-if="getColDisplayType(k)==='currency'">
                                            {{ v | currency({symbol: publisherCurrencySymbol, fractionCount: 2}) }}
                                        </span>
                  <span v-if="getColDisplayType(k)==='currency_int'">
                                            {{ v | currency(publisherCurrencySymbol) }}
                                        </span>
                  <span v-if="getColDisplayType(k)==='text'">
                                            {{ v }}
                                        </span>
                  <span v-if="getColDisplayType(k)==='float1'">
                                            {{ v.toFixed(1) }}
                                        </span>


                </td>

              </tr>

            </template>


          </v-data-table>

        </v-card>


      </v-card>
    </template>


  </v-card>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex'

export default {
  name: "PublisherApc",
  components: {},
  data() {
    return {
      search: "",
    }
  },
  computed: {
    ...mapGetters([
      "institutionName",
      "institutionIsJisc",
      "institutionIsConsortium",

      "publisherName",
      "publisherPublisher",
      "publisherId",
      "publisherCurrencySymbol",

      // apc stuff
      "publisherApcIsLoading",
      "publisherApcPapersCount",
      "publisherApcAuthorsFractionalCount",
      "publisherApcCost",
      "publisherApcJournals",
      "publisherApcHeaders",

    ]),
    tableRows() {
      return this.$store.getters.publisherApcJournals.map(j => {
        let ret = j.table_row
        ret.title = j.meta.title
        ret.subject = j.meta.subject
        ret.issnl = j.meta.issn_l
        return ret
      })
    },
    tableHeaders() {
      const metaHeaders = [
        {text: "Title", value: "title"},
      ]
      return [...metaHeaders, ...this.publisherApcHeaders]
    },
    rowsForDownload() {
      return this.tableRows
    },
  },
  methods: {
    ...mapMutations([]),
    ...mapActions([]),
    getColDisplayType(colName) {
      const myHeader = this.publisherApcHeaders.find(h => h.value === colName)
      if (myHeader) {
        return myHeader.display
      } else {
        return "number"
      }
    },
    findKey(v, k) {
      // get the friendly human-readable version of the table for download
      let ret = k
      this.publisherApcHeaders.forEach(header => {
        if (header.value === k) {
          ret = header.text
        }
      })
      return ret
    }
  },

  created() {
  },
  async mounted() {


  },
}
</script>

<style lang="scss">
.v-toolbar__extension {
  border-top: none !important;
}

</style>