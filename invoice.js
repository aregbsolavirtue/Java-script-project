const modal = document.querySelector(".modal");
const newInvoiceBtn = document.querySelector("#new-invoice-btn");
const dropdown = document.querySelector(".dropdown");
const filter = document.querySelector(".filter");
const discard = document.querySelector(".btn-discard");
const addNewItemBtn = document.querySelector(".btn-secondary");
const newItem = document.querySelector(".new-item");
const invoiceForm = document.querySelector("#invoice_form");
const submitBtnSend = document.querySelector(".btn-send");
const submitBtnDraft = document.querySelector(".btn-draft");
const invoiceContainer = document.querySelector(".invoice-container");
const addItemBtn = document.getElementById("add-item-btn");
const discardBtn = document.getElementById("discard-btn");
const itemsContainer = document.querySelector(".items-container");
const sunIcon = document.querySelector(".sun-icon");
const moonIcon = document.querySelector(".moon-icon");
const filterCheckboxes = document.querySelectorAll(
  ".dropdown-content input[type='checkbox']"
);
const editForm = document.querySelector(".edit-form");
const updateCancel = document.querySelector(".update-cancel");
const updateSendBtn = document.querySelector("#update-send-btn");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const rightSection = document.querySelector(".right");
const initialDiscardSave = document.querySelector(".discard-save"); // Select the initial discard-save div
const newInvoiceHeading = document.querySelector(".invoice-form.new-form");
const editInvoiceHeading = document.querySelector(".invoice-form.edit-form");

let isDropdownOpen = false;
let submitStatus = "Pending";
let newInvoiceArrays =
  JSON.parse(localStorage.getItem("newInvoiceArrays")) || [];
let currentInvoiceId = null;
let currentInvoices = [...newInvoiceArrays];
let editInvoiceSection; // Will be created dynamically

function generateInvoiceList(invoices) {
  invoiceContainer.innerHTML = invoices
    .map((invoice) => {
      return `
            <div class="box" data-invoice-id="${invoice.invoiceId}">
              <div class="box-left">
                <h3>#INV00-${invoice.invoiceId}</h3>
                <p>Due: ${invoice.invoiceDate}</p>
                <p>${invoice.clientName}</p>
              </div>
              <div class="box-right">
                <h3>£${invoice.totalPriceQuantity.toFixed(2)}</h3>
                <div class="status">
                  <h4 class="status-${invoice.status.toLowerCase()}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" viewBox="0 0 16 16">
                      <circle cx="8" cy="8" r="8" />
                    </svg>
                    ${invoice.status}
                  </h4>
                </div>
              </div>
            </div>
          `;
    })
    .join("");

  // Add event listeners to the generated invoice boxes to display details
  document.querySelectorAll(".invoice-container .box").forEach((box) => {
    box.addEventListener("click", () => {
      const invoiceId = parseInt(box.dataset.invoiceId);
      const selectedInvoice = newInvoiceArrays.find(
        (invoice) => invoice.invoiceId === invoiceId
      );
      if (selectedInvoice) {
        displayInvoiceDetails(selectedInvoice);
        if (editInvoiceSection) editInvoiceSection.style.display = "block";
        if (document.querySelector(".right .top"))
          document.querySelector(".right .top").style.display = "none";
        if (document.querySelector(".centered-box"))
          document.querySelector(".centered-box").style.display = "none";
      }
    });
  });
}

