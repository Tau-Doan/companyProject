<template>
  <div id="dPlayer"/>
</template>

<script>
  import DPlayer from 'dplayer';
  export default {
    name: "videoPlay",
    props: {
      videoUrl: {
        type: String,
        require: true
      }
    },
    data(){
      return {
        dp: null,
      }
    },
    mounted() {
      this.playVideo();
    },
    methods: {
      /**
       * 加载视频
       */
      playVideo(){
        this.dp = new DPlayer({
          container: document.querySelector('#dPlayer'),
          video: {
            url: this.videoUrl || 'xxx',
          },
          autoplay: true
        });

        this.dp.on('error',() => {
          this.$message.error('视频播放出错，请检查网络或视频地址！')
        });
      }
    },
    destroyed() {
      this.dp.pause();
    }
  }
</script>

<style scoped>
  #dPlayer {
    width: 520px;
    height: 500px;
  }
</style>
