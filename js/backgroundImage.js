$(document).ready(function () {
   let count = 0;
   let images = ['../img/background/1.jpg', '../img/background/2.jpg', '../img/background/3.jpg','../img/background/4.jpg','../img/background/5.jpg','../img/background/6.jpg','../img/background/7.jpg','../img/background/8.jpg','../img/background/9.jpg','../img/background/10.jpg','../img/background/11.jpg','../img/background/12.jpg','../img/background/13.jpg','../img/background/14.jpg','../img/background/15.jpg','../img/background/16.jpg','../img/background/17.jpg','../img/background/18.jpg','../img/background/19.jpg','../img/background/20.jpg','../img/background/21.jpg','../img/background/22.jpg','../img/background/23.jpg','../img/background/24.jpg'
] ;
   let image = $('.fader');
   image.css({
       backgroundImage: 'url('+ images[1]+')',
       backgroundRepeat: 'no-repeat',
       backgroundSize: '100%',
       backgroundPosition: 'center 75%'
   });
   let interval = setInterval(() => {
      image.fadeOut(500, ()=>{
        image.css({
            backgroundImage: 'url('+ images[count++] +')'
        }); 
        image.fadeIn(500) ;
      });
      if (count == images.length) {
          count=0;
      }
   }, 5000);
});