function createEditInvoiceSection() {
  editInvoiceSection = document.createElement("div");
  editInvoiceSection.className = "edit-invoice";
  editInvoiceSection.innerHTML = `
      <div class="go-back">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-caret-left-fill"
          viewBox="0 0 16 16"
        >
          <path
            d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"
          />
        </svg>
        Go Back
      </div>
      <div class="edit-container">
        </div>
      <div class="status-crud">
        <div class="top-status">
          <span><p>Status</p></span>
          <div class="status-pending">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <circle cx="8" cy="8" r="8" />
            </svg>
            Pending
          </div>
        </div>
        <div class="edit-delete-mark">
          <button class="btn-edit">Edit</button>
          <button class="btn-delete">Delete</button>
          <button class="btn-mark">Mark as Paid</button>
        </div>
      </div>
      <div class="main-edit">
        <div class="main-edit-details">
          <div class="id-address">
            <div class="id-description">
              <h2>#INV00-</h2>
              <p></p>
            </div>
            <div class="address-sender">
              <p></p>
            </div>
          </div>

          <div class="invoice-payment">
            <div class="invoice-due">
              <div class="invoice-date">
                <p>Invoice Date</p>
                <h3></h3>
              </div>
              <div class="payment-due">
                <p>Payment Due</p>
                <h3></h3>
              </div>
            </div>
            <div class="bill-details">
              <p>Bill To</p>
              <h3></h3>
              <p></p>
            </div>
            <div class="bill-details">
              <p>Sent To</p>
              <h3></h3>
            </div>
          </div>

          <div class="item-detailed">
            <div class="item-names">
              <p>Item Name</p>
              <h3></h3>
            </div>
            <div class="item-names">
              <p>QTY.</p>
              <p></p>
            </div>
            <div class="item-names">
              <p>Price</p>
              <p></p>
            </div>
            <div class="item-names">
              <p>Total</p>
              <h4></h4>
            </div>
          </div>
          <div class="amount-due">
            <p class="due-amount-p">Amount Due</p>
            <h1 class="due-amount"></h1>
          </div>
        </div>
      </div>
    `;
  rightSection.appendChild(editInvoiceSection);

  // Add event listener for going back in the dynamically created section
  const goBackBtn = editInvoiceSection.querySelector(".go-back");
  if (goBackBtn) {
    goBackBtn.addEventListener("click", () => {
      if (editInvoiceSection) editInvoiceSection.style.display = "none";
      if (document.querySelector(".right .top"))
        document.querySelector(".right .top").style.display = "flex";
      if (document.querySelector(".centered-box"))
        document.querySelector(".centered-box").style.display = "block";
    });
  }

  // Add event listeners for edit, delete, and mark as paid buttons in the dynamically created section
  const editBtnInDetails = editInvoiceSection.querySelector(".btn-edit");
  const deleteBtnInDetails = editInvoiceSection.querySelector(".btn-delete");
  const markAsPaidBtnInDetails = editInvoiceSection.querySelector(".btn-mark");

  if (editBtnInDetails) {
    editBtnInDetails.addEventListener("click", () => {
      const invoiceId = parseInt(
        document.querySelector(".edit-invoice .btn-edit").dataset.invoiceId
      );
      openEditForm(invoiceId);
    });
  }

  if (deleteBtnInDetails) {
    deleteBtnInDetails.addEventListener("click", () => {
      const invoiceId = parseInt(
        document.querySelector(".edit-invoice .btn-delete").dataset.invoiceId
      );
      deleteInvoice(invoiceId);
    });
  }
  if (markAsPaidBtnInDetails) {
    markAsPaidBtnInDetails.addEventListener("click", () => {
      const invoiceId = parseInt(
        document.querySelector(".edit-invoice .btn-mark").dataset.invoiceId
      );
      markInvoiceAsPaid(invoiceId);
    });
  }

  return editInvoiceSection;
}

