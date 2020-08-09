<template>
    <el-table
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            :data="gameSources">
        <el-table-column label="题目" prop="content" align="left"/>
        <el-table-column label="答案" prop="answer" align="left"/>
        <el-table-column label="原因" prop="desc" align="left"/>
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
    export default {
        props: {
            gameSources: Array,
            loading: Boolean,
            del: Function,
            toEdit: Function
        },
        name: "brainTwisterContent"
    }
</script>

<style lang="scss" scoped>
</style>

