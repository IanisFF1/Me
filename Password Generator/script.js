const passwordInput = document.getElementById("password");
const lengthSlider = document.getElementById("length");
const lengthDisplay = document.getElementById("length-value");
const uppercaseCheckbox = document.getElementById("uppercase");
const lowercaseCheckbox = document.getElementById("lowercase");
const numbersCheckbox = document.getElementById("numbers");
const symbolsCheckbox = document.getElementById("symbols");
const generateButton = document.getElementById("generate-btn");
const copyButton = document.getElementById("copy-btn");
const strengthBar = document.querySelector(".strength-bar");
const strengthText = document.querySelector(".strength-container p");
const strengthLabel = document.getElementById("strength-label");
const popupContainer = document.querySelector(".popup-no-chars");
const eyeIcon = document.getElementById("visible");
const siteField = document.getElementById("site-name");
const passwordField = document.getElementById("encrypted-password");
const enterSaveContainer = document.getElementById("enter-save-container");
const exitSaveContainer = document.getElementById("exit-save-container");
const saveContainer = document.querySelector(".save-container");
const container = document.querySelector(".container");
const saveContainerIcon = document.getElementById("enter-save-container-icon");
const enterListContainer = document.getElementById("enter-list-container");
const listContainer = document.querySelector(".password-list-container");
const exitListContainer = document.getElementById("exit-list-container");
const savePasswordButton = document.getElementById("save-btn");
const masterField = document.getElementById("master-key");
const confirmMasterField = document.getElementById("confirm-master");
const confirmMasterContainer = document.querySelector( ".confirm-master-container");
const masterLabel = document.getElementById("master-key-label");
const saveCheckbox = document.getElementById("session-save");
const saveCheckboxContainer = document.querySelector(".save-checkbox-container");
const enterListButton = document.getElementById("enter-btn");
const authScreen = document.querySelector(".auth-screen");
const listScreen = document.querySelector(".list-screen");
const listKeyField = document.getElementById("key-for-list");
const saveCheckboxList = document.getElementById("list-show");

const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
const numberCharacters = "0123456789";
const symbolCharacters = "!@#$%^&*()_+{}[];:',<>.?";

lengthSlider.addEventListener("input", () => {
  lengthDisplay.textContent = lengthSlider.value;
});

generateButton.addEventListener("click", makePassword);

function makePassword() {
  const length = Number(lengthSlider.value);
  const includeUppercase = uppercaseCheckbox.checked;
  const includeLowercase = lowercaseCheckbox.checked;
  const includeNumbers = numbersCheckbox.checked;
  const includeSymbols = symbolsCheckbox.checked;

  if (
    !includeUppercase &&
    !includeLowercase &&
    !includeNumbers &&
    !includeSymbols
  ) {
    //alert("Please select at least one char type.")
    popupContainer.classList.toggle("show");
    return;
  }

  popupContainer.classList.remove("show");

  const newPassword = createRandomPassword(
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
  );
  passwordInput.value = newPassword;
  updateStrengthMeter(newPassword);
}

function updateStrengthMeter(password) {
  const passwordLength = password.length;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[!@#$%^&*()_+{}[\];:',<>.?]/.test(password);

  let strengthScore = 0;

  strengthScore += Math.min(passwordLength * 2, 40);

  if (hasUppercase) strengthScore += 15;
  if (hasLowercase) strengthScore += 15;
  if (hasNumbers) strengthScore += 15;
  if (hasSymbols) strengthScore += 15;

  if (passwordLength < 8) {
    strengthScore = Math.min(strengthScore, 40);
  }

  const safeScore = Math.max(5, Math.min(100, strengthScore));
  strengthBar.style.width = safeScore + "%";

  let strengthLabelText = "";
  let barColor = "";

  if (strengthScore < 40) {
    strengthLabelText = "Weak";
    barColor = "#fc8181";
  } else if (strengthScore < 70) {
    strengthLabelText = "Medium";
    barColor = "#fbd38d";
  } else {
    strengthLabelText = "Strong";
    barColor = "#68d391";
  }

  strengthBar.style.backgroundColor = barColor;
  strengthLabel.textContent = strengthLabelText;
}

function createRandomPassword(
  length,
  includeUppercase,
  includeLowercase,
  includeNumbers,
  includeSymbols,
) {
  let allCharacters = "";

  if (includeUppercase) allCharacters += uppercaseLetters;
  if (includeLowercase) allCharacters += lowercaseLetters;
  if (includeNumbers) allCharacters += numberCharacters;
  if (includeSymbols) allCharacters += symbolCharacters;

  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allCharacters.length);
    password += allCharacters[randomIndex];
  }

  return password;
}

