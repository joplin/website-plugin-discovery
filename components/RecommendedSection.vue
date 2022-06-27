<template>
  <div>
    <v-row class="mt-0">
      <v-col cols="12" class="px-12 py-6">
        <div class="text-h6">Recommended Plugins</div>
      </v-col>
    </v-row>
    <v-row class="mt-0 mx-6">
      <template v-for="plugin in plugins">
        <v-col :key="plugin.id" cols="4">
          <PluginCard :plugin="plugin" :show-actions="false" />
        </v-col>
      </template>
    </v-row>
  </div>
</template>

<script>
import PluginCard from './PluginCard.vue'
export default {
  components: { PluginCard },
  data() {
    return {
      plugins: [
        {
          manifest_version: 1,
          id: 'retr0ve.EmojiPlugin',
          app_min_version: '2.7',
          version: '1.0.4',
          name: 'Emoji',
          description: 'A emoji picker.',
          author: 'Retr0ve',
          homepage_url:
            'https://discourse.joplinapp.org/t/plugin-emoji-picker/24228',
          repository_url: 'https://github.com/Retr0ve/joplin-plugin-emoji',
          keywords: ['emoji'],
          categories: ['editor'],
        },
        {
          manifest_version: 1,
          id: 'aa.asrient.backstage',
          app_min_version: '2.7',
          version: '1.0.0',
          name: 'Backstage',
          description: 'Scan and import files directly from your phone',
          author: 'Asrient',
          homepage_url: 'https://asrient.github.io/backstage',
          repository_url: 'https://github.com/asrient/backstage',
          keywords: ['import', 'scan', 'files', 'images'],
          categories: ['files', 'productivity', 'integrations'],
          _publish_hash:
            'sha256:2a8ccf5e9b6d1457dded3cc94e78bf6f1aa94769db426dfbf43ffb919093bee8',
          _publish_commit: 'master:ec17fce44ea272d2959a2c0651f069d7ddc3adde',
          _npm_package_name: 'joplin-plugin-backstage',
        },
        {
          manifest_version: 1,
          id: 'shufo.markdown-prettier',
          app_min_version: '2.8',
          version: '0.1.0',
          name: 'Markdown Prettier',
          description: 'Format your markdown by prettier',
          author: 'shufo',
          homepage_url:
            'https://github.com/shufo/joplin-plugin-markdown-prettier',
          repository_url:
            'https://github.com/shufo/joplin-plugin-markdown-prettier',
          keywords: ['prettier', 'formatter'],
          categories: ['productivity'],
          _publish_hash:
            'sha256:bed5a77aadadec868af2be7bc98cfdd178732cd656c85dfbb29779c9d678a6fc',
          _publish_commit: 'main:8da3853dd21f7d6cf7b4a9a9fb200e7a0296693b',
          _npm_package_name: 'joplin-plugin-markdown-prettier',
        },
        {
          manifest_version: 1,
          id: 'net.noeto.JoplinBibleNotes',
          app_min_version: '2.2',
          version: '0.2.0',
          name: 'Joplin Bible Notes',
          description:
            'A Joplin plugin that helps find easily in which notes you spoke about a Bible reference.',
          author: 'Tojo Rakotoarison',
          homepage_url: '',
          repository_url: 'https://github.com/tojoRs/joplin-bible-notes',
          keywords: ['Bible', 'references'],
          _publish_hash:
            'sha256:41426a7a81ffe6e4568f71589b607bdb478572eabc46a72acea52aa72ed7d189',
          _publish_commit: 'main:6f91bae2b0278a9c2b42f9c5ac9558053314eb16',
          _npm_package_name: 'joplin-plugin-biblenotes',
        },
        {
          manifest_version: 1,
          id: 'com.font.size.shortcut',
          app_min_version: '2.7',
          version: '1.0.0',
          name: 'Font Size Shortcut',
          description: 'Adds shortcuts to increase/decrease font size',
          author: 'mak2002',
          homepage_url:
            'https://github.com/mak2002/joplin-font-size-shortcut.git',
          repository_url:
            'https://github.com/mak2002/joplin-font-size-shortcut.git',
          keywords: ['font', 'font size'],
          categories: ['editor'],
          _publish_hash:
            'sha256:17f082366d61649f92ccb37022460d2d7a28977015624afac04fe8bedeb253bb',
          _publish_commit: 'master:7e37439126553a97b5cfe446c9e7def1aa68e7ae',
          _npm_package_name: 'joplin-plugin-font-size-shortcut',
        },
      ],
    }
  },
}
</script>

<style></style>
