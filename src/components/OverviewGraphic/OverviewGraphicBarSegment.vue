<template>
  <v-dialog
      max-width="450"
      :persistent="false"
      v-model="dialogIsOpen"
  >
    <template v-slot:activator="{ on, attrs }">
      <div class="bar-segment"
           v-on="on"
           :class="{light: configObj.isLeftover}"
           :style="{height: percentage+'%', background: configObj.color.normal, color: textColor}">

                <span class="segment-label d-flex px-2" v-if="percentage > 5">
                    <span>
                        {{ configObj.displayName }}
                    </span>
                    <v-spacer/>

                    <span class="bar-value" :id="`bar-value-${configObj.name}`">
                        <template v-if="!configObj.isCurrency">{{ percentage | round }}%</template>
                        <template v-if="configObj.isCurrency">{{ count | currency(publisherCurrencySymbol) }}</template>
                    </span>
                </span>

      </div>
    </template>
    <v-card>
      <v-toolbar flat dark :color="configObj.color.normal">
        <v-toolbar-title>
          {{ configObj.displayNameLong }}
        </v-toolbar-title>
        <v-spacer/>
        <div class="font-weight-bold">
          <template v-if="!configObj.isCurrency">{{ percentage | round(1) }}%</template>
          <template v-if="configObj.isCurrency">{{ count | currency(publisherCurrencySymbol) }}</template>
        </div>
      </v-toolbar>
      <div class="pa-4">

        <template v-if="configObj.segmentType==='cost'">
          <div v-if="0" class="d-flex subtitle-1 align-center">
                <span class="name font-weight-bold">
                    {{ configObj.displayNameLong }}
                </span>
            <v-spacer/>
            <span class="number pl-3">
                    {{ count | currency(publisherCurrencySymbol) }}
                </span>
          </div>

          <span v-if="configObj.name=='costSavings'">
                This is your annual savings over the next five years,
            </span>
          <span v-if="configObj.name=='costSubr'">
                This is your subscription spend over the next five years,
            </span>
          <span v-if="configObj.name=='costRequested'">
                This is your <em>requested</em> subscription spend over the next five years,
            </span>
          <span v-if="configObj.name=='costIll'">
                This is your ILL spend over the next five years,
            </span>

          based on the current model.
        </template>
        <template v-if="configObj.segmentType==='usage'">
          <div v-if="0" class="d-flex subtitle-1 align-center">
                <span class="name font-weight-bold">
                    {{ configObj.displayNameLong }}
                </span>
            <v-spacer/>
            <span class="number pl-3">
                    {{ percentage | round }}%
                </span>
          </div>

          This is the percentage of usage that
          <span v-if="configObj.name=='usageTurnaway'">
                 can't be fulfilled by OA or the library, and won't generate an ILL request. Current research suggests that in these cases, users will email colleagues for copies, visit Sci-Hub, or find alternative articles; however, the details of user behavior in these cases are still poorly understood.
            </span>
          <span v-if="configObj.name=='usageIll'">
                 can't be fulfilled by any free source or subscription, and goes on to generate an ILL request.
            </span>
          <span v-if="configObj.name=='usageSubr'">
                can't be fulfilled by any free source, but can be fulfilled by one of your title-by-title subscriptions.
            </span>
          <span v-if="configObj.name=='usageRequested'">
                can't be fulfilled by any free source, but could be fulfilled by your <em>requested</em> title-by-title subscriptions.
            </span>
          <span v-if="configObj.name=='usageBackfile'">
                can't be fulfilled by Open Access, but can be fulfilled under your PTA rights.
            </span>
          <span v-if="configObj.name=='usageOa'">
                can be fulfilled by online Open Access.
            </span>

        </template>
      </div>
      <v-card-actions>
        <v-spacer/>
        <v-btn text @click="dialogIsOpen=false">Dismiss</v-btn>
      </v-card-actions>


    </v-card>


  </v-dialog>
</template>

<script>
import colorHighlightedPhrase from "../colorHighlightedPhrase";
import {mapGetters, mapMutations} from 'vuex'

export default {
  components: {
    colorHighlightedPhrase,
  },
  name: "OverviewGraphicBarSegment",
  props: {
    count: Number,
    countTotal: Number,

    // from the config
    configObj: Object,

    numJournals: Number,
    numJournalsSubscribed: Number,
  },
  data() {
    return {
      dialogIsOpen: false,
    }
  },
  computed: {
    ...mapGetters([
      'publisherCurrencySymbol',
    ]),
    percentage() {
      return 100 * this.count / this.countTotal
    },
    height() {
      return Math.max(this.percentage, 5)
    },
    textColor() {
      return (this.configObj.isLeftover) ? "#000" : "#fff"
    },
    subrColor() {
      return appConfigs.colors.subr.nomal
    },
    settings() {
      return this.$store.getters.configs
    },
  }
}
</script>

<style scoped lang="scss">
.bar-segment {
  padding-left: 3px;
  /*border-top: 1px solid rgba(255, 255, 255, 0.2);*/
  border-top: 1px solid #fff;
  font-size: 13px;
  color: #333;
  /*opacity: .9;*/
  cursor: pointer;

  &.light {
    opacity: .8;
  }

  span {
    cursor: default;
  }

  &:hover {
    /*background: #333 !important;*/
    /*color: #fff !important;*/
    /*opacity: 1;*/
  }
}
</style>