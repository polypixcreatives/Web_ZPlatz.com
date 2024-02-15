// Scroll and Mouse Effects
const links = document.querySelectorAll('nav a');

links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        link.querySelector('span').classList.remove('scale-x-0');
    });

    link.addEventListener('mouseleave', () => {
        link.querySelector('span').classList.add('scale-x-0');
    });
});

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

// Navigation Bar Buttons
const communityBtn = document.getElementById('communityBtn');
const trendingBtn = document.getElementById('trendingBtn');
const latestBtn = document.getElementById('latestBtn');

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

// View Listing Item
document.addEventListener("DOMContentLoaded", function () {
    const listingItem = document.getElementById('listingItem');
    if (listingItem) {
        listingItem.addEventListener('click', function () {
            window.location.href = 'viewer.html';
        });
    }
});