<template>
  <div class="canvas">
    <Shape
      :keyCode="keyCode"
      v-on:removeKeyCode="handleRemoveKeyCode"
      :arrs="arrs"/>
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
      arrs: [
        [1,0],
        [1,0],
        [1,1]
      ]
    }
  },
  created: function () {
    window.addEventListener('keydown',this.handleKeyUp);
  },
  methods: {
    handleKeyUp: function (event) {
      if(event){
        this.keyCode = event.keyCode;
      }
    },
    handleRemoveKeyCode: function (){
      this.keyCode = null;
    }
  }
}
</script>