function displayInvoiceDetails(invoice) {
  if (!editInvoiceSection) {
    createEditInvoiceSection();
  }
  const editContainer = editInvoiceSection.querySelector(".edit-container");
  const statusDisplay = editInvoiceSection.querySelector(".top-status > div");
  const invoiceIdDisplay = editInvoiceSection.querySelector(
    ".id-description > h2"
  );
  const projectDescriptionDisplay = editInvoiceSection.querySelector(
    ".id-description > p"
  );
  const senderAddressDisplay = editInvoiceSection.querySelector(
    ".address-sender > p"
  );
  const invoiceDateDisplay =
    editInvoiceSection.querySelector(".invoice-date > h3");
  const paymentDueDisplay =
    editInvoiceSection.querySelector(".payment-due > h3");
  const billToNameDisplay = editInvoiceSection.querySelector(
    ".bill-details:nth-child(2) > h3"
  );
  const billToAddressDisplay = editInvoiceSection.querySelector(
    ".bill-details:nth-child(2) > p"
  );
  const sentToEmailDisplay = editInvoiceSection.querySelector(
    ".bill-details:nth-child(3) > h3"
  );
  const itemDetailedContainer =
    editInvoiceSection.querySelector(".item-detailed");
  const amountDueDisplay = editInvoiceSection.querySelector(".due-amount");
  const editButton = editInvoiceSection.querySelector(".btn-edit");
  const deleteButton = editInvoiceSection.querySelector(".btn-delete");
  const markAsPaidButton = editInvoiceSection.querySelector(".btn-mark");

  if (statusDisplay) {
    statusDisplay.className = ` status- ${invoice.status.toLowerCase()}`;
    statusDisplay.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" viewBox="0 0 16 16">
          <circle cx="8" cy="8" r="8" />
        </svg>
        ${invoice.status}
      `;
  }
  if (invoiceIdDisplay)
    invoiceIdDisplay.textContent = ` #INV00-${invoice.invoiceId}`;
  if (projectDescriptionDisplay)
    projectDescriptionDisplay.textContent = invoice.projectDescription;
  if (senderAddressDisplay) {
    senderAddressDisplay.innerHTML = `
        ${invoice.streetAddress}<br />
        ${invoice.city}<br />
        ${invoice.postCode}<br />
        ${invoice.country}
      `;
  }
  if (invoiceDateDisplay) invoiceDateDisplay.textContent = invoice.invoiceDate;
  if (paymentDueDisplay) invoiceDateDisplay.textContent = invoice.invoiceDate; // Assuming due date is same as invoice date for now
  if (billToNameDisplay) billToNameDisplay.textContent = invoice.clientName;
  if (billToAddressDisplay) {
    billToAddressDisplay.innerHTML = `
        ${invoice.clientStreetAddress}<br />
        ${invoice.clientCity}<br />
        ${invoice.clientPostCode}<br />
        ${invoice.clientCountry}
      `;
  }
  if (sentToEmailDisplay) sentToEmailDisplay.textContent = invoice.clientEmail;

  if (itemDetailedContainer) {
    itemDetailedContainer.innerHTML = `
        <div class="item-names header">
          <p>Item Name</p>
          <p>QTY.</p>
          <p>Price</p>
          <p>Total</p>
        </div>
        ${invoice.items
          .map(
            (item) => `
              <div class="item-names">
                <h3>${item.itemName}</h3>
                <p>${item.itemQty}</p>
                <p>£ ${item.itemPrice.toFixed(2)}</p>
                <h4>£ ${item.itemTotal.toFixed(2)}</h4>
              </div>
            `
          )
          .join("")}
      `;
  }

  if (amountDueDisplay)
    amountDueDisplay.textContent = ` $${invoice.totalPriceQuantity.toFixed(2)}`;
  if (editButton) editButton.dataset.invoiceId = invoice.invoiceId;
  if (deleteButton) deleteButton.dataset.invoiceId = invoice.invoiceId;
  if (markAsPaidButton) markAsPaidButton.dataset.invoiceId = invoice.invoiceId;
}

function openEditForm(invoiceId) {
  currentInvoiceId = invoiceId;
  const invoiceToEdit = newInvoiceArrays.find(
    (invoice) => invoice.invoiceId === invoiceId
  );

  if (invoiceToEdit) {
    // Populate the form with the invoice details
    document.querySelector("#primary-street-address").value =
      invoiceToEdit.streetAddress;
    document.querySelector("#primary-city").value = invoiceToEdit.city;
    document.querySelector("#primary-post-code").value = invoiceToEdit.postCode;
    document.querySelector("#primary-country").value = invoiceToEdit.country;
    document.querySelector("#client-name").value = invoiceToEdit.clientName;
    document.querySelector("#client-email").value = invoiceToEdit.clientEmail;
    document.querySelector("#secondary-street-address").value =
      invoiceToEdit.clientStreetAddress;
    document.querySelector("#secondary-city").value = invoiceToEdit.clientCity;
    document.querySelector("#secondary-post-code").value =
      invoiceToEdit.clientPostCode;
    document.querySelector("#secondary-country").value =
      invoiceToEdit.clientCountry;
    document.querySelector("#invoice-date").value = invoiceToEdit.invoiceDate;
    document.querySelector("#Payment-terms").value = invoiceToEdit.paymentTerms;
    document.querySelector("#project-description").value =
      invoiceToEdit.projectDescription;

    // Clear existing items in the form
    itemsContainer.innerHTML = "";

    // Repopulate items in the form
    invoiceToEdit.items.forEach((item) => {
      const newItemHTML = `
              <div class="new-item-details">
                <div class="client-details">
                  <label class="label-secondary">Item Name</label>
                  <input class="input-four item-name" type="text" value="${
                    item.itemName
                  }" />
                </div>
                <div class="client-details">
                  <label class="label-secondary">Qty</label>
                  <input class="input-five item-qty" type="number" value="${
                    item.itemQty
                  }" />
                </div>
                <div class="client-details">
                  <label class="label-secondary">Price</label>
                  <input class="input-five item-price" type="number" value="${
                    item.itemPrice
                  }" />
                </div>
                <div class="client-details">
                  <label class="label-secondary">Total</label>
                  <input class="input-five item-total" type="text" value="${item.itemTotal.toFixed(
                    2
                  )}" readonly />
                </div>
                <div>
                  <button class="delete-item-btn">🗑</button>
                </div>
              </div>
            `;

      const temp = document.createElement("div");
      temp.innerHTML = newItemHTML;
      const newItemElement = temp.firstElementChild;

      const qtyInput = newItemElement.querySelector(".item-qty");
      const priceInput = newItemElement.querySelector(".item-price");
      const totalInput = newItemElement.querySelector(".item-total");

      const updateTotal = () => {
        const qty = parseFloat(qtyInput.value) || 0;
        const price = parseFloat(priceInput.value) || 0;
        totalInput.value = (qty * price).toFixed(2);
      };

      qtyInput.addEventListener("input", updateTotal);
      priceInput.addEventListener("input", updateTotal);

      newItemElement
        .querySelector(".delete-item-btn")
        .addEventListener("click", () => {
          newItemElement.remove();
        });

      itemsContainer.appendChild(newItemElement);
    });

    // Show the modal
    if (modal) modal.style.display = "block";
    if (editForm) {
      editForm.style.display = "block";
    }
    if (updateCancel) {
      updateCancel.style.display = "none"; // Hide the update/cancel buttons
    }
    if (initialDiscardSave) {
      initialDiscardSave.style.display = "flex"; // Show the initial discard/save buttons
    }
    if (editInvoiceSection) editInvoiceSection.style.display = "none";
    if (document.querySelector(".right .top"))
      document.querySelector(".right .top").style.display = "none";
    if (document.querySelector(".centered-box"))
      document.querySelector(".centered-box").style.display = "none";

    // Change headings to indicate edit mode
    if (newInvoiceHeading) newInvoiceHeading.style.display = "none";
    if (editInvoiceHeading) editInvoiceHeading.style.display = "block";
  }
}

function deleteInvoice(invoiceId) {
  // Find the index of the invoice to delete
  const invoiceIndex = newInvoiceArrays.findIndex(
    (invoice) => invoice.invoiceId === invoiceId
  );

  // If the invoice is found, remove it from the array
  if (invoiceIndex !== -1) {
    newInvoiceArrays.splice(invoiceIndex, 1);

    // Update local storage
    localStorage.setItem("newInvoiceArrays", JSON.stringify(newInvoiceArrays));

    // Update the displayed list
    currentInvoices = [...newInvoiceArrays];
    generateInvoiceList(currentInvoices);

    // Hide the edit invoice section if it's open
    if (editInvoiceSection) editInvoiceSection.style.display = "none";
    if (document.querySelector(".right .top"))
      document.querySelector(".right .top").style.display = "flex";
    if (document.querySelector(".centered-box"))
      document.querySelector(".centered-box").style.display = "block";
  }
}
function markInvoiceAsPaid(invoiceId) {
  const invoiceIndex = newInvoiceArrays.findIndex(
    (invoice) => invoice.invoiceId === invoiceId
  );

  if (invoiceIndex !== -1) {
    newInvoiceArrays[invoiceIndex].status = "Paid";
    localStorage.setItem("newInvoiceArrays", JSON.stringify(newInvoiceArrays));
    currentInvoices = [...newInvoiceArrays];
    generateInvoiceList(currentInvoices);
    if (editInvoiceSection) editInvoiceSection.style.display = "none";
    if (document.querySelector(".right .top"))
      document.querySelector(".right .top").style.display = "flex";
    if (document.querySelector(".centered-box"))
      document.querySelector(".centered-box").style.display = "block";
  }
}

function handleFilterAndToggle() {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.body.classList.add("dark-mode");
    if (sunIcon) sunIcon.style.display = "block";
    if (moonIcon) moonIcon.style.display = "none";
  } else {
    document.body.classList.remove("dark-mode");
    if (sunIcon) sunIcon.style.display = "none";
    if (moonIcon) moonIcon.style.display = "block";
  }

  const filterInvoices = () => {
    const checkedFilters = Array.from(filterCheckboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.id);

    if (checkedFilters.length === 0) {
      currentInvoices = [...newInvoiceArrays];
    } else {
      currentInvoices = newInvoiceArrays.filter((invoice) =>
        checkedFilters.includes(invoice.status.toLowerCase())
      );
    }
    generateInvoiceList(currentInvoices);
  };

  filterCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", filterInvoices);
  });

  moonIcon?.addEventListener("click", () => {
    document.body.classList.add("dark-mode");
    localStorage.setItem("theme", "dark");
    if (sunIcon) sunIcon.style.display = "block";
    if (moonIcon) moonIcon.style.display = "none";
  });

  sunIcon?.addEventListener("click", () => {
    document.body.classList.remove("light-mode");
    localStorage.setItem("theme", "light");
    if (sunIcon) sunIcon.style.display = "none";
    if (moonIcon) moonIcon.style.display = "block";
  });
}

