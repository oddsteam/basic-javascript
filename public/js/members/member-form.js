let txtFirstName = document.getElementById('txtFirstName');
let txtLastName = document.getElementById('txtLastName');
let txtEmail = document.getElementById('txtEmail');
let txtZipCode = document.getElementById('txtZipCode');

let btnAdd = document.getElementById('btnAdd');
let btnGetAll = document.getElementById('btnGetAll');

function getData(){
    return {
        firstName : txtFirstName.value,
        lastName: txtLastName.value,
        email: txtEmail.value,
        zipcode: txtZipCode.value
    };
}

function resetData(){
    txtFirstName.value = "";
    txtLastName.value = "";
    txtEmail.value = "";
    txtZipCode.value = "";
}   

let memberForm = {
    firstName : txtFirstName,
    lastName: txtLastName,
    email: txtEmail,
    zipcode: txtZipCode,
    buttonAdd: btnAdd,
    buttonGetAll: btnGetAll,
    getData: getData,
    resetData: resetData
};

export default memberForm ;
//export  { memberForm };