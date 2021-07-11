<template>


  <div>
    <div class="best-deal-mode d-flex">
      <div class="number-and-controls">
        <div class="d-flex align-top">
          <v-btn
              :color="subrColor"
              small
              v-long-press="300"
              class="mt-2"
              icon
              :disabled="publisherIsConsortialProposalSet"

              @long-press-start="longPressStart(-1)"
              @long-press-stop="longPressStop"
              @click="changeMyCount(-1)"
          >
            <v-icon>mdi-minus</v-icon>
          </v-btn>
          <div class="input-container subscribed mx-2 text-right">
            <v-text-field
                v-model="myCount"
                dense
                hide-details
                :color="subrColor"
                :readonly="publisherIsConsortialProposalSet"
            />

          </div>

          <v-btn
              :color="subrColor"
              small
              icon
              class="mt-2"

              v-long-press="300"
              :disabled="(myCount > numJournals) || publisherIsConsortialProposalSet"
              @long-press-start="longPressStart(1)"
              @long-press-stop="longPressStop"
              @click="changeMyCount(1)"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
        <div class="text-center mt-1 body-2">
          Subscribed journals
        </div>
      </div>
      <div v-if="publisherIsConsortialProposalSet" class="number-and-controls pl-10">
        <div class="d-flex align-top">
          <div class="input-container requested ml-8 text-right">
            <v-text-field
                v-model="requestedJournalsCount"
                dense
                readonly
                hide-details
                color="#ef6c00"
            />
          </div>
        </div>
        <div class="text-center mt-2 body-2">
          Requested journals
        </div>
      </div>
    </div>

    <v-dialog v-model="dialogs.confirmStomp" max-width="400" persistent>
      <v-card>
        <v-card-title class="headline">
          Overwrite custom subscription?
        </v-card-title>
        <v-card-text class="pt-4">
          <div>
            This will overwrite your custom title-by-title journals subscription(s), and automatically subscribe
            to the {{ lastValSet }} journals with the lowest Cost Per Use. Are you sure you want to do that?
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn depressed
                 @click="confirmStomp"
                 color="primary"
          >
            Yep, overwrite it.
          </v-btn>
          <v-btn depressed
                 @click="dialogs.confirmStomp = false"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


  </div>


</template>

<script>
import LongPress from 'vue-directive-long-press'
import {mapGetters, mapMutations, mapActions} from "vuex"
import appConfigs from "../../appConfigs";

export default {
  name: "OverviewGraphicSubrsCounter",
  directives: {
    LongPress
  },
  data() {
    return {
      longPressInterval: null,
      isOkToStompCustomSubrs: false,
      allowAutoSubscribed: true,
      lastValSet: null,
      dialogs: {
        confirmStomp: false,
      }
    }
  },
  methods: {
    ...mapActions([
      "subrIndexAdd",
    ]),
    longPressStop() {
      clearInterval(this.longPressInterval)
    },
    changeMyCount(amountToChange) {
      this.myCount += amountToChange
    },
    confirmStomp() {
      this.$store.commit("setAllowAutoSubscribe", true)
      this.dialogs.confirmStomp = false
      this.myCount = this.lastValSet
    },
    longPressStart(direction) {
      const stepSize = 5
      const that = this
      this.longPressInterval = setInterval(function () {
        console.log("tick: longPressStart")
        let step = stepSize * direction
        // that.subrIndexAdd(step)
        that.myCount += step
      }, 0)
    }
  },
  computed: {
    ...mapGetters([
      "scenarioJournalsAnySubr",
      "subrIssnls",
      "scenarioJournals",
      "scenarioAllowAutosubscribe",
        "requestedJournalsCount",
        "publisherIsConsortialProposalSet",
    ]),
    numJournals() {
      return this.scenarioJournals.length
    },
    subrColor() {
      return appConfigs.colors.subr.normal
    },
    countIsTooHigh() {

    },
    myCount: {
      get() {
        return this.$store.getters.subrJournalsCount
      },
      set(val) {
        this.lastValSet = val
        if (!this.scenarioAllowAutosubscribe) {
          this.dialogs.confirmStomp = true
          return
        }

        if (val < 0) return
        if (val > this.numJournals) return
        this.$store.dispatch("subscribeUpToIndex", val)
      }
    },
    myUnsubscribedCount() {
      return this.numJournals - this.$store.getters.subrJournalsCount
    }
  },

}
</script>

<style lang="scss">
@import "./_variables.scss";

.subr-count {
  width: 180px;
}

.button {
  cursor: pointer;
  background: $subr-color;

  &:hover {
    background: darken($subr-color, 20%);
  }

  &.top {
    border-bottom: 1px solid #fff;
    border-radius: 5px 5px 0 0;
  }

  &.bottom {
    border-radius: 0 0 5px 5px;
  }
}

.number-and-controls {
  .main-number-label {
  }

  .input-container {
    width: 70px;

    .v-input input {
      //max-height: none;
    }

    .v-input {

    }

    .v-text-field--outlined fieldset {
      border-radius: 4px;
    }

    .v-text-field input {
      font-size: 1.5rem;
      font-weight: bold;
      text-align: right;
      padding-top: 0;
    }


    &.subscribed {
      .v-text-field--outlined fieldset {
        border-color: $subr-color !important;
      }

      .v-text-field input {
        color: $subr-color;
      }

      .theme--light.v-label {
        color: $subr-color;
      }
    }

    &.requested {
      .v-text-field input {
        color: $requested-color;
      }

      .theme--light.v-label {
        color: $requested-color;
      }
    }

  }


}
</style>