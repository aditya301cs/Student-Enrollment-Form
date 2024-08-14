const dbName = "SCHOOL-DB";
const relName = "STUDENT-TABLE";
const connToken = "90932104|-31949222274912943|90962111"; // Replace with your actual connection token

$(document).ready(function () {
    resetForm();
});

function saveData() {
    let jsonStrObj = validateFormData();
    if (jsonStrObj === "") {
        return;
    }
    let putRequest = createPUTRequest(connToken, jsonStrObj, dbName, relName);
    jQuery.ajaxSetup({ async: false });
    let resultObj = executeCommandAtGivenBaseUrl(putRequest, "http://api.login2explore.com:5577", "/api/iml");
    jQuery.ajaxSetup({ async: true });
    resetForm();
}

function updateData() {
    let jsonStrObj = validateFormData();
    if (jsonStrObj === "") {
        return;
    }
    let updateRequest = createUPDATERecordRequest(connToken, jsonStrObj, dbName, relName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({ async: false });
    let resultObj = executeCommandAtGivenBaseUrl(updateRequest, "http://api.login2explore.com:5577", "/api/iml");
    jQuery.ajaxSetup({ async: true });
    resetForm();
}

function validateFormData() {
    let rollNo, fullName, className, birthDate, address, enrollmentDate;
    rollNo = $("#rollNo").val();
    fullName = $("#fullName").val();
    className = $("#class").val();
    birthDate = $("#birthDate").val();
    address = $("#address").val();
    enrollmentDate = $("#enrollmentDate").val();
    
    if (rollNo === "" || fullName === "" || className === "" || birthDate === "" || address === "" || enrollmentDate === "") {
        alert("All fields are required");
        return "";
    }

    let jsonStrObj = {
        rollNo: rollNo,
        fullName: fullName,
        class: className,
        birthDate: birthDate,
        address: address,
        enrollmentDate: enrollmentDate
    };
    return JSON.stringify(jsonStrObj);
}

function resetForm() {
    $("#rollNo").val("");
    $("#fullName").val("");
    $("#class").val("");
    $("#birthDate").val("");
    $("#address").val("");
    $("#enrollmentDate").val("");

    $("#rollNo").prop("disabled", false);
    $("#fullName").prop("disabled", true);
    $("#class").prop("disabled", true);
    $("#birthDate").prop("disabled", true);
    $("#address").prop("disabled", true);
    $("#enrollmentDate").prop("disabled", true);

    $("#saveBtn").prop("disabled", true);
    $("#updateBtn").prop("disabled", true);
    $("#resetBtn").prop("disabled", true);

    $("#rollNo").focus();
}

function getRollNoAsJsonObj() {
    let rollNo = $("#rollNo").val();
    let jsonStr = {
        rollNo: rollNo
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    let data = JSON.parse(jsonObj.data).record;
    $("#fullName").val(data.fullName);
    $("#class").val(data.class);
    $("#birthDate").val(data.birthDate);
    $("#address").val(data.address);
    $("#enrollmentDate").val(data.enrollmentDate);
}

function saveRecNo2LS(jsonObj) {
    let lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getRollNo() {
    let rollNoJsonObj = getRollNoAsJsonObj();
    let getRequest = createGET_BY_KEYRequest(connToken, dbName, relName, rollNoJsonObj);
    jQuery.ajaxSetup({ async: false });
    let resultObj = executeCommandAtGivenBaseUrl(getRequest, "http://api.login2explore.com:5577", "/api/irl");
    jQuery.ajaxSetup({ async: true });
    
    if (resultObj.status === 400) {
        $("#fullName").prop("disabled", false);
        $("#class").prop("disabled", false);
        $("#birthDate").prop("disabled", false);
        $("#address").prop("disabled", false);
        $("#enrollmentDate").prop("disabled", false);
        $("#saveBtn").prop("disabled", false);
        $("#resetBtn").prop("disabled", false);
        $("#fullName").focus();
    } else if (resultObj.status === 200) {
        $("#rollNo").prop("disabled", true);
        fillData(resultObj);
        $("#fullName").prop("disabled", false);
        $("#class").prop("disabled", false);
        $("#birthDate").prop("disabled", false);
        $("#address").prop("disabled", false);
        $("#enrollmentDate").prop("disabled", false);
        $("#updateBtn").prop("disabled", false);
        $("#resetBtn").prop("disabled", false);
        $("#fullName").focus();
    }
}

$("#rollNo").on("focusout", function () {
    if ($("#rollNo").val() !== "") {
        getRollNo();
    }
});

$("#saveBtn").on("click", saveData);
$("#updateBtn").on("click", updateData);
$("#resetBtn").on("click", resetForm);