window.addEventListener("DOMContentLoaded", makePassword);

copyButton.addEventListener("click", () => {
  if (!passwordInput.value) return;

  navigator.clipboard
    .writeText(passwordInput.value)
    .then(() => showCopySuccess())
    .catch(() => console.log("Could not copy.", error));
});

function showCopySuccess() {
  copyButton.classList.remove("far", "fa-copy");
  copyButton.classList.add("fas", "fa-check");
  copyButton.style.color = "#48bb78";

  setTimeout(() => {
    copyButton.classList.remove("fas", "fa-check");
    copyButton.classList.add("far", "fa-copy");
    copyButton.style.color = "";
  }, 2500);
}

eyeIcon.addEventListener("click", () => {
  if (passwordField.type === "password") {
    passwordField.type = "text";
  } else {
    passwordField.type = "password";
  }
});

enterSaveContainer.addEventListener("click", openSaveContainer);

function openSaveContainer() {
  closeListContainer();
  isVaultCreated("vault");
  saveContainer.style.transform = "translateX(250%)";
  container.style = "opacity: 0.6";
  container.style.transform = "translateX(100%) scale(0.7)";
  container.style.pointerEvents = "none";
  saveContainerIcon.style.transform = "rotate(225deg)";
  siteField.value = "";
  passwordField.value = "";
  masterField.value = "";
  confirmMasterField.value = "";
  enterSaveContainer.removeEventListener("click", openSaveContainer);
  enterSaveContainer.addEventListener("click", closeSaveContainer);
}

exitSaveContainer.addEventListener("click", closeSaveContainer);

function closeSaveContainer() {
  saveContainer.style.transform = "translateX(0)";
  container.style.transform = "translateX(0) scale(1)";
  container.style = "opacity: 1";
  container.style.pointerEvents = "all";
  saveContainerIcon.style.transform = "rotate(0)";
  enterSaveContainer.removeEventListener("click", closeSaveContainer);
  enterSaveContainer.addEventListener("click", openSaveContainer);
}

enterListContainer.addEventListener("click", openListContainer);

function openListContainer() {
  closeSaveContainer();
  renderVault();
  listContainer.style.transform = "translateX(-225%)";
  container.style = "opacity: 0.6";
  container.style.transform = "translateX(-100%) scale(0.7)";
  container.style.pointerEvents = "none";
  enterListContainer.removeEventListener("click", openListContainer);
  enterListContainer.addEventListener("click", closeListContainer);
}

exitListContainer.addEventListener("click", closeListContainer);

function closeListContainer() {
  listContainer.style.transform = "translateX(0)";
  container.style.transform = "translateX(0) scale(1)";
  container.style = "opacity: 1";
  container.style.pointerEvents = "all";
  enterListContainer.removeEventListener("click", closeListContainer);
  enterListContainer.addEventListener("click", openListContainer);

  if (!saveCheckboxList.checked) {
    transitionToAuthView();
  }
}

savePasswordButton.addEventListener("click", savePassword);

masterField.addEventListener("focus", () => {
  masterField.classList.remove("error-border");
});

confirmMasterField.addEventListener("focus", () => {
  confirmMasterField.classList.remove("error-border");
});

listKeyField.addEventListener("focus", () => {
  listKeyField.classList.remove("error-border");
});

