<template>
  <div class="container">
    <h3>Image Picker</h3>
    <hr />
    <div>
      {{ mydata }}
    </div>
  </div>
</template>
<script>
export default {
  data: () => ({
    mydata: 'test!!!!!!!!!!!!!!!!!!!!111'
  }),
  computed: { },
  created () {
    console.log('New tab')
  },
  mounted () { },
  methods: { }
}
</script>
<style>
  .container {
    width: 400px;
  }
  .container h3 {
    text-align: center;
  }
</style>
