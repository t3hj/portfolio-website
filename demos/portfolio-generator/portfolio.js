function escapeHTML(value) { return String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character])); }
function safeURL(value) { try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? escapeHTML(url.href) : ''; } catch { return ''; } }
document.getElementById('addExperience').addEventListener('click', function() {
    const experienceList = document.getElementById('experienceList');
    const newExperience = document.createElement('div');
    newExperience.innerHTML = `
        <input type="text" placeholder="Job Title (e.g., Junior Accountant)">
        <input type="text" placeholder="Company (e.g., ABC Company, Marseilles, France)">
        <input type="text" placeholder="Duration (e.g., Jan 2017 – Sept 2019)">
        <textarea placeholder="Description"></textarea>
    `;
    experienceList.appendChild(newExperience);
});

document.getElementById('addEducation').addEventListener('click', function() {
    const educationList = document.getElementById('educationList');
    const newEducation = document.createElement('div');
    newEducation.innerHTML = `
        <input type="text" placeholder="Degree (e.g., Degree in Accounting and Finance)">
        <input type="text" placeholder="Institution (e.g., University of Bordeaux, France)">
        <input type="text" placeholder="Year (e.g., Sept 2014 – June 2017)">
    `;
    educationList.appendChild(newEducation);
});

document.getElementById('generatePortfolio').addEventListener('click', function() {
    const profileImageInput = document.getElementById('profileImage');
    const profileImage = profileImageInput.files[0];
    const name = escapeHTML(document.getElementById('name').value);
    const role = escapeHTML(document.getElementById('role').value);
    const phone = escapeHTML(document.getElementById('phone').value);
    const email = escapeHTML(document.getElementById('email').value);
    const address = escapeHTML(document.getElementById('address').value);
    const linkedin = safeURL(document.getElementById('linkedin').value);
    const github = safeURL(document.getElementById('github').value);
    const languages = escapeHTML(document.getElementById('languages').value);
    const hobbies = escapeHTML(document.getElementById('hobbies').value);
    const summary = escapeHTML(document.getElementById('summary').value);
    const certificates = escapeHTML(document.getElementById('certificates').value);

    const experienceList = Array.from(document.getElementById('experienceList').children).map(exp => `
        <div class="box">
            <h3>${escapeHTML(exp.children[0].value)}</h3>
            <p><strong>Company:</strong> ${escapeHTML(exp.children[1].value)}</p>
            <p><strong>Duration:</strong> ${escapeHTML(exp.children[2].value)}</p>
            <p>${escapeHTML(exp.children[3].value)}</p>
        </div>
    `).join('');

    const educationList = Array.from(document.getElementById('educationList').children).map(edu => `
        <div class="box">
            <h3>${escapeHTML(edu.children[0].value)}</h3>
            <p><strong>Institution:</strong> ${escapeHTML(edu.children[1].value)}</p>
            <p><strong>Year:</strong> ${escapeHTML(edu.children[2].value)}</p>
        </div>
    `).join('');

    if (profileImage && (!profileImage.type.startsWith('image/') || profileImage.size > 5 * 1024 * 1024)) {
        alert('Choose an image smaller than 5 MB.');
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        const portfolioContent = `
            <div class="box personal-info">
                <div>
                    <h3 style="background-color: #007bff; color: #fff; padding: 5px;">Personal Information</h3>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Address:</strong> ${address}</p>
                    <div class="social-media-box">
                        <h3>Social Media</h3>
                        <p><strong>LinkedIn:</strong> <a href="${linkedin}" target="_blank" rel="noreferrer">${linkedin}</a></p>
                        <p><strong>GitHub:</strong> <a href="${github}" target="_blank" rel="noreferrer">${github}</a></p>
                    </div>
                </div>
                <img id="portfolioImage" src="${e.target.result}" alt="Profile Image" style="max-width: 150px; ${profileImage ? '' : 'display:none;'}">
            </div>
            <div class="box">
                <h3>Profile Summary</h3>
                <p>${summary}</p>
            </div>
            <div class="box">
                <h3>Professional Experience</h3>
                ${experienceList}
            </div>
            <div class="box">
                <h3>Education</h3>
                ${educationList}
            </div>
            <div class="box">
                <h3>Skills & Interests</h3>
                <p><strong>Languages:</strong> ${languages}</p>
                <p><strong>Hobbies:</strong> ${hobbies}</p>
            </div>
            <div class="box">
                <h3>Certificates</h3>
                <p>${certificates}</p>
            </div>
        `;

        document.getElementById('portfolioContent').innerHTML = portfolioContent;
        document.getElementById('portfolioDisplay').classList.remove('hidden');
        document.getElementById('portfolioName').textContent = document.getElementById('name').value; // Ensure the name is set here
    };

    if (profileImage) {
        reader.readAsDataURL(profileImage);
    } else {
        reader.onload({ target: { result: '' } });
    }
});

document.getElementById('downloadPortfolio').addEventListener('click', async function() {
    const element = document.getElementById('portfolioDisplay');
    const button = document.getElementById('downloadPortfolio');
    if (typeof html2pdf !== 'function') { window.print(); return; }
    button.hidden = true;
    try { await html2pdf().from(element).save('portfolio.pdf'); }
    catch { window.print(); }
    finally { button.hidden = false; }
});
