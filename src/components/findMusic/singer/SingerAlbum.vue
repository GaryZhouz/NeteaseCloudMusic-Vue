<template>
    <div style="margin-top: 50px;margin-bottom: 75px;">

        <!--默认的头部热门五十首-->
        <el-row>
            <el-col :span="4" :offset="2">
                <el-image src="imgs/top50.png" style="width: 150px;height: 150px;"></el-image>
            </el-col>

            <el-col :span="8">
                热门50曲
                <el-table :data="hot50Songs.slice(0,defaultShow)" highlight-current-row stripe
                          :show-header="false" @row-dblclick="playHot50Music"
                          style="margin-top: 15px;cursor: context-menu;border: 1px solid rgb(230,230,230)">

                    <el-table-column label="#" type="index">
                        <template scope="scope">
                            <img v-if="curId === scope.row.id" src="imgs/isPlay.png" alt="">
                            <p v-else>{{scope.$index+1 >= 10 ? scope.$index+1 : ('0'+(scope.$index+1)).toString()}}</p>
                        </template>
                    </el-table-column>

                    <el-table-column label="操作" width="70px;">
                        <template>
                            <i class="el-icon-star-off" style="font-size: 18px;cursor: pointer"></i>
                            <i class="el-icon-download" style="margin-left: 10px;font-size: 18px;cursor:pointer;"></i>
                        </template>
                    </el-table-column>

                    <el-table-column v-if="false" label="id" prop="id"></el-table-column>

                    <el-table-column label="音乐标题" prop="name"></el-table-column>

                    <el-table-column label="时长" prop="dt" width="80px;"></el-table-column>

                </el-table>
                <p class="show" style="margin-top: 15px;cursor: pointer;" @click="changeDefaultNum">查看全部50首></p>
            </el-col>
        </el-row>

        <!--所有专辑信息-->
        <el-row v-for="item in albumMusicInfo" style="margin-top: 45px;">
            <el-col :span="4" :offset="2">
                <el-image :src="item.album.picUrl" style="width: 150px;height: 150px;"></el-image>
                <span style="position:absolute;left: 140px;top: 150px;">{{item.album.publishTime | dateFormatToYMD}}</span>
            </el-col>

            <el-col :span="8">
                {{item.album.name}}
                <el-table :data="item.songs" highlight-current-row stripe
                          :show-header="false" @row-dblclick="playAlbumMusic"
                          style="margin-top: 15px;cursor: context-menu;border: 1px solid rgb(230,230,230)"
                >

                    <el-table-column type="index">
                        <template scope="scope">
                            <img v-if="curId === scope.row.id" src="imgs/isPlay.png" alt="">
                            <p v-else>{{scope.$index+1 >= 10 ? scope.$index+1 : ('0'+(scope.$index+1)).toString()}}</p>
                        </template>
                    </el-table-column>

                    <el-table-column width="70px;">
                        <template>
                            <i class="el-icon-star-off" style="font-size: 18px;cursor: pointer"></i>
                            <i class="el-icon-download" style="margin-left: 10px;font-size: 18px;cursor:pointer;"></i>
                        </template>
                    </el-table-column>

                    <el-table-column v-if="false" label="id" prop="id"></el-table-column>

                    <el-table-column prop="name"></el-table-column>

                    <el-table-column prop="dt" width="80px;"></el-table-column>

                </el-table>
            </el-col>
        </el-row>
        <!--分页-->
        <el-pagination background
                       layout="prev,next"  :page-size="queryInfo.limit"
                       @current-change="handleCurrentChange">
        </el-pagination>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                //歌手专辑查询条件
                queryInfo: {
                    id: this.$route.params.id,
                    limit: 4,
                    offset: 0,
                },
                //当前歌手的id
                singerId: this.$route.params.id,
                //歌手热门50首
                hot50Songs: [],
                //50首默认展示10首
                defaultShow: 10,
                //父组件当前播放的音乐的id
                curId: parseInt(window.localStorage.getItem('curPlayMusicId')),
                //当前歌手热门专辑信息(不包含专辑内含的歌曲)
                hotAlbum: [],
                //当前歌手专辑内歌曲信息
                albumMusicInfo: []
            }
        },
        created() {
            //获取歌曲热门50首歌
            this.getHot50Music()
            //获得歌手的热门专辑信息
            this.getHotAlbum()
            /**
             * 注册监听的事件 在main.js中定义了
             * (监听当前播放音乐的id变化 响应式的切换当前播放的音乐的前缀图标)
             */
            window.addEventListener('setItem', ()=> {
                this.curId = parseInt(localStorage.getItem('curPlayMusicId'))
            })
        },
        methods: {
            //获取歌曲热门50首歌
            getHot50Music() {
                this.$http.get('artist/top/song', {params: {id: this.singerId}}).then(res => {
                    this.hot50Songs = res.data.songs;
                    //处理时长数据
                    this.hot50Songs.forEach(item => {
                        const dt = new Date(item.dt)
                        const mm = (dt.getMinutes() + '').padStart(2, '0')
                        const ss = (dt.getSeconds() + '').padStart(2, '0')

                        item.dt = mm + ':' + ss
                    })
                })
            },
            //切换当前显示热门50首
            changeDefaultNum() {
                this.$('.show').remove()
                this.defaultShow = 50
            },
            //获取歌手热门专辑
            getHotAlbum() {
                this.$http.get('artist/album', {params: this.queryInfo}).then(res => {
                    this.hotAlbum = res.data.hotAlbums
                    this.hotAlbum.forEach(item => {
                        this.$http.get('album', {params: {id: item.id}}).then(res => {
                            //处理时长 再放入数据
                            res.data.songs.forEach(item => {
                                const dt = new Date(item.dt)
                                const mm = (dt.getMinutes() + '').padStart(2, '0')
                                const ss = (dt.getSeconds() + '').padStart(2, '0')

                                item.dt = mm + ':' + ss
                            })
                            this.albumMusicInfo.push(res.data)
                        })
                    })
                    //处理时长数据
                    this.hotAlbum.forEach(item => {
                        const dt = new Date(item.dt)
                        const mm = (dt.getMinutes() + '').padStart(2, '0')
                        const ss = (dt.getSeconds() + '').padStart(2, '0')

                        item.dt = mm + ':' + ss
                    })
                })
            },
            //分页插件页数改变
            handleCurrentChange(newPage) {
                this.queryInfo.offset = (newPage - 1) * this.queryInfo.limit
                this.getHotAlbum();
            },
            //播放热门五十首
            playHot50Music(row) {
                var playList = []
                this.hot50Songs.forEach(item => {
                    playList.push(item.id)
                })
                this.$emit('setSongListInfo', playList, row.id)
            },
            //播放专辑中的歌曲
            playAlbumMusic(row) {
                this.$emit('setSongListInfo', window.localStorage.getItem('playList'), row.id)
            }
        }
    }
</script>

<style scoped>

</style>
