
// import forms from '.server';
// window.addEventListener('DOMContentLoaded' , () => {
// "use strict";
// forms();
// });

// =====Круглишок с процентами =====

var Dial = function(container) {
    this.container = container;
    this.size = this.container.dataset.size;
    this.strokeWidth = this.size / 8;
    this.radius = (this.size / 2) - (this.strokeWidth / 2);
    this.value = this.container.dataset.value;
    this.direction = this.container.dataset.arrow;
    this.svg;
    this.defs;
    this.slice;
    this.overlay;
    this.text;
    this.arrow;
    this.create();
}

Dial.prototype.create = function() {
    this.createSvg();
    this.createDefs();
    this.createSlice();
    this.createOverlay();
    this.createText();
    this.createArrow();
    this.container.appendChild(this.svg);
};

Dial.prototype.createSvg = function() {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('width', this.size + 'px');
    svg.setAttribute('height', this.size + 'px');
    this.svg = svg;
};

Dial.prototype.createDefs = function() {
    var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    var linearGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    linearGradient.setAttribute('id', 'gradient');
    var stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop1.setAttribute('stop-color', '#6E4AE2');
    stop1.setAttribute('offset', '0%');
    linearGradient.appendChild(stop1);
    var stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop2.setAttribute('stop-color', '#78F8EC');
    stop2.setAttribute('offset', '100%');
    linearGradient.appendChild(stop2);
    var linearGradientBackground = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    linearGradientBackground.setAttribute('id', 'gradient-background');
    var stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop1.setAttribute('stop-color', 'rgba(0, 0, 0, 0.2)');
    stop1.setAttribute('offset', '0%');
    linearGradientBackground.appendChild(stop1);
    var stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop2.setAttribute('stop-color', 'rgba(0, 0, 0, 0.05)');
    stop2.setAttribute('offset', '100%');
    linearGradientBackground.appendChild(stop2);
    defs.appendChild(linearGradient);
    defs.appendChild(linearGradientBackground);
    this.svg.appendChild(defs);
    this.defs = defs;
};

Dial.prototype.createSlice = function() {
    var slice = document.createElementNS("http://www.w3.org/2000/svg", "path");
    slice.setAttribute('fill', 'none');
    slice.setAttribute('stroke', 'url(#gradient)');
    slice.setAttribute('stroke-width', this.strokeWidth);
    slice.setAttribute('transform', 'translate(' + this.strokeWidth / 2 + ',' + this.strokeWidth / 2 + ')');
    slice.setAttribute('class', 'animate-draw');
    this.svg.appendChild(slice);
    this.slice = slice;
};

Dial.prototype.createOverlay = function() {
    var r = this.size - (this.size / 2) - this.strokeWidth / 2;
    var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute('cx', this.size / 2);
    circle.setAttribute('cy', this.size / 2);
    circle.setAttribute('r', r);
    circle.setAttribute('fill', 'url(#gradient-background)');
    this.svg.appendChild(circle);
    this.overlay = circle;
};

Dial.prototype.createText = function() {
    var fontSize = this.size / 3.5;
    var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute('x', (this.size / 2) + fontSize / 7.5);
    text.setAttribute('y', (this.size / 2) + fontSize / 4);
    text.setAttribute('font-family', 'Century Gothic, Lato');
    text.setAttribute('font-size', fontSize);
    text.setAttribute('fill', '#78F8EC');
    text.setAttribute('text-anchor', 'middle');
    var tspanSize = fontSize / 3;
    text.innerHTML = 0 + '<tspan font-size="' + tspanSize + '" dy="' + -tspanSize * 1.2 + '">%</tspan>';
    this.svg.appendChild(text);
    this.text = text;
};

Dial.prototype.createArrow = function() {
    var arrowSize = this.size / 10;
    var arrowYOffset, m;
    if(this.direction === 'up') {
        arrowYOffset = arrowSize / 2;
        m = -1;
    }
    else if(this.direction === 'down') {
        arrowYOffset = 0;
        m = 1;
    }
    var arrowPosX = ((this.size / 2) - arrowSize / 2);
    var arrowPosY = (this.size - this.size / 3) + arrowYOffset;
    var arrowDOffset =  m * (arrowSize / 1.5);
    var arrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
    // arrow.setAttribute('d', 'M 0 0 ' + arrowSize + ' 0 ' + arrowSize / 2 + ' ' + arrowDOffset + ' 0 0 Z');
    arrow.setAttribute('fill', '#97F8F0');
    arrow.setAttribute('opacity', '0.6');
    // arrow.setAttribute('transform', 'translate(' + arrowPosX + ',' + arrowPosY + ')');
    this.svg.appendChild(arrow);
    this.arrow = arrow;
};

