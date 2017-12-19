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
    initLeft: Number,
    initTop: Number,
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
              for(let j = 0;j< blockArrs[0].length;j++){
                if(blockArrs[i][j] === 1){
                  if(this.area[i+this.top][j+this.left-1] === 1){
                      return canMove = false;
                  }
                }
              }
            }
        }else{
          return canMove = this.left - 1 >= 0;
        }
      }else if(direction === 'right'){
        if(this.count){
          if(this.left + this.width + 1 > this.area[0].length){
            return canMove = false;
          }
          const blockArrs = this.blockArrs;
            for(let i = 0;i < blockArrs.length;i++){
              for(let j = 0;j< blockArrs[0].length;j++){
                if(blockArrs[i][j] === 1){
                  if(this.area[i+this.top][j+this.left+1] === 1){
                      return canMove = false;
                  }
                }
              }
            }
        }else{
          return canMove = this.left + this.width + 1 <= this.area[0].length;
        }
      }else if(direction === 'down'){
        if(this.count){
          if(this.top + this.height + 1 > this.area.length){
            return canMove = false;
          }
          const blockArrs = this.blockArrs;
          for(let i = 0;i < blockArrs.length;i++){
            for(let j = 0;j< blockArrs[0].length;j++){
              if(blockArrs[i][j] === 1){
                if(this.area[i+this.top+1][j+this.left] === 1){
                    return canMove = false;
                }
              }
            }
          }
        }else{
          return canMove = this.top + this.height + 1 <= this.area.length;
        }
      }else if(direction === 'up'){
        if(this.count){
          if(this.left + this.height > this.area[0].length || this.top + this.width > this.area.length){
            return canMove = false;
          }
          // }else{
          //   for(let i = 0;i < this.blockArrs.reverse().length;i++){
          //     for(let j = 0;j< this.blockArrs.reverse()[0].length;j++){
          //       if(this.blockArrs.reverse()[i][j] === 1){
          //         if(this.area[i+this.top][j+this.left] === 1){
          //             return canMove = false;
          //         }
          //       }
          //     }
          //   }
          // }
        }else{
          return canMove =  this.left + this.height <= this.area[0].length && this.top + this.width <= this.area.length;
        }
      }else{
        console.log('error direction');
      }
      return canMove;
    },
    fallDown: function () {
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
          this.$emit('update:arr', this.blockArrs);
          this.$emit('upDateArea');
          if(this.top === 0){
            console.log('Game Over !');
          }else{
            // this.$emit('init');
          }
        }
      }.bind(this), 600);
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
          if(this.canMove('up')){
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
        default:
          this.$emit('removeKeyCode');
      }
    }
      }
  }
}
</script>