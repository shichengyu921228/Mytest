<template>
    <div class="listImg">
        <div class="Imgs">
            <div class="tit">
                <p><span>颜色</span></p>
                <p><span>车款</span></p>
            </div>
            <div class="img-default">
                <ul v-for="(item,index) in list" :key="index">
                    <li v-for="(value,key) in item.List" :key="key">
                        <span :style="{'backgroundImage':`url(${value.Url.replace('{0}',value.LowSize)})`}"></span>
                        <div v-if="!key" @click="clickAll(item.Id)">
                            <p>{{item.Name}}</p>
                            <p>{{item.Count}}张></p>
                        </div>
                    </li>
                </ul>  
            </div>
        </div>
        <div v-if="showDetail" class="img-list" @scroll="scrollAll">
            <ul ref="ul">
                <li v-for="(value,key) in categoryList" :key="key">
                    <span @click="clickSwiper(key)" :style="{'backgroundImage': `url(${value.Url.replace('{0}', value.LowSize)})`}"></span>
                </li>
            </ul>
        </div>
        <div v-show="isShowSwiper" class="img-swiper" @click="hideSwiper">
            <swiper :options="swiperOption" ref="mySwiper">
                <swiper-slide v-for="(item,index) in categoryList" :key="index">
                    <img :src="item.Url.replace('{0}',item.HighSize)"/>
                </swiper-slide>
                <div class="swiper-pagination"  slot="pagination"></div>
            </swiper>
        </div>
    </div>
</template>
<script>
import 'swiper/dist/css/swiper.css';
import {swiper,swiperSlide} from "vue-awesome-swiper";
    export default {
        computed:{
            swiperOption(){
                return{}
            },
            swipe(){
                return this.$refs.mySwiper.swiper
            }
        },
        components:{
            swiper,
            swiperSlide
        },
        data(){
            return {
                list:[],
                Page:1,
                id:'',
                categoryList:[],
                showDetail:false,
                fetchingAll:false,
                isShowSwiper: false
            }
        },
        methods:{
            init(){
               this.id = this.$route.query.id;
                fetch("https://baojia.chelun.com/v2-car-getImageList.html?SerialID="+this.id).then(res=>{
                    res.json().then(body=>{
                        console.log(body.data)
                        if(body.code==1){
                            this.list = body.data;
                        }
                    })
                })  
            },
            clickAll(ip){
                this.showDetail = true;
                this.ip = ip;
                fetch(`https://baojia.chelun.com/v2-car-getCategoryImageList.html?SerialID=${this.id}&ImageID=${ip}&Page=1&PageSize=30`).then(res=>{
                    return res.json()
                }).then(body=>{
                    console.log("body...",body)
                    this.categoryList = body.data.List;
                }) 
            },
            hideSwiper(e){
                if(e.target == e.currentTarget){
                    this.isShowSwiper=false
                }
            },
            clickSwiper(index){
                this.isShowSwiper=true
                this.swipe.slideTo(index)
            },
            scrollAll(e){
                if(this.fetchingAll){
                    return
                }
                let scrollHeight = this.$refs.ul.getBoundingClientRect().height - window.innerHeight;
                let current = e.target.scrollTop;
                console.log('current...', current, scrollHeight);
                if (current >= (scrollHeight-20)){
                    // 加载下一页数据
                    this.fetchingAll = true;
                    this.Page++;
                    fetch(`https://baojia.chelun.com/v2-car-getCategoryImageList.html?SerialID=${this.id}&ImageID=${this.ip}&Page=${this.Page}&PageSize=30`).then(res=>{
                    return res.json()
                }).then(body=>{
                    console.log("body...",body)
                   this.categoryList = this.categoryList.concat(body.data.List)
                   this.fetchingAll = false;
                })
                }

            }

        },
        mounted() {
            this.init()
        },
    }
</script>
<style lang="sass" scoped>
@import "../css/_Imgs.scss"
</style>
