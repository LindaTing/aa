/**
 * Created by hyt on 2017/8/20.
 */
var vm = new  Vue({
    el:"#app",
    data:{
        productList:[],
        isShow:false,//弹出层是否出现
        checkedAllFlag:false,//全选开关
        totalMoney:0
    },
   /* 局部过滤器*/
    filters:{
        priceFormat:function(Price){
            return "￥" + Price.toFixed(2);
        }
    },
    mounted:function(){  //挂载
        this.$nextTick(function () {//页面dom改变更新后执行
            this.getCarData();
        });
    },
    methods:{
        //绑定数据
        getCarData:function(){
            //类似于promise的then，es6的箭头函数，保持this指向父亲
            this.$http.get("data/carData.json",{ }).then(res=>{
                this.productList = res.data.result.list;
            });
        },
        /*添加和减少产品数量*/
        changeQuantity:function(item,flag){
            if(flag && item.productQuantity>0){//加商品
                item.productQuantity++;
            }else{//减商品
                /*不缺货的情况*/
                if(item.productQuantity==1){
                    item.productQuantity=1;
                }else if(item.productQuantity>1){
                    item.productQuantity--;
                }
            }
            this.calcuTotalMoney();
        },
        /*删除产品*/
        deleteBtn:function(item){
            this.isShow=true;
            this.curProduct=item;
        },
        /*确认删除
        * 实际项目中调接口，现在模拟删除
        * */
        deleteProduct:function(){
            /*js原生indexOf();
            * 1、string.indexOf();返回某个指定的字符串值在字符串中首次出现的位置。
            * 2、array.indexOf(obj);返回在数组中obj的索引值。
            * js原生splice();
            * 删除
            * */
            var index = this.productList.indexOf(this.curProduct);
            this.productList.splice(index,1);
            this.isShow=false;
            this.calcuTotalMoney();
        },
        /*选择产品*/
        checked:function(item){
            if(typeof item.isChecked == "undefined"){
                this.$set(item,"isChecked",true);
            }else{
                //this.$set(item,"isChecked",false);
                item.isChecked=!item.isChecked;
            }
            /*全部点亮时，全部按钮也点亮*/
            /*let：es6声明变量*/
            let checkedAllFlags=true;
            this.productList.forEach((item,index)=>{
                console.log(item.isChecked , checkedAllFlags)
                checkedAllFlags = item.isChecked && checkedAllFlags;//当取消选中时，checkedAllFlags变为false

            });
            this.checkedAllFlag=checkedAllFlags;
            this.calcuTotalMoney();
        },
        /*全选*/
        isCheckedAll:function(flag){
            this.checkedAllFlag=flag;
            this.productList.forEach((item,index)=>{
                if(typeof item.isChecked == "undefined"){
                    this.$set(item,"isChecked",this.checkedAllFlag);
                }else{
                    item.isChecked=this.checkedAllFlag;
                }
                console.log(item.isChecked,index);
            });
            this.calcuTotalMoney();
        },
        /*计算总金额*/
        calcuTotalMoney:function(){
            this.totalMoney=0;
            this.productList.forEach((item,index)=>{
                if(item.isChecked){
                    this.totalMoney += item.productPrice * item.productQuantity;
                }
            });
        }
    }
});