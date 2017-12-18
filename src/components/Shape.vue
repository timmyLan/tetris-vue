<template>
    <div class="shape" :style="positionObject">
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
    arr: Array,
    active: Boolean,
    area: Array,
    parentRect:Object,
    fontSize:Number,
    initLeft:Number,
    initTop:Number,
    count: Number
  },
  data: function () {
    return {
      left: this.initLeft,
      top: this.initTop,
      blockArrs: this.arr,
      isActive: this.active
    }
  },
  created: function (){
    this.fallDown();
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
    width: function () {
      return this.blockArrs[0].length;
    },
    height: function () {
      return this.blockArrs.length;
    }
  },
  methods: {
    transformBlockArrs: function () {
      const revBlockArrs = this.blockArrs.reverse();
      return Object.keys(revBlockArrs[0]).map(function(c) {
        return revBlockArrs.map(function(r) { return r[c]; });
      });
    },
    canMove: function (direction) {
      let canMove = true;
      if(direction === 'left'){
        if(this.count){
          if(this.left - 1 < 0){
            return canMove = false;
          }
          const blockArrs = this.blockArrs;
            for(let i = 0;i < blockArrs.length;i++){
              if(!canMove) break;
              for(let j = 0;j< blockArrs[0].length;j++){
                  if(this.area[i+this.top][j+this.left-1] == 1){
                      canMove = false;
                      break;
                  }
              }
            }
        }else{
          canMove = this.left - 1 >= 0;
        }
      }else if(direction === 'right'){
        if(this.count){
          if(this.left + this.width + 1 > this.area[0].length){
            return canMove = false;
          }
          const blockArrs = this.blockArrs;
            for(let i = 0;i < blockArrs.length;i++){
              if(!canMove) break;
              for(let j = 0;j< blockArrs[0].length;j++){
                  if(this.area[i+this.top][j+this.left+1] == 1){
                      canMove = false;
                      break;
                  }
              }
            }
        }else{
          canMove = this.left + this.width + 1 <= this.area[0].length;
        }
      }else if(direction === 'down'){
        if(this.count){
          if(this.top + this.height + 1 > this.area.length){
            return canMove = false;
          }
          for(let i = 0;i < this.blockArrs.length;i++){
            for(let j = 0;j< this.blockArrs[0].length;j++){
                if(this.area[i+this.top+1][j+this.left] === 1){
                    return canMove = false;
                }
            }
          }
        }else{
          canMove = this.top + this.height + 1 <= this.area.length;
        }
      }else{
        console.log('error direction');
      }
      return canMove;
    },
    fallDown: function () {
      if(this.isActive){
          setTimeout(function loop() {
          if(this.canMove('down')){
            this.top++;
            setTimeout(loop.bind(this), 600);
          }else{
            console.log('can not fallDown!');
            this.isActive = false;
            clearTimeout(this.fallDown);
            this.$emit('update:initLeft', this.left);
            this.$emit('update:initTop', this.top);
            this.$emit('upDateArea');
            this.$emit('init');
          }
        }.bind(this), 600);
      }
    }
  },
  watch: {
    keyCode: function (newKeyCode){
      if(this.isActive){
        switch (newKeyCode) {
        //left
        case 37:
          if(this.canMove('left')){
            this.left -= 1;
          }
          this.$emit('removeKeyCode');
          break;
        //up
        case 38:
          if((this.left + this.height) * this.GLOBAL.offset * this.fontSize <= this.parentRect.width && (this.top + this.width) * this.GLOBAL.offset * this.fontSize <= this.parentRect.height){
            this.blockArrs = this.transformBlockArrs();
          }
          this.$emit('removeKeyCode');
          break;
        //right
        case 39:
          if(this.canMove('right')){
            this.left += 1;
          }
          this.$emit('removeKeyCode');
          break;
        //down
        case 40:
          if(this.canMove('down')){
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
}
</script>