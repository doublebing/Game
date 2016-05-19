//定义Tank父类
function Tank(x,y,direct,speed,color){
    this.x=x;
    this.y=y;
    this.direct=direct;
    this.speed=speed;
    this.isLive=true;
    //一个坦克，需要两个颜色
    this.color=color;
    //上移
    this.moveUp=function(){
         this.y-=this.speed;
         this.direct=0;
    }
    //右移
    this.moveRight=function(){
         this.x+=this.speed;
         this.direct=1;
    }
    //下移
    this.moveDown=function(){
         this.y+=this.speed;
         this.direct=2;
    }
    //左移
    this.moveLeft=function(){
        this.x-=this.speed;
        this.direct=3;     
    }
}

//子弹类
//type表示，这颗子弹是敌人的，还是自己的
//tank表示对象，表明这颗子弹是属于哪个坦克
function Bullet(x,y,direct,speed,type,tank){
    this.x=x;
    this.y=y;
    this.direct=direct;
    this.speed=speed;
    this.timer=null;
    this.isLive=true;
    this.type=type;
    this.tank=tank;
    this.run=function(){

        //在改变坐标时，先判断是否子弹到达边界
        //子弹不前进，有两个逻辑，1.碰到边界 2.碰到别人坦克
        if(this.x<=0||this.x>=400||this.y<=0||this.y>=300||this.isLive==false){
            //子弹要停止
            window.clearInterval(this.timer);
            //子弹死亡
            this.isLive=false;
            if(this.type=="enemy"){
                this.tank.bulletIsLive=false;
            }
        }
        else{
            //修改坐标
            switch(this.direct){
            case 0:
                this.y-=this.speed;
                break;
            case 1:
                this.x+=this.speed;
                break;
            case 2:
                this.y+=this.speed;
                break;
            case 3:
                this.x-=this.speed;
                break;
            }      
        }
    }
}
//定义一个炸弹类
function Bomb(x,y){
    this.x=x;
    this.y=y;
    this.isLive=true;
    //炸弹有一个生命值
    this.blood=9;
    //减生命值
    this.bloodDown=function(){
        if(this.blood>0)
            this.blood--;
        else//炸弹死亡
            this.isLive=false;
    }
}
 //定义一个Hero类
//x表示坦克的横坐标，y表示坦克的纵坐标，speed表示坦克移动的速度，direct为方向
function Hero(x,y,direct,speed,color){

   //通过对象冒充，继承Tank类
   this.tank=Tank;
   this.tank(x,y,direct,speed,color);

   //增加一个函数，射击敌人坦克
   this.shotEnemy=function(){
    //创建子弹,子弹的位置和方向跟hero有关
    switch(this.direct){
        case 0:
            heroBullet=new Bullet(this.x+9,this.y,this.direct,2,"hero",this);
            break;
        case 1:
            heroBullet=new Bullet(this.x+30,this.y+9,this.direct,2,"hero",this);
            break;
        case 2:
            heroBullet=new Bullet(this.x+9,this.y+30,this.direct,2,"hero",this);
            break;
        case 3:
            heroBullet=new Bullet(this.x,this.y+9,this.direct,2,"hero",this);
            break;
        }
        //将子弹对象放入数组 push
        heroBullets.push(heroBullet);
        //每个子弹的定时器独立?之前是所有子弹共享一个定时器，所以速度越来越快
        var timer=window.setInterval("heroBullets["+(heroBullets.length-1)+"].run()",50);

        //把timer赋值给这个子弹（js对象是引用传递）
        heroBullets[heroBullets.length-1].timer=timer;
    } 
}

//画出子弹,也可以把该函数封装到Hero类中
function drawHeroBullet(){

    //画出所有子弹
    for(var i=0;i<heroBullets.length;i++)
    {
        var heroBullet=heroBullets[i];
        if(heroBullet!=null&&heroBullet.isLive){
            cxt.fillStyle="#FEF26E";
            cxt.fillRect(heroBullet.x,heroBullet.y,2,2);
        }
    }
   
}

