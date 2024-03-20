// Back to dashboard button navigate to the dashboard.html
const backToDashboard = () => {
    window.location.href = 'dashboard.html';
};

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

        document.getElementById('logout-button').addEventListener('click', function () {
            localStorage.removeItem('userEmail');
            window.location.href = 'dashboard.html';
        });
    }
});