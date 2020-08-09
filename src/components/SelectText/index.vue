<template>
    <div id="text">
        <el-form >
            <el-form-item>
                <el-radio-group v-model="textId" class="textImport">
                    <el-radio :label="item.id" v-model="item.isSelect" v-for="(item,index) in texts" :key="index" >
                        {{item.isCustom? '自定义': ''}}
                        <el-input :style="{width: item.isCustom?'285px':'330px'}" v-model="item.text"></el-input>
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item>
                <el-button @click="save">确定</el-button>
                <el-button @click="close">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

    export default {
        name:"selectText",
        props: {
            saveComponentData: {
                type: Function,
                require: true
            },
            close: {
                type: Function,
                require: false
            }
        },
        data() {
            return {
                textId: '',
                texts: [
                    {
                    isSelect: false,
                    text: '欢迎加入本群，开启您的社群之路！请了解一下入群规则：\n' +
                        '①、请修改群名片：昵称+地区（店名）\n' +
                        '②、请花一分钟时间详细阅读群公告注意事项\n' +
                        '③、群内发送“指令”，解锁更多玩法！\n' +
                        '④、更多问题请@助手号，竭诚为您答疑解惑。\n' +
                        '越努力，越幸运！与诸君共勉，创造更大价值',
                    id: 1,
                    isCustom: false,
                    },
                    {
                        isSelect: false,
                        text: '欢迎加入本群，开启您的社群之路！请了解一下入群规则：\n' +
                            '①、请修改群名片：昵称+地区（店名）\n' +
                            '②、请花一分钟时间详细阅读群公告注意事项\n' +
                            '③、群内发送“指令”，解锁更多玩法！\n' +
                            '④、更多问题请@助手号，竭诚为您答疑解惑。\n' +
                            '心随好猫，意纵天高！祝大家2020宏图大展，财源滚滚！',
                        id: 2,
                        isCustom: false,
                    },
                    {
                        isSelect: false,
                        text: '终于等到你！欢迎加入本群！进了群就是一家人，可不许走哟！现在可以和大家一起愉快的交流啦！',
                        id: 3,
                        isCustom: false,
                    },
                    {
                        isSelect: false,
                        text: '欢迎加入本群！本群旨在为大家提供一个互动交流的平台，并将不定期开展各项福利活动，敬请期待！希望大家踊跃发言，互帮互助，互通有无。',
                        id: 4,
                        isCustom: false,
                    },
                    {
                        isSelect: false,
                        text: '',
                        id: 5,
                        isCustom: true,
                    },
                ],
            }
        },
        methods: {
            /**
             * 保存数据
             */
            save(){
                const text = this.texts.filter(text => text.id === this.textId)[0];

                if(!text){
                    this.$message.error("请选择内容");
                    return;
                }

                if(text.isCustom && !text.text){ // 用户是自定义，并且内容为空
                    this.$message.error("自定义内容不能为空");
                    return;
                }

                // 校验长度
                if(text.text.length > 500){
                    this.$message.warning('内容长度不能大于500');
                    return;
                }

                this.saveComponentData(text.text,1);
            }
        }
    }
</script>

<style lang="scss">
    #text{
        width: 400px;
        .textImport{
            display: flex;
            justify-content: center;
            flex-direction :column;
            .el-radio{
                margin: 10px!important;
            }
        }

    }

</style>
