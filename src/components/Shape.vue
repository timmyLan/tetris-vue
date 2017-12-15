<template>
    <div class="shape" :style="positionObject" @click="changeBlockArrs">
      <div v-for="(blockArr,index) of blockArrs">
        <div v-for="(block,innerIndex) of blockArr" v-if="block">
          <Block
           :key="`${index}-${innerIndex}`"
           :left="innerIndex"
           :top="index"/>
        </div>
      </div>
    </div>
</template>
<script>
import Block from './Block';
export default {
  name: 'Shape',
  components: {
    Block
  },
  props: {
    keyCode: Number,
    arrs: Array
  },
  data: function () {
    return {
      left: 0,
      top: 0,
      blockArrs: this.arrs
    }
  },
  computed: {
    positionObject: function () {
      const left = this.left * this.GLOBAL.offset;
      const top = this.top * this.GLOBAL.offset;
      return {
        left:`${left}em`,
        top:`${top}em`
      }
    },
    parentRect: function () {
      return this.$parent.$el.getBoundingClientRect();
    },
    fontSize: function () {
      return parseFloat(window.getComputedStyle(this.$parent.$el, null).getPropertyValue('font-size'));
    },
    width: function () {
      return this.blockArrs[0].length;
    },
    height: function () {
      return this.blockArrs.length;
    }
  },
  methods: {
    changeBlockArrs: function (){
      const blockArrs = this.blockArrs.reverse();
      this.blockArrs = Object.keys(blockArrs[0]).map(function(c) {
        return blockArrs.map(function(r) { return r[c]; });
      });
    }
  },
  watch: {
    keyCode: function (newKeyCode){
      switch (newKeyCode) {
        //left
        case 37:
          if(this.left - 1 >= 0){
            this.left -= 1;
          }
          this.$emit('removeKeyCode');
          break;
        //up
        case 38:
          this.changeBlockArrs();
          this.$emit('removeKeyCode');
          break;
        //right
        case 39:
          if((this.left + this.width + 1) * this.GLOBAL.offset * this.fontSize <= this.parentRect.width){
            this.left += 1;
          }
          this.$emit('removeKeyCode');
          break;
        //down
        case 40:
          if((this.top + this.height + 1 ) * this.GLOBAL.offset * this.fontSize <= this.parentRect.height){
            this.top += 1;
          }
          this.$emit('removeKeyCode');
          break;
        default:
          this.$emit('removeKeyCode');
      }
    }
  }
}
</script>