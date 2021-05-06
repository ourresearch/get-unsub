<template>
  <v-card flat>
    <!--    <v-card-title class="pr-4">-->
    <!--                            <div>-->
    <!--                                ROR IDs <span class="body-2">({{institutionRorIds.length}})</span>-->
    <!--                            </div>-->

    <div class="pa-3">
      <div class="body-2">
        A ROR ID is a unique ID (like an ISSN) for research institutions. We base your
        institutional citation and authorship counts on your institution's ROR ID(s).
      </div>
      <v-list :dense="institutionRorIds.length > 1">
        <v-list-item
            v-for="rorId in institutionRorIds"
            :key="rorId"
        >
          <v-list-item-avatar>
            <v-icon>mdi-map-marker-outline</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="" style="font-family: Monaco, monospace;" v-html="rorId"/>

            <v-list-item-subtitle v-if="rorId === '00xbe3815'">
              (demo ROR ID)
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-tooltip bottom color="#333" max-width="200">
              <template v-slot:activator="{on}">
                <v-btn v-on="on" icon :href="`https://ror.org/${rorId}`" target="_blank">
                  <v-icon>mdi-open-in-new</v-icon>
                </v-btn>
              </template>
              <div>
                View record on www.ror.org
              </div>

            </v-tooltip>
          </v-list-item-action>
        </v-list-item>
      </v-list>

    </div>


  </v-card>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'

const shortUuid = require('short-uuid');

export default {
  name: "InstitutionRorList",
  components: {},
  props: {},
  data() {
    return {
      dialogs: {
        createGroupMember: false,
      }
    }
  },
  methods: {
    ...mapMutations([
      "snackbar",
    ]),
  },
  computed: {
    ...mapGetters([
      'institutionId',
      'institutionName',
      'institutionIsDemo',
      "institutionIsConsortium",
      "institutionUsersWithRoles",
      "institutionRorIds",
      'userConsortia',
      'userInstitutions',
    ]),


  },
  created() {
  },
  mounted() {
  },
  watch: {
    "foo": {
      immediate: true,
      handler: function (to, from) {
      }
    }
  }
}
</script>

<style lang="scss">


</style>