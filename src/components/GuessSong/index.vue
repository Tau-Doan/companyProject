<template>
    <div class="gameContent">
        <!--      猜歌名-->
        <div>
            <span>语音：</span>
            <el-button :class="!guessSong.isPlay?'el-icon-video-play':'el-icon-video-pause'"/>
        </div>

        <span class="answer">你的答案: {{guessSong?guessSong.answer : ''}}</span>
    </div>
</template>

<script>
    import BenzAMRRecorder from "benz-amr-recorder";
    import Vue from "vue";

    export default {
        props: {
            gameSourceMap: Object
        },
        name: "guessSong",
        data(){
            return {
                guessSong: {}
            }
        },
        watch: {
            gameSourceMap: {
                handler(){
                    this.guessSong = {...this.gameSourceMap};
                },
                deep: true
            }
        },
        methods: {
            /**
             * 暂停音频
             */
            pause(){
                if (this.guessSong.amr && this.guessSong.amr.isPlaying()) {
                    this.guessSong.amr.pause();
                }
            },
            /**
             * 播放音频
             * @param item
             * @returns {Promise<boolean>}
             */
            async play(item) {
                // 创建amr

                try {
                    if (!item.amr) {
                        item.amr = new BenzAMRRecorder();
                        await item.amr.initWithUrl(item.content); // 初始化
                    }
                }catch (e) {
                    this.$message.error('音频初始化失败，请检查网络或者音频地址');
                    return false;
                }

                if (!item.isPlay) {
                    item.amr.play();
                    item.isPlay = true;
                } else {
                    item.amr.pause();
                    item.isPlay = false;
                }
                // 更新界面
                Vue.set(this.guessSong, 'isPlay', item.isPlay);

                // 播放完成监听
                item.amr.onEnded(() => {
                    item.isPlay = false;
                    Vue.set(this.guessSong, 'isPlay', item.isPlay);
                });
            },
        },
        async mounted() {
            this.guessSong = {...this.gameSourceMap};
            await this.play()
        },
        destroyed() {
            this.pause();
            this.play();
        }
    }
</script>

<style lang="scss" scoped>
    .gameContent {
      z-index: 0;
        display: flex;
        height: 60px;
        line-height: 60px;
        font-size: 17px;
        padding-top: 20px;
        justify-content: space-between;
        .answer {
            margin-left: 10px;
        }

        /*!*猜歌名*!*/
        span {
            line-height: 60px;
        }

        video {
            border: 0;
            outline: none;
        }

    }
</style>

