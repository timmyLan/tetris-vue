<template>
    <div class="block" :style="positionObject"></div>
</template>
<script>
export default {
  name: 'Block',
  props: {
    left: Number,
    top: Number
  },
  computed: {
    positionObject: function(){
      const left = this.left * this.GLOBAL.offset;
      const top = this.top * this.GLOBAL.offset;
      return {
        left:`${left}em`,
        top:`${top}em`
      }
    }
  }
}
</script>