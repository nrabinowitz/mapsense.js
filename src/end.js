  if (typeof define === "function" && define.amd)
    define(['topojson'], mapsense);
  else if (typeof module === "object" && module.exports)
    module.exports = mapsense;
  this.mapsense = mapsense;
})();
