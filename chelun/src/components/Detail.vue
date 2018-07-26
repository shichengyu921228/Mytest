<template>
    <div class="car">
        <div class="content">
            <div class="img" @click="clickImgs(list.SerialID)">
                <img :src="list.CoverPhoto" alt=""/>
                <span>{{list.pic_group_count}}张照片</span>
            </div>
            <div class="info">
                <p>{{list.market_attribute&&list.market_attribute.dealer_price}}</p>
                <p>指导价 {{list.market_attribute&&list.market_attribute.official_refer_price}}</p>
                <div class="action active flex-row">
                    <button>{{list.BottomEntranceTitle}}</button>
                </div>
            </div>
            <div class="car-list">
                <div class="c-type">
                    <span :class="index==active?'active':null" v-for="(item,index) in yearlist" :key="index" @click="tablist(item,index)">{{item}}</span>
                </div>
                <div v-for="(item,index) in tabList" :key="index">
                    <ul>
                         <li>
                             <p>{{item.market_attribute.year}}款 {{item.car_name}}</p> 
                             <p>{{item.horse_power}}马力{{item.gear_num}}档{{item.trans_type}}</p>
                             <p><span>指导价 {{item.market_attribute.official_refer_price}}</span> <span>{{item.market_attribute.dealer_price_min}}起</span>
                              </p>
                            <button data-id="127946" data-hover="hover">询问底价</button>
                        </li>
                    </ul>
                </div>
            </div>
            <div data-hover="hover" class="bottom flex-column flex-centerY">
                <p>询问底价</p><p>本地经销商为你报价</p>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                list:[],
                tabList:[],
                yearlist:[],
                active:""
            }
        },
        methods:{
            init(){
                this.id = this.$route.query.id;
                fetch("https://baojia.chelun.com/v2-car-getInfoAndListById.html?SerialID="+this.id).then(res=>{
                    res.json().then(body=>{
                        if(body.code==1){
                            this.list=body.data;
                            let yearlist = ["全部"];
                            let carlist=[];
                            body.data.list.forEach(item=>{
                                let year = item.market_attribute.year;
                                if(yearlist.indexOf(year)==-1){
                                    yearlist.push(year)
                                }
                                carlist.push(item)
                            })
                            this.yearlist = yearlist;
                            let sortCar = (arr)=>{
                                return arr.sort((a,b)=>{
                                    if(a.exhaust<b.exhaust){
                                        return -1;
                                    }else if(a.exhaust > b.exhaust){
                                        return 1;
                                    }else{
                                        if(a.max_power < b.max_power){
                                            return -1;
                                        }else if(a.max_power > b.max_power){
                                            return 1;
                                        }else{
                                            return b.inhale_type - a.inhale_type;
                                        }
                                    }
                                })
                            }
                            this.carlist = carlist;
                            this.carlist = sortCar(carlist);
                            this.tabList = carlist;
                            //console.log(yearlist,carlist)
                        }else{
                            alert(body.code)
                        }
                    })
                })
            },
            tablist(key,index){
                if(key=="全部"){
                    this.tabList = this.carlist;
                }else{
                    this.tabList = this.carlist.filter(item=>{
                        let year = item.market_attribute.year;
                        return year == key
                    })
                }
                //console.log(this.tabList);
                this.active = index;
            },
            clickImgs(id){
                 this.$router.push({
                    path:"/Imgs?id="+id
                })
            }
        },
        mounted() {
            this.init();
        }
       
    }
</script>
<style lang="sass" scoped>
@import "../css/detail.scss"
</style>