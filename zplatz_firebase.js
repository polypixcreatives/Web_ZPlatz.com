const firebaseConfig = {
  apiKey: "AIzaSyBIAg_71Rq-Ma6BZBlaqjZhW4uPfZ254tY",
  authDomain: "zplatz-database.firebaseapp.com",
  databaseURL: "https://zplatz-database-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "zplatz-database",
  storageBucket: "zplatz-database.appspot.com",
  messagingSenderId: "371563563136",
  appId: "1:371563563136:web:21dab9cd363a2d055dbe65",
  measurementId: "G-P33J1TQJS3"
};

const app = firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const db = firebase.firestore();

// Upload Cover Photo
const inp = document.querySelector(".inp");
const progressbar = document.querySelector(".progress");
const fileData = document.querySelector(".filedata");
const loading = document.querySelector(".loading");
let file;
let fileName;
let progress;
let uploadedFileName;

const selectCoverPhoto = () => {
    inp.click();
};

const getImageData = (e) => {
    file = e.target.files[0];
    fileName = file.name;
    if (fileName) {
        fileData.style.display = "block";
    }
    fileData.innerHTML = fileName;
    console.log(file, fileName);


    const reader = new FileReader();
    reader.onload = function () {
        const coverPhotoDiv = document.querySelector('.cover-photo');
        coverPhotoDiv.innerHTML =
            `<div style="position: relative;">   
                <img src="${reader.result}" alt="Cover Photo" class="uploaded-image">
                <button class="close-btn" onclick="removeCoverPhoto()">
                    <i class="fas fa-times"></i>
                </button>
            </div>`;

        // Change button text to "Change Cover Photo"
        const selectCoverPhotoButton = document.querySelector('.selectImage');
        selectCoverPhotoButton.innerHTML = `
            <div class="flex items-center justify-center">
                <i class="fas fa-file-upload text-gray-300 text-4xl"></i>
            </div>
            Change Cover Photo`;
    }

    reader.readAsDataURL(file);
};

function removeCoverPhoto() {
    const coverPhotoDiv = document.querySelector('.cover-photo');
    coverPhotoDiv.innerHTML = '';

    fileData.textContent = 'No Cover Photo selected';

    // Change button text to "Upload Cover Photo"
    const selectCoverPhotoButton = document.querySelector('.selectImage');
    selectCoverPhotoButton.innerHTML = `
        <div class="flex items-center justify-center">
            <i class="fas fa-file-upload text-gray-300 text-4xl"></i>
        </div>
        Upload Cover Photo`;
}

// Save URL to Firestore
async function saveURLtoFirestore(url, fileName, propertyName, customAddress) {
    try {
        const collectionRef = db.collection("cover_photos");
        await collectionRef.add({
            'Image Name': fileName,
            'Image URL': url,
            'Timestamp': firebase.firestore.FieldValue.serverTimestamp(),
            'Property Name': propertyName,
            'Custom Address': customAddress
        });
        console.log("URL saved to Firestore successfully:", url);
    } catch (error) {
        console.error("Error saving URL to Firestore:", error);
    }
}

// Upload the image to the listing
const uploadCoverPhoto = () => {
    console.log("Uploading cover photo...");
    loading.style.display = "block";

    const customAddressInput = document.getElementById('customAddressInput').querySelector('input');
    const customAddress = customAddressInput.value;

    const propertyName = getPropertyName();

    const storageRef = storage.ref().child("Cover Photos");
    const folderRef = storageRef.child(fileName);
    const uploadtask = folderRef.put(file);
    uploadtask.on(
        "state_changed",
        (snapshot) => {
            console.log("Snapshot", snapshot.ref.name);
            progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            progress = Math.round(progress);
            progressbar.style.width = progress + "%";
            progressbar.innerHTML = progress + "%";
            uploadedFileName = snapshot.ref.name;
        },
        (error) => {
            console.error("Error uploading file:", error);
        },
        async () => {
            try {
                const downloadURL = await storageRef.child(uploadedFileName).getDownloadURL();
                console.log("URL", downloadURL);
                if (!downloadURL) {
                    // Handle no URL case
                } else {
                    // Save URL to Firestore
                    await saveURLtoFirestore(downloadURL, uploadedFileName, propertyName, customAddress);

                    // Update the property name of the corresponding SPLAT file
                    updateSplatFilePropertyName(propertyName); // Call the function to update SPLAT file property name
                }

               window.location.href = `dashboard.html`;
            } catch (error) {
                console.error("Error uploading file:", error);
            }
        }
    );
};

