const imageUpload = document.getElementById('imageUpload');
const uploadedImage = document.getElementById('uploadedImage');
const imageContainer = document.getElementById('imageContainer');
const topTextInput = document.getElementById('topTextInput');
const bottomTextInput = document.getElementById('bottomTextInput');
const topTextOverlay = document.getElementById('topText');
const bottomTextOverlay = document.getElementById('bottomText');
const saveImageBtn = document.getElementById('saveImage');
const fontSizeSlider = document.getElementById('fontSize');
const fontSizeValue = document.getElementById('fontSizeValue');
const textShadowCheckbox = document.getElementById('textShadow');
const controls = document.querySelector('.controls');

const draftList = document.getElementById('draftList');
const saveDraftBtn = document.getElementById('saveDraft');
const loadDraftBtn = document.getElementById('loadDraft');
const clearDraftBtn = document.getElementById('clearDraft');

const addNewBtn = document.getElementById('addNew');

let currentScale = 1;
let currentX = 0;
let currentY = 0;

imageUpload.addEventListener('change', function (e) {
    const file = e
        .target
        .files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            uploadedImage.src = e.target.result;
            resetImagePosition();
        }
        reader.readAsDataURL(file);
    }
});

function resetEditor() {

    topTextInput.value = '';
    bottomTextInput.value = '';

    fontSizeSlider.value = 14;
    fontSizeValue.textContent = '14px';
    textShadowCheckbox.checked = false;

    uploadedImage.src = '';

    topTextOverlay.innerHTML = '';
    bottomTextOverlay.innerHTML = '';

    resetImagePosition();
}

addNewBtn.addEventListener('click', resetEditor);

function resetImagePosition() {
    currentScale = 1;
    currentX = 0;
    currentY = 0;
    updateImageTransform();
}

function updateImageTransform() {
    uploadedImage.style.transform = `translate(${currentX}px, ${currentY}px) scale(${currentScale})`;
}

function resetImagePosition() {
    currentScale = 1;
    currentX = 0;
    currentY = 0;
    updateImageTransform();
}

function updateImageTransform() {
    uploadedImage.style.transform = `translate(${currentX}px, ${currentY}px) scale(${currentScale})`;
}

function updateTextOverlay(input, overlay) {
    const lines = input
        .value
        .split('\n')
        .slice(0, 6);
    overlay.innerHTML = '';
    lines.forEach(line => {
        const p = document.createElement('p');
        if (line.startsWith('*')) {
            p
                .classList
                .add('special');
            p.textContent = line;
        } else {
            p.textContent = line;
        }
        p.style.fontSize = `${fontSizeSlider.value}px`;
        if (textShadowCheckbox.checked) {
            p.style.textShadow += '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 2px 4px 3p' +
                    'x rgba(0,0,0,1)';
        } else {
            p.style.textShadow += '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000';
        }
        overlay.appendChild(p);
    });
}

function saveDraft() {
    const draftTitle = prompt("Masukkan judul draft:");

    if (draftTitle) {
        const draft = {
            topText: topTextInput.value,
            bottomText: bottomTextInput.value,
            fontSize: fontSizeSlider.value,
            textShadow: textShadowCheckbox.checked,
            imageSrc: uploadedImage.src
        };

        localStorage.setItem(`imageEditorDraft_${draftTitle}`, JSON.stringify(draft));
        alert(`Draft "${draftTitle}" telah disimpan!`);

        populateDraftList();
    } else {
        alert("Judul draft tidak boleh kosong.");
    }
}

function populateDraftList() {
    draftList.innerHTML = '<option value="" disabled selected>Pilih Draft</option>';

    const draftTitles = Object
        .keys(localStorage)
        .filter(key => key.startsWith('imageEditorDraft_'))
        .map(key => key.replace('imageEditorDraft_', ''));

    draftTitles.forEach(title => {
        const option = document.createElement('option');
        option.value = title;
        option.textContent = title;
        draftList.appendChild(option);
    });
}

