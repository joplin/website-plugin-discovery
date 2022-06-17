<template>
  <v-app dark>
    <v-app-bar fixed app>
      <JoplinLogo class="appbar-logo"/>
      <v-spacer />
    </v-app-bar>
    <v-main>
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
    }
  },
}
</script>
<style scoped>
.appbar-logo {
  height: 40px;
  object-fit: cover;
}
</style>
