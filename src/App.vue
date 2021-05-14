<template>
  <v-app>

    <app-bar/>
    <v-main>
      <router-view class="mb-12" :key="$route.fullPath"/>
      <single-journal/>
    </v-main>
    <site-footer/>

    <v-snackbar
        color="warning"
        bottom
        v-model="$store.state.notSupportedMsgOpen">
      Sorry, that's not supported yet. Contact team@ourresearch.org for more info.
      <v-btn text @click="$store.commit('closeNotSupportedMsg')">close</v-btn>
    </v-snackbar>

    <v-snackbar
        bottom
        :color="$store.state.snackbarColor"
        v-model="$store.state.snackbarIsOpen">
      {{ $store.state.snackbarMsg }}

      <template v-slot:action="{ attrs }">
        <v-btn
            icon
            v-bind="attrs"
            @click="$store.commit('closeSnackbar')"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>


  </v-app>
</template>

<script>
import SingleJournal from "./components/SingleJournal/SingleJournal"
import AppBar from "./components/AppBar/AppBar"
import SiteFooter from "./components/SiteFooter";

export default {
  name: 'App',
  components: {
    SingleJournal,
    AppBar,
    SiteFooter,
  },
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: 'Unsub',
    titleTemplate: '%s | Unsub',
    link: [
      // copied over from unpaywall
      // {rel: 'favicon', href: 'favicon.png'},
      // {
      //     rel: 'chrome-webstore-item',
      //     href: 'https://chrome.google.com/webstore/detail/iplffkdpngmdjhlpjmppncnlhomiipha'
      // },
    ],

    meta: []
  },
  data: () => ({
    drawerRight: false,
    activeViewIndex: 0,
    wizardOpen: false,
  }),
  computed: {
    summary() {
      return this.$store.getters.summary
    },
    singleJournalIssnl() {
      return this.$store.state.singleJournalIssnl
    },
    singleJournalData() {
      return this.$store.state.singleJournalData
    },
    account() {
      return this.$store.state.user
    },
    selectedScenario() {
      return this.$store.getters.selectedScenario
    },

  },
  methods: {
    clearSingleJournal() {
      console.log("clear single journal")
      this.$store.commit('clearSingleJournal')
    },
    openWizard() {
      this.$store.dispatch("openWizard")
    },
  },

  async mounted() {
  },
  watch: {
    "$route": {
      immediate: false,
      handler: function (val) {
        window.Intercom('update')

        // const that = this
        // setTimeout(function () {
        //     console.log("running intercom.update()  ")
        //     that.$intercom.update()
        // }, 500)
      }
    }
  },
};
</script>

<style lang="scss">

@media (min-width: 1264px) {
  .container {
    max-width: 1264px;
  }
}

.v-content {
  background: #fafafa;
}

.v-tooltip__content {
  /*opacity: 1 !important;*/
}

.low-key-button {
  font-size: 15px;
  text-transform: none !important;
  font-weight: normal !important;
  letter-spacing: 0 !important;
}

.dot-tooltip-edit-mode-true {
  display: none !important;
}
.v-application {
.body-1 {
  letter-spacing: normal !important;
}

}

/*.container {*/
/*    max-width: 1280px;*/
/*}*/

.no-highlight {
  &::before {
    opacity: 0 !important;
  }

  &:hover::before {
    opacity: .05 !important;
  }

  .theme--light.v-btn--active::before {
    opacity: 0;
  }

  .theme--light.v-btn--active:hover::before {
    opacity: .05;
  }

  .theme--light.v-list-item--active::before {
    opacity: 0;
  }

  .theme--light.v-list-item--active:hover::before, {
    opacity: .05;
  }

}

.breadcrumbs {
  .theme--light.v-btn--active::before {
    opacity: 0;
  }

  .theme--light.v-btn {
    text-transform: none !important;
    padding: 0 5px;
  }

  .theme--light.v-btn--active:hover::before {
    opacity: .05;
  }

}


.toolbar-summary {
  display: inline-flex;

  div.bar {
    display: flex;
    flex-direction: column;
    height: 30px;
    width: 20px;
    margin-right: 2px;
    background: #ccc;
  }

  .bar-fill {
    background: #ccc;
    width: 100%;
    display: block;
    flex-grow: 10;
  }

  div.segment {
    width: 100%;
    display: block;

    &.cost {
      background: #555;
    }

    &.free-instant {
      background: green;
    }

    &.paid-instant {
      background: dodgerblue;
    }
  }
}

.v-slider--vertical {
  min-height: 400px !important;
  margin: 0 !important;
}

.main-footer {
  font-size: 14px;

  a {
    color: #fff !important;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}


a.low-key-link {
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

img.gravatar {
  border-radius: 60px;
}

// hack to get rid of vue's active class on buttons, which makes them display different
// when they are linking to the page you're on right now.
// https://github.com/vuetifyjs/vuetify/issues/8172#issuecomment-596935920
// you have to also add this to the button:
// <v-btn active-class="no-active"></v-btn>

.v-btn--active.no-active::before {
  opacity: 0 !important;
}

.entity-title {
  line-height: 1;
  margin-left: -30px;
  margin-bottom: 10px;
  .caption {
    line-height: 1;
  }
  .text-h5 {
    line-height: 1.2;
  }
}


</style>