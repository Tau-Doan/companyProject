<template>
    <div>
        <div  class="selectMemberName">
            <div class="selectMemberContent">
                <h1 v-if="!members.length">暂无数据</h1>
                <div v-else class="selectMemberPhoto" >
                    <el-checkbox-group v-model="selectMembers" @change="handleCheckedMemberChange">
                        <el-checkbox class="bulkPullersMemberCheckbox"  :label="item"  :key="index" v-for="(item,index) in members">
                            <div class="bulkPullersMember">
                                <el-image
                                  style="width: 60px;height: 60px;"
                                  :src="item.vcHeadImgUrl"
                                  fit="contain">
                                </el-image>
                                <span class="selectMemberPhotoName">{{item.vcNickName}}</span>
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
        name: "selectMember",
        props: {
            members: Array,
            closeComponent: Function,
            saveComponentData: Function
        },
        data(){
            return {
                selectMembers: [],
                checkAll: false,
                isIndeterminate: true,
            }
        },
        methods: {
            save(){
                this.saveComponentData(2,this.selectMembers);
            },
            /**
             * 选择数据处理
             */
            handleCheckedMemberChange(value){
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.members.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.members.length;
            },
            /**
             * 全选处理
             * @param val
             */
            handleCheckAllChange(val){
                this.selectMembers = !val ? [] : this.members;
                this.isIndeterminate = false;
            },
            // 清理选中
            clearData(){
                this.selectMembers = [];
                this.checkAll = false;
                this.isIndeterminate = true;
            },
        }
    }
</script>

<style lang="scss" scoped>
    .selectMemberName {
        width: 400px;
        display: flex;
        justify-content: space-between;
        flex-flow: column nowrap;
        margin-left: 10px;
        margin-right: 10px;
        height: 400px;
        .selectMemberContent{
            overflow: auto;
        }

        .selectMemberPhoto {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            margin-bottom: 10px;
            .bulkPullersMemberCheckbox{
                display: flex;
                align-items: center;
                margin-bottom: 10px;
            }
            .bulkPullersMember {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                flex-flow: row nowrap;
            }
            .el-image{
                width: 60px;
                height: 60px;
                box-sizing:border-box;
                margin: 0 15px;
                border-radius: 50%;
            }
            .selectMemberPhotoName{
                display: block;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;

            }
        }
    }
</style>
