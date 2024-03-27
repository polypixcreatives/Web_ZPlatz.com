// Back to dashboard button navigate to the dashboard.html
const backToDashboard = () => {
    window.location.href = 'dashboard.html';
};

//Dropdown button and list
document.addEventListener('DOMContentLoaded', function () {
    const municipalityInput = document.querySelector('.municipality-dropdown input');
    const municipalityDropdownList = document.querySelector('.municipality-dropdown .dropdown-list');

    municipalityInput.addEventListener('click', function () {
        municipalityDropdownList.style.display = 'block';
    });

    municipalityDropdownList.addEventListener('click', function (event) {
        if (event.target.tagName === 'LI') {
            municipalityInput.value = event.target.textContent;
            municipalityDropdownList.style.display = 'none';
        }
    });

    document.addEventListener('click', function (event) {
        if (!municipalityDropdownList.contains(event.target) && event.target !== municipalityInput) {
            municipalityDropdownList.style.display = 'none';
        }
    });

    const provinceInput = document.querySelector('.province-dropdown input');
    const provinceDropdownList = document.querySelector('.province-dropdown .dropdown-list');

    provinceInput.addEventListener('click', function () {
        provinceDropdownList.style.display = 'block';
    });

    provinceDropdownList.addEventListener('click', function (event) {
        if (event.target.tagName === 'LI') {
            provinceInput.value = event.target.textContent;
            provinceDropdownList.style.display = 'none';
        }
    });

    document.addEventListener('click', function (event) {
        if (!provinceDropdownList.contains(event.target) && event.target !== provinceInput) {
            provinceDropdownList.style.display = 'none';
        }
    });

    const input = document.querySelector('.country-dropdown input');
    const dropdownList = document.querySelector('.country-dropdown .dropdown-list');

    input.addEventListener('click', function () {
        dropdownList.style.display = 'block';
    });

    dropdownList.addEventListener('click', function (event) {
        if (event.target.tagName === 'LI') {
            input.value = event.target.textContent;
            dropdownList.style.display = 'none';
        }
    });

    document.addEventListener('click', function (event) {
        if (!dropdownList.contains(event.target) && event.target !== input) {
            dropdownList.style.display = 'none';
        }
    });
});

function filterDropdown(event) {
    const input = event.target;
    const dropdown = input.nextElementSibling;
    const options = dropdown.querySelectorAll('li');

    const searchText = input.value.toLowerCase();

    options.forEach(option => {
        if (option.textContent.toLowerCase().includes(searchText)) {
            option.style.display = 'block';
        } else {
            option.style.display = 'none';
        }
    });

    if (input === '') {
        dropdown.style.display = 'none';
    } else {
        dropdown.style.display = 'block';
    }
}

// Custom Address
const customAddressCheckbox = document.getElementById('customAddressCheckbox');
const customAddressInput = document.getElementById('customAddressInput');

customAddressCheckbox.addEventListener('change', () => {
    if (customAddressCheckbox.checked) {
        customAddressInput.style.display = 'block';
    } else {
        customAddressInput.style.display = 'none';
    }
});

// Function to toggle logo visibility in UI
function toggleLogoVisibility() {
    const description = document.querySelector('.mini-description');
    const button = document.querySelector('.eye-icon-buttons button');

    if (description.textContent === "ZPlatz logo will be visible in the viewer.") {
        description.textContent = "ZPlatz logo will be hidden in the viewer.";
        button.innerHTML = '<i class="fas fa-eye"></i> Show ZPlatz logo';
        return true; 
    } else {
        description.textContent = "ZPlatz logo will be visible in the viewer.";
        button.innerHTML = '<i class="fas fa-eye-slash"></i> Hide ZPlatz logo';
        return false; 
    }
}