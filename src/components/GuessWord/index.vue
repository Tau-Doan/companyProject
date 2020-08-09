<template>
    <div class="gameContent">
        <div class="avatar  GroupNameList">
            <span>图片：</span>
            <el-image
                    style="width: 60px; height: 60px"
                    :src="gameSourceMap?gameSourceMap.content : ''"
                    fit="cover"></el-image>
          <span class="gameAnswer">答案：{{gameSourceMap?gameSourceMap.answer : ''}}</span>
        </div>

    </div>
</template>

<script>
    export default {
        props: {
            gameSourceMap: Object
        },
        name: "guessWord "
    }
</script>

<style lang="scss" scoped>
    .gameContent {
        display: flex;
        height: 60px;
        line-height: 60px;
        font-size: 17px;
        padding-top: 20px;
        justify-content: space-between;
        .GroupNameList{
          justify-content: space-between;
        }

        /*看图猜字*/
        .gameAnswer {
            margin-left: 80px;
        }

        .avatar{

            span{
                margin: 0 !important;
            }
        }

    }
</style>
