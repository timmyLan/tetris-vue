<template>
  <div class="canvas">
    <div v-for="arrObj of arrs">
      <Shape
      :keyCode="keyCode"
      v-on:removeKeyCode="handleRemoveKeyCode"
      v-on:init="init"
      v-on:upDateArea="upDateArea"
      :area="area"
      :count="count"
      :arr.sync="arrObj.arr"
      :active="arrObj.active"
      :initLeft.sync="arrObj.left"
      :initTop.sync="arrObj.top"/>
    </div>
  </div>
</template>

<script>
import Shape from './Shape';
import './MainScreen.scss';
export default {
  name: 'MainScreen',
  components: {
    Shape
  },
  data: function(){
    return {
      keyCode: null,
      arrs: [],
      area: [],
      fontSize: 0,
      rect: {},
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
    this.rect = {width,height};
    this.fontSize = fontSize;
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
      const length = this.arrs.length;
      if(length){
        this.arrs[length -1].active = false;
        this.count ++;
      }
      this.arrs.push(arrObj);
    },
    upDateArea: function() {
      let {arr,left,top} = this.arrs[this.count];
      for(let i = 0;i < arr.length;i++){
        for(let j = 0;j< arr[0].length;j++){
          if(arr[i][j] === 1){
            this.area[i+top][j+left] = 1;
          }
        }
      }
    }
  }
}
</script>