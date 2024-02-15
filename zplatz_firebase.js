const firebaseConfig = {
    apiKey: "AIzaSyBIAg_71Rq-Ma6BZBlaqjZhW4uPfZ254tY",
    authDomain: "zplatz-database.firebaseapp.com",
    projectId: "zplatz-database",
    storageBucket: "zplatz-database.appspot.com",
    messagingSenderId: "371563563136",
    appId: "1:371563563136:web:21dab9cd363a2d055dbe65",
    measurementId: "G-P33J1TQJS3"
};

const app = firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

// Upload Cover Photo

const inp = document.querySelector(".inp");
const progressbar = document.querySelector(".progress");
const fileData = document.querySelector(".filedata");
const loading = document.querySelector(".loading");
let file;
let fileName;
let progress;
let isLoading = false;
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
};

// Upload the image to the listing
const uploadCoverPhoto = () => {
    loading.style.display = "block";
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
            console.log(error);
        },
        () => {
            storage
                .ref("Cover Photos")
                .child(uploadedFileName)
                .getDownloadURL()
                .then((url) => {
                    console.log("URL", url);
                    if (!url) {
                        img.style.display = "none";
                    } else {
                        img.style.display = "block";
                        loading.style.display = "none";

                        // Insert the image into the listings
                        var listItem = document.createElement('li');
                        listItem.className = 'bg-gray-700 rounded-lg overflow-hidden custom-size-listing';

                        var imgElement = document.createElement('img');
                        imgElement.className = 'w-full h-full object-cover';
                        imgElement.src = url;
                        imgElement.alt = 'Uploaded Property Image';

                        listItem.appendChild(imgElement);

                        var listings = document.querySelector('.flex.flex-wrap.gap-1');
                        listings.insertBefore(listItem, listings.firstChild);

                        closeModal();
                        clearInputFields();
                        
                    }
                });
            console.log("File Uploaded Successfully");
        }
    );
};

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
};

// Upload the SPLAT file
const uploadSplatFile = () => {
    loadingSplat.style.display = "block";
    const storageRefSplat = storage.ref().child("SPLAT Files");
    const folderRefSplat = storageRefSplat.child(fileNameSplat);
    const uploadtaskSplat = folderRefSplat.put(fileSplat);
    uploadtaskSplat.on(
        "state_changed",
        (snapshot) => {
            console.log("Snapshot", snapshot.ref.name);
            progressSplat = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            progressSplat = Math.round(progressSplat);
            progressbarSplat.style.width = progressSplat + "%";
            progressbarSplat.innerHTML = progressSplat + "%";
            uploadedFileNameSplat = snapshot.ref.name;
        },
        (error) => {
            console.log(error);
        },
        () => {
            storage
                .ref("SPLAT Files")
                .child(uploadedFileNameSplat)
                .getDownloadURL()
                .then((url) => {
                    console.log("URL", url);
                    if (!url) {
                        // Handle if no URL is returned
                    } else {
                        // Call the function to display the uploaded SPLAT file
                        displayUploadedSplatFile(url);
                    }
                });
            console.log("File Uploaded Successfully");
        }
    );
};

// Function to display the uploaded SPLAT file
const displayUploadedSplatFile = (url) => {
    // Create an anchor element
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.textContent = 'Download SPLAT File';
    downloadLink.setAttribute('download', fileNameSplat);

    // Append the anchor element to the container
    const container = document.getElementById('canvasContainer');
    container.appendChild(downloadLink);
};
