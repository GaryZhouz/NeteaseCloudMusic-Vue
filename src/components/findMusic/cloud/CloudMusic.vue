<template>
    <!--歌曲列表-->
    <el-table :data="currentMusicListInfo" ref="playTable" highlight-current-row border stripe
              style="cursor: context-menu;" @row-dblclick="playMusicList" @cell-click="toSingerPage">

        <el-table-column label="#" type="index">
            <template scope="scope">
                <img v-if="curId === scope.row.simpleSong.id" src="imgs/isPlay.png" alt="">
                <p v-else>{{scope.$index+1}}</p>
            </template>
        </el-table-column>


        <el-table-column v-if="false" label="id" prop="simpleSong.id"></el-table-column>

        <el-table-column label="音乐标题" prop="songName"></el-table-column>

        <el-table-column label="歌手" prop="simpleSong.ar[0].name" width="80px;"></el-table-column>

        <el-table-column label="专辑名" prop="album"></el-table-column>

        <el-table-column label="上传时间" prop="addTime" width="100px;"></el-table-column>

    </el-table>
</template>

<script>
    export default {
        data() {
            return {
                //当前音乐的对象
                currentMusicListInfo: [],
                //父组件当前播放的音乐的id
                curId: parseInt(window.localStorage.getItem('curPlayMusicId')),
                //歌单的歌曲id合集
                songListInfo: [],
            }
        },
        created() {
            //获取音乐云盘的数据
            this.getCloudData()
            //注册监听的事件 在main.js中定义了
            window.addEventListener('setItem', () => {
                this.curId = parseInt(localStorage.getItem('curPlayMusicId'))
            })
        },
        methods: {
            getCloudData() {
                this.$http.get('/user/cloud', {params: {limit: 1000}}).then(res => {
                    this.currentMusicListInfo = res.data.data
                    //处理时间
                    this.currentMusicListInfo.forEach(item => {
                        const dt = new Date(item.addTime)

                        const y = dt.getFullYear()
                        const m = (dt.getMonth()+ 1 +'').padStart(2,'0')
                        const d = (dt.getDay() + '').padStart(2,'0')


                        item.addTime = `${y}-${m}-${d}`
                    })
                    //设置歌单所有歌曲的id信息
                    this.setSongListInfo()
                })
            },
            //双击歌曲添加数据进去,并循环播放(向父组件传递参数)
            playMusicList(row) {
                this.$emit('setSongListInfo', this.songListInfo, row.simpleSong.id)
            },
            //设置歌单所有歌曲的id
            setSongListInfo() {
                this.currentMusicListInfo.forEach(item => {
                    this.songListInfo.push(item.simpleSong.id)
                })
            },
            //点击歌手名跳转歌手详细页面
            toSingerPage(row, column, cell) {
                if (column.label === "歌手"){//点击的是歌手那一列 进入歌手详情页
                    this.$router.push('/singer/'+row.simpleSong.ar[0].id)
                }
            }
        }
    }
</script>

<style scoped>

</style>