// Function to get cover photos from Firestore
const getCoverPhotosFromFirestore = async () => {
    try {
        const coverPhotosList = document.querySelector('.flex.flex-wrap.gap-1');

        // Get snapshot of the cover_photos collection
        const snapshot = await db.collection('cover_photos').orderBy('Timestamp', 'asc').get();

        // Iterate over each document in the collection
        snapshot.forEach(doc => {
            // Get data from each document
            const data = doc.data();

            // Create list item for each cover photo
            const listItem = document.createElement('li');
            listItem.className = 'relative bg-gray-700 rounded-lg overflow-hidden custom-size-listing';

            // Add click event listener to the list item
            listItem.addEventListener('click', (event) => {
                // Extract the property name from the clicked element
                const propertyName = data['Property Name'];

                // Navigate to viewer page with the property name as a query parameter
                window.location.href = `viewer.html?propertyName=${encodeURIComponent(propertyName)}`;
            });

            const imgElement = document.createElement('img');
            imgElement.className = 'w-full h-full object-cover';
            imgElement.src = data['Image URL'];
            imgElement.alt = 'Uploaded Cover Photo';

            const textContainer = document.createElement('div');
            textContainer.className = 'absolute bottom-0 left-0 w-full p-1 slide-in-text';

            const heading = document.createElement('h3');
            heading.className = 'text-lg font-semibold text-white ml-1';
            heading.textContent = `${data['Property Name']}`;

            const paragraph = document.createElement('p');
            paragraph.className = 'text-white text-sm flex items-center ml-1';
            paragraph.textContent = `${data['Custom Address']}`;

            textContainer.appendChild(heading);
            textContainer.appendChild(paragraph);
            listItem.appendChild(imgElement);
            listItem.appendChild(textContainer);

            // Append list item before the first listing
            const firstListing = coverPhotosList.firstChild;
            coverPhotosList.insertBefore(listItem, firstListing);
        });
    } catch (error) {
        console.error('Error fetching cover photos from Firestore:', error);
    }
};

// Call the function to get cover photos when the page loads
document.addEventListener('DOMContentLoaded', getCoverPhotosFromFirestore);

// Upload SPLAT File
const inpSplat = document.querySelector(".inp-splat");
const progressbarSplat = document.querySelector(".progress-splat");
const fileDataSplat = document.querySelector(".filedata-splat");
const loadingSplat = document.querySelector(".loading-splat");
let fileSplat;
let fileNameSplat;
let progressSplat;
let isLoadingSplat = false;
let uploadedFileNameSplat;
let documentId;

const selectSplatfile = () => {
    inpSplat.click();
};

const getSplatData = (e) => {
    fileSplat = e.target.files[0];
    fileNameSplat = fileSplat.name;
    if (fileNameSplat) {
        fileDataSplat.style.display = "block";
    }
    fileDataSplat.innerHTML = fileNameSplat;
    console.log(fileSplat, fileNameSplat);

    const readerSplat = new FileReader();

    showProgress();

    readerSplat.onload = function () {
        // Upload the splat file to Firebase Firestore
        uploadSplatFile();
    }

    readerSplat.readAsDataURL(fileSplat);
};

function hideProgress() {
    const progressBar = document.querySelector('.progress-splat');
    progressBar.style.display = 'none';
    
    const loadingSpan = document.querySelector('.loading-splat');
    loadingSpan.style.display = 'none';
}

function showProgress() {
    const progressBar = document.querySelector('.progress-splat');
    progressBar.style.display = 'block';
    
    const loadingSpan = document.querySelector('.loading-splat');
    loadingSpan.style.display = 'block';
}

function removeSplat() {
    // Change button text to "Upload SPLAT File"
    const selectSplatButton = document.querySelector('.selectSplat');
    selectSplatButton.innerHTML = `
        <div class="flex items-center justify-center">
            <i class="fas fa-file-upload text-gray-300 text-4xl"></i>
        </div>
        Upload SPLAT file`;
        
    const splatFileDiv = document.querySelector('.splat-file');
    splatFileDiv.innerHTML = '';

    fileDataSplat.textContent = 'No SPLAT file selected';

    // Hide progress bar
    hideProgress();

    // Delete SPLAT File from Firestore
    deleteSplatFile();
}

