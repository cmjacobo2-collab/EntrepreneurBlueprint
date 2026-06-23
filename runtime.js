/* Across the Table — Founder's Workbook
 * Runtime: a small React-like base class + bootstrap that drives the
 * reused application logic (app.logic.js) and the real-DOM renderer (render.js).
 *
 * This is a fresh implementation of the runtime/render layer — the prototype's
 * <x-dc>/<sc-*> template engine is NOT used. Only the authored content + logic
 * (sections, state data, view-model builder) are reused, unchanged.
 */
(function () {
  'use strict';

  // ---- Base class the Component extends (provides state + reactivity) ----
  window.DCLogic = class DCLogic {
    constructor() {
      this.state = {};
      this._mount = null;
      this._raf = 0;
    }

    // Supports both setState(object, cb) and setState(updaterFn, cb).
    setState(patch, cb) {
      const next = (typeof patch === 'function') ? patch(this.state) : patch;
      this.state = Object.assign({}, this.state, next || {});
      this.scheduleRender();
      if (typeof cb === 'function') cb();
    }

    // Coalesce multiple synchronous setStates into one paint.
    scheduleRender() {
      if (this._raf) return;
      this._raf = requestAnimationFrame(() => {
        this._raf = 0;
        this.renderNow();
      });
    }

    renderNow() {
      if (!this._mount) return;
      const vm = this.renderVals();
      window.ATTRender(vm, this, this._mount);
    }
  };

  // ---- Bootstrap ----
  function boot() {
    const root = document.getElementById('root');
    const app = new Component({});
    app._mount = root;
    app.renderNow(); // first paint (synchronous)
    if (typeof app.componentDidMount === 'function') {
      try { app.componentDidMount(); } catch (e) { /* non-fatal */ }
    }
    window.__attApp = app; // handy for debugging
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
