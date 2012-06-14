myapp.Templates = {
    "test": function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<h1> ',  title ,' </h1>');}return __p.join('');},
	"test_two": function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('I can put anything I want in here ',  foo ,'');}return __p.join('');}
};