function loadDraft() {
    const selectedDraftTitle = draftList.value;

    if (!selectedDraftTitle) {
        alert('Silakan pilih draft untuk dimuat.');
        return;
    }

    const draft = JSON.parse(
        localStorage.getItem(`imageEditorDraft_${selectedDraftTitle}`)
    );

    if (draft) {
        topTextInput.value = draft.topText || '';
        bottomTextInput.value = draft.bottomText || '';
        fontSizeSlider.value = draft.fontSize || 14;
        fontSizeValue.textContent = `${draft.fontSize}px`;
        textShadowCheckbox.checked = draft.textShadow || false;
        uploadedImage.src = draft.imageSrc || '';

        updateTextOverlay(topTextInput, topTextOverlay);
        updateTextOverlay(bottomTextInput, bottomTextOverlay);

        alert(`Draft "${selectedDraftTitle}" telah dimuat!`);
    } else {
        alert('Draft tidak ditemukan.');
    }
}

function clearDraft() {
    const selectedDraftTitle = draftList.value;

    if (!selectedDraftTitle) {
        alert('Silakan pilih draft untuk dihapus.');
        return;
    }

    if (localStorage.getItem(`imageEditorDraft_${selectedDraftTitle}`)) {
        localStorage.removeItem(`imageEditorDraft_${selectedDraftTitle}`);
        alert(`Draft "${selectedDraftTitle}" telah dihapus!`);

        populateDraftList();
    } else {
        alert('Draft tidak ditemukan.');
    }
}

saveDraftBtn.addEventListener('click', saveDraft);
loadDraftBtn.addEventListener('click', loadDraft);
clearDraftBtn.addEventListener('click', clearDraft);

window.addEventListener('load', populateDraftList);

topTextInput.addEventListener(
    'input',
    () => updateTextOverlay(topTextInput, topTextOverlay)
);
bottomTextInput.addEventListener(
    'input',
    () => updateTextOverlay(bottomTextInput, bottomTextOverlay)
);

fontSizeSlider.addEventListener('input', function () {
    fontSizeValue.textContent = `${this.value}px`;
    updateTextOverlay(topTextInput, topTextOverlay);
    updateTextOverlay(bottomTextInput, bottomTextOverlay);
});

textShadowCheckbox.addEventListener('change', function () {
    updateTextOverlay(topTextInput, topTextOverlay);
    updateTextOverlay(bottomTextInput, bottomTextOverlay);
});

document
    .getElementById('zoomIn')
    .addEventListener('click', () => {
        currentScale = Math.min(3, currentScale + 0.1);
        updateImageTransform();
    });

document
    .getElementById('zoomOut')
    .addEventListener('click', () => {
        currentScale = Math.max(0.5, currentScale - 0.1);
        updateImageTransform();
    });

document
    .getElementById('moveUp')
    .addEventListener('click', () => {
        currentY += 10;
        updateImageTransform();
    });

document
    .getElementById('moveDown')
    .addEventListener('click', () => {
        currentY -= 10;
        updateImageTransform();
    });

document
    .getElementById('moveLeft')
    .addEventListener('click', () => {
        currentX += 10;
        updateImageTransform();
    });

document
    .getElementById('moveRight')
    .addEventListener('click', () => {
        currentX -= 10;
        updateImageTransform();
    });

document
    .getElementById('resetPosition')
    .addEventListener('click', resetImagePosition);

saveImageBtn.addEventListener('click', function () {
    controls.style.display = 'none';

    html2canvas(imageContainer, {
        scale: 3,
        useCORS: true
    }).then(canvas => {
        controls.style.display = 'grid';

        const resizedCanvas = document.createElement('canvas');
        const ctx = resizedCanvas.getContext('2d');

        resizedCanvas.width = 800;
        resizedCanvas.height = 600;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        const steps = 3;
        let stepCanvas = canvas;

        for (let i = 0; i < steps; i++) {
            const stepWidth = canvas.width * Math.pow(0.8, i + 1);
            const stepHeight = canvas.height * Math.pow(0.8, i + 1);

            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = stepWidth;
            tempCanvas.height = stepHeight;
            const tempCtx = tempCanvas.getContext('2d');

            tempCtx.imageSmoothingEnabled = true;
            tempCtx.imageSmoothingQuality = 'high';
            tempCtx.drawImage(stepCanvas, 0, 0, stepWidth, stepHeight);

            stepCanvas = tempCanvas;
        }

        ctx.drawImage(stepCanvas, 0, 0, resizedCanvas.width, resizedCanvas.height);

        resizedCanvas.toBlob(function (blob) {
            const link = document.createElement('a');
            link.download = 'ICAO-SSRP.png';
            link.href = URL.createObjectURL(blob);
            link.click();
        }, 'image/png');
    });
});