function transitionToListView() {
    renderVault();
    
    // 1. Pregătim dispariția ecranului de login
    authScreen.style.opacity = "0";
    authScreen.style.transform = "scale(0.7)";

    setTimeout(() => {
        authScreen.style.display = "none";

        // 2. RESETĂM listScreen la valorile de START chiar înainte de a-l afișa
        // Asta forțează browserul să aibă un punct de plecare (0 -> 1)
        listScreen.style.opacity = "0";
        listScreen.style.transform = "translateY(30px)";
        listScreen.style.display = "flex";

        // 3. O mică pauză (micro-task) pentru ca browserul să proceseze display: flex
        setTimeout(() => {
            listScreen.style.opacity = "1";
            listScreen.style.transform = "translateY(0)";
        }, 50); // 50ms sunt suficiente pentru a declanșa tranzitia de fiecare dată

    }, 800);
}

function transitionToAuthView() {
  listScreen.style.opacity = "0";
  listScreen.style.transform = "translateY(30px)";

  setTimeout(() => {
    authScreen.style.display = "block";
    authScreen.style.opacity = "1";
    authScreen.style.transform = "scale(1)";
    listScreen.style.display = "none";
  }, 1000);

  listKeyField.value = "";
}

function renderVault() {
  let decryptedData = decryptVault();

  console.log("Date decriptate:", decryptedData);

  listScreen.innerHTML = "";

  if (decryptedData.length === 0) {
    listScreen.innerHTML = `
            <p id="no-passwords-saved-message">No passwords saved yet, thus no vault has been created. 
                Generate and save your first password and you will be able to see it in your vault here.
            </p>
        `;

    return;
  }

  const ul = document.createElement("ul");
  ul.className = "vault-list";

  decryptedData.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "vault-row";

    li.innerHTML = `
            <span title="${item.site}">${item.site}</span>
            <input type="password" readonly value="${item.pass}">
            <i class="fa-solid fa-eye show-pass" title="Show Password"></i>
            <i class="far fa-copy copy-pass" title="Copy to Clipboard"></i>
            <i class="fa-solid fa-trash delete-pass" title="Delete from Vault"></i>
        `;

    const listInput = li.querySelector("input");
    const eyeIconFromList = li.querySelector(".show-pass");
    const copyBtnFromList = li.querySelector(".copy-pass");
    const deleteBtnFromList = li.querySelector(".delete-pass");

    eyeIconFromList.addEventListener("click", () => {
      if (listInput.type === "password") {
        listInput.type = "text";
        eyeIconFromList.classList.replace("fa-eye", "fa-eye-slash");
      } else {
        listInput.type = "password";
        eyeIconFromList.classList.replace("fa-eye-slash", "fa-eye");
      }
    });

    copyBtnFromList.addEventListener("click", () => {
      navigator.clipboard.writeText(listInput.value);

      copyBtnFromList.classList.replace("far", "fas");
      setTimeout(() => {
        copyBtnFromList.classList.replace("fas", "far");
      }, 1300);
    });

    deleteBtnFromList.addEventListener("click", () => {
        showDeleteModal(item.site, index);
    });

    ul.appendChild(li);
  });

  listScreen.appendChild(ul);
}

enterListButton.addEventListener("click", enterListScreen);

function enterListScreen() {
  const key_from_input = listKeyField.value.trim();
  const vault_check = localStorage.getItem("vault_check");

  if (key_from_input === "") {
    listKeyField.placeholder = "Missing key!";
    listKeyField.classList.add("error-border");
    return;
  }

  if (!vault_check) {
    transitionToListView();
    return;
  }

  let bytes = CryptoJS.AES.decrypt(vault_check, key_from_input);
  let decryptedCheck = bytes.toString(CryptoJS.enc.Utf8);

  if (decryptedCheck !== "UCraiova") {
    listKeyField.value = "";
    listKeyField.placeholder = "Wrong key!";
    listKeyField.classList.add("error-border");
    return;
  }

  if (saveCheckboxList.checked) {
    sessionStorage.setItem("master-key", key_from_input);
  }

  transitionToListView();
}

