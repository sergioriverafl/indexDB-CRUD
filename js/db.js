var bd;
var contacts;

var contactsContent = document.querySelector("#contacts");

function initDB() {
  const btnSave = document.querySelector("#btn-save");

  btnSave.addEventListener("click", function (event) {
    event.preventDefault();
    const data = getDataClient();
    create(data);
  });

  var instance = indexedDB.open("project-contacts");
  instance.addEventListener("error", errorHandler);
  instance.addEventListener("success", startHandler);
  instance.addEventListener("upgradeneeded", createStoreHandler);
}

function errorHandler(event) {
  console.log(`errorHandler:: ${event.code}, ${event.message}`);
}

function startHandler(event) {
  console.log(`startHandler:: ${event.target.result}`);
  bd = event.target.result;
  getContacts();
}

function createStoreHandler(event) {
  console.log(`createStoreHandler:: ${event.target.result}`);
  var database = event.target.result;
  var store = database.createObjectStore("contacts", { keyPath: "id" });
  store.createIndex("searchName", "name", { unique: false });
}

function resetForm() {
  document.querySelector("#contact-name").value = "";
  document.querySelector("#contact-last-name").value = "";
  document.querySelector("#contact-phone").value = "";
  document.querySelector("#contact-email").value = "";
  document.querySelector("#contact-address").value = "";
}

function seedForm() {
  document.querySelector("#contact-name").value = "Sergio";
  document.querySelector("#contact-last-name").value = "Rivera";
  document.querySelector("#contact-phone").value = "312312312312";
  document.querySelector("#contact-email").value = "sawaw@email.com";
  document.querySelector("#contact-address").value =
    "1093 DZURO DR, FLORIDA FL 2833";
}

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function formatDate() {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1; // Los meses comienzan desde 0
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return `${year}-${padNumber(month)}-${padNumber(day)} ${padNumber(
    hours
  )}:${padNumber(minutes)}:${padNumber(seconds)}`;
}

function padNumber(num) {
  return num < 10 ? `0${num}` : num;
}

function getDataClient() {
  const contactName = document.querySelector("#contact-name");
  const contactLastName = document.querySelector("#contact-last-name");
  const contactPhone = document.querySelector("#contact-phone");
  const contactEmail = document.querySelector("#contact-email");
  const contactAddress = document.querySelector("#contact-address");

  const contactNameValue = contactName.value;
  const contactLastNameValue = contactLastName.value;
  const contactPhoneValue = contactPhone.value;
  const contactEmailValue = contactEmail.value;
  const contactAddressValue = contactAddress.value;

  return {
    contactNameValue,
    contactLastNameValue,
    contactPhoneValue,
    contactEmailValue,
    contactAddressValue,
  };
}

function create(data) {
  const {
    contactNameValue,
    contactLastNameValue,
    contactPhoneValue,
    contactEmailValue,
    contactAddressValue,
  } = data;

  const date = formatDate();

  var transaction = bd.transaction(["contacts"], "readwrite");
  var store = transaction.objectStore("contacts");

  store.add({
    id: generateUUID(),
    name: contactNameValue,
    lastName: contactLastNameValue,
    phone: contactPhoneValue,
    email: contactEmailValue,
    address: contactAddressValue,
    createAt: date,
    updatedAt: date,
  });

  getContacts();
}

function getContacts() {
  contactsContent.innerHTML = "";
  var transaction = bd.transaction(["contacts"]);
  var store = transaction.objectStore("contacts");

  var cursor = store.openCursor();

  cursor.addEventListener("success", renderGet);
}

function renderGet(event) {
  try {
    var cursor = event.target.result;

    if (cursor) {
      contactsContent.innerHTML += `
      <div class="flex w-full border-b border-x border-gray-300 hover:bg-gray-50">
        <div
            class="flex items-center text-xs uppercase w-full border-l-none border-gray-300 border-collapse px-3 py-1">
            ${cursor.value.id}
        </div>
        <div
            class="flex items-center text-xs uppercase w-full border-l border-gray-300 border-collapse px-3 py-1">
            ${cursor.value.name}
        </div>
        <div
            class="flex items-center text-xs uppercase w-full border-l border-gray-300 border-collapse px-3 py-1">
            ${cursor.value.lastName}
        </div>
        <div
            class="flex items-center text-xs uppercase w-full border-l border-gray-300 border-collapse px-3 py-1">
            ${cursor.value.phone}
        </div>
        <div
            class="flex items-center text-xs uppercase w-full border-l border-gray-300 border-collapse px-3 py-1">
            ${cursor.value.email}
        </div>
        <div
            class="flex items-center text-xs uppercase w-full border-l border-gray-300 border-collapse px-3 py-1">
            ${cursor.value.address}
        </div>
        <div
            class="flex items-center text-xs uppercase w-full border-l border-gray-300 border-collapse px-3 py-1">
            ${cursor.value.createAt}
        </div>
        <div
            class="flex items-center text-xs uppercase w-full border-l border-gray-300 border-collapse px-3 py-1">
            ${cursor.value.updatedAt}
        </div>
    </div>`;

      cursor.continue();
    }
  } catch (error) {
    console.log(error);
  }
}

window.addEventListener("load", initDB);
seedForm();
