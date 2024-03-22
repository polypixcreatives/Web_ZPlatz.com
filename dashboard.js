function scrollProperties(direction) {
    const container = document.querySelector('.properties-container');
    const scrollAmount = 300;

    if (direction === 'left') {
        container.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    } else if (direction === 'right') {
        container.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }
}

function scrollPlaces(direction) {
    const container = document.querySelector('.properties-container');
    const scrollAmount = 300;

    if (direction === 'left') {
        container.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    } else if (direction === 'right') {
        container.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }
}

// Header
document.querySelector('.sidebar-toggle-btn').addEventListener('click', function () {
    document.querySelector('.sidebar').classList.toggle('open');
});

// Navigation Bar Buttons
const communityBtn = document.getElementById('communityBtn');
const trendingBtn = document.getElementById('trendingBtn');
const latestBtn = document.getElementById('latestBtn');

communityBtn.classList.add('bg-black', 'text-white');

communityBtn.addEventListener('click', () => {
    communityBtn.classList.add('bg-black', 'text-white');
    trendingBtn.classList.remove('bg-black', 'text-white');
    latestBtn.classList.remove('bg-black', 'text-white');
});

trendingBtn.addEventListener('click', () => {
    communityBtn.classList.remove('bg-black', 'text-white');
    trendingBtn.classList.add('bg-black', 'text-white');
    latestBtn.classList.remove('bg-black', 'text-white');
});

latestBtn.addEventListener('click', () => {
    communityBtn.classList.remove('bg-black', 'text-white');
    trendingBtn.classList.remove('bg-black', 'text-white');
    latestBtn.classList.add('bg-black', 'text-white');
});

// Upload Listing button navigate to the upload_listing.html
const navigateToUploadPage = () => {
    window.location.href = 'upload_listing.html';
};

// Sign in button navigate to the account.html
const navigateToLoginPage = () => {
    window.location.href = 'account.html';
};

// Profile Picture button navigate to upload_list.html
const navigateToUploadListPage = () => {
    window.location.href = 'upload_list.html';
}

document.addEventListener('DOMContentLoaded', function () {
    // Retrieve email from localStorage
    var email = localStorage.getItem('userEmail');

    // Log the fetched email to the console
    console.log("Fetched Email:", email);

    // Check if email is present
    if (email) {
        // Display profile picture
        var profilePicture = document.getElementById('profile-picture');
        profilePicture.style.display = 'block';

        // Show logout button on hover
        var profilePictureContainer = document.getElementById('profile-picture-container');
        profilePictureContainer.addEventListener('mouseenter', function () {
            document.getElementById('logout-button').style.opacity = '1';
        });
        profilePictureContainer.addEventListener('mouseleave', function () {
            document.getElementById('logout-button').style.opacity = '0';
        });

        // Hide sign-in button
        var signInButton = document.getElementById('sign-in-btn');
        signInButton.style.display = 'none';
        
        document.getElementById('logout-button').addEventListener('click', function () {
            localStorage.removeItem('userEmail'); 
            window.location.href = 'dashboard.html'; 
        });
    } else {
        // Show sign-in button
        var signInButton = document.getElementById('sign-in-btn');
        signInButton.style.display = 'block';
    }
});
