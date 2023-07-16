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
  if (!validateForm()) {
    return;
  }
  const formData = new FormData(document.getElementById("sheetdb-form"));
  formData.set('data[City]', $("#order-cities option:selected").text());
  // let object = {};
  // formData.forEach((value, key) => object[key] = value);
  // let json = JSON.stringify(object);
  fetch(form.action, {
    method: "POST",
    body: formData,
  }).then(
    response => response.json()
  ).then(() => {
    // you can put any JS code here
    console.log('OK');
    alert('Замовлення прийняте!');
    window.scrollTo({top: 0, left: 0})

  });
});

function validateForm() {
  // Get form values
  let firstName = document.getElementById('first-name').value;
  let lastName = document.getElementById('last-name').value;
  let phone = document.getElementById('phone').value;
  let cities = document.getElementById('order-cities').value;
  let departament = document.getElementById('order-warehouses').value;

  const fields = [firstName, lastName, phone, cities, departament];

  if (phone.length < 12) {
    alert('Невірний номер телефону');
    return false; // Prevent form submission
  }

  // Simple validation example (name cannot be empty and email must be valid)
  if (fields.some(el => !el)) {
    alert('Заповніть всі необхідні поля');
    return false; // Prevent form submission
  }



  // Form is valid, proceed with submission
  return true;
}

// Reveal animations
function revealAnimations() {
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

function checkLights() {
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

// ----- On render -----

/*ORDER*/

// async function loadCitiesAPI(searchStr = null) {
//   const req = {
//     "apiKey": "aabcf7c7457fed2937fc69e37d77369d",
//     "modelName": "Address",
//     "calledMethod": "getSettlements",
//     "methodProperties": {
//       "Page": 1,
//       "Warehouse": 1,
//       "Limit": 10,
//     }
//   }
//
//   if (searchStr) {
//     req['FindByString'] = searchStr;
//   }
//
//
//   try {
//     const res = await fetch('https://api.novaposhta.ua/v2.0/json/', {
//       method: 'POST',
//       body: JSON.stringify(req)
//     });
//     const resJson = await res.json();
//
//     if (resJson.success && resJson.data.length > 0) {
//       console.log('data', resJson.data);
//
//       return resJson.data.map(item => ({name: `${item['Description']} ${item['AreaDescription']}`, ref: item['Ref']}))
//     }
//
//     return null;
//   } catch (e) {
//     console.log(e);
//     return null;
//   }
// }


// async function loadWarehousesAPI(cityRef) {
//   const req = {
//     "apiKey": "aabcf7c7457fed2937fc69e37d77369d",
//     "modelName": "Address",
//     "calledMethod": "getWarehouses",
//     "methodProperties": {
//       "Page": 1,
//       "Warehouse": 1,
//       "Limit": 10,
//       "SettlementRef": cityRef
//     }
//   }
//
//   try {
//     const resJson = await fetch('https://api.novaposhta.ua/v2.0/json/', {
//       method: 'POST',
//       body: JSON.stringify(req)
//     });
//
//     const res = resJson.json();
//
//     if (res.success && res.data.length > 0) {
//       return res.map(item => ({name: item['Description'], ref: item['Ref']}))
//     }
//
//     return null;
//   } catch (e) {
//     console.log(e);
//     return null;
//   }
//
// }

async function initForm() {
  $('#warehouses').hide();

  $('#order-cities').select2({
    width: "100%",
    placeholder: "Виберіть місто",
    minimumInputLength: 3,
    templateResult: formatResults,
    ajax: {
      url: 'https://api.novaposhta.ua/v2.0/json/',
      dataType: "json",
      method: "POST",
      data: function (params) {
        // Query parameters will be ?search=[term]&type=public
        return JSON.stringify({
          "apiKey": "aabcf7c7457fed2937fc69e37d77369d",
          "modelName": "Address",
          "calledMethod": "getSettlements",
          "methodProperties": {
            "Page": 1,
            "Warehouse": 1,
            "Limit": 10,
            'FindByString': params.term,
          },
        })

      },
      processResults: function (data) {
        if (data.success) {
          let res = data.data.map(item => ({
            id: item.Ref,
            text: item.Description + ", " + item.AreaDescription,
          }));
          return {
            results: res,
          };
        }
        return null;
      }
    }
  });

  $('#order-cities').on("select2:select", function (e) {
    let cityRef = e.target.value;

    const req = {
      "apiKey": "aabcf7c7457fed2937fc69e37d77369d",
      "modelName": "Address",
      "calledMethod": "getWarehouses",
      "methodProperties": {
        "Page": 1,
        "Warehouse": 1,
        "Limit": 10,
        "SettlementRef": cityRef
      }
    }

    $("input[name=\"city\"]").val($("#order_city_dropdown option:selected").text());

    fetch( 'https://api.novaposhta.ua/v2.0/json/', {
      method: "POST",
      body: JSON.stringify(req)
    })
      .then((response) => {
        if (!response.ok && response.status === 422){
          console.log("error", response);
        } else {
          response.json().then(
            ( result ) => {
              let data = result.data.map(depart => {
                return {
                  id: depart.Description,
                  text: depart.Description
                };
              });
              $('#warehouses').fadeIn();
              $('#order-warehouses').html("").select2({
                width: "100%",
                placeholder: "Номер відділення",
                disabled: false,
                data: data
              });
            }
          );
        }
      })
      .catch(error => {
        console.log(error);
      });
  });



}

function formatResults(res) {
  if (!res.text) {
    return "Пошук...";
  }
  return res.text;
}

initForm();
// loadWarehousesAPI('0e451e40-4b3a-11e4-ab6d-005056801329');
