(function(){

var LIFE_EXPECTENCY = "lifeExpectency";

var $  = document.getElementById.bind(document);
var $$ = document.querySelectorAll.bind(document);

var App = function($el){
  this.$el = $el;
  this.load();

  this.$el.addEventListener(
    'submit', this.submit.bind(this)
  );

  if (this.dob && this.lifeExpectency) {
    this.renderAgeLoop();
  } else {
    this.renderChoose();
  }
};

App.fn = App.prototype;

App.fn.load = function(){
  var value;
  const lifeExpectency = localStorage.getItem(LIFE_EXPECTENCY);
  if (value = localStorage.dob && lifeExpectency)
    this.dob = new Date(parseInt(value));
    this.lifeExpectency = new Date(parseInt(lifeExpectency))
};

App.fn.save = function(){
  if (this.dob && this.lifeExpectency) {
    localStorage.dob = this.dob.getTime();
    localStorage.setItem(LIFE_EXPECTENCY, this.lifeExpectency.getTime());
  }
};

App.fn.submit = function(e){
  e.preventDefault();

  var input = this.$$('input')[0];
  var lifeExpectencyInput = this.$$("input")[1];
  if ( !input.valueAsDate && !lifeExpectencyInput.valueAsDate ) return;

  this.dob = input.valueAsDate;
  this.lifeExpectency = lifeExpectencyInput.valueAsDate
  this.save();
  this.renderAgeLoop();
};

App.fn.renderChoose = function(){
  this.html(this.view('dob')());
};

App.fn.renderAgeLoop = function(){
  this.interval = setInterval(this.renderAge.bind(this), 100);
};

App.fn.renderAge = function(){
  var now       = new Date();
  var duration  = this.lifeExpectency -  (now - this.dob);
  var years     = duration / 31556900000;

  var majorMinor = years.toFixed(9).toString().split('.');

  requestAnimationFrame(function(){
    this.html(this.view('age')({
      year:         majorMinor[0],
      milliseconds: majorMinor[1]
    }));
  }.bind(this));
};

App.fn.$$ = function(sel){
  return this.$el.querySelectorAll(sel);
};

App.fn.html = function(html){
  this.$el.innerHTML = html;
};

App.fn.view = function(name){
  var $el = $(name + '-template');
  return Handlebars.compile($el.innerHTML);
};

window.app = new App($('app'))

})();