//定义一个EnemyTank类
function EnemyTank(x,y,direct,speed,color){

    //通过对象冒充，继承Tank类
    this.tank=Tank;
    this.count=0;  //记录在一个方向上走的步数
    this.bulletIsLive=true;
    this.tank(x,y,direct,speed,color);

    this.run=function(){
        //判断敌人坦克的当前方向
        switch(this.direct){
            case 0:
                if(this.y>0)
                    this.y-=this.speed;
                break;
            case 1:
                if(this.x+30<400)
                    this.x+=this.speed;
                break;
            case 2:
                if(this.y+30<300)
                    this.y+=this.speed;
                break;
            case 3:
                if(this.x>0)
                    this.x-=this.speed;
                break;
        }
        //改变方向，走30次，再改变方向
        if(this.count>30){
            this.direct=Math.round(Math.random()*3);//随机生成0,1,2,3
            this.count=0;
        }
        this.count++;
        //判断子弹是否已经死亡，如果死亡，则根据方向增加新的一颗子弹
        if(this.bulletIsLive==false){
            switch(this.direct){
                case 0:
                    etBullet=new Bullet(this.x+9,this.y,this.direct,1.5,"enemy",this);
                    break;
                case 1:
                    etBullet=new Bullet(this.x+30,this.y+9,this.direct,1.5,"enemy",this);
                    break;
                case 2:
                    etBullet=new Bullet(this.x+9,this.y+30,this.direct,1.5,"enemy",this);
                    break;
                case 3:
                    etBullet=new Bullet(this.x,this.y+9,this.direct,1.5,"enemy",this);
                    break;
            }
            //把子弹添加到敌人子弹数组
            enemyBullets.push(etBullet);
            //启动新子弹run函数
            var mytimer=window.setInterval("enemyBullets["+(enemyBullets.length-1)+"].run()",50);
            enemyBullets[enemyBullets.length-1].timer=mytimer;
            this.bulletIsLive=true;

        }
    }
}

//画出敌人子弹,当然，可以将drawHeroBullet和drawEnemyBullet进行合并
function drawEnemyBullet(){

    //画出所有子弹
    for(var i=0;i<enemyBullets.length;i++)
    {
        var enemyBullet=enemyBullets[i];
        if(enemyBullet.isLive){
            cxt.fillStyle="#00FEFE";
            cxt.fillRect(enemyBullet.x,enemyBullet.y,2,2);
        }
    }
   
}

//绘制坦克
 function drawTank(tank){
    //所有的坦克都要isLive这个属性
    if(tank.isLive){
        switch(tank.direct){
        case 0:
        case 2://向上和向下类似，只是炮筒方向不一样
            //画出自己的坦克
            //设置颜色
            cxt.fillStyle=tank.color[0];
            //先画出左边的矩形
            cxt.fillRect(tank.x,tank.y,5,30);
            //再画出右边的矩形 一定要找一个参照点 本例中以坦克左上角为参照点，好处是当左上角的坐标变换，坦克就整体移动  画出图片比较耗资源
            cxt.fillRect(tank.x+15,tank.y,5,30);
            //画出中间矩形
            cxt.fillRect(tank.x+6,tank.y+5,8,20);
            //画出坦克的盖子
            cxt.fillStyle=tank.color[1];
            cxt.arc(tank.x+10,tank.y+15,4,0,Math.PI*2,false);
            cxt.fill();
            //画出炮筒(直线)
            cxt.strokeStyle=tank.color[1];
            cxt.lineWidth="1.5";
            cxt.beginPath();
            cxt.moveTo(tank.x+10,tank.y+15);
            if(tank.direct==0)//上
                cxt.lineTo(tank.x+10,tank.y);
            else if(tank.direct==2)//下
                cxt.lineTo(tank.x+10,tank.y+30);
            cxt.closePath();
            cxt.stroke();
            break;
        case 1:
        case 3://向右和向左类似，只是炮筒方向不一样
            //画出自己的坦克
            //设置颜色
            cxt.fillStyle=tank.color[0];
            //先画出左边的矩形
            cxt.fillRect(tank.x,tank.y,30,5);
            //再画出右边的矩形 一定要找一个参照点 本例中以坦克左上角为参照点，好处是当左上角的坐标变换，坦克就整体移动  画出图片比较耗资源
            cxt.fillRect(tank.x,tank.y+15,30,5);
            //画出中间矩形
            cxt.fillRect(tank.x+5,tank.y+6,20,8);
            //画出坦克的盖子
            cxt.fillStyle=tank.color[1];
            cxt.arc(tank.x+15,tank.y+10,4,0,Math.PI*2,false);
            cxt.fill();
            //画出炮筒(直线)
            cxt.strokeStyle=tank.color[1];
            cxt.lineWidth="1.5";
            cxt.beginPath();
            cxt.moveTo(tank.x+15,tank.y+10);
            if(tank.direct==1)//右
                cxt.lineTo(tank.x+30,tank.y+10);
            else if(tank.direct==3)//左
                cxt.lineTo(tank.x,tank.y+10);
            cxt.closePath();
            cxt.stroke();
            break;
        }
    }      
}