// Delete SPLAT File
async function deleteSplatFile() {
    try {
        const collectionRef = db.collection("splat_files");
        const querySnapshot = await collectionRef.where("File Name", "==", fileNameSplat).get();
        querySnapshot.forEach(async (doc) => {
            await doc.ref.delete();
            console.log("Document deleted successfully from Firestore:", doc.id);
        });
    } catch (error) {
        console.error("Error deleting document from Firestore:", error);
    }
}

// Save URL to Firestore
async function saveSplatURLtoFirestore(url, fileNameSplat, propertyName, customAddress) {
    try {
        const collectionRef = db.collection("splat_files");
        await collectionRef.add({
            'File Name': fileNameSplat,
            'File URL': url,
            'Timestamp': firebase.firestore.FieldValue.serverTimestamp(),
            'Property Name': propertyName,
            'Custom Address': customAddress
        });
        console.log("Splat file URL saved to Firestore successfully:", url);
    } catch (error) {
        console.error("Error saving splat file URL to Firestore:", error);
    }
}

// Listen for the custom event dispatched from upload_viewer.js
document.addEventListener('updateViewMatrix', async function (event) {
    const { docId, viewMatrixJSON } = event.detail;
    console.log('Received documentId:', docId);
    console.log('Received viewMatrixJSON:', viewMatrixJSON);

    try {
        // Ensure that documentId is defined
        if (!docId) {
            console.error('Document ID is not defined.');
            return;
        }

        if (!viewMatrixJSON) {
            console.error('View Matrix is not defined.');
            return;
        }

        // Identify the document you want to update
        const docRef = db.collection('splat_files').doc(docId); // Use the received document ID

        // Update the document with the new field
        await docRef.update({
            'View Matrix': viewMatrixJSON
        });

        console.log('View matrix updated successfully in Firestore.');

    } catch (error) {
        console.error('Error updating view matrix in Firestore:', error);
    }
});

// Upload the splat file
const uploadSplatFile = () => {
    console.log("Uploading splat file...");
    loadingSplat.style.display = "block";

    const customAddressInput = document.getElementById('customAddressInput').querySelector('input');
    const customAddress = customAddressInput.value; // Get custom address value

    const propertyNameInput = document.getElementById('propertyNameInput');
    const propertyName = propertyNameInput.value;

    const storageRefSplat = storage.ref().child("SPLAT Files");
    const folderRefSplat = storageRefSplat.child(fileNameSplat);
    const uploadtaskSplat = folderRefSplat.put(fileSplat);
    uploadtaskSplat.on(
        "state_changed",
        (snapshot) => {
            console.log("Splat file Snapshot", snapshot.ref.name);
            progressSplat = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            progressSplat = Math.round(progressSplat);
            progressbarSplat.style.width = progressSplat + "%";
            progressbarSplat.innerHTML = progressSplat + "%";
            uploadedFileNameSplat = snapshot.ref.name;
        },
        (error) => {
            console.error("Error uploading splat file:", error);
        },
        async () => {
            try {
                const downloadSplatURL = await storageRefSplat.child(uploadedFileNameSplat).getDownloadURL();
                console.log("Splat file URL", downloadSplatURL);
                if (!downloadSplatURL) {
                    // Handle no URL case
                } else {
                    // Save URL to Firestore
                    await saveSplatURLtoFirestore(downloadSplatURL, uploadedFileNameSplat, propertyName, customAddress);

                    const splatFileDiv = document.querySelector('.splat-file');
                    splatFileDiv.innerHTML =
                        `<div style="position: relative;">
                        <!-- Display upload_viewer.html content here -->
                        <iframe id="upload_viewer_frame" src="upload_viewer.html?splatFile=${encodeURIComponent(fileNameSplat)}" frameborder="0" style="width: 497px; height: 297px;"></iframe>
                            <button class="close-btn" onclick="removeSplat()">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>`;

                    // Change button text to "Change SPLAT file"
                    const selectSplatButton = document.querySelector('.selectSplat');
                    selectSplatButton.innerHTML =
                        `<div class="flex items-center justify-center">
                            <i class="fas fa-file-upload text-gray-300 text-4xl"></i>
                        </div>
                        Change SPLAT file`;
                }
            } catch (error) {
                console.error("Error uploading splat file:", error);
            }
        }
    );
};

