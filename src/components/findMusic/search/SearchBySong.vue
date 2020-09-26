<template>
    <div style="margin-bottom: 75px">
        <!--歌曲列表-->
        <el-table :data="songList" ref="playTable" highlight-current-row border stripe
                  style="cursor: context-menu;" @row-dblclick="playMusic">

            <el-table-column label="#" type="index">
                <template scope="scope">
                    <img v-if="curId === scope.row.id" src="imgs/isPlay.png" alt="">
                    <p v-else>{{scope.$index+1}}</p>
                </template>
            </el-table-column>


            <el-table-column v-if="false" label="id" prop="id"></el-table-column>

            <el-table-column label="音乐标题" prop="name"></el-table-column>

            <el-table-column label="歌手" width="80px;">
                <template scope="scope">
                <span v-for="(item,index) in scope.row.artists" style="cursor: pointer" @click="toSingerPage(item.id)">
                    {{
                    index === 0 && scope.row.artists.length > 1 && index !== scope.row.artists.length-1
                    ? item.name +'/' : item.name
                    }}
                </span>
                </template>
            </el-table-column>

            <el-table-column label="专辑名" prop="album.name"></el-table-column>

            <el-table-column label="时长" prop="duration" width="80px;"></el-table-column>

        </el-table>
        <!--分页-->
        <el-pagination
                layout="prev, pager, next" :page-size="queryInfo.limit"
                :total="songTotal" @current-change="handleCurrentChange">
        </el-pagination>
    </div>

</template>

<script>
    export default {
        data() {
            return {
                searchData: decodeURIComponent(this.$route.params.data),
                //当前的搜索条件
                queryInfo: {
                    keywords: this.$route.params.data,
                    limit: 30,
                    offset: 0,
                    type: 1
                    /* type
                        默认为1
                        1: 单曲 100:歌手 1000:歌单 1014:视频
                    */
                },
                //查询结果总数
                songTotal: 0,
                //歌曲数的结果集
                songList: [],
                //父组件当前播放的音乐的id
                curId: parseInt(window.localStorage.getItem('curPlayMusicId')),
            }
        },
        created() {
            //获取搜索结果集
            this.getSearchResult()
            //注册监听的事件 在main.js中定义了
            window.addEventListener('setItem', () => {
                this.curId = parseInt(localStorage.getItem('curPlayMusicId'))
            })
        },
        methods: {
            getSearchResult() {
                this.$http.get('/search', {params: this.queryInfo}).then(res => {
                    this.songList = res.data.result.songs
                    this.songTotal = res.data.result.songCount
                    //处理时长dt
                    this.songList.forEach(item => {
                        var time = item.duration / 1000
                        //分钟
                        var minute = time / 60;
                        var minutes = parseInt(minute);
                        if (minutes < 10) {
                            minutes = "0" + minutes;
                        }
                        //秒
                        var second = time % 60;
                        var seconds = Math.round(second);
                        if (seconds < 10) {
                            seconds = "0" + seconds;
                        }
                        item.duration = `${minutes}:${seconds}`;
                    })
                })
            },
            //双击歌曲添加数据进去,并循环播放(向父组件传递参数)
            playMusic(row) {
                this.$http.get('song/url', {params: {id: row.id}}).then(res => {
                    if (res.data.data[0].url !== '') {
                        this.$http.get('song/detail', {params: {ids: row.id}}).then(r => {
                            this.$emit('setMusicUrl', res.data.data[0].url, r.data.songs[0])
                        })
                    }

                })
            },
            //分页插件页数改变
            handleCurrentChange(newPage) {
                this.queryInfo.offset = (newPage - 1) * this.queryInfo.limit
                if (this.queryInfo.offset >= this.songTotal) this.queryInfo.offset = this.songTotal
                this.getSearchResult();
            },
            //跳转歌手
            toSingerPage(id) {
                this.$router.push('/singer/' + id)
            }
        }
    }
</script>

<style scoped>

</style>
