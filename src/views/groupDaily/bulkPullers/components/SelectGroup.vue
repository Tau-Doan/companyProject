<template>
    <div>
        <div  class="selectGroupName">
            <div class="selectGroupContent">
                <h1 v-if="!groups.length">暂无数据</h1>
                <div v-else class="selectGroupPhoto" >
                    <el-checkbox-group  v-model="selectGroups" @change="handleCheckedGroupsChange">
                            <el-checkbox  class="bulkPullersCheckbox"  v-for="(item,index) in groups" :label="item" :key="index">
                                <div class="bulkPullersGroup">
                                    <el-image
                                      style="width: 60px;height: 60px;"
                                      :src="item.headUrl"
                                      fit="contain">
                                    </el-image>
                                    <span class="selectGroupPhotoName">{{item.name}}</span>
                                </div>
                            </el-checkbox>
                    </el-checkbox-group>
                </div>
            </div>
        </div>
        <div>
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <el-button @click="closeComponent" >取 消</el-button>
            <el-button type="primary" @click="save">确 定</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "selectGroup",
        props: {
            groups: Array,
            closeComponent: Function,
            saveComponentData: Function
        },
        data(){
            return {
                selectGroups: [],
                checkAll: false,
                isIndeterminate: true,
            }
        },
        methods: {
            save(){
                this.saveComponentData(1,this.selectGroups);
            },
            /**
             * 选择数据处理
             */
            handleCheckedGroupsChange(value){
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.groups.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.groups.length;
            },
            /**
             * 全选处理
             * @param val
             */
            handleCheckAllChange(val){
                this.selectGroups = !val ? [] : this.groups;
                this.isIndeterminate = false;
            },
            // 清理选中
            clearData(){
                this.selectGroups = [];
                this.checkAll = false;
                this.isIndeterminate = true;
            },
        }
    }
</script>

<style lang="scss" scoped>
    .selectGroupName {
        width: 400px;
        display: flex;
        justify-content: space-between;
        flex-flow: column nowrap;
        margin-left: 10px;
        margin-right: 10px;
        height: 400px;
        .selectGroupContent{
            overflow: auto;
        }

        .selectGroupPhoto {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            flex-flow: row nowrap;
            margin-bottom: 10px;
            .bulkPullersCheckbox{
                display: flex;
                align-items: center;
                margin-bottom: 10px;
                /*flex-flow: column nowrap;*/
            }
            .bulkPullersGroup{
                display: flex;
                align-items: center;
                justify-content: flex-start;
                flex-flow: row nowrap;
                .el-image{
                    width: 60px;
                    height: 60px;
                    box-sizing:border-box;
                    margin: 0 15px;
                    border-radius: 50%;
                }
                .selectGroupPhotoName{
                    display: block;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }


        }
    }
</style>
