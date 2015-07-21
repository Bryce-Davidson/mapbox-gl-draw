'use strict';

var Immutable = require('immutable');
var hat = require('hat');
var EditStore = require('../edit_store');
var { translate } = require('../util');

module.exports = {

  /**
   * Initializes geometries
   *
   * @param {Object} map - Instancce of MapboxGL Map
   * @param {Object} drawStore - Overall store for session
   * @param {String} type - Type of GeoJSON geometry
   * @param {Object} data - GeoJSON feature
   */
  initialize(map, drawStore, type, data) {
    this._map = map;
    this.drawStore = drawStore;
    this.coordinates = Immutable.fromJS(data ? data.geometry.coordinates : []);

    this.feature = Immutable.fromJS({
      type: 'Feature',
      properties: {
        _drawid: data ? data.properties._drawid : hat()
      },
      geometry: {
        type: type,
        coordinates: this.coordinates.toJS()
      }
    });

    this.store = new EditStore(this._map, [ this.feature.toJS() ]);
  },

  /**
   * @return {Object} GeoJSON feature
   */
  get() {
    return this.feature.toJS();
  },

  /**
   * Translate this polygon
   *
   * @param {Array<Number>} init - Mouse position at the beginining of the drag
   * @param {Array<Number>} curr - Current mouse position
   */
  translate(init, curr) {
    if (this.translating) {
      this.store.update(this.feature.toJS());
    } else {
      this.translating = true;
      this.initGeom = Immutable.fromJS(this.feature.toJS());
    }
    this.feature = Immutable.Map(translate(this.initGeom.toJS(), init, curr, this._map));
  }
};

