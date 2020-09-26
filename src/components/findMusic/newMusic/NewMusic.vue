<template>
    <!--最新音乐-->
    <el-row style="margin-top: 25px;">
        <p>
            语种:
            <span id="types" v-for="(item,index) in musicType" @click="changeType(item.type)"
                  :class="index===0 ? 'isActive' : 'types'+ item.type"
                  style="margin-left: 25px;cursor: pointer;">{{item.name}}</span>
        </p>

        <!--左侧-->
        <el-col :span="20" :offset="2">
            <el-table :data="newMusicInfo" stripe
                      :show-header="false">

                <el-table-column type="index">
                    <template scope="scope">
                        {{scope.$index+1 >= 10 ? scope.$index+1: '0'+(scope.$index+1).toString()}}
                    </template>
                </el-table-column>

                <el-table-column>
                    <template scope="scope">

                        <i class="el-icon-video-play" @click="changeNewUrl(scope.row.id)"
                           style="position: absolute;font-size: 25px;top: 35px;left:35px;z-index: 8;cursor:pointer;"></i>

                        <el-image :src="scope.row.album.picUrl" @click="changeNewUrl(scope.row.id)"
                                  style="width: 75px;height: 75px;cursor:pointer;"></el-image>

                        <span style="position: absolute;top: 25px;font-size: 15px;font-weight: 500">
                                    {{scope.row.name}}
                                </span>
                        <span style="position: absolute;bottom: 25px;font-size: 12px;font-weight: 500">
                                    {{scope.row.album.name}}
                                </span>
                    </template>
                </el-table-column>
            </el-table>
        </el-col>
    </el-row>
</template>

<script>
    export default {
        data() {
            return {
                //筛选条件
                queryInfo: {
                    type: 0
                },
                //标签数据
                musicType: [
                    {type: 0, name: '全部'},
                    {type: 7, name: '华语'},
                    {type: 96, name: '欧美'},
                    {type: 16, name: '韩国'},
                    {type: 8, name: '日本'}
                ],
                //最新音乐的数据
                newMusicInfo: [
                    {
                        id: 0,
                        album: {
                            picUrl: ''
                        }
                    },

                ],
                //上一次点击的分类(默认的是type-1)
                prevType: 'types' + 0,
            }
        },
        created() {
            //获取最新音乐
            this.getNewMusic()
        },
        methods: {
            getNewMusic() {
                this.$http.get('top/song', {params: this.queryInfo}).then(res => {
                    this.newMusicInfo = res.data.data
                })
            },
            //改变筛选条件
            changeType(typeId) {
                //撤销上一次被选中的标签的样式
                this.$('.isActive').eq(0).attr('class', this.prevType)
                //这次点击的标签高亮
                this.$('.types' + typeId).eq(0).attr('class', 'isActive')
                this.queryInfo.type = typeId
                //赋值存储
                this.prevType = 'types' + typeId
                this.getNewMusic()
            },
            //播放点击的最新音乐
            changeNewUrl(musicId) {
                var playlist = []
                this.newMusicInfo.forEach(item => {
                    playlist.push(item.id)
                })
                this.$emit('setSongListInfo', playlist, musicId)
            },
        }
    }
</script>

<style lang="less" scoped>
    .isActive {
        color: red;
    }
</style>
