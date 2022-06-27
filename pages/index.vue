<template>
  <div>
    <v-row>
      <v-col cols="12">
        <div class="slogan text-h4 font-weight-bold text-center">
          Extend Your Joplin.
        </div>
      </v-col>
    </v-row>

    <v-col cols="12" offset-md="3" md="6">
      <div
        class="text-subtitle-1 text--primary text-center justify-center pb-6"
      >
        Joplin has a plenty of plugins provided by community which can be
        helpful in your workflow.
      </div>
    </v-col>
    <v-row>
      <v-col cols="12" offset-md="3" md="4" class="pl-4">
        <v-text-field dense outlined filled solo class="pb-12"  prepend-inner-icon="mdi-magnify"></v-text-field>
      </v-col>
      <v-col cols="2" class="pl-2 pr-4">
        <v-select :items="cats" dense outlined filled solo label="Category"></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="2">
        <v-sheet rounded="lg">
          <v-list color="transparent">
            <v-subheader>Categories</v-subheader>
            <v-list-item v-for="cat in cats" :key="cat" link>
              <v-list-item-content>
                <v-list-item-title class="text-uppercase">
                  {{ cat }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-divider class="my-2"></v-divider>

            <v-list-item link color="grey lighten-4">
              <v-list-item-content>
                <v-list-item-title> About </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-sheet>
      </v-col>

      <v-col>
        <v-sheet min-height="70vh" rounded="lg"> 
          <TrendingSection />
          <RecommendedSection />
        </v-sheet>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import RecommendedSection from '~/components/RecommendedSection.vue'
import TrendingSection from '~/components/TrendingSection.vue'
export default {
  name: 'IndexPage',
  components: { RecommendedSection, TrendingSection },
  data() {
    return {
      cats: [
        'All',
        'Appearance',
        'Developer Tools',
        'Productivity',
        'Themes',
        'Integrations',
        'Viewer',
        'Search',
        'Tags',
        'Editor',
        'Files',
        'Personal Knowledge Management',
      ],
    }
  },
}
</script>

<style scoped>
.slogan {
  padding-top: 12vh;
}
.slogan-caption {
}
</style>