if (newItem) newItem.style.display = "none";
if (modal) modal.style.display = "none";
if (dropdown) dropdown.style.display = "none";
if (editForm) editForm.style.display = "none";
if (updateCancel) updateCancel.style.display = "none";
if (initialDiscardSave) initialDiscardSave.style.display = "flex"; // Initially show the normal buttons
if (editInvoiceHeading) editInvoiceHeading.style.display = "none"; // Initially hide edit heading

handleFilterAndToggle();
generateInvoiceList(currentInvoices);

newInvoiceBtn?.addEventListener("click", () => {
  if (modal) modal.style.display = "block";
  if (editForm) editForm.style.display = "none";
  if (updateCancel) updateCancel.style.display = "none";
  if (initialDiscardSave) initialDiscardSave.style.display = "flex"; // Show normal buttons for new invoice
  if (newInvoiceHeading) newInvoiceHeading.style.display = "block";
  if (editInvoiceHeading) editInvoiceHeading.style.display = "none";
});
discard?.addEventListener("click", () => {
  if (modal) modal.style.display = "none";
});

discardBtn?.addEventListener("click", (e) => {
  e.preventDefault(); // prevent form reset default behavior
  if (modal) modal.style.display = "none";
  invoiceForm?.reset(); // clear form fields
  itemsContainer.innerHTML = ""; // remove added items
  if (initialDiscardSave) initialDiscardSave.style.display = "flex"; // Ensure normal buttons are visible
  if (updateCancel) updateCancel.style.display = "none";
  if (editForm) editForm.style.display = "none";
  if (newInvoiceHeading) newInvoiceHeading.style.display = "block";
  if (editInvoiceHeading) editInvoiceHeading.style.display = "none";
  if (currentInvoiceId !== null) {
    // If discarding from edit mode, go back to invoice details
    const selectedInvoice = newInvoiceArrays.find(
      (invoice) => invoice.invoiceId === currentInvoiceId
    );
    if (selectedInvoice) {
      displayInvoiceDetails(selectedInvoice);
      if (editInvoiceSection) editInvoiceSection.style.display = "block";
      if (document.querySelector(".right .top"))
        document.querySelector(".right .top").style.display = "none";
      if (document.querySelector(".centered-box"))
        document.querySelector(".centered-box").style.display = "none";
    }
    currentInvoiceId = null; // Reset current invoice ID
  }
});

