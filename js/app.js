let employees = [];
const urlAPI =
  "https://randomuser.me/api/?results=12&inc=name, picture, email, location, phone, dob &noinfo &nat=US";
const gridContainer = document.querySelector(".employee-grid");
const overlay = document.querySelector(".overlay");
const modalContainer = document.querySelector(".modal-content");
const modalClose = document.querySelector(".modal-close");

// Get employee data and insert into HTML
fetch(urlAPI)
  .then((res) => res.json())
  .then((res) => res.results)
  .then(displayEmployees)
  .catch((err) => console.log(err));

function displayEmployees(employeeData) {
  employees = employeeData;
  let employeeHTML = "";

  // Loop through all employees to build data cards
  employees.forEach((employee, index) => {
    let name = employee.name;
    let email = employee.email;
    let city = employee.location.city;
    let picture = employee.picture;

    // Build the employee card HTML
    employeeHTML += `
        <div class="card" data-index="${index}">
                <img class="avatar" src="${picture.large}" alt="Photo of ${name.first} ${name.last}">
                <div class="card-text">
                    <h2 class="name">${name.first} ${name.last}</h2>
                    <p class="email">${email}</p>
                    <p class="address">${city}</p>
                </div>
            </div>
        `;
  });
  // Insert employee grid content into div
  gridContainer.innerHTML = employeeHTML;
}

// Put employee info in the popup modal
function displayModal(index) {
  let {
    name,
    dob,
    phone,
    email,
    location: { city, street, state, postcode },
    picture,
  } = employees[index];
  let date = new Date(dob.date);
  // Find the data-index of the previous and next employee.
  let previous = index - 1;
  let next = Number(index) + 1;
  // Store the total number of employees in the list for the arrow navigation.
  let totalEmployees = employees.length - 1;

  // Build the modal's HTML
  const modalHTML = `
        <img class="avatar" src="${picture.large}" alt="Photo of ${
    name.first
  } ${name.last}">
        <div class="modal-text">
                <h2 class="name">${name.first} ${name.last}</h2>
                <p class="email">${email}</p>
                <p class="address">${city}</p>
                <hr/>
                <p>${phone}</p>
                <p class="address">${street.number} ${
    street.name
  }, ${state} ${postcode}</p>
                <p>Birthday: ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
        </div>
        <div class="left-arrow">&#9664;</div>
        <div class="right-arrow">&#9654;</div>
        `;

  // Make the overlay visible
  overlay.classList.remove("hidden");
  // Insert modal HTML content into div
  modalContainer.innerHTML = modalHTML;

  // Add modal previous and next arrow event listeners
  let prevArrow = document.querySelector(".left-arrow");
  let nextArrow = document.querySelector(".right-arrow");

  // Check that current selection isn't the first on list, and if it is, open the last employee on the list.
  prevArrow.addEventListener("click", (e) => {
    if (index !== 0) {
      displayModal(previous);
    } else {
      displayModal(totalEmployees);
    }
  });

  // Check that current selection isn't the last on list, and if it is, open the first employee on the list.
  nextArrow.addEventListener("click", (e) => {
    if (index !== totalEmployees) {
      displayModal(next);
    } else {
      displayModal(0);
    }
  });
}

gridContainer.addEventListener("click", (e) => {
  // Select card and display appropriate modal, as long as not selecting the gridContainer.
  if (e.target !== gridContainer) {
    const card = e.target.closest(".card");
    const index = card.getAttribute("data-index");
    displayModal(index);
  }
});

//Re-hide the modal when X is clicked.
modalClose.addEventListener("click", (e) => {
  overlay.classList.add("hidden");
});

// Called by onkeyup on search input
function filterSearch() {
  let input = document.getElementById("search");
  let filter = input.value.toUpperCase();

  // Loop through all list items, and hide those who don't match the search query
  for (let i = 0; i < employees.length; i++) {
    let dataIndex = `[data-index="${i}"]`;
    let currentCard = document.querySelector(dataIndex);
    let currentName = currentCard.querySelector("h2").textContent.toUpperCase();

    if (currentName.includes(filter)) {
      currentCard.style.display = "";
    } else {
      currentCard.style.display = "none";
    }
  }
}
