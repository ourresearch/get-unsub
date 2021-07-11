<template>
  <tr
      :class="{isSubscribed, isRequested}"
      @click.exact="openSingleJournal"
      @click.ctrl="toggleCustomSubscribed"
      @click.meta="toggleCustomSubscribed"
  >
    <td class="title-column d-flex">
      <div class="icon">
        <v-icon dark small v-if="isSubscribed">mdi-cart</v-icon>
        <v-icon color="#ddd" small v-if="!isSubscribed">mdi-cart-outline</v-icon>
      </div>
      <div class="ml-2">{{ journal.title }}</div>
    </td>

    <td
        v-for="header in headers"
        :key="journal.issn_l + header.value"
    >
            <span v-if="header.display==='number'">
                {{ journal[header.value].toLocaleString() }}
            </span>
      <span v-if="header.display==='percent'">
                {{ journal[header.value] | round }}%
            </span>
      <span v-if="header.display==='currency'">
                <template v-if="typeof journal[header.value] === 'number'">
                    {{ journal[header.value] | currency({symbol: publisherCurrencySymbol, fractionCount: 2}) }}
                </template>
                <template v-if="typeof journal[header.value] !== 'number'">
                    &mdash;
                </template>
            </span>
      <span v-if="header.display==='currency_int'">
                {{ journal[header.value] | currency(publisherCurrencySymbol) }}
            </span>
      <span v-if="header.display==='text'">
                {{ journal[header.value] }}
            </span>
      <span v-if="header.display==='boolean'">
                {{ journal[header.value] }}
            </span>
      <span v-if="header.display==='float1'">
                {{ journal[header.value].toFixed(1) }}
            </span>
    </td>

    <td class="spacer">&nbsp;</td>


  </tr>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  props: ["journal", "headers"],
  name: "JournalRow",

  methods: {
    subscribe() {
      console.log("subscribe!")
      this.$store.dispatch("subscribeCustom", this.journal.issn_l)
    },
    unsubscribe() {
      console.log("unsubscribe!")
      this.$store.dispatch("unsubscribeCustom", this.journal.issn_l)
    },
    openSingleJournal() {
      console.log("@click on openSingleJournal()")
      this.$store.commit('setZoomIssnl', this.journal.issn_l)
    },
    toggleCustomSubscribed() {
      console.log("custom subscribe!")
      if (this.publisherIsConsortialProposalSet) {
        if (this.journal.subscribed) return // subscriptions are read-only for you.
        if (this.journal.requested) {
          this.$store.dispatch("unrequestCustom", this.journal.issn_l)
        } else {
          this.$store.dispatch("requestCustom", this.journal.issn_l)
        }
      }

      // nearly everyone everytime will use this
      else {
        if (this.journal.subscribed) {
          this.$store.dispatch("unsubscribeCustom", this.journal.issn_l)
        } else {
          this.$store.dispatch("subscribeCustom", this.journal.issn_l)
        }
      }


    },
  },
  computed: {
    ...mapGetters([
      'publisherCurrencySymbol',
      "publisherIsConsortialProposalSet",
    ]),
    isSubscribed() {
      return this.journal.subscribed || this.journal.customSubscribed
    },
    isRequested(){
      return this.journal.requested
    },
  }
}
</script>

<style scoped lang="scss">
@import "./_variables.scss";

tr.isSubscribed {
  background: $subr-color;
  color: #fff;

  &:hover {
    background: darken($subr-color, 10%);
  }
}
tr.isRequested {
  background: $requested-color;
  color: #fff;

  &:hover {
    background: darken($requested-color, 10%);
  }
}

td {
  padding: 5px 10px;
  text-align: right;

  &.title-column {
    text-align: left;
  }
}

</style>