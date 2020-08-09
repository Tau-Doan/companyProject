<template>
    <div class="gameContent">
        <!--      猜歇后-->
        <span v-if="gameSourceMap && gameSourceMap.content.length < 10">
                题目：
               {{gameSourceMap.content}}
            </span>
        <el-tooltip v-else class="ellipses" effect="dark" :content="gameSourceMap.content" placement="right">
            <span> 题目：{{gameSourceMap.content}}</span>
        </el-tooltip>
        <span v-if="gameSourceMap && gameSourceMap.answer.length < 10">
                答案：
               {{gameSourceMap.answer}}
            </span>
        <el-tooltip v-else class="ellipses" effect="dark" :content="gameSourceMap.answer" placement="right">
            <span> 答案：{{gameSourceMap.answer}}</span>
        </el-tooltip>
    </div>
</template>

<script>
    export default {
        props: {
            gameSourceMap: Object
        },
        name: "AllegoricalSaying"
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
        height: 60px;
        line-height: 60px;
        font-size: 17px;
        justify-content: space-between;
        span:nth-child(1){
            display: block;
            max-width: 300px;
        }
        span:nth-child(2) {
            display: block;
            max-width: 200px;
            margin-left: 80px;
        }
    }


</style>