// Function to update the property name of the corresponding SPLAT file
async function updateSplatFilePropertyName(propertyName) {
    // Log the propertyName when the function is called
    console.log("Updating SPLAT file property name:", propertyName);

    try {
        // Query for the SPLAT file by its fileName
        const querySnapshot = await db.collection("splat_files").where("File Name", "==", fileNameSplat).get();

        // Iterate over each document in the query result
        querySnapshot.forEach(async (doc) => {
            // Get the document ID
            const docId = doc.id;

            // Log the document ID
            console.log("Document ID for SPLAT file:", docId);

            // Identify the document you want to update
            const docRef = db.collection('splat_files').doc(docId);

            // Update the document with the new Property Name
            await docRef.update({
                'Property Name': propertyName
            });

            console.log('Property Name updated successfully for SPLAT file in Firestore.');
        });
    } catch (error) {
        console.error("Error updating Property Name for SPLAT file in Firestore:", error);
    }
}

// Function to get the property name of the SPLAT file
const getSplatFilePropertyName = async () => {
    try {
        // Assuming you have a collection in Firestore named 'splat_files'
        const splatFilesRef = db.collection("splat_files");

        // Query for the SPLAT file with the corresponding fileNameSplat
        const querySnapshot = await splatFilesRef.where("File Name", "==", fileNameSplat).get();

        // Assuming there's only one SPLAT file with this name, so taking the first document
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            const data = doc.data();
            return data['Property Name']; // Return the property name
        } else {
            console.log("No SPLAT file found with the given name.");
            return null; // Return null if no SPLAT file found
        }
    } catch (error) {
        console.error("Error getting SPLAT file property name:", error);
        return null;
    }
};

// Function to fetch data from both collections and populate the table
async function fetchAndPopulateMergedData() {
    const coverPhotosRef = db.collection("cover_photos");
    const splatFilesRef = db.collection("splat_files");
    try {
        const coverPhotosSnapshot = await coverPhotosRef.get();
        const splatFilesSnapshot = await splatFilesRef.get();
        const tableBody = document.querySelector("#merged-upload-list tbody");
        tableBody.innerHTML = ""; // Clear existing table rows
        // Process cover photos data
        coverPhotosSnapshot.forEach(doc => {
            const data = doc.data();
            const propertyName = data['Property Name'];
            const fileName = data['Image Name'];
            const timestamp = data['Timestamp'].toDate(); // Convert Firebase timestamp to Date object
            const formattedTimestamp = timestamp.toLocaleString(); // Format timestamp as per your requirement
            // Create table row and cells for cover photos
            const row = document.createElement("tr");
            row.innerHTML = `
                    <td class="px-4 py-4 whitespace-nowrap">
                        <input type="checkbox">
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap">Cover Photo</td>
                    <td class="px-4 py-4 whitespace-nowrap">${propertyName}</td>
                    <td class="px-4 py-4 whitespace-nowrap">${fileName}</td>
                    <td class="px-4 py-4 whitespace-nowrap">${formattedTimestamp}</td>
                    <td class="px-4 py-4 whitespace-nowrap">
                        <button class="text-red-600">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="text-red-600">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>`;
            tableBody.appendChild(row); // Append row to table body
        });
        // Process splat files data
        splatFilesSnapshot.forEach(doc => {
            const data = doc.data();
            const propertyName = data['Property Name'];
            const fileNameSplat = data['File Name'];
            const timestamp = data['Timestamp'].toDate(); // Convert Firebase timestamp to Date object
            const formattedTimestamp = timestamp.toLocaleString(); // Format timestamp as per your requirement
            // Create table row and cells for splat files
            const row = document.createElement("tr");
            row.innerHTML = `
                    <td class="px-4 py-4 whitespace-nowrap">
                        <input type="checkbox">
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap">Splat File</td>
                    <td class="px-4 py-4 whitespace-nowrap">${propertyName}</td>
                    <td class="px-4 py-4 whitespace-nowrap">${fileNameSplat}</td>
                    <td class="px-4 py-4 whitespace-nowrap">${formattedTimestamp}</td>
                    <td class="px-4 py-4 whitespace-nowrap">
                        <button class="text-red-600">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="text-red-600">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>`;
            tableBody.appendChild(row); // Append row to table body
        });
    } catch (error) {
        console.error("Error fetching data from Firestore:", error);
    }
}

