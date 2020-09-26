<template>
    <div>
        <div v-for="item in singerDesc">
            <h4>{{item.ti}}</h4>
            <span v-html="item.txt"></span>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                //当前歌手id
                singerId: this.$route.params.id,
                //当前歌手详情
                singerDesc: []
            }
        },
        created() {
            //获取改歌手的详细经历
            this.getSingerDesc()
        },
        methods: {
            //获取改歌手的详细经历
            getSingerDesc() {
                this.$http.get('artist/desc', {params: {id: this.singerId}}).then(res => {
                    this.singerDesc = res.data.introduction
                    this.singerDesc.forEach(item => {
                        item.txt = item.txt.replace(/▪/g,'<br/>▪');
                    })
                })
            }
        }
    }
</script>

<style scoped>

</style>
