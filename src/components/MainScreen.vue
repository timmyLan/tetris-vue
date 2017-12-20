<template>
  <div class="canvas">
    <Shape
      :key="count"
      v-if="arrObj.active"
      v-on:removeKeyCode="handleRemoveKeyCode"
      v-on:init="init"
      v-on:upDateArea="upDateArea"
      v-on:eliminate ="eliminate"
      :keyCode="keyCode"
      :area="area"
      :arr.sync="arrObj.arr"
      :active.sync="arrObj.active"
      :initLeft.sync="arrObj.left"
      :initTop.sync="arrObj.top"/>
    <div v-for="(blockArr,index) of area">
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
import Shape from './Shape';
import Block from './Block';
import './MainScreen.scss';
export default {
  name: 'MainScreen',
  components: {
    Shape,
    Block
  },
  data: function(){
    return {
      keyCode: null,
      area: [],
      arrObj: {},
      count: 0
    }
  },
  created: function () {
    window.addEventListener('keydown',this.handleKeyUp);
    this.init();
  },
  mounted: function(){
    const rect = this.$el.getBoundingClientRect();
    const {width,height} = rect;
    const fontSize = parseFloat(window.getComputedStyle(this.$el, null).getPropertyValue('font-size'));
    const rowLength = parseFloat(width / fontSize /this.GLOBAL.offset);
    const colLength = parseFloat(height / fontSize / this.GLOBAL.offset);
    let arr = [];
    for(let i = 0;i < colLength;i++){
      arr[i] = new Array;
      for(let j = 0;j < rowLength;j++){
        arr[i][j] = 0;
      }
    }
    this.area = arr;
  },
  methods: {
    handleKeyUp: function (event) {
      if(event){
        this.keyCode = event.keyCode;
      }
    },
    handleRemoveKeyCode: function () {
      this.keyCode = null;
    },
    init: function () {
      const random = Math.floor(Math.random() * this.GLOBAL.arrs.length);
      const arr = this.GLOBAL.arrs[random];
      const arrObj = {
        active: true,
        arr: arr,
        left: 0,
        top: 0
      };
      this.arrObj = arrObj;
      this.count ++;
    },
    upDateArea: function() {
      let {arr,left,top} = this.arrObj;
      for(let i = 0;i < arr.length;i++){
        for(let j = 0;j< arr[0].length;j++){
          if(arr[i][j] === 1){
            this.area[i+top][j+left] = 1;
          }
        }
      }
    },
    eliminate: function () {
      const area = this.area;
      const eliminateColumn = [];
      const length = area[0].length;
      for(let i = 0; i < area.length; i++){
        let count = 0;
        for(let j = 0; j < length; j++){
          if(area[i][j] === 1){
            count++;
          }
        }
        if(count === length){
          eliminateColumn.push(i);
        }
      }
      if(eliminateColumn.length){
        for(let i = 0 ; i < eliminateColumn.length; i++){
          for(let j = 0; j < eliminateColumn[i] - 1; j++){
            area[eliminateColumn[i] - j] = area[eliminateColumn[i] - j - 1];
          }
        }
      }
    }
  }
}
</script>