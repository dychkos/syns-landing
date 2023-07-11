(function () {
  const doc = document
  const rootEl = doc.documentElement
  const body = doc.body
  const lightSwitch = doc.getElementById('lights-toggle')
  /* global ScrollReveal */
  const sr = window.sr = ScrollReveal()

  rootEl.classList.remove('no-js')
  rootEl.classList.add('js')

  window.addEventListener('load', function () {
    body.classList.add('is-loaded')
  })

  let form = document.getElementById('sheetdb-form');
  form.addEventListener("submit", e => {
    e.preventDefault();
    // const formData = new FormData(document.getElementById("sheetdb-form"));
    // let object = {};
    // formData.forEach((value, key) => object[key] = value);
    // let json = JSON.stringify(object);
    fetch(form.action, {
      method : "POST",
      body: new FormData(document.getElementById("sheetdb-form")),
    }).then(
      response => response.json()
    ).then(() => {
      // you can put any JS code here
      console.log('OK');
      window.scrollTo({top: 0, left: 0})

    });
  });

  // Reveal animations
  function revealAnimations () {
    sr.reveal('.feature', {
      duration: 600,
      distance: '20px',
      easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
      origin: 'right',
      viewFactor: 0.2
    })
  }

  if (body.classList.contains('has-animations')) {
    window.addEventListener('load', revealAnimations)
  }

  // Light switcher
  if (lightSwitch) {
    window.addEventListener('load', checkLights)
    lightSwitch.addEventListener('change', checkLights)
  }

  function checkLights () {
    let labelText = lightSwitch.parentNode.querySelector('.label-text')
    if (lightSwitch.checked) {
      body.classList.remove('lights-off')
      if (labelText) {
        labelText.innerHTML = 'світла'
      }
    } else {
      body.classList.add('lights-off')
      if (labelText) {
        labelText.innerHTML = 'темна'
      }
    }
  }

  // function loadWarehouses(input) {
  //   const apiUrl = 'https://api.novaposhta.ua/v2.0/json/Address/getWarehouses';
  //
  //   // API request parameters (modify as needed)
  //   const requestData = {
  //     apiKey: 'your_api_key',
  //     CityRef: 'your_city_ref', // Specify the city reference
  //   };
  //
  //   // Make the API request
  //   fetch(apiUrl, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(requestData),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       // Check if the request was successful
  //       if (data.success) {
  //         const warehouses = data.data;
  //
  //         // Create a select element
  //         const select = document.createElement('select');
  //         select.name = 'warehouse';
  //
  //         // Iterate over the warehouses and create the options
  //         warehouses.forEach((warehouse) => {
  //           const option = document.createElement('option');
  //           option.value = warehouse.Ref;
  //           option.text = warehouse.Description;
  //           select.appendChild(option);
  //         });
  //
  //         // Append the select element to a container element in the HTML
  //         const container = document.getElementById('warehouse-container');
  //         container.appendChild(select);
  //       } else {
  //         console.log('Error retrieving warehouse data from Nova Poshta API.');
  //       }
  //     })
  //     .catch((error) => {
  //       console.log('Error:', error);
  //     });
  // }
}())
