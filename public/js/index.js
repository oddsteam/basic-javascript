import { Members } from "./members/index.js";

import { helloMyJs } from "./myjs.js";


let tbodyMembers = document.getElementById('tbodyMembers');

function renderTable() {
    let members = Members.data;
    tbodyMembers.innerHTML = "";

    for (let idx = 0; idx < members.length; idx++) {
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${members[idx].id}</td>
            <td>${members[idx].firstName}</td>
            <td>${members[idx].lastName}</td>
            <td>${members[idx].email}</td>
            <td>${members[idx].zipcode}</td>
            <td><button id="btnDel${members[idx].id}" type="button" class="btn btn-danger">Del</button></td>
        `;
        let btnDel = tr.querySelector(`#btnDel${members[idx].id}`);
        btnDel.addEventListener('click', async function () {
            console.log(`Delete member with id: ${members[idx].id}`);
            await Members.service.delete(members[idx].id);
            Members.data = await Members.service.getlist();
            renderTable();
        });
        tbodyMembers.appendChild(tr);
    }
}

async function reloadTable() {
    Members.data = await Members.service.getlist();
    renderTable();
}

async function main() {

    helloMyJs();

    reloadTable();

    Members.form.buttonAdd.addEventListener('click', async function () {
        console.log(Members.form.getData());
        let _member = Members.form.getData();
        Members.service.add(_member);
        Members.data = await Members.service.getlist();
        Members.form.resetData();
        reloadTable();
    });

    Members.form.buttonGetAll.addEventListener('click', async function () {
        Members.data = await Members.service.getlist();
        renderTable();
    });

};

document.addEventListener('DOMContentLoaded', async () => {
    const provinceSelect = document.getElementById('provinceSelect');
    const amphoeSelect = document.getElementById('amphoeSelect');
    const tambonSelect = document.getElementById('tambonSelect');
    const zipcodeSelect = document.getElementById('zipcodeSelect');
    const txtZipCode = document.getElementById('txtZipCode');

    async function fetchProvinces() {
        const response = await fetch('https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json');
        const provinces = await response.json();
        return provinces.filter(province => province.id <= 77);
    }

    async function populateProvinces() {
        const provinces = await fetchProvinces();
        const defaultOption = '<option value="" disabled selected>Select a province</option>';
        const provinceOptions = provinces.map(province =>
            `<option value="${province.id}">${province.name_th} (${province.name_en})</option>`
        ).join('');
        provinceSelect.innerHTML = defaultOption + provinceOptions;
    }

    async function populateAmphoe(provinceId) {
        const provinces = await fetchProvinces();
        const selectedProvince = provinces.find(province => province.id == provinceId);
        if (selectedProvince) {
            const defaultOption = '<option value="" disabled selected>Select an amphoe</option>';
            const amphoeOptions = selectedProvince.amphure.map(amphoe =>
                `<option value="${amphoe.id}">${amphoe.name_th}</option>`
            ).join('');
            amphoeSelect.innerHTML = defaultOption + amphoeOptions;
            amphoeSelect.disabled = false;
            tambonSelect.innerHTML = '';
            tambonSelect.disabled = true;
            zipcodeSelect.innerHTML = '';
            zipcodeSelect.disabled = true;
        }
    }

    async function populateTambon(amphoeId) {
        const provinces = await fetchProvinces();
        const selectedProvince = provinces.find(province => province.id == provinceSelect.value);
        const selectedAmphoe = selectedProvince.amphure.find(amphoe => amphoe.id == amphoeId);
        if (selectedAmphoe) {
            const defaultOption = '<option value="" disabled selected>Select a tambon</option>';
            const tambonOptions = selectedAmphoe.tambon.map(tambon =>
                `<option value="${tambon.zip_code}">${tambon.name_th}</option>`
            ).join('');
            tambonSelect.innerHTML = defaultOption + tambonOptions;
            tambonSelect.disabled = false;
            zipcodeSelect.innerHTML = '';
            zipcodeSelect.disabled = true;
        }
    }

    function showZipcode(tambonZipCode) {
        zipcodeSelect.innerHTML = `<option value="${tambonZipCode}">${tambonZipCode}</option>`;
        zipcodeSelect.disabled = true;
    }

    provinceSelect.addEventListener('change', () => {
        populateAmphoe(provinceSelect.value);
    });

    amphoeSelect.addEventListener('change', () => {
        populateTambon(amphoeSelect.value);
    });

    tambonSelect.addEventListener('change', () => {
        showZipcode(tambonSelect.value);
    });

    document.getElementById('saveZipCode').addEventListener('click', function () {
        const selectedZipCode = zipcodeSelect.options[zipcodeSelect.selectedIndex].value;
        txtZipCode.value = selectedZipCode;
        const zipToolModal = bootstrap.Modal.getInstance(document.getElementById('zipToolModal'));
        zipToolModal.hide();
    });

    document.getElementById('btnAdd').addEventListener('click', function () {
        // Reset the modal and input fields
        provinceSelect.selectedIndex = 0; // Reset to default option
        amphoeSelect.selectedIndex = 0; // Reset to default option
        tambonSelect.selectedIndex = 0; // Reset to default option
        zipcodeSelect.selectedIndex = 0; // Reset to default option

        // Clear values and disable fields
        amphoeSelect.disabled = true;
        tambonSelect.disabled = true;
        zipcodeSelect.disabled = true;
        txtZipCode.value = '';

        // Optionally, hide the modal if it's open
        const zipToolModal = bootstrap.Modal.getInstance(document.getElementById('zipToolModal'));
        if (zipToolModal) {
            zipToolModal.hide();
        }
    });

    populateProvinces();
});




main();

