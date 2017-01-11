var BodiesManager = React.createClass({
  onViewportLoad: function() {
    var container;
    if ((container = $(".system", this.refs.browser.refs.ui)[0])) {
      var loader = new AppLoader({ textures: "/textures/" });
      loader.loadSystem(container, 2455794.330554163, function(sys) {
        window.sys = sys;
      });
    }
  },

  componentDidMount: function() {
    this.onViewportLoad();
  },

  bodyResult: function(props) {
    return <a href={ props.url }><strong>{ props.name }</strong></a>;
  },

  render: function() {
    return (
      <BrowserApp ref="browser" {...this.props}
        resultTag={ this.bodyResult }
        onSelect={ this.onViewportLoad } />
    );
  }
});
