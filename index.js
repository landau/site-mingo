/*jshint esnext: true*/
'use strict';

var React = require('react');
var dom = React.DOM;
var mingo = require('mingo');


var defaultJSON = {
  name: {
    first: 'Lloyd',
    last: 'Hilaiel'
  },
  favoriteColor: 'yellow',
  languagesSpoken: [
    {
      lang: 'Bulgarian',
      level: 'advanced'
    },
    {
      lang: 'English',
      level: 'native',
      preferred: true
    },
    {
      lang: 'Spanish',
      level: 'beginner'
    }
  ],
  seatingPreference: [
    'window',
    'aisle'
  ],
  drinkPreference: [
    'whiskey',
    'beer',
    'wine'
  ],
  weight: 156
};


var defaultQuery = {
  favoriteColor: 'yellow'
};

window.json = defaultJSON;
window.query = defaultQuery;
window.mingo = mingo;

function stringify(o) {
  return JSON.stringify(o, null, '  ');
}

var app = React.createClass({
  getInitialState: function() {
    return {
      json: stringify(defaultJSON),
      query: stringify(defaultQuery),
      method: 'find',
      err: null
    };
  },

  onChange: function(e) {
    var s = {};
    s[e.target.name] = e.target.value;

    this.setState(s);
  },

  find: function(query, json) {
    try {

      if (typeof query === 'string') {
        query = JSON.parse(query);
      }

      if (typeof json === 'string') {
        json = JSON.parse(json);
      }

      if (!Array.isArray(json)) {
        json = [json];
      }

      var _query = new mingo.Query(query);
      var res = _query.find(json).all();
      console.group('Find:')
      console.log(res);
      console.groupEnd();
      return res;
    } catch (e) {
      console.error('FindError:', e);
    }
  },

  updateMethod: function(e) {
    try {
      var method = e.target.value;

      this.setState({
        method: method,
        err: null
      });
    } catch(err) {
      this.setState({
        method: e.target.value,
        err: err
      });
    }

  },

  updateJSON: function(e) {
    try {
      var json = JSON.parse(e.target.value);

      this.setState({
        json: stringify(json), // keeps json pretty
        err: null
      });
    } catch(err) {
      this.setState({
        json: e.target.value,
        err: err
      });
    }
  },

  updateQuery: function(e) {
    try {
      var query = JSON.parse(e.target.value);

      this.setState({
        query: stringify(query), // keeps json pretty
        err: null
      });
    } catch(err) {
      this.setState({
        query: e.target.value,
        err: err
      });
    }
  },

  format: function() {
    try {
      var json = JSON.parse(this.state.json);
      var query = JSON.parse(this.state.query);

      this.setState({
        json: stringify(json), // keeps json pretty
        query: stringify(query) // keeps json pretty
      });
    } catch(err) {
      this.setState({ err: err });
    }
  },

  render: function() {

    return dom.div(
      { className: 'container-fluid' },
      // Input
      dom.div(
        { className: 'row' },
        dom.div(
          { className: 'col-md-12' },
          dom.h2(null, 'mingo'),

          dom.div(
            { className: 'form-group' },

            /*jshint indent:false */
            dom.label({ htmlFor: 'method' }, 'Method: '),
            dom.select({
              className: 'form-control',
              type: 'select',
              onChange: this.updateMethod,
              value: this.state.method,
              name: 'method'
            },
            dom.option({ value: 'find' }, 'find')),

            dom.br()
          )
        )
      ),

      dom.div(
        { className: 'row' },
        dom.div(
          { className: 'col-md-12' },
          dom.button({ className: 'btn btn-sm btn-primary', onClick: this.format }, 'Format')
        )
      ),

      // Output
      dom.div(
        { className: 'row' },
        dom.div(
          { className: 'col-md-4' },
          dom.textarea({
            /*jshint indent:false */
            className: 'form-control',
            name:'json',
            onChange: this.updateJSON,
            value: this.state.json
          })
          /*jshint indent:2 */
        ),
        dom.div(
          { className: 'col-md-4' },
          dom.textarea({
            /*jshint indent:false */
            className: 'form-control',
            name:'json',
            onChange: this.updateQuery,
            value: this.state.query
          })
          /*jshint indent:2 */
        ),
        dom.div(
          { className: 'col-md-4 output' },
          dom.pre(null, this.state.err ? this.state.err.message : stringify(this[this.state.method](this.state.query, this.state.json)))
        )
      )
    );
  }
});

React.renderComponent(app(null), document.getElementById('app'));
