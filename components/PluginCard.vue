<template>
  <v-card outlined class="mx-auto" max-width="400">
    <v-card-title class="pb-2">
      <v-icon left> {{ getPluginIcon() }} </v-icon>
      <span class="text-h6">{{ plugin.name }}</span>
      <v-spacer></v-spacer>
    </v-card-title>

    <v-card-text
      class="text-body font-weight-bold pb-0 overflow-hidden"
      style="height: 40px"
    >
      {{ plugin.description }}
    </v-card-text>
    <v-card-text class="pb-0">
      <template v-for="cat in plugin.categories">
        <v-chip :key="cat" small color="Primary" class="ml-0 mr-2 my-1">
          {{ cat }}
        </v-chip>
      </template>
    </v-card-text>
    <v-card-actions class="pl-4">
      <v-row>
        <v-col>
          <a color="blue darken-2">
            Learn more
            <v-icon color="blue darken-2">mdi-arrow-right-thin</v-icon>
          </a>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    plugin: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    //
  }),
  methods: {
    getPluginIcon() {
      if (this.plugin.icon) {
        return this.plugin.icon
      }
      // if (this.plugin.category) {
      //   return `mdi-${this.plugin.category}`;
      // }
      return 'mdi-puzzle-outline'
    },
  },
}
</script>

<style></style>