function savePassword() {
  const siteName = siteField.value.trim();
  const password = passwordField.value.trim();
  const master = masterField.value.trim();
  const confirmMaster = confirmMasterField.value.trim();

  let finalKey = "";

  let current_vault = localStorage.getItem("vault");
  if (current_vault === null) {
    if (master !== confirmMaster) {
      masterField.value = "";
      confirmMasterField.value = "";
      masterField.placeholder = "Keys don't match!";
      confirmMasterField.placeholder = "Keys don't match!";
      masterField.classList.add("error-border");
      confirmMasterField.classList.add("error-border");
      return;
    }

    finalKey = master;

    if (saveCheckbox.checked) {
      sessionStorage.setItem("master-key", master);
    }
    let encryptedCheck = CryptoJS.AES.encrypt("UCraiova", master).toString();
    localStorage.setItem("vault_check", encryptedCheck);

    var list = [];
  } else {
    let keyInSession = sessionStorage.getItem("master-key");
    let vault_check = localStorage.getItem("vault_check");
    let decryptedControl = "";

    if (master !== "") {
      try {
        let bytes = CryptoJS.AES.decrypt(vault_check, master);
        decryptedControl = bytes.toString(CryptoJS.enc.Utf8);
      } catch (e) {
        decryptedControl = "";
      }
    }

    if (!keyInSession && decryptedControl !== "UCraiova") {
      masterField.value = "";
      masterField.placeholder = "Wrong or Missing Key!";
      masterField.classList.add("error-border");
      return;
    }

    finalKey = keyInSession || master;

    if (saveCheckbox.checked) {
      sessionStorage.setItem("master-key", finalKey);
    }
    confirmMasterContainer.classList.add("hidden");
    var list = JSON.parse(current_vault);
  }

  let encryptedPassword = CryptoJS.AES.encrypt(password, finalKey).toString();

  let currentItem = {
    site: siteName,
    pass: encryptedPassword,
  };

  list.push(currentItem);
  console.log(list);
  let textToStore = JSON.stringify(list);
  localStorage.setItem("vault", textToStore);
}

function isVaultCreated(vaultName) {
  let test = localStorage.getItem(vaultName);
  if (test === null) {
    confirmMasterContainer.classList.remove("hidden");
    saveCheckboxContainer.classList.remove("hidden");
    masterField.classList.remove("hidden");
    masterLabel.classList.remove("hidden");
    return false;
  }
  confirmMasterContainer.classList.add("hidden");
  if (saveCheckbox.checked && sessionStorage.getItem("master-key")) {
    saveCheckboxContainer.classList.add("hidden");
    masterField.classList.add("hidden");
    masterLabel.classList.add("hidden");
  }

  return true;
}

function decryptVault() {
  let key = sessionStorage.getItem("master-key") || masterField.value.trim() || listKeyField.value.trim();
  let storedData = localStorage.getItem("vault");

  if (!storedData) {
    return [];
  }

  let encryptedList = JSON.parse(storedData);
  let cleanList = [];

  encryptedList.forEach((item) => {
    try {
      let bytes = CryptoJS.AES.decrypt(item.pass, key);
      let originalPass = bytes.toString(CryptoJS.enc.Utf8);

      if (originalPass) {
        cleanList.push({
          site: item.site,
          pass: originalPass,
        });
      }
    } catch (e) {
      console.error("Error decrypting a pass.", e);
    }
  });

  return cleanList;
}

let indexToDelete = null;

function showDeleteModal(site, index) {
    indexToDelete = index;
    document.getElementById("modal-site-name").textContent = site;
    
    const modal = document.querySelector(".modal-content");

    setTimeout(() => {
        modal.style.transform = "translateX(0)";
        modal.style.opacity = "1";
    }, 500);

}

document.getElementById("cancel-delete").addEventListener("click", () => {
    const modal = document.querySelector(".modal-content");
    setTimeout(() => {
        modal.style.opacity = "0";
        modal.style.transform = "translateX(-5px)";
    }, 500);
});

document.getElementById("confirm-delete").addEventListener("click", () => {
    if (indexToDelete !== null) {
        let rawVault = JSON.parse(localStorage.getItem("vault"));
        rawVault.splice(indexToDelete, 1);
        localStorage.setItem("vault", JSON.stringify(rawVault));
        
        document.getElementById("cancel-delete").click();
        renderVault();
    }
});