//编写一个函数，专门用于判断我的子弹是否击中了某个敌人坦克
function isHitEnemyTank(){
    //取出每颗子弹
    for(var i=0;i<heroBullets.length;i++){
        //取出一颗子弹
        var heroBullet=heroBullets[i];
        if(heroBullet.isLive){//子弹是活的，才去判断
            //让这颗子弹去和每个敌人坦克判断
            for(var j=0;j<enemyTanks.length;j++){
                var enemyTank=enemyTanks[j];
                if(enemyTank.isLive){
                    //子弹击中敌人坦克的条件是什么？思路之一：判断该子弹是否进入坦克所在矩形
                    //根据当时敌人坦克的方向来决定
                    switch(enemyTank.direct){
                        case 0://敌人坦克向上
                        case 2://敌人坦克向下
                            if(heroBullet.x>=enemyTank.x&&heroBullet.x<=enemyTank.x+20&&heroBullet.y>=enemyTank.y&&heroBullet.y<=enemyTank.y+30){
                                enemyTank.isLive=false;//坦克死亡
                                heroBullet.isLive=false;//该子弹也死亡
                                //创建一颗炸弹
                                var bomb=new Bomb(enemyTank.x,enemyTank.y);
                                //然后把该炸弹放入到bombs数组中
                                bombs.push(bomb);
                            }
                            break;
                        case 1:
                        case 3:
                            if(heroBullet.x>=enemyTank.x&&heroBullet.x<=enemyTank.x+30&&heroBullet.y>=enemyTank.y&&heroBullet.y<=enemyTank.y+20){
                                enemyTank.isLive=false;
                                heroBullet.isLive=false;
                                 //创建一颗炸弹
                                var bomb=new Bomb(enemyTank.x,enemyTank.y);
                                //然后把该炸弹放入到bombs数组中
                                bombs.push(bomb);
                            }
                            break;
                    }
                }
            }

        }

    }
}
//画出敌人炸弹
function drawEnemyBomb(){
    //画出敌人炸弹
    for(var i=0;i<bombs.length;i++){
        var bomb=bombs[i];
        if(bomb.isLive){
            //根据当前炸弹的生命值，来画出不同的炸弹图片
            if(bomb.blood>6){//显示最大炸弹图
                var img1=new Image();
                img1.src="bomb_1.gif";
                var x=bomb.x;
                var y=bomb.y;
                img1.onload=function(){
                    cxt.drawImage(img1,x,y,30,30);
                }
            }else if(bomb.blood>3){
                var img1=new Image();
                img1.src="bomb_2.gif";
                var x=bomb.x;
                var y=bomb.y;
                img1.onload=function(){
                    cxt.drawImage(img1,x,y,30,30);
                }
            }else{
                var img1=new Image();
                img1.src="bomb_3.gif";
                var x=bomb.x;
                var y=bomb.y;
                img1.onload=function(){
                    cxt.drawImage(img1,x,y,30,30);
                }
            }
            bomb.bloodDown();
            if(bomb.blood<=0){
                //把炸弹从数组中去掉
                bombs.splice(i,1);
            }

        }
    }

}
    