filter?.addEventListener("mouseenter", () => {
  dropdown.style.display = "block";
  isDropdownOpen = true;
});

filter?.addEventListener("click", (event) => {
  event.stopPropagation();
  isDropdownOpen = !isDropdownOpen;
  dropdown.style.display = isDropdownOpen ? "block" : "none";
});

document.addEventListener("click", (event) => {
  if (
    isDropdownOpen &&
    !filter.contains(event.target) &&
    !dropdown.contains(event.target)
  ) {
    dropdown.style.display = "none";
    isDropdownOpen = false;
  }
});

addNewItemBtn?.addEventListener("click", (e) => {
  e.preventDefault(); // prevents accidental form submission

  const newItemHTML = `
          <div class="new-item-details">
            <div class="client-details">
              <label class="label-secondary">Item Name</label>
              <input class="input-four item-name" type="text" />
            </div>
            <div class="client-details">
              <label class="label-secondary">Qty</label>
              <input class="input-five item-qty" type="number" value="0" />
            </div>
            <div class="client-details">
              <label class="label-secondary">Price</label>
              <input class="input-five item-price" type="number" value="0" />
            </div>
            <div class="client-details">
              <label class="label-secondary">Total</label>
              <input class="input-five item-total" type="text" value="0.00" readonly />
            </div>
            <div>
              <button class="delete-item-btn">🗑</button>
            </div>
          </div>
        `;

  const temp = document.createElement("div");
  temp.innerHTML = newItemHTML;
  const newItemElement = temp.firstElementChild;

  const qtyInput = newItemElement.querySelector(".item-qty");
  const priceInput = newItemElement.querySelector(".item-price");
  const totalInput = newItemElement.querySelector(".item-total");

  const updateTotal = () => {
    const qty = parseFloat(qtyInput.value) || 0;
    const price = parseFloat(priceInput.value) || 0;
    totalInput.value = (qty * price).toFixed(2);
  };

  qtyInput.addEventListener("input", updateTotal);
  priceInput.addEventListener("input", updateTotal);

  newItemElement
    .querySelector(".delete-item-btn")
    .addEventListener("click", () => {
      newItemElement.remove();
    });

  itemsContainer.appendChild(newItemElement);
});

