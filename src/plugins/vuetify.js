import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import colors from 'vuetify/lib/util/colors'


Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: colors.blue,
                secondary: colors.grey.darken1,
                accent: colors.shades.black,
            }
        },
    },

    icons: {
        iconfont: 'mdi',
    },
});
