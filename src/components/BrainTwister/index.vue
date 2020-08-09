<template>
    <div class="gameContent">
            <!--      脑筋急转弯-->
        <div>
            <span v-if="gameSourceMap && gameSourceMap.content.length < 10">
                题目：
               {{gameSourceMap.content}}
            </span>
            <el-tooltip v-else class="ellipses" effect="dark" :content="gameSourceMap.content" placement="right">
                <span> 题目：{{gameSourceMap.content}}</span>
            </el-tooltip>
        </div>

        <div>
            <span v-if="gameSourceMap && gameSourceMap.answer.length < 10">
                答案：
               {{gameSourceMap.answer}}
            </span>
            <el-tooltip v-else class="ellipses" effect="dark" :content="gameSourceMap.answer" placement="right">
                <span> 答案：{{gameSourceMap.answer}}</span>
            </el-tooltip>
        </div>
        <div>
            <span v-if="gameSourceMap && gameSourceMap.desc.length < 10">
                原因：
               {{gameSourceMap.desc}}
            </span>
            <el-tooltip v-else class="ellipses" effect="dark" :content="gameSourceMap.desc" placement="right">
                <span> 原因：{{gameSourceMap.desc}}</span>
            </el-tooltip>
        </div>

    </div>
</template>

<script>
    export default {
        props: {
            gameSourceMap: Object
        },
        name: "BrainTwister"
    }
</script>

<style lang="scss" scoped>

    .ellipses{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .gameContent {
        display: flex;
        justify-content: space-between;
        height: 60px;
        line-height: 60px;
        font-size: 17px;
        span:nth-child(1){
            display: block;
            width: 200px;
        }
        span:nth-child(2) {
            display: block;

        }
        span:nth-child(3) {
            display: block;

        }
    }
</style>