submitBtnSend?.addEventListener("click", () => {
  submitStatus = "Pending";
  invoiceForm.requestSubmit();
});

submitBtnDraft?.addEventListener("click", () => {
  submitStatus = "Draft";
  invoiceForm.requestSubmit();
});
updateSendBtn?.addEventListener("click", (e) => {
  e.preventDefault();

  if (currentInvoiceId !== null) {
    // Find the index of the invoice to update
    const invoiceIndex = newInvoiceArrays.findIndex(
      (invoice) => invoice.invoiceId === currentInvoiceId
    );

    if (invoiceIndex !== -1) {
      // Update the invoice details with the form values
      newInvoiceArrays[invoiceIndex].streetAddress = document.querySelector(
        "#primary-street-address"
      ).value;
      newInvoiceArrays[invoiceIndex].city =
        document.querySelector("#primary-city").value;
      newInvoiceArrays[invoiceIndex].postCode =
        document.querySelector("#primary-post-code").value;
      newInvoiceArrays[invoiceIndex].country =
        document.querySelector("#primary-country").value;
      newInvoiceArrays[invoiceIndex].clientName =
        document.querySelector("#client-name").value;
      newInvoiceArrays[invoiceIndex].clientEmail =
        document.querySelector("#client-email").value;
      newInvoiceArrays[invoiceIndex].clientStreetAddress =
        document.querySelector("#secondary-street-address").value;
      newInvoiceArrays[invoiceIndex].clientCity =
        document.querySelector("#secondary-city").value;
      newInvoiceArrays[invoiceIndex].clientPostCode = document.querySelector(
        "#secondary-post-code"
      ).value;
      newInvoiceArrays[invoiceIndex].clientCountry =
        document.querySelector("#secondary-country").value;
      newInvoiceArrays[invoiceIndex].invoiceDate =
        document.querySelector("#invoice-date").value;
      newInvoiceArrays[invoiceIndex].paymentTerms =
        document.querySelector("#Payment-terms").value;
      newInvoiceArrays[invoiceIndex].projectDescription =
        document.querySelector("#project-description").value;

      // Clear existing items and add updated ones
      newInvoiceArrays[invoiceIndex].items = [];
      newInvoiceArrays[invoiceIndex].totalPriceQuantity = 0; // Reset total

      const itemBlocks = document.querySelectorAll(".new-item-details");
      itemBlocks.forEach((block) => {
        const itemNameInput = block.querySelector(".item-name");
        const itemQtyInput = block.querySelector(".item-qty");
        const itemPriceInput = block.querySelector(".item-price");
        const itemTotalInput = block.querySelector(".item-total");

        if (itemNameInput && itemQtyInput && itemPriceInput && itemTotalInput) {
          const itemName = itemNameInput.value;
          const itemQty = parseFloat(itemQtyInput.value) || 0;
          const itemPrice = parseFloat(itemPriceInput.value) || 0;
          const itemTotal = parseFloat(itemTotalInput.value) || 0;

          newInvoiceArrays[invoiceIndex].items.push({
            itemName,
            itemQty,
            itemPrice,
            itemTotal,
          });

          newInvoiceArrays[invoiceIndex].totalPriceQuantity += itemTotal;
        }
      });

      // Save updated invoices to local storage
      localStorage.setItem(
        "newInvoiceArrays",
        JSON.stringify(newInvoiceArrays)
      );

      // Update the displayed list
      currentInvoices = [...newInvoiceArrays];
      generateInvoiceList(currentInvoices);

      // Hide the modal and reset the form
      if (modal) modal.style.display = "none";
      invoiceForm.reset();
      itemsContainer.innerHTML = "";
      if (editForm) {
        editForm.style.display = "none";
      }
      if (updateCancel) {
        updateCancel.style.display = "none";
      }
      if (initialDiscardSave) {
        initialDiscardSave.style.display = "flex"; // Show normal buttons again if needed
      }
      if (editInvoiceSection) editInvoiceSection.style.display = "none";
      if (document.querySelector(".right .top"))
        document.querySelector(".right .top").style.display = "flex";
      if (document.querySelector(".centered-box"))
        document.querySelector(".centered-box").style.display = "block";
      if (newInvoiceHeading) newInvoiceHeading.style.display = "block";
      if (editInvoiceHeading) editInvoiceHeading.style.display = "none";
      currentInvoiceId = null; // Reset current invoice ID
    }
  }
});

cancelEditBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  if (modal) modal.style.display = "none";
  invoiceForm.reset();
  itemsContainer.innerHTML = "";
  if (editForm) {
    editForm.style.display = "none";
  }
  if (updateCancel) {
    updateCancel.style.display = "none";
  }
  if (initialDiscardSave) {
    initialDiscardSave.style.display = "flex"; // Show normal buttons again
  }
  if (editInvoiceSection) editInvoiceSection.style.display = "none";
  if (document.querySelector(".right .top"))
    document.querySelector(".right .top").style.display = "flex";
  if (document.querySelector(".centered-box"))
    document.querySelector(".centered-box").style.display = "block";
  if (currentInvoiceId !== null) {
    // If canceling edit, go back to invoice details
    const selectedInvoice = newInvoiceArrays.find(
      (invoice) => invoice.invoiceId === currentInvoiceId
    );
    if (selectedInvoice) {
      displayInvoiceDetails(selectedInvoice);
      if (editInvoiceSection) editInvoiceSection.style.display = "block";
      if (document.querySelector(".right .top"))
        document.querySelector(".right .top").style.display = "none";
      if (document.querySelector(".centered-box"))
        document.querySelector(".centered-box").style.display = "none";
    }
    currentInvoiceId = null; // Reset current invoice ID
  }
});

invoiceForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const invoiceId =
    newInvoiceArrays.length > 0
      ? Math.max(...newInvoiceArrays.map((inv) => inv.invoiceId)) + 1
      : 1;

  const invoice = {
    invoiceId,
    streetAddress: document.querySelector("#primary-street-address").value,
    city: document.querySelector("#primary-city").value,
    postCode: document.querySelector("#primary-post-code").value,
    country: document.querySelector("#primary-country").value,
    clientName: document.querySelector("#client-name").value,
    clientEmail: document.querySelector("#client-email").value,
    clientStreetAddress: document.querySelector("#secondary-street-address")
      .value,
    clientCity: document.querySelector("#secondary-city").value,
    clientPostCode: document.querySelector("#secondary-post-code").value,
    clientCountry: document.querySelector("#secondary-country").value,
    invoiceDate: document.querySelector("#invoice-date").value,
    paymentTerms: document.querySelector("#Payment-terms").value,
    projectDescription: document.querySelector("#project-description").value,
    items: [],
    totalPriceQuantity: 0,
    status: submitStatus,
  };
  const itemBlocks = document.querySelectorAll(".new-item-details");
  itemBlocks.forEach((block) => {
    const itemNameInput = block.querySelector(".item-name");
    const itemQtyInput = block.querySelector(".item-qty");
    const itemPriceInput = block.querySelector(".item-price");
    const itemTotalInput = block.querySelector(".item-total");

    if (itemNameInput && itemQtyInput && itemPriceInput && itemTotalInput) {
      const itemName = itemNameInput.value;
      const itemQty = parseFloat(itemQtyInput.value) || 0;
      const itemPrice = parseFloat(itemPriceInput.value) || 0;
      const itemTotal = parseFloat(itemTotalInput.value) || 0;

      invoice.items.push({
        itemName,
        itemQty,
        itemPrice,
        itemTotal,
      });

      invoice.totalPriceQuantity += itemTotal;
    }
  });

  newInvoiceArrays.push(invoice);
  localStorage.setItem("newInvoiceArrays", JSON.stringify(newInvoiceArrays));
  currentInvoices = [...newInvoiceArrays];
  generateInvoiceList(currentInvoices);

  if (modal) modal.style.display = "none";
  newItem.style.display = "none";
  itemsContainer.innerHTML = "";
  invoiceForm.reset();
  if (initialDiscardSave) initialDiscardSave.style.display = "flex"; // Show normal buttons after submission
  if (updateCancel) updateCancel.style.display = "none";
  if (editForm) editForm.style.display = "none";
  if (newInvoiceHeading) newInvoiceHeading.style.display = "block";
  if (editInvoiceHeading) editInvoiceHeading.style.display = "none";
});

// Initialize the edit invoice section dynamically
if (rightSection) {
  createEditInvoiceSection();
  if (editInvoiceSection) {
    editInvoiceSection.style.display = "none"; // Initially hide it
  }
}
