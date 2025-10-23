<template>
  <div class="input-chat-box">
    <div class="input-box">
      <div
        class="iconfont icon-tupian"
        @click="$emit('upload')"
      >
        <input
          type="file"
          id="picture"
          ref="files"
          @change="chooseImage"
        >
      </div>
        <input type="text"
          ref="input"
          :value="value"
          @input="$emit('input', $event.target.value)"
          @keyup.enter="send"
        />
      <div class="send" @click="send" :class="{ highlight: value.length !== 0 }">发送</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InputBox',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  methods: {
    send () {
      this.$emit('send')
      this.$nextTick(() => {
        // console.log(1);
        this.$refs.input.focus()
      })
    },
    chooseImage (e) {
      // this.$emit('upload')
      const file = e.target.files[0]
      // console.log(url);
      if (!file || !file.type.startsWith('image/')) { return }
      this.$emit('upload', file)
    }
  }
}
</script>

<style lang="less" scoped>
.input-box {
  z-index: 1;
  width: 375px;
  height: 46px;
  display: flex;
  align-items: center;
  background-color: #F6F6F6;
  position: fixed;
  left: 0;
  bottom: 0;
  .iconfont {
    margin: 0 12px;
    font-size: 28px;
    position: relative;
    #picture {
      width: inherit;
      height: inherit;
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
      pointer-events: none;
    }
  }
  input {
    flex: 1;
    background-color: white;
    font-size: 12px;
    height: 60%;
    border-radius: 5px;
    padding-left: 7px;
    &:focus {
      outline: none;
    }
  }
  .send {
    margin: 0 12px;
    width: 15%;
    height: 27px;
    background-color: gray;
    font-size: 12px;
    text-align: center;
    line-height: 27px;
    border-radius: 5px;
    color: white;
  }
  .highlight {
    background-color: rgb(7, 193, 96);
  }
}
</style>
