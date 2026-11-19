// Shared helpers for the example concepts.
(function () {
  document.querySelectorAll(".nav-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var nav = document.getElementById(btn.getAttribute("aria-controls"));
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
    });
  });
  window.concept = {
    toast: function (text) {
      var t = document.querySelector(".toast");
      if (!t) {
        t = document.createElement("div");
        t.className = "toast";
        t.setAttribute("role", "status");
        document.body.appendChild(t);
      }
      t.textContent = text;
      t.classList.add("show");
      clearTimeout(t._timer);
      t._timer = setTimeout(function () { t.classList.remove("show"); }, 2600);
    },
    store: {
      get: function (key, fallback) {
        try { var v = localStorage.getItem("concept:" + key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
      },
      set: function (key, value) {
        try { localStorage.setItem("concept:" + key, JSON.stringify(value)); } catch (e) {}
      }
    },
    money: function (n) { return "$" + Number(n).toFixed(2); },
    param: function (name) { return new URLSearchParams(location.search).get(name); },
    esc: function (s) { var d = document.createElement("div"); d.textContent = String(s); return d.innerHTML; },
    // Validates required fields and shows friendly messages under each one.
    validate: function (form) {
      var ok = true;
      form.querySelectorAll(".field-error").forEach(function (e) { e.remove(); });
      Array.prototype.forEach.call(form.elements, function (el) {
        if (!el.willValidate || el.checkValidity()) { el.removeAttribute("aria-invalid"); return; }
        ok = false;
        el.setAttribute("aria-invalid", "true");
        var msg = document.createElement("span");
        msg.className = "field-error";
        msg.textContent = el.validity.valueMissing ? "Please fill this in." : el.validity.typeMismatch ? "Please check the format." : el.validationMessage;
        (el.closest("label") || el).insertAdjacentElement("afterend", msg);
      });
      if (!ok) { var first = form.querySelector("[aria-invalid=true]"); if (first) first.focus(); }
      return ok;
    }
  };
})();