// Call fetchAndPopulateMergedData when the page loads
window.addEventListener('load', () => {
    fetchAndPopulateMergedData();
});

                        
// Function to generate a random property name
const generateRandomPropertyName = () => {
    const letters = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz';
    const numbers = '0123456789';
    let randomName = 'Untitled-';

    for (let i = 0; i < 3; i++) {
        randomName += letters.charAt(Math.floor(Math.random() * letters.length));
    }

    for (let i = 0; i < 3; i++) {
        randomName += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }

    return randomName;
};

// Function to check if property name is entered or generate a random one
const getPropertyName = () => {
    const propertyNameInput = document.getElementById('propertyNameInput');
    return propertyNameInput.value.trim() !== '' ? propertyNameInput.value.trim() : generateRandomPropertyName();
};

// Upload listing files
const uploadListingFiles = () => {
    // Retrieve file names (fileName and fileNameSplat)
    const coverPhotoFileName = fileName;
    const splatFileFileName = fileNameSplat;

    // Check if both cover photo and SPLAT file are uploaded
    if (!coverPhotoFileName && !splatFileFileName) {
        alert('Please upload a cover photo and a SPLAT file.');
        return; // Stop further execution if both cover photo and SPLAT file are empty
    }

    // Check if cover photo is uploaded
    if (!coverPhotoFileName) {
        alert('Please upload a cover photo.');
        return; // Stop further execution if cover photo is not uploaded
    }

    // Check if SPLAT file is uploaded
    if (!splatFileFileName) {
        alert('Please upload a SPLAT file.');
        return; // Stop further execution if SPLAT file is not uploaded
    }

    const propertyNameInput = document.getElementById('propertyNameInput');
    const propertyName = propertyNameInput.value;
    // Log the property name 
    console.log("Property Name:", propertyName);

    (async () => {
        // Check if the entered property name already exists in the database
        const propertyNameExists = await checkPropertyNameExists(propertyName);
        if (propertyNameExists) {
            // Property name already exists, show error message and stop upload
            alert('Property name already exists. You cannot upload the listing with an existing property name.');
        } else {
            const splatFilePropertyName = getSplatFilePropertyName();
            // Log the property name of the SPLAT file 
            console.log("SPLAT File Property Name:", splatFilePropertyName);

            // Check if the property names match
            if (propertyName === splatFilePropertyName) {
                // Both property names match, proceed with uploading the SPLAT file
                uploadCoverPhoto();
            } else {
                // Property names don't match, update the property name of the SPLAT file
                updateSplatFilePropertyName(propertyName);
                uploadCoverPhoto();
            }
        }
    })();
};

// Function to check if the property name exists in the database
const checkPropertyNameExists = async (propertyName) => {
    try {
        const snapshot = await db.collection("cover_photos").where("Property Name", "==", propertyName).get();
        return !snapshot.empty; // Return true if any document with the given property name exists
    } catch (error) {
        console.error("Error checking property name:", error);
        return false; // Return false in case of an error
    }
};

// Function to update the UI based on property name validation
const updatePropertyNameValidation = async () => {
    const propertyNameInput = document.getElementById('propertyNameInput');
    const propertyNameValidationIcon = document.getElementById('propertyNameValidationIcon');
    const propertyNameValidationText = document.getElementById('propertyNameValidationText');

    const propertyName = propertyNameInput.value.trim();

    if (propertyName === '') {
        // Property name is empty
        propertyNameValidationIcon.innerHTML = '';
        propertyNameValidationText.textContent = ''; // Clear validation text
    } else {
        // Check if the property name exists in the database
        const propertyNameExists = await checkPropertyNameExists(propertyName);
        if (propertyNameExists) {
            // Property name exists in the database
            propertyNameValidationIcon.innerHTML = '<i class="fas fa-times text-red-500"></i>';
            propertyNameValidationText.textContent = 'Property name already exists';
        } else {
            // Property name is available
            propertyNameValidationIcon.innerHTML = '<i class="fas fa-check text-green-500"></i>';
            propertyNameValidationText.textContent = 'Property name is available';
        }
    }
};

// Event listener for input change to trigger validation
document.getElementById('propertyNameInput').addEventListener('input', updatePropertyNameValidation);
