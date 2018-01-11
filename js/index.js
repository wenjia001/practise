let loadingBox = (function ($) {
    let $box = $(".loadingBox"),
        $range = $box.find(".con");
    let imgList = ["img/icon.png","img/zf_concatAddress.png","img/zf_concatInfo.png","img/zf_concatPhone.png","img/zf_course.png","img/zf_course1.png","img/zf_course2.png","img/zf_course3.png","img/zf_course4.png","img/zf_course5.png","img/zf_course6.png","img/zf_cube1.png","img/zf_cube2.png","img/zf_cube3.png","img/zf_cube4.png","img/zf_cube5.png","img/zf_cube6.png","img/zf_cubeBg.jpg","img/zf_cubeTip.png","img/zf_emploment.png","img/zf_messageArrow1.png","img/zf_messageArrow2.png","img/zf_messageChat.png","img/zf_messageKeyboard.png","img/zf_messageLogo.png","img/zf_messageStudent.png","img/zf_outline.png","img/zf_phoneBg.jpg","img/zf_phoneDetail.png","img/zf_phoneListen.png","img/zf_phoneLogo.png","img/zf_return.png","img/zf_style1.jpg","img/zf_style2.jpg","img/zf_style3.jpg","img/zf_styleTip1.png","img/zf_styleTip2.png","img/zf_teacher1.png","img/zf_teacher2.png","img/zf_teacher3.jpg","img/zf_teacher4.png","img/zf_teacher5.png","img/zf_teacher6.png","img/zf_teacherTip.png"];
    let total = imgList.length,
        count = 0;
    let computed = function () {
        imgList.forEach((item)=>{
            let tempImg = new Image;
            tempImg.src = item;
            tempImg.onload = function () {
                tempImg = null;
                count++;
                run();
            }
        })
    };
    function run() {
        $range.css({"width":count/total*100+'%'});
        if(count>=total){
            let timer = setTimeout(()=>{
                $box.remove();
                phoneRender.init();
                clearTimeout(timer);
            },1500)
        }
    }

    return{
        init:function () {
            $box.css("display","block");
            computed();
        }
    }
})(Zepto);
let phoneRender = (function ($) {
    let $phoneBox = $(".phoneBox"),
        $time = $phoneBox.find(".time"),
        $call = $phoneBox.find(".call"),
        $btn = $call.find(".btn"),
        $details = $phoneBox.find(".detailsBtn"),
        $detailsBtn = $details.find(".btn"),
        $bell = $("#audioBell")[0],
        $say = $("#audioSay")[0];
    let $phonePlan = $.Callbacks();
    //显示隐藏
    $phonePlan.add(function(){
        $call.remove();
        $details.css("transform","translateY(0)");
    });
    //音乐和时间切换
    $phonePlan.add(()=>{
       $bell.pause();
       $say.play();
       $time.css("display","block");
       let sayTimer = setInterval(()=>{
           let duration = $say.duration,
               current = $say.currentTime;
           let minute = Math.floor(current/60),
               second = Math.floor(current-minute*60);
           minute<10?minute="0"+minute:null;
           second<10?second="0"+second:null;
           $time.html(`${minute}:${second}`);
           if(current>=duration){
               clearInterval(sayTimer);
               enterNext();
           }
       },1000)
    });
    $phonePlan.add(()=>$detailsBtn.tap(enterNext));
    function enterNext() {
        $say.pause();
        $phoneBox.remove();
        messageRender.init();
    }

    return{
        init:function () {
            $phoneBox.css("display","block");
            $bell.play();
            $btn.tap($phonePlan.fire);
        }
    }
})(Zepto);
let messageRender = (function ($) {
    let $messageBox = $(".messageBox"),
        $talk = $messageBox.find(".talk"),
        $olis = $talk.find("li"),
        $send = $messageBox.find(".send"),
        $enter = $send.find(".enter"),
        $submit = $send.find(".submit"),
        $music = $messageBox.find("#music")[0];
    $messagePlan = $.Callbacks();
    //控制li显示
    let step = -1,
        timer = null,
        interval = 1000,
        offset = 0;
    $messagePlan.add(()=>{
        timer = setInterval(()=>{
            step++;
            let cur = $olis.eq(step);
            cur.css({"opacity":1,"transform":"translateY(0)"});
            if(step===2){
                cur.one("transitionend",()=>{
                    $send.css("transform","translateY(0)").one("transitionend",autoMove);
                })
                clearInterval(timer);
                return;
            };
            if(step>=4){
                offset+= -$olis[0].offsetHeight;
                $talk.css(`transform`,`translateY(${offset}px)`);
            }
            if(step>=$olis.length-1){
                clearInterval(timer);
                let lazyTimer = setInterval(()=>{
                    $music.pause();
                    $messageBox.remove();
                    cubeRender.init();
                    clearInterval(lazyTimer);
                },1000)
            }
        },interval);
    });
    function autoMove() {
        let n=-1,
            str = $enter.html();
        $enter.css("display","block").html("");
        let timer = setInterval(()=>{
            if(n>=str.length){
                clearInterval(timer);
                $submit.css("display","block").tap(()=>{
                    $enter.css("display","none");
                    $send.css("transform","translateY(3.7rem)");
                    $messagePlan.fire();
                });
                return;
            }
            n++;
            $enter[0].innerHTML += str.charAt(n);
        },100)
    }
    return{
        init:function () {
            $messageBox.css("display","block");
            $music.play();
            $messagePlan.fire();
        }
    }
})(Zepto);
let cubeRender = (function ($) {
    let $cube = $(".cube"),
        $box = $cube.find("ul");
    let touchBegin = function (e) {
        let point = e.changedTouches[0];
        $(this).attr({
            strX:point.clientX,
            strY:point.clientY,
            isMove:false,
            changeX:0,
            changeY:0
        })
    }
    let touching = function (e) {
        let point = e.changedTouches[0],
            $this = $(this);
        let changeX = point.clientX - parseFloat($this.attr('strX')),
            changeY = point.clientY - parseFloat($this.attr('strY'));
        if(Math.abs(changeX)>10 || Math.abs(changeY)>10){
            $this.attr({
                isMove:true,
                changeY:changeY,
                changeX:changeX
            })
        }

    }
    let touchEnd = function (e) {
        $this = $(this);
        let isMove = $this.attr('isMove'),
            changeX = parseFloat($this.attr('changeX')),
            changeY = parseFloat($this.attr('changeY')),
            rotateX = parseFloat($this.attr('rotateX')),
            rotateY = parseFloat($this.attr('rotateY'));
        if(isMove ==='false') return;
        rotateX = rotateX-changeY/3;
        rotateY = rotateY+changeX/3;
        $this.css(`transform`,`scale(.6) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`).attr({
            rotateY:rotateY,
            rotateX:rotateX
        })
    }
    return{
        init:function () {
            $cube.css("display","block");
            $box.attr({
                rotateX:-30,
                rotateY:45
            }).on({
                touchstart:touchBegin,
                touchmove:touching,
                touchend:touchEnd
            });
            $box.find('li').tap(function () {
                $cube.css("display","none");
                let index = $(this).index();
                detailsRender.init(index);
            })
        }
    }
})(Zepto);
let detailsRender = (function ($) {
    var $details = $(".details"),
        $backReturn = $details.find(".backReturn"),
        $cube = $(".cube"),
        swipeExample = null,
        $makisuBox = $("#makisuBox");
    let change = function (example) {
        let {slides:slideAry,activeIndex} = example;
        if(activeIndex===0){
            $makisuBox.makisu({
                selector: 'dd',
                overlap: 0.6,
                speed: 0.8
            });
            $makisuBox.makisu('open');
        }else{
            $makisuBox.makisu({
                selector: 'dd',
                overlap: 0,
                speed: 0
            });
            $makisuBox.makisu('close');
        }

        [].forEach.call(slideAry,(item,index)=>{
            if(index ===activeIndex){
                item.id = "page"+(activeIndex+1);
                return;
            }
            item.id = null;
        })
    }
    return{
        init:function (index) {
            $details.css("display","block");

            if(!swipeExample){
                $backReturn.tap(()=>{
                    $details.css("display","none");
                    $cube.css("display","block");
                });
                swipeExample = new Swiper('.swiper-container',{
                    effect: 'coverflow',
                    onInit:change,
                    onTransitionEnd:change
                })
            }
            index = index>5?5:index;
            swipeExample.slideTo(index,0);
        }
    }
})(Zepto);
loadingBox.init();