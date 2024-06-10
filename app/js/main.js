$(document).ready(function(){
    $("body").on('mousemove',function(e){
        let y = e.pageY / 25;
        let x = e.pageX / 25;
        $(".content__decor").css('transform', 'translate(' + x + 'px,' + y + 'px)');
    });

    $(".content__statistics-num span").each(function(){
       $(this).prop("Counter", "0").animate({
           Counter: $(this).text()
       },{
           duration: 4000,
           easing: "swing",
           step: function (now){
               $(this).text(Math.ceil(now));
           }
       });
    });

    function time(element){
        let timeString = element.text();
        let timeParts = timeString.split(' : ');

        let hours = parseInt(timeParts[0].replace('H', ''));
        let minutes = parseInt(timeParts[1].replace('M', ''));
        let seconds = parseInt(timeParts[2].replace('S', ''));

        let totalSeconds = (hours * 3600) + (minutes * 60) + seconds;

        let timer = setInterval(function(){
            if(totalSeconds > 0){
                totalSeconds--;
                let h = totalSeconds/3600 ^ 0,
                    m = (totalSeconds-h*3600)/60 ^ 0,
                    s = totalSeconds-h*3600-m*60,
                    time = (h<10?"0" + h:h) + "H : " + (m<10?"0" + m:m) + "M : " + (s<10?"0" + s:s) + "S";
                element.text(time);
            }
            else{
                clearInterval(timer);
            }
        },1000)
    }
    time($('.content__boxs-itemtime'));
});