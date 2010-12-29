JS.Kernel = new JS.Module('Kernel', {
  __eigen__: function(resolve) {
    if (this.__meta__) return this.__meta__;
    var name = this.toString() + '.';
    this.__meta__ = new JS.Module(name, null, {_target: this});
    return this.__meta__.include(this.klass, {_resolve: resolve});
  },
  
  equals: function(other) {
    return this === other;
  },
  
  extend: function(module) {
    this.__eigen__().include(module, {_extended: this});
    return this;
  },
  
  hash: function() {
    return JS.Kernel.hashFor(this);
  },
  
  isA: function(module) {
    return (typeof module === 'function' && this instanceof module) ||
           this.__eigen__().includes(module);
  },
  
  method: function(name) {
    var cache = this.__mct__ = this.__mct__ || {},
        value = cache[name],
        field = this[name];
    
    if (typeof field !== 'function') return field;
    if (value && field === value._value) return value._bound;
    
    var bound = JS.bind(field, this);
    cache[name] = {_value: field, _bound: bound};
    return bound;
  },
  
  methods: function() {
    return this.__eigen__().instanceMethods();
  },
  
  tap: function(block, context) {
    block.call(context || null, this);
    return this;
  },
  
  toString: function() {
    return '#<' + this.klass.toString() + ':' + this.hash() + '>';
  }
});

(function() {
  var id = 1;
  
  JS.Kernel.hashFor = function(object) {
    if (object.__hash__ !== undefined) return object.__hash__;
    object.__hash__ = (new Date().getTime() + id).toString(16);
    id += 1;
    return object.__hash__;
  };
})();

