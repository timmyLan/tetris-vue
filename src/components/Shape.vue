<template>
    <div class="shape" :style="positionObject">
      <!--遍历俄罗斯方块数组为1的则渲染成block-->
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
    area: Array,
    arr: Array,
    active: Boolean,
    initLeft: Number,
    initTop: Number
  },
  data: function () {
    return {
      left: this.initLeft,
      top: this.initTop,
      blockArrs: this.arr
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
    /**
     * 俄罗斯方块形变
     */
    transformBlockArrs: function () {
      const blockArrs = this.blockArrs;
      let newArr = [];
      for (let i = 0; i < blockArrs[0].length; i++) {
          let temArr = [];
          for (let j = blockArrs.length - 1; j >= 0; j--) {
              temArr.push(blockArrs[j][i]);
          }
          newArr.push(temArr);
      }
      return newArr;
    },
    /**
     * 判断俄罗斯方块能否移动
     * 遍历俄罗斯方块 i为列 j为行
     * 俄罗斯方块 高度为 i+top 宽度为 j+left
     * @param  {string} direction 移动方向(对应方向键的上下左右)
     * @return {boolean}   canmove  能否移动
     */
    canMove: function (direction) {
      let canMove = true;
      if(direction === 'left'){
        if(this.left - 1 < 0){
          return canMove = false;
        }
        const blockArrs = this.blockArrs;
        for(let i = 0;i < blockArrs.length;i++){
          for(let j = 0;j < blockArrs[0].length;j++){
            if(blockArrs[i][j] === 1){
              if(this.area[i+this.top][j+this.left-1] === 1){
                  return canMove = false;
              }
            }
          }
        }
      }else if(direction === 'right'){
        if(this.left + this.width + 1 > this.area[0].length){
          return canMove = false;
        }
        const blockArrs = this.blockArrs;
          for(let i = 0;i < blockArrs.length;i++){
            for(let j = 0;j < blockArrs[0].length;j++){
              if(blockArrs[i][j] === 1){
                if(this.area[i+this.top][j+this.left+1] === 1){
                    return canMove = false;
                }
              }
            }
          }
      }else if(direction === 'down'){
        if(this.top + this.height + 1 > this.area.length){
          return canMove = false;
        }
        const blockArrs = this.blockArrs;
        for(let i = 0;i < blockArrs.length;i++){
          for(let j = 0;j < blockArrs[0].length;j++){
            if(blockArrs[i][j] === 1){
              if(this.area[i+this.top+1][j+this.left] === 1){
                  return canMove = false;
              }
            }
          }
        }
      }else if(direction === 'up'){
        if(this.left + this.height > this.area[0].length || this.top + this.width > this.area.length){
          return canMove = false;
        }
        const revBlockArrs = this.transformBlockArrs();
        for(let i = 0;i < revBlockArrs.length;i++){
          for(let j = 0;j< revBlockArrs[0].length;j++){
            if(revBlockArrs[i][j] === 1){
              if(this.area[i+this.top][j+this.left] === 1){
                  return canMove = false;
              }
            }
          }
        }
      }else{
        console.log('error direction');
      }
      return canMove;
    },
    /**
     * 掉落函数
     * 每600毫秒方块高度+1
     * 当前方块高度为0则gameOver
     * 否则将创建新的方块
     */
    fallDown: function () {
      setTimeout(function loop() {
        if(this.canMove('down')){
          this.top++;
          setTimeout(loop.bind(this), 600);
        }else{
          console.log('can not fallDown!');
          this.$emit('update:active',false);
          this.$emit('update:initLeft', this.left);
          this.$emit('update:initTop', this.top);
          this.$emit('update:arr', this.blockArrs);
          this.$emit('upDateArea');
          this.$emit('eliminate');
          if(this.top === 0){
            window.alert('Game Over !');
          }else{
            this.$emit('init');
          }
          clearTimeout(this.fallDown);
        }
      }.bind(this), 600);
    }
  },
  watch: {
    /**
     * 监听keyCode
     * 判断上下左右
     * 触发keydown后将keyCode置为空值,可重复触发
     */
    keyCode: function (newKeyCode){
      if(this.active){
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