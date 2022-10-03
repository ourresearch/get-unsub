<template>
  <v-card flat  class="setup-subtab-content">

    <div class="">

    <div class="pb-3">
      Download a report as a CSV file with those journal titles that are missing. The same titles will be missing from all scenarios within this package. 
    </div>
    <div class="pb-3">
      There are two informational columns (issn_l, publisher), and four columns for the four reasons a title could be excluded from a scenario. The columns are:
      <ul>
        <li><strong>issn_l</strong>: The linking ISSN, or ISSN-L</li>
        <li><strong>publisher</strong>: The publisher, according to OpenAlex</li>
        <li><strong>gold_oa</strong>: <code>True</code> if OpenAlex thinks the journal is Gold Open Access (OA), otherwise <code>False</code>. We can not include titles that are Gold OA because there is no subscription access route, and we currently require that</li>
        <li><strong>not_currently_publishing</strong>: <code>True</code> if we think the journal is no longer publishing, otherwise <code>False</code>. This determination is based on data from OpenAlex</li>
        <li><strong>price_not_available</strong>: <code>True</code> if there is not title price, otherwise <code>False</code>. You can fix this by <a href="https://docs.unsub.org/how-to-guides/upload-title-prices" target="_blank">uploading title prices</a>. We require title prices for a title to be included in the dashboard</li>
        <li><strong>filtered_out</strong>: <code>True</code> if you filtered the title out using the optional Journal Filter setup step, otherwise <code>False</code>. Read the docs for <a href="https://docs.unsub.org/how-to-guides/upload-journal-filter" target="_blank">journal filter</a></li>
      </ul>
    </div>
    <div class="pb-3">
      A few notes:
      <ul>
        <li>A title can be missing for more than one reason. For example, it can be Gold OA and missing a title price.</li>
        <li>For some titles you can change something so it appear in your dashboard. For example, if a title price is missing you can get a title price; if you've filtered the title out you can remove the title from your filtered titles upload. However, if the title is Gold OA or is no longer publishing, nothing can be done.</li>
        <li>Read <a href="#" target="_blank">the documentation on the missing titles report</a> for more information.</li>
        <li>Check out the <a href="https://docs.openalex.org/" target="_blank">OpenAlex documentation</a> for more about OpenAlex.</li>
      </ul>
    </div>
    <div class="pb-3">
      After looking at the report <a href="mailto:support@unsub.org" target="_blank">email us (support@unsub.org)</a> if you think any of the titles should be included in your scenarios for this package, and we'll have a look.
    </div>
    <!-- <div class="pb-3">
      Read <a href="#" target="_blank">the documentation on the missing titles report</a> for more information.
    </div> -->
    <!-- <div class="pb-3">
      Check out the <a href="https://docs.openalex.org/" target="_blank">OpenAlex documentation</a> for more about OpenAlex.
    </div> -->

    <v-card flat>
      <div class="d-flex pt-3">
        <v-btn color="primary" @click="" :href="csvUrl">
          <v-icon left>mdi-download</v-icon>
          Download
        </v-btn>
      </div>
    </v-card>

    </div>
  </v-card>
</template>


<script>
import _ from "lodash"
import {mapGetters, mapMutations, mapActions} from 'vuex'
import {urlBase} from "../../api";
import PublisherFile from "../PulisherFile/PublisherFile";
import PublisherWarning from "@/components/PublisherWarning/PublisherWarning";

export default {
  name: "PublisherSetupTabMissing",
  components: {
    PublisherFile,
    PublisherWarning,
  },
  props: {},
  data() {
    return {}
  },
  methods: {},
  computed: {
    ...mapGetters([
      "publisherName",
      "publisherId",
      "publisherBigDealCost",
      "publisherFiles",
      "getPublisherDataFile",
      "publisherCounterVersion",
    ]),
    csvUrl() {
      // urlBase ends with a slash
      let url = `${urlBase}publisher/${this.publisherId}/missing`;
      url += "?timestamp=" + `${new Date().getTime()}`
      url += "&jwt=" + localStorage.getItem("token")
      return url
    },
  },
  created() {
  },
  mounted() {

  },
  watch: {}
}
</script>

<style lang="scss">


</style>
