<template>
    <el-table
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            :data="gameSources">

        <el-table-column label="语音" prop="name" align="left">
            <template slot-scope="scope">
                <div class="AudioPlayback" >
                    <el-button :class="!scope.row.isPlay?'el-icon-video-play':'el-icon-video-pause'"/>
                </div>
            </template>
        </el-table-column>
        <el-table-column label="答案" prop="answer" align="left"/>
        <el-table-column label="上传时间" prop="createTime" align="left"/>
        <el-table-column label="使用次数" prop="number" align="center"/>
        <el-table-column label="操作" align="center">
            <template slot-scope="scope">
                <div class="operate">
                    <el-button type="text" @click="toEdit(scope.row.id)">
                        <i class="el-icon-edit operateButton"/>
                    </el-button>
                    <el-button type="text" @click="del(scope.row.id)">
                        <i class="el-icon-delete operateButton"/>
                    </el-button>
                </div>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
    import Vue from 'vue'
    import BenzAMRRecorder from "benz-amr-recorder";

    export default {
        props: {
            gameSources: Array,
            loading: Boolean,
            del: Function,
            toEdit: Function,
        },
        name: "guessSongContent",
        methods: {
            /**
             * 暂停音频
             */
            pause(){
                this.gameSources.forEach((source) => {
                    if (source.amr && source.amr.isPlaying()) {
                        source.amr.pause();
                    }
                });
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
                const itemIndex = this.gameSources.findIndex(game => game.id === item.id);
                Vue.set(this.gameSources, itemIndex, item);

                // 播放完成监听
                item.amr.onEnded(() => {
                    item.isPlay = false;
                    Vue.set(this.gameSources, itemIndex, item);
                });

                // 停止其他所有的播放
                this.gameSources.forEach((source, index) => {
                    if (source.id !== item.id && source.amr) {
                        source.amr.pause();
                        source.isPlay = false;
                    }
                    index !== itemIndex && Vue.set(this.gameSources, index, source);
                });
            },
        },
        destroyed() {
            this.pause();
        }
    }
</script>

<style lang="scss" scoped>
</style>

