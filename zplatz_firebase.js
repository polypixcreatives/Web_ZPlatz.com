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

const inp = document.querySelector(".inp");
const progressbar = document.querySelector(".progress");
const img = document.querySelector(".img");
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
    fileName = Math.round(Math.random() * 9999) + file.name;
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

// Clearing Input Fields
const clearInputFields = () => {
    // Clear file input value
    const fileInput = document.querySelector('.inp');
    fileInput.value = '';

    // Reset file data display
    const fileData = document.querySelector('.filedata');
    fileData.textContent = '';

    // Reset progress bar
    const progressBar = document.querySelector('.progress');
    progressBar.style.width = '0%';

    // Reset progress text percentage to '0%'
    progressBar.innerHTML = '';
};