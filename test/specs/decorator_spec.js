DecoratorSpec = JS.Test.describe(JS.Decorator, function() { with(this) {
  var Bicycle = new JS.Class({
      initialize: function(model, gears) {
          this.model = model;
          this.gears = gears;
      },
      getModel: function() {
          return this.model;
      },
      getPrice: function() {
          return 10 * this.gears;
      }
  });

  var HeadlightDecorator = new JS.Decorator(Bicycle, {
      getPrice: function() {
          return 5 + this.component.getPrice();
      }
  });

  var PedalsDecorator = new JS.Decorator(Bicycle, {
      getPrice: function() {
          return 24 + this.component.getPrice();
      },
      rotatePedals: function() {
          return 'Turning the pedals';
      }
  });
  
  before(function() { with(this) {
    this.bicycle        = new Bicycle("Trek", 24)
    this.withHeadlights = new HeadlightDecorator(bicycle)
    this.withPedals     = new PedalsDecorator(bicycle)
    this.withBoth       = new HeadlightDecorator(withPedals)
  }})
  
  it("creates classes", function() { with(this) {
    assertKindOf( JS.Class, HeadlightDecorator )
  }})
  
  it("generates objects of the decorated type", function() { with(this) {
    assertKindOf( Bicycle, withHeadlights )
    assertKindOf( Bicycle, withBoth )
  }})
  
  it("generates the same API of the decorated class", function() { with(this) {
    assertRespondTo( withHeadlights, "getModel" )
    assertRespondTo( withHeadlights, "getPrice" )
  }})
  
  it("adds methods specified in the decorating class", function() { with(this) {
    assertRespondTo( withPedals, "rotatePedals" )
    assertEqual( "Turning the pedals", withPedals.rotatePedals() )
  }})
  
  it("passes undefined method calls down to the component", function() { with(this) {
    assertEqual( "Trek", withHeadlights.getModel() )
    assertEqual( "Trek", withPedals.getModel() )
  }})
  
  it("allows decorators to call down to the decoree using this.component", function() { with(this) {
    assertEqual( 240, bicycle.getPrice() )
    assertEqual( 245, withHeadlights.getPrice() )
    assertEqual( 264, withPedals.getPrice() )
  }})
  
  it("allows decorators to be composed", function() { with(this) {
    assertEqual( 269, withBoth.getPrice() )
  }})
}})

