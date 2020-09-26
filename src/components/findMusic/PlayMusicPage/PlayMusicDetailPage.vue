<template>
    <div>
        <!--头部的图片跟歌词-->
        <el-row class="topInfo">
            <img :src="music.al.picUrl"
                 style="opacity: 0.4;border-radius: 25px;position: absolute;left: 220px;width:1000px;height: 600px;z-index: -1"
                 alt="">
            <el-col :offset="5" :span="6">
                <el-image src="imgs/play-bar.png" style="width: 120px;"></el-image>
                <el-image src="imgs/play-bar-middle.png"
                          style="position: absolute;top: -5px;left: 340px;width: 25px;height: 25px;z-index: 10"></el-image>

                <!--播放的歌曲的图片信息-->
                <img :src="music.al.picUrl" alt="" class="musicPoster">
            </el-col>

            <el-col :span="6">
                <h1 style="font-size: 25px;font-weight: 400">{{music.name}}</h1>
                <span>专辑: {{music.al.name}}</span>
                <span style="margin-left: 15px;">
                    歌手:
                    <span style="color: #4d99de;cursor: pointer" @click="toSingerPage(music.ar[0].id)">{{music.ar[0].name}}</span>
                </span>
                <!--歌词-->
                <div style="width: 350px;height: 350px;overflow: hidden;margin-top: 25px;">
                    <div style="overflow-y: auto">
                        <ul ref="lyric">
                            <li v-for="(item, i) in lrcObject"
                                :style="{color: lyricIndex === i ? 'red' : 'black'}">
                                {{item.c}}
                            </li>
                        </ul>
                    </div>
                </div>

            </el-col>
        </el-row>

        <!--底部评论信息-->
        <el-main style="margin-top: 25px;margin-bottom: 75px;">
            <el-row>
                <el-col :offset="3" :span="15">
                    <h4 style="font-weight: 300" v-if="queryInfo.offset === 0">精彩评论</h4>
                    <!--精彩评论的信息-->
                    <div v-for="item in hotCommentList"
                         style="position: relative;border-top: 2px solid rgb(240,240,242);
                 border-bottom: 1px solid rgb(240,240,242);padding: 15px 0;font-size: 15px;">

                        <div>
                            <!--用户头像-->
                            <img :src="item.user.avatarUrl" alt=""
                                 style="display: inline;width: 50px;height: 50px;border-radius: 25px;">

                            <!--评论信息-->
                            <div style="margin-left: 60px;margin-top: -60px;">
                                <p><span style="color: #4d99de;">{{item.user.nickname}}</span>: {{item.content}}</p>

                                <br v-if="item.beReplied.length > 0">
                                <!--子评论-->
                                <div v-if="item.beReplied.length > 0"
                                     style="background-color: rgb(241,241,244);padding: 5px 5px;">
                                    <p v-for="citem in item.beReplied"><span
                                            style="color: #4d99de;">{{citem.user.nickname}}</span>: {{citem.content}}
                                    </p>
                                </div>

                                <p style="display:block;font-size: 13px;color: gray;opacity: 0.7">{{item.time |
                                    dateFormat}}</p>
                            </div>
                        </div>
                    </div>


                    <h4 style="font-weight: 300;margin-top: 25px;">最新评论({{total}})</h4>
                    <!--所有评论的信息-->
                    <div v-for="item in commentList"
                         style="position: relative;border-top: 2px solid rgb(240,240,242);
                 border-bottom: 1px solid rgb(240,240,242);padding: 15px 0;font-size: 15px;">

                        <div>
                            <!--用户头像-->
                            <img :src="item.user.avatarUrl" alt=""
                                 style="display: inline;width: 50px;height: 50px;border-radius: 25px;">

                            <!--评论信息-->
                            <div style="margin-left: 60px;margin-top: -60px;">
                                <p><span style="color: #4d99de;">{{item.user.nickname}}</span>: {{item.content}}</p>

                                <br v-if="item.beReplied.length > 0">
                                <!--子评论-->
                                <div v-if="item.beReplied.length > 0"
                                     style="background-color: rgb(241,241,244);padding: 5px 5px;">
                                    <p v-for="citem in item.beReplied"><span
                                            style="color: #4d99de;">@{{citem.user.nickname}}</span>: {{citem.content}}
                                    </p>
                                </div>

                                <p style="display:block;font-size: 13px;color: gray;opacity: 0.7">{{item.time |
                                    dateFormat}}</p>
                            </div>
                        </div>
                    </div>

                    <!--分页-->
                    <el-pagination
                            layout="prev, pager, next"  :page-size="queryInfo.limit"
                            :total="total" @current-change="handleCurrentChange">
                    </el-pagination>
                </el-col>
            </el-row>
        </el-main>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                curId: this.$route.params.id,
                //当前音乐的详细信息
                music: {
                    name,
                    al: {
                        picUrl: ''
                    },
                    ar: [
                        {
                            name: ''
                        }
                    ]
                },
                //当前歌词字符串
                lrc: '',
                //解析歌词为对象
                lrcObject: [],
                //当前音乐播放的进度条(从父组件中实时同步获取)
                duration: '',
                //当前歌词的所位于歌词对象中的索引值(用于帮助高亮)
                lyricIndex: 0,
                //旋转对象
                rotate: null,
                //旋转角度
                deg: 0,
                //是否在播放
                play: this.isPlay,
                //查询评论的信息
                queryInfo: {
                    id: this.$route.params.id,
                    limit: 10,
                    offset: 0,
                },
                //所有评论列表
                commentList: [],
                //最热评论列表
                hotCommentList: [],
                //评论总数
                total: 0,
            }
        },
        props: ['musicDuration', 'curId', 'isPlay'],
        watch: {
            //父组件通过 router-view 的@musicDuration传递过来值(进行歌曲滚动操作)
            musicDuration(newVal) {
                this.duration = newVal
                //对每次进来的进度条进行判断
                // 跟下一句台词时长是否匹配,如果匹配则当前高亮的索引值+1
                //使用循环帮助****回退  快进****的判断
                for (let i = 0; i < this.lrcObject.length; i++) {
                    //这里使用小于符号判断是为了 保证回退音乐进度事件的效果实现性
                    if (newVal <= parseFloat(this.lrcObject[i].t)) {
                        if (this.lyricIndex === i - 1) {
                            break
                        }
                        //找到比当前时间点 大一点的后一位的歌词的索引值
                        this.lyricIndex = i - 1;
                        //当前距离上方的距离  控制歌词上下滚动
                        var currentTemp = this.$refs.lyric.style.marginTop
                        currentTemp = currentTemp.substr(0, currentTemp.length - 2)
                        //滚动距离
                        currentTemp = parseInt(currentTemp)
                        if (i > 5) {//第五句歌词之后 开始使用定位
                            /**
                             * 例子
                             * 第一句 margin-top 25px
                             * 第二句 margin-top 50px
                             * 第三句 margin-top 75px;
                             * 以此类推
                             *  ***计算出给一句歌词一个距离顶部的一个距离
                             *  (每次只需要切换到当前距离顶部的位置 实现歌词滚动)
                             *  顶部的位置 = 当前高亮歌词索引 * 25 +'px'   ***
                             * @type {number}
                             */
                            currentTemp = (i - 5) * -35
                            //设置样式
                            this.$refs.lyric.style.marginTop = currentTemp + 'px'
                        }
                        //如果当前是最后一句歌词 代表歌曲要放送结束了 将我们的lyricIndex(当前歌词索引值还原成0便于下一曲使用)
                        if (this.lyricIndex === this.lrcObject.length - 1) {
                            this.lyricIndex = 0;
                        }
                        break;
                    }
                }
            },
            //监测curId变化
            curId(newVal) {
                this.curId = newVal
            },
            //监测当前的播放状态
            isPlay(newVal) {
                if (!newVal) {//如果当前是在暂停状态
                    window.clearInterval(this.rotate)
                } else {
                    this.rotate = window.setInterval(() => {
                        this.$('.musicPoster').eq(0).css('transform', 'rotate(' + this.deg + 'deg)');
                        this.deg += 1;
                    }, 30)
                }
            }
        },
        created() {
            //获取音乐的详细信息
            this.getMusicDetail(this.$route.params.id)
            //获取歌曲的歌词
            this.getMusicLrc()
            //注册监听的事件 在main.js中定义了
            window.addEventListener('setItem', () => {
                this.curId = parseInt(localStorage.getItem('curPlayMusicId'))
                this.getMusicDetail(this.curId)
                this.getMusicLrc()
            })
            //查询该歌曲的评论信息
            this.getMusicComment()
        },
        mounted() {
            //dom元素加载完毕后,设置ul默认的向上样式
            this.$refs.lyric.style.marginTop = '-10px'
            //如果当前是在播放的时候 开始旋转
            if (this.play) {
                this.rotate = window.setInterval(() => {
                    this.$('.musicPoster').eq(0).css('transform', 'rotate(' + this.deg + 'deg)');
                    this.deg += 1;
                }, 30)
            }
        },
        beforeRouteLeave(to, form, next) {
            window.clearInterval(this.rotate)
            this.rotate = null
            next()
        },
        methods: {
            //根据id获取音乐详情
            getMusicDetail(musicId) {
                this.$http.get('song/detail', {params: {ids: musicId}}).then(res => {
                    this.music = res.data.songs[0]
                })
            },
            //获取歌词
            getMusicLrc() {
                this.$http.get('lyric', {params: {id: this.curId}}).then(res => {
                    //获取歌词
                    this.lrc = res.data.lrc.lyric
                    //解析歌词
                    this.createLrcObj(this.lrc);
                })
            },
            //解析歌词
            createLrcObj(lrc) {
                var oLRC = {
                    ms: [] //歌词数组{t:时间,c:歌词}
                };
                if (lrc.length == 0) return;
                var lrcs = lrc.split('\n');//用回车拆分成数组
                for (var i in lrcs) {//遍历歌词数组
                    lrcs[i] = lrcs[i].replace(/(^\s*)|(\s*$)/g, ""); //去除前后空格
                    var t = lrcs[i].substring(lrcs[i].indexOf("[") + 1, lrcs[i].indexOf("]"));//取[]间的内容
                    var s = t.split(":");//分离:前后文字
                    if (isNaN(parseInt(s[0]))) { //不是数值
                        for (var i in oLRC) {
                            if (i != "ms" && i == s[0].toLowerCase()) {
                                oLRC[i] = s[1];
                            }
                        }
                    } else { //是数值
                        var arr = lrcs[i].match(/\[(\d+:.+?)\]/g);//提取时间字段，可能有多个
                        var start = 0;
                        for (var k in arr) {
                            start += arr[k].length; //计算歌词位置
                        }
                        var content = lrcs[i].substring(start);//获取歌词内容
                        for (var k in arr) {
                            var t = arr[k].substring(1, arr[k].length - 1);//取[]间的内容
                            // var t = arr[k]
                            var s = t.split(":");//分离:前后文字
                            oLRC.ms.push({//对象{t:时间,c:歌词}加入ms数组
                                // t: t,
                                t: (parseFloat(s[0]) * 60 + parseFloat(s[1])).toFixed(3),
                                c: content === '' ? '..............' : content
                            });
                        }
                    }
                }
                oLRC.ms.sort(function (a, b) {//按时间顺序排序
                    return a.t - b.t;
                });
                // for(var i in oLRC){ //查看解析结果
                //     console.log(i,":",oLRC[i]);
                // }
                this.lrcObject = oLRC.ms
            },
            //点击歌手名跳转歌手详细页面
            toSingerPage(id) {
                this.$router.push('/singer/' + id)
            },
            //查询评论
            getMusicComment() {
                this.$http.get('comment/music', {params: this.queryInfo}).then(res => {
                    if (res.data.code !== 200) return this.$message.error('获取评论数据失败!')
                    this.commentList = res.data.comments
                    this.hotCommentList = res.data.hotComments
                    this.total = res.data.total
                })
            },
            //分页插件页数改变
            handleCurrentChange(newPage) {
                this.queryInfo.offset = (newPage - 1) * this.queryInfo.limit
                this.getMusicComment();
            },
        }
    }
</script>

<style lang="less" scoped>
    .musicPoster {
        position: absolute;
        border: 45px solid black;
        border-radius: 100%;
        box-shadow: 0 0 5px 5px gray;
        width: 200px;
        height: 200px;
        top: 120px;
        left: 250px;
        z-index: -1;
    }

    .topInfo {
        height: 600px;
    }

    li {
        list-style: none;
        margin-top: 15px;
    }


</style>
