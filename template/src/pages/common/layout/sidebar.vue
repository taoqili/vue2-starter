<template>
  <div class="sidebar-wrapper">
    <menubar></menubar>
  </div>
</template>
<script>
  import menubar from './menubar.vue'
  export default {
    name: 'sidebar',
    components: {
      menubar
    }
  }
</script>
<style scoped>
  .sidebar-wrapper {
  }
</style>