<template>
  <v-app id="inspire">
    <v-app-bar app flat>
      <v-container class="py-0 fill-height">
        <!-- <v-avatar class="mr-10" color="grey darken-1" size="32"></v-avatar> -->
        <JoplinLogo class="appbar-logo" />
        <v-btn v-for="link in links" :key="link" text>
          {{ link }}
        </v-btn>

        <v-spacer></v-spacer>

        <v-responsive max-width="260">
          <v-text-field
            dense
            flat
            hide-details
            rounded
            solo-inverted
          ></v-text-field>
        </v-responsive>
      </v-container>
    </v-app-bar>

    <v-main class="grey lighten-3">
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import JoplinLogo from '~/components/JoplinLogo.vue'
export default {
  name: 'DefaultLayout',
  components: { JoplinLogo },
  data() {
    return {
      fixed: false,
      links: ['Trending','Recommended', 'All'],
    }
  },
}
</script>
<style scoped>
.appbar-logo {
  height: 38px;
  object-fit: cover;
  padding-right: 20px;
  margin-top: -2px;
}
</style>


