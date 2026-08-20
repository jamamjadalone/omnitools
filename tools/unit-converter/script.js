(function () {
  "use strict";
  const categorySelect = document.getElementById("categorySelect");
  const fromValue = document.getElementById("fromValue");
  const fromUnit = document.getElementById("fromUnit");
  const toUnit = document.getElementById("toUnit");
  const output = document.getElementById("output");

  const units = {
    length: [
      { value: "mm", label: "Millimeter (mm)" },
      { value: "cm", label: "Centimeter (cm)" },
      { value: "m", label: "Meter (m)" },
      { value: "km", label: "Kilometer (km)" },
      { value: "in", label: "Inch (in)" },
      { value: "ft", label: "Foot (ft)" },
      { value: "yd", label: "Yard (yd)" },
      { value: "mi", label: "Mile (mi)" }
    ],
    weight: [
      { value: "mg", label: "Milligram (mg)" },
      { value: "g", label: "Gram (g)" },
      { value: "kg", label: "Kilogram (kg)" },
      { value: "oz", label: "Ounce (oz)" },
      { value: "lb", label: "Pound (lb)" }
    ],
    temperature: [
      { value: "C", label: "Celsius (°C)" },
      { value: "F", label: "Fahrenheit (°F)" },
      { value: "K", label: "Kelvin (K)" }
    ]
  };

  /* All conversion factors to a base unit: meter for length, gram for weight */
  const toBase = {
    length: { mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344 },
    weight: { mg: 0.001, g: 1, kg: 1000, oz: 28.3495, lb: 453.592 }
  };

  function populateUnits(cat) {
    fromUnit.innerHTML = "";
    toUnit.innerHTML = "";
    units[cat].forEach(function (u) {
      fromUnit.innerHTML += '<option value="' + u.value + '">' + u.label + '</option>';
      toUnit.innerHTML += '<option value="' + u.value + '">' + u.label + '</option>';
    });
    if (cat === "length") { fromUnit.value = "m"; toUnit.value = "ft"; }
    else if (cat === "weight") { fromUnit.value = "kg"; toUnit.value = "lb"; }
    else { fromUnit.value = "C"; toUnit.value = "F"; }
  }

  function convertTemp(val, from, to) {
    var celsius;
    if (from === "C") celsius = val;
    else if (from === "F") celsius = (val - 32) * 5 / 9;
    else celsius = val - 273.15;

    if (to === "C") return celsius;
    if (to === "F") return celsius * 9 / 5 + 32;
    return celsius + 273.15;
  }

  function convert() {
    var val = parseFloat(fromValue.value);
    if (isNaN(val)) { output.textContent = "—"; return; }
    var cat = categorySelect.value;
    var from = fromUnit.value;
    var to = toUnit.value;
    var result;

    if (cat === "temperature") {
      result = convertTemp(val, from, to);
    } else {
      var baseVal = val * toBase[cat][from];
      result = baseVal / toBase[cat][to];
    }

    var display = parseFloat(result.toPrecision(10));
    output.textContent = val + " " + from + " = " + display + " " + to;
  }

  categorySelect.addEventListener("change", function () {
    populateUnits(categorySelect.value);
    convert();
  });
  fromValue.addEventListener("input", convert);
  fromUnit.addEventListener("change", convert);
  toUnit.addEventListener("change", convert);

  populateUnits("length");
  convert();
})();
