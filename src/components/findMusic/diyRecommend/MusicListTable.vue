<template>
    <!--歌曲列表-->
    <el-table :data="currentMusicListInfo" ref="playTable" highlight-current-row border stripe
              style="cursor: context-menu;" @row-dblclick="playMusicList">

        <el-table-column label="#" type="index">
            <template scope="scope">
                <img v-if="curId === scope.row.id" src="imgs/isPlay.png" alt="">
                <p v-else>{{scope.$index+1}}</p>
            </template>
        </el-table-column>


        <el-table-column v-if="false" label="id" prop="id"></el-table-column>

        <el-table-column label="音乐标题" prop="name"></el-table-column>

        <el-table-column label="歌手" prop="ar[0].name" width="80px;">
            <template scope="scope">
                <span v-for="(item,index) in scope.row.ar" style="cursor: pointer" @click="toSingerPage(item.id)">
                    {{
                    index === 0 && scope.row.ar.length > 1 && index !== scope.row.ar.length-1
                    ? item.name +'/' : item.name
                    }}
                </span>
            </template>
        </el-table-column>

        <el-table-column label="专辑名" prop="al.name"></el-table-column>

        <el-table-column label="时长" prop="dt" width="80px;"></el-table-column>

    </el-table>
</template>

<script>

    export default {
        data() {
            return {
                //接受传递来的参数
                queryIds: this.$route.params.ids ? this.$route.params.ids : window.localStorage.getItem('queryIds'),
                //查询当前歌单所有音乐的name url 作者等等
                currentMusicListInfo: [],
                //歌单的歌曲id合集
                songListInfo: [],
                //父组件当前播放的音乐的id
                curId: parseInt(window.localStorage.getItem('curPlayMusicId')),
            }
        },
        created() {
            //获取列表信息数据
            this.handlerSongList()
            //注册监听的事件 在main.js中定义了
            window.addEventListener('setItem', () => {
                this.curId = parseInt(localStorage.getItem('curPlayMusicId'))
            })
        },
        mounted() {
            //放入上一个组件传递来的参数
            window.localStorage.setItem('queryIds', this.queryIds)
        },
        methods: {
            //处理歌单所有歌曲信息的查询(根据id)
            handlerSongList() {
                this.$http.get('song/detail', {params: {ids: this.queryIds}}).then(res => {
                    this.currentMusicListInfo = res.data.songs
                    //处理时长数据
                    this.currentMusicListInfo.forEach(item => {
                        const dt = new Date(item.dt)
                        const mm = (dt.getMinutes() + '').padStart(2, '0')
                        const ss = (dt.getSeconds() + '').padStart(2, '0')

                        item.dt = mm + ':' + ss
                    })
                    //设置歌单所有歌曲的id信息
                    this.setSongListInfo()
                })
            },
            //双击歌曲添加数据进去,并循环播放(向父组件传递参数)
            playMusicList(row) {
                this.$emit('setSongListInfo', this.songListInfo, row.id)
            },
            //设置歌单所有歌曲的id
            setSongListInfo() {
                this.currentMusicListInfo.forEach(item => {
                    this.songListInfo.push(item.id)
                })
            },
            //点击歌手名跳转歌手详细页面
            toSingerPage(id) {
                this.$router.push('/singer/' + id)
            }
        }
    }
</script>

<style lang="less" scoped>

    /deep/ .el-table_1_column_4 .cell {
        cursor: pointer !important;
    }
</style>
