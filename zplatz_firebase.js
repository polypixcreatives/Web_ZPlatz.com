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

    const propertyNameInput = document.getElementById('propertyNameInput');
    const propertyName = propertyNameInput.value;

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
                }
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
    readerSplat.onload = function () {
        const splatFileDiv = document.querySelector('.splat-file');
        splatFileDiv.innerHTML =
            `<div style="position: relative;">   
                <p><canvas id="canvas" alt="SPLAT File"></canvas></p>
                <button class="close-btn" onclick="removeSplat()">
                    <i class="fas fa-times"></i>
                </button>
            </div>`;

        // Change button text to "Change SPLAT file"
        const selectSplatButton = document.querySelector('.selectSplat');
        selectSplatButton.innerHTML = `
            <div class="flex items-center justify-center">
                <i class="fas fa-file-upload text-gray-300 text-4xl"></i>
            </div>
            Change SPLAT file`;
    }

    readerSplat.readAsDataURL(fileSplat);
};

function removeSplat() {
    const splatFileDiv = document.querySelector('.splat-file');
    splatFileDiv.innerHTML = '';

    fileDataSplat.textContent = 'No SPLAT file selected';

    // Change button text to "Upload SPLAT File"
    const selectSplatButton = document.querySelector('.selectSplat');
    selectSplatButton.innerHTML = `
        <div class="flex items-center justify-center">
            <i class="fas fa-file-upload text-gray-300 text-4xl"></i>
        </div>
        Upload SPLAT file`;
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

/*// Render the splat file
const renderSplat = () => { 
    console.log("Rendering splat file...");
    loadingSplat.style.display = "block";

    const customAddressInput = document.getElementById('customAddressInput').querySelector('input');
    const customAddress = customAddressInput.value; // Get custom address value

    const propertyNameInput = document.getElementById('propertyNameInput');
    const propertyName = propertyNameInput.value;

    const storageRefSplat = storage.ref().child("SPLAT Render");
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
            console.error("Error rendering splat file:", error);
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
                    // Display the canvas
                    displaySplatCanvas();
                }
            } catch (error) {
                console.error("Error rendering splat file:", error);
            }
        }
    );
};

const displaySplatCanvas = () => {

    // Display the canvas
    const splatFileDiv = document.querySelector('.splat-file');
    splatFileDiv.innerHTML =
        `<div style="position: relative;">   
            <iframe id="upload_viewer_frame" src="upload_viewer.html" frameborder="0" style="width: 497px; height: 500px;"></iframe>
            <button class="close-btn" onclick="removeSplat()">
                <i class="fas fa-times"></i>
            </button>
        </div>`;

    // Change button text to "Change SPLAT file"
    const selectSplatButton = document.querySelector('.selectSplat');
    selectSplatButton.innerHTML = `
        <div class="flex items-center justify-center">
            <i class="fas fa-file-upload text-gray-300 text-4xl"></i>
        </div>
        Change SPLAT file`;
}*/

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
                }
            } catch (error) {
                console.error("Error uploading splat file:", error);
            }
        }
    );
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