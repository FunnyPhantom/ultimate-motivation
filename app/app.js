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
  var value = localStorage.dob;
  const lifeExpectancy = localStorage.getItem(LIFE_EXPECTENCY);
  console.log(lifeExpectancy)
  if (value && lifeExpectancy)
    this.dob = new Date(parseInt(value, 10));
    this.lifeExpectency = parseInt(lifeExpectancy, 10)
};

App.fn.save = function(){
  if (this.dob && this.lifeExpectency) {
    localStorage.dob = this.dob.getTime();
    localStorage.setItem(LIFE_EXPECTENCY, this.lifeExpectency.toString());
  }
};

App.fn.submit = function(e){
  e.preventDefault();

  var input = this.$$('input')[0];
  var lifeExpectancyInput = this.$$("input")[1];
  if ( !input.valueAsDate && !lifeExpectancyInput.valueAsNumber ) return;

  this.dob = input.valueAsDate;
  this.lifeExpectency = lifeExpectancyInput.valueAsNumber
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
  var future = new Date(this.dob);
  future.setFullYear(future.getFullYear() + this.lifeExpectency)
  var duration  = future - now;
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
