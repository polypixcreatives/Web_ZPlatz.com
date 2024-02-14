
const customAddressCheckbox = document.getElementById('customAddressCheckbox');
const customAddressInput = document.getElementById('customAddressInput');

customAddressCheckbox.addEventListener('change', () => {
    if (customAddressCheckbox.checked) {
    customAddressInput.style.display = 'block';
    } else {
    customAddressInput.style.display = 'none';
    }
});

const uploadListingFiles = () => {
    uploadCoverPhoto();
    uploadSplatFile();
};