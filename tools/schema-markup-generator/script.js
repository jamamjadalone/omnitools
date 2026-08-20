(function () {
  "use strict";
  var schemaType = document.getElementById("schemaType");
  var fieldsContainer = document.getElementById("fieldsContainer");
  var generateBtn = document.getElementById("generateBtn");
  var output = document.getElementById("schemaOutput");
  var copyBtn = document.getElementById("copyBtn");
  var downloadBtn = document.getElementById("downloadBtn");

  var schemas = {
    article: {
      headline: "Headline",
      description: "Description",
      author: "Author Name",
      datePublished: "Date Published (YYYY-MM-DD)",
      image: "Image URL",
      url: "Article URL"
    },
    product: {
      name: "Product Name",
      description: "Description",
      image: "Image URL",
      price: "Price",
      currency: "Currency (e.g. USD)",
      availability: "In Stock / Out of Stock",
      url: "Product URL"
    },
    organization: {
      name: "Organization Name",
      url: "Website URL",
      logo: "Logo URL",
      description: "Description",
      email: "Contact Email",
      phone: "Phone Number"
    },
    localBusiness: {
      name: "Business Name",
      address: "Street Address",
      city: "City",
      region: "State/Region",
      postalCode: "Postal Code",
      country: "Country",
      phone: "Phone Number",
      url: "Website URL"
    },
    faq: {
      q1: "Question 1",
      a1: "Answer 1",
      q2: "Question 2",
      a2: "Answer 2",
      q3: "Question 3",
      a3: "Answer 3"
    },
    howTo: {
      name: "How-To Title",
      description: "Description",
      step1: "Step 1 Description",
      step2: "Step 2 Description",
      step3: "Step 3 Description",
      totalTime: "Total Time (e.g. PT30M)"
    }
  };

  function renderFields() {
    var type = schemaType.value;
    var fields = schemas[type];
    var html = "";
    for (var key in fields) {
      html += '<div class="field"><label for="f_' + key + '">' + fields[key] + '</label>';
      html += '<input type="text" id="f_' + key + '" placeholder="' + fields[key] + '" style="width:100%;padding:10px;border-radius:8px;border:1px solid var(--border);background:var(--bg-card);color:var(--text);font-size:1rem;"></div>';
    }
    fieldsContainer.innerHTML = html;
  }

  function val(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : "";
  }

  function generate() {
    var type = schemaType.value;
    var schema = { "@context": "https://schema.org", "@type": "" };
    var data = {};

    if (type === "article") {
      schema["@type"] = "Article";
      schema.headline = val("f_headline") || "Article Title";
      schema.description = val("f_description");
      schema.author = { "@type": "Person", "name": val("f_author") || "Author" };
      schema.datePublished = val("f_datePublished");
      if (val("f_image")) schema.image = val("f_image");
      if (val("f_url")) schema.url = val("f_url");
    } else if (type === "product") {
      schema["@type"] = "Product";
      schema.name = val("f_name") || "Product Name";
      schema.description = val("f_description");
      if (val("f_image")) schema.image = val("f_image");
      schema.offers = {
        "@type": "Offer",
        price: val("f_price") || "0",
        priceCurrency: val("f_currency") || "USD",
        availability: "https://schema.org/" + (val("f_availability") || "InStock").replace(/\s+/g, "")
      };
      if (val("f_url")) schema.url = val("f_url");
    } else if (type === "organization") {
      schema["@type"] = "Organization";
      schema.name = val("f_name") || "Organization";
      schema.url = val("f_url");
      if (val("f_logo")) schema.logo = val("f_logo");
      schema.description = val("f_description");
      if (val("f_email")) schema.email = val("f_email");
      if (val("f_phone")) schema.telephone = val("f_phone");
    } else if (type === "localBusiness") {
      schema["@type"] = "LocalBusiness";
      schema.name = val("f_name") || "Business Name";
      schema.address = {
        "@type": "PostalAddress",
        streetAddress: val("f_address"),
        addressLocality: val("f_city"),
        addressRegion: val("f_region"),
        postalCode: val("f_postalCode"),
        addressCountry: val("f_country")
      };
      if (val("f_phone")) schema.telephone = val("f_phone");
      if (val("f_url")) schema.url = val("f_url");
    } else if (type === "faq") {
      schema["@type"] = "FAQPage";
      schema.mainEntity = [];
      for (var i = 1; i <= 3; i++) {
        var q = val("f_q" + i);
        var a = val("f_a" + i);
        if (q && a) {
          schema.mainEntity.push({
            "@type": "Question",
            name: q,
            acceptedAnswer: { "@type": "Answer", text: a }
          });
        }
      }
      if (schema.mainEntity.length === 0) schema.mainEntity = undefined;
    } else if (type === "howTo") {
      schema["@type"] = "HowTo";
      schema.name = val("f_name") || "How-To Title";
      schema.description = val("f_description");
      if (val("f_totalTime")) schema.totalTime = val("f_totalTime");
      schema.step = [];
      for (var j = 1; j <= 3; j++) {
        var s = val("f_step" + j);
        if (s) schema.step.push({ "@type": "HowToStep", text: s });
      }
    }

    output.textContent = JSON.stringify(schema, null, 2);
  }

  schemaType.addEventListener("change", renderFields);
  generateBtn.addEventListener("click", generate);
  renderFields();

  copyBtn.addEventListener("click", function () {
    var text = output.textContent;
    if (text.indexOf("Select a schema") !== -1) return;
    window.OmniTools.copyText(text).then(function () {
      window.OmniTools.showToast("Copied to clipboard.", "success");
    });
  });

  downloadBtn.addEventListener("click", function () {
    var blob = new Blob([output.textContent], { type: "application/json;charset=utf-8;" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = "schema.json"; a.click();
    URL.revokeObjectURL(url);
  });
})();
