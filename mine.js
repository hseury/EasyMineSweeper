/**
 * Created by hseury on 9/10/18.
 */

var Mine = function  (ele,faceele,panewidth,paneheight,minenum,tagele,timeele) {
    this.PANE_SIZE = 16;//每个格子的像素px大小。
    this.paneheight = paneheight;//有几行
    this.panewidth = panewidth;//有几列
    this.minenum = minenum;//有几个雷
    this.ele = document.getElementById(ele);
    this.cxt = this.ele.getContext("2d");
    this.tagele = tagele;
    this.timeele = timeele;
    this.faceele = document.getElementById(faceele);
}


Mine.prototype = {
    init: function () {
        //画格子
        this.ele.width = this.PANE_SIZE * this.panewidth;
        this.ele.height = this.PANE_SIZE * this.paneheight;
        this.faceele.src = "res/face_normal.bmp";

        this.oldPos = [0, 0];//鼠标上一个停留的位置。默认值。用于处理hover事件。
        this.cellArr = [];//格子信息保存数组。保存每个格子是不是雷，当前是否有标记。
        this.mineArr = [];//地雷位置数组。
        this.time = 0;
        this.notTaged = this.minenum;
        this.numToImage(this.notTaged, this.tagele);
        this.numToImage(this.time, this.timeele);

        this.mousedownArr = '';
        this.createCells();//初始化cellArr数组,并涂上颜色。
        this.inited = false;
        clearInterval(this.timer);
        // //绑定事件
        this.onmousemove();//鼠标在上面移动，触发每个格子的
        // this.onmouseout();//鼠标移出canvas的事件。
        // this.onmousedown();
        // this.onclick();//点击方格事件
        // this.preRightMenu();//阻止右键菜单。
    },

    onmousemove:function(){

        var that = this;//传入this.
        this.ele.onmousemove = function(e){

            var pos = that.getCellPos(getEventPosition(e));
            var oldPos = that.oldPos;
            var cellArr = that.cellArr;

            if(pos.toString() == oldPos.toString()){//当前位置等于上一位置，return;
                return;
            }

            //如果上一个位置没被打开，就把上一个位置涂白
            if(that.checkCell(oldPos)&&(cellArr[oldPos[0]][oldPos[1]].isOpened == false && cellArr[oldPos[0]][oldPos[1]].tag == 0)){
                that.drawCell(oldPos,1);
            }

            //如果当前位置被打开了，新地址替换旧地址，return;
            if(that.checkCell(pos) && (cellArr[pos[0]][pos[1]].isOpened == true || cellArr[pos[0]][pos[1]].tag != 0 )){
                that.oldPos = pos;
                return;
            }

            that.drawCell(pos,2);
            that.oldPos = pos;

        }
    },

    createCells:function(){//初始化cellArr，保存每个格子的状态。

        var  paneheight = 	this.paneheight;
        var  panewidth = this.panewidth;

        for(var i=1;i<=panewidth;i++){
            this.cellArr[i] = [];
            for (var j = 1; j <= paneheight; j++) {
                this.cellArr[i][j] = {
                    isMine:false,
                    isOpened:false,
                    tag:0
                };
                this.drawCell([i,j],1)
            };
        }
    },

    getCellArea:function(pos){//根据格子坐标返回一个格子左上角的像素坐标[32,666];
        return [(pos[0]-1)*this.PANE_SIZE+1,(pos[1]-1)*this.PANE_SIZE+1];
    },

    preRightMenu:function(){//阻止右键菜单
        this.ele.oncontextmenu=function(event) {
            if (document.all) window.event.returnValue = false;// for IE
            else event.preventDefault();
        }
    },

    drawCell:function(pos,type){//绘制不同种类的格子。
        var area =  this.getCellArea(pos);
        var cxt = this.cxt;
        var image = new Image();
        var src;
        var srcArr = ["res/blank.bmp","res/0.bmp","res/flag.bmp","res/ask.bmp","res/mine.bmp","res/blood.bmp","res/error.bmp"];
        //1正常格 2mouseover格子 3旗子格 4问号格 5正常雷格 6点中雷格 7.错误标记
        var index  = type -1;
        image.src =srcArr[index];
        image.onload = function(){
            cxt.drawImage(image,area[0],area[1],16,16);
        }
    },

    checkCell:function(pos){//检测位置有效性。
        return this.cellArr[pos[0]] && this.cellArr[pos[0]][pos[1]] ;
    },

    getCellPos:function(coordinate){//根据像素坐标返回格子坐标。[3,5];
        return [Math.ceil(coordinate.x/this.PANE_SIZE),Math.ceil(coordinate.y/this.PANE_SIZE)];
    },

    numToImage:function (num,ele){
        if(num>999){
            num = 999;
        }else if(num<0){
            num = 000;
        }else if(num<10){
            num = "00"+num;
        }	else if(num< 100){
            num = "0"+num;
        }
        var ele = document.getElementsByClassName(ele)[0].getElementsByTagName('img');

        for (var i = 0,eLen=ele.length; i < eLen; i++) {
            ele[i].src="res/d"+num.toString().charAt(i)+".bmp";
        };

    }


}

//获取坐标：解决canvas在高分屏缩放150%之后坐标计算不准确的问题。
//https://github.com/zbinlin/blog/blob/master/getting-mouse-position-in-canvas.md
function getEventPosition(evt)
{
    var x, y;
    var x = evt.clientX;
    var y = evt.clientY;
    var rect = document.getElementById('mine1').getBoundingClientRect();
    x -= rect.left;
    y -= rect.top;
    return {x: x, y: y};
}