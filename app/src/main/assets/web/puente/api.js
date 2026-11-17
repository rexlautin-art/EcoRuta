/* CAPA DE TRANSPORTE (receptora). Habla con el puente usando solo el contrato (ver contrato/protocolo.md).
 * No sabe nada de tipos de contenido: pide metadatos y bytes. Es la misma API que usa la emisora. */
(function () {
  'use strict';
  // La app guarda la direccion del servidor (Ajustes > Servidor) como JSON en "ecoruta.server".
  function base() {
    try {
      var v = JSON.parse(localStorage.getItem('ecoruta.server') || '""');
      if (typeof v === 'string' && v.trim()) return v.trim().replace(/\/+$/, '');
    } catch (e) { /* valor dañado: se ignora */ }
    return '';
  }
  // Si no hay direccion guardada, solo sirve el mismo origen cuando la web viene de http(s) (navegador).
  function available() { return !!base() || /^https?:$/.test(location.protocol); }
  function get(path) {
    var ctrl = new AbortController();
    var t = setTimeout(function () { ctrl.abort(); }, 8000);
    return fetch(base() + path, { cache: 'no-store', signal: ctrl.signal }).then(function (r) {
      clearTimeout(t);
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r;
    }, function (e) { clearTimeout(t); throw e; });
  }
  window.PuenteApi = {
    base: base,
    available: available,
    ping: function () { return get('/api/ping').then(function (r) { return r.json(); }); },
    list: function (since) { return get('/api/items?since=' + (since || 0)).then(function (r) { return r.json(); }); },
    blob: function (id) { return get('/api/items/' + encodeURIComponent(id)).then(function (r) { return r.blob(); }); }
  };
})();
