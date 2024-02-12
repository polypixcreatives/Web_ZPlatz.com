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

// Buttons
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


// Modals
function openModal() {
    document.getElementById("uploadModal").style.display = "block";
}

function closeModal() {
    document.getElementById("uploadModal").style.display = "none";
}




// View Listing Item
document.addEventListener("DOMContentLoaded", function () {
    const listingItem = document.getElementById('listingItem');
    if (listingItem) {
        listingItem.addEventListener('click', function () {
            window.location.href = 'index.html';
        });
    }
});