<template>
  <div class="box">
    <div class="wrap" ref="wrap">
      <List :brandList="brandList" :getMasterList="getMasterList"/>
    </div>
      <Letter :letter="letter" :changeLetter="changeLetter"/>
      <MasterList :masterCls="masterCls" :masterList="masterList" :hideMaster="hideMaster"/>
    </div>
</template>

<script>
import Letter from "./common/Letter.vue";
import List from "./common/List.vue";
import MasterList from "./common/MasterList.vue";
import {debounce,throttle,lazyLoad} from "./utils/utils.js";
export default {
    data(){
      return{
        letter:[],
        brandList:[],
        masterList:[],
        masterCls:""
      }
    },
    components:{
      Letter,
      List,
      MasterList
    },
    methods:{
      getBrandList(){
        fetch("https://baojia.chelun.com/v2-car-getMasterBrandList.html").then(res=>{
          res.json().then(body=>{
            //console.log("body: ",body);
            //处理数据
            if(body.code == 1){
                let letter = [];
                let brandList = [];
                let len = -1;
                body.data.forEach((item)=>{
                    let speeling = item.Spelling[0];
                    item.speeling = item.Spelling[0];
                    if(letter[len] == speeling){
                        brandList[len].list.push(item);
                    }else{
                        len++;
                        letter.push(speeling);
                        brandList.push({
                          speeling,
                          list:[item]
                        })
                    }
                })
                letter.unshift("#");
                this.letter = letter;
                this.brandList = brandList;
                setTimeout(()=>lazyLoad.init(),10);
            }else{
                alert(body.msg)
            }
          })
        })
      },
      getMasterList(id){
        fetch('https://baojia.chelun.com/v2-car-getMakeListByMasterBrandId.html?MasterID='+id).then(res=>{
          res.json().then(body=>{
            //console.log("body ",body);
            if(body.code == 1){
              this.masterList = body.data;
              this.masterCls = "active";
              setTimeout(()=>lazyLoad.init(),10);
            }else{
              alert(body.msg);
            }
          })
        })
      },
      hideMaster(){
        this.masterCls="";
      },
      changeLetter(letter){
        if(letter == "#"){
          return;
        }
        let scrollTop = document.querySelector(`#${letter}`).offsetTop;
        console.log(letter,scrollTop);
        this.$refs.wrap.scrollTop = scrollTop;
      }
    },
    mounted() {
      this.getBrandList();
      let scroll = throttle(()=>{
        lazyLoad.loadImg();
      },500);
      this.$refs.wrap.onScroll =()=>{
        scroll()
      }
      document.querySelector(".master").onscroll = ()=>{
        scroll();
      }
    }
}
</script>

<style scoped>
.wrap{
  height:100%;
  overflow-y:scroll;
}
</style>