Dial.prototype.animateStart = function() {
    var v = 0;
    var self = this;
    var intervalOne = setInterval(function() {
        var p = +(v / self.value).toFixed(2);
        var a = (p < 0.95) ? 2 - (2 * p) : 0.05;
        v += a;
        if(v >= +self.value) {
            v = self.value;
            clearInterval(intervalOne);
        }
        self.setValue(v);
    }, 10);
};

Dial.prototype.animateReset = function() {
    this.setValue(0);
};

Dial.prototype.polarToCartesian = function(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

Dial.prototype.describeArc = function(x, y, radius, startAngle, endAngle){
    var start = this.polarToCartesian(x, y, radius, endAngle);
    var end = this.polarToCartesian(x, y, radius, startAngle);
    var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    var d = [
        "M", start.x, start.y, 
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
    return d;       
}

Dial.prototype.setValue = function(value) {	
		var c = (value / 100) * 360;
		if(c === 360)
			c = 359.99;
		var xy = this.size / 2 - this.strokeWidth / 2;
		var d = this.describeArc(xy, xy, xy, 180, 180 + c);
    this.slice.setAttribute('d', d);
    var tspanSize = (this.size / 3.5) / 3;
    this.text.innerHTML = Math.floor(value) + '<tspan font-size="' + tspanSize + '" dy="' + -tspanSize * 1.2 + '">%</tspan>';
};

const charts= document.querySelectorAll(".chart");
charts.forEach(chart=>{
const dial = new Dial(chart);
dial.animateStart();
	
})


// анимация текста при скроле
AOS.init({
    // Global settings:
  disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
  startEvent: 'DOMContentLoaded', // name of the event dispatched on the document, that AOS should initialize on
  initClassName: 'aos-init', // class applied after initialization
  animatedClassName: 'aos-animate', // class applied on animation
  useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
  disableMutationObserver: false, // disables automatic mutations' detections (advanced)
  debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
  throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)
  

  // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
  offset: 100, // offset (in px) from the original trigger point когда будет виден при скроле 
  delay: 0, // values from 0 to 3000, with step 50ms задержка анимации
  duration: 1000, // values from 0 to 3000, with step 50ms скрость анимации
  easing: 'ease', // default easing for AOS animations вид анимации 
  once: true, // whether animation should happen only once - while scrolling down
  mirror: false, // whether elements should animate out while scrolling past them
  anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation

});


// модалное окно 
!function(e){"function"!=typeof e.matches&&(e.matches=e.msMatchesSelector||e.mozMatchesSelector||e.webkitMatchesSelector||function(e){for(var t=this,o=(t.document||t.ownerDocument).querySelectorAll(e),n=0;o[n]&&o[n]!==t;)++n;
    return Boolean(o[n])}),
    "function"!=typeof e.closest&&(e
        .closest=function(e){for(var t=this;t&&1===t.nodeType;)
            {if(t.matches(e))return t;t=t.parentNode}
            return null})}
            (window.Element.prototype);


document.addEventListener('DOMContentLoaded', function() {

   /* Записываем в переменные массив элементов-кнопок и подложку.
      Подложке зададим id, чтобы не влиять на другие элементы с классом overlay*/
   var modalButtons = document.querySelectorAll('.js-open-modal'),
       overlay      = document.querySelector('.js-overlay-modal'),
       closeButtons = document.querySelectorAll('.js-modal-close');


   /* Перебираем массив кнопок */
   modalButtons.forEach(function(item){

      /* Назначаем каждой кнопке обработчик клика */
      item.addEventListener('click', function(e) {

         /* Предотвращаем стандартное действие элемента. Так как кнопку разные
            люди могут сделать по-разному. Кто-то сделает ссылку, кто-то кнопку.
            Нужно подстраховаться. */
         e.preventDefault();

         /* При каждом клике на кнопку мы будем забирать содержимое атрибута data-modal
            и будем искать модальное окно с таким же атрибутом. */
         var modalId = this.getAttribute('data-modal'),
             modalElem = document.querySelector('.modal[data-modal="' + modalId + '"]');


         /* После того как нашли нужное модальное окно, добавим классы
            подложке и окну чтобы показать их. */
         modalElem.classList.add('active');
         overlay.classList.add('active');
      }); // end click

   }); // end foreach


   closeButtons.forEach(function(item){

      item.addEventListener('click', function(e) {
         var parentModal = this.closest('.modal');

         parentModal.classList.remove('active');
         overlay.classList.remove('active');
      });

   }); // end foreach


    document.body.addEventListener('keyup', function (e) {
        var key = e.keyCode;

        if (key == 27) {

            document.querySelector('.modal.active').classList.remove('active');
            document.querySelector('.overlay').classList.remove('active');
        };
    }, false);


    overlay.addEventListener('click', function() {
        document.querySelector('.modal.active').classList.remove('active');
        this.classList.remove('active');
    });




}); // end ready


// модалка на главном секции кнопка закрытие в главном кнопке в модалке там svg close не работает 
// ..постр запросы модалки 
