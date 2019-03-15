let port = ':4000';
let host = location.host || 'localhost'; //192.168.1.110
let hostAddress = 'http://' + host + port;
let loginAddress = "/auth/login";
let transactionsAddress = "/deadlines";
let userDataAddress = "/users";


window.addEventListener('load', function () {
    //add admin/admin to username/password
    riempiCampi();
    $('#loginButton').on('click', login);
    $('#userDataButton').on('click', getUserData);
    $('#getTransactionsButton').on('click', getTransactions);
    $('#setTransactionButton').on('click', setTransaction);
    $('#deleteTransactionButton').on('click', deleteTransaction);
    //transactionId e transactionType si annullano a vicenda
    $('#transactionIdInputField').on('keypress', function () {
        $('#transactionTypeInputField').val('');
    });
    $('#transactionTypeInputField').on('keypress', function () {
        $('#transactionIdInputField').val('');
    });
});

function riempiCampi() {
    $('#loginForm').children('input[name="username"]').val('admin');
    $('#loginForm').children('input[name="password"]').val('admin');
}

function login() {
    let jsonString = '';
    let formElement = document.getElementById("loginForm");
    let formData = new FormData(formElement);
    jsonString = JSON.stringify(convertFormToJson(formData));

    //Fetch instead of XMLHttpRequest
    let url = hostAddress + loginAddress;

    let loginResponseDiv = $("#loginResponse");

    fetch(url, {
        method: 'post',
        body: jsonString,
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(response => {
            return response.json().then(data => ({
                message: data.message,
                status: response.status,
                token: data.token,
            }));
        })
        .then(response => {
            localStorage.setItem("token", response.token);
            loginResponseDiv.text(() => response.message);
            switch (response.status) {
                case 200:
                    loginResponseDiv.css("border-color", "green");
                    break;
                case 401:
                    loginResponseDiv.css("border-color", "red");
                    break;
                default:
                    loginResponseDiv.css("border-color", "yellow");
                    break;
            }
        })
        .catch(err => {
            loginResponseDiv.text(() => err);
            loginResponseDiv.css("border-color", "red");
        });


    console.log("json sent", jsonString);
}

function getUserData() {
    let getUserDataResponse = $('#userDataResponse');

    let url = hostAddress + userDataAddress + "/" + jwt_decode(localStorage.getItem('token')).userID;

    customFetch({
        url,
        method: 'get',
        useToken: true,
    }).then(response => {
        getUserDataResponse.text(() => JSON.stringify(response.data));
        switch (response.status) {
            case 200 || 201:
                getUserDataResponse.css("border-color", "green");
                break;
            case 401 || 404:
                getUserDataResponse.css("border-color", "red");
                break;
            default:
                getUserDataResponse.css("border-color", "yellow");
                break;
        }
    }).catch(err => {
        getUserDataResponse.text(() => err);
        getUserDataResponse.css("border-color", "red");
    });
}

function getTransactions() {
    let getTransactionsResponseDiv = $("#getTransactionsResponse");

    let transactionTypeForm = document.getElementById('getTransactionsForm');
    let formData = new FormData(transactionTypeForm);

    let decideUrl = '';
    if (formData.get('transactionId') && formData.get('transactionId').length > 0) {
        decideUrl = formData.get('transactionId');
    }
    else {
        let temp = (formData.get('transactionType').length > 0) ?
            '?type=' + formData.get('transactionType') : '';
        decideUrl = 'all' + temp;
    }

    let url = hostAddress + transactionsAddress + "/" + decideUrl;

    customFetch({
        url,
        method: 'get',
        useToken: true,
    }).then(response => {
        getTransactionsResponseDiv.text(() => JSON.stringify(response.data));
        switch (response.status) {
            case 200 || 201:
                getTransactionsResponseDiv.css("border-color", "green");
                break;
            case 401 || 404:
                getTransactionsResponseDiv.css("border-color", "red");
                break;
            default:
                getTransactionsResponseDiv.css("border-color", "yellow");
                break;
        }
    }).catch(err => {
        getTransactionsResponseDiv.text(() => err);
        getTransactionsResponseDiv.css("border-color", "red");
    });
}

function setTransaction() {
    let setTransactionResponse = $("#setTransactionResponse");

    let setTransactionForm = document.getElementById('setTransactionForm');
    let formData = new FormData(setTransactionForm);
    if (formData.get('transactionType').length <= 0) formData.set('transactionType', 'dare');

    let transactionIdUrlParam = (formData.get('transactionId').length > 0) ? formData.get('transactionId') : 'new';
    let url = hostAddress + transactionsAddress + "/" + transactionIdUrlParam;

    customFetch({
        url,
        method: 'put',
        body: JSON.stringify(convertFormToJson(formData)),
        useToken: true,
    })
        .then(response => {
            console.log('response', response);
            setTransactionResponse.text(() => JSON.stringify(response.message));
            switch (response.status) {
                case (201 || 200):
                    setTransactionResponse.css("border-color", "green");
                    break;
                case (400 || 404):
                    setTransactionResponse.css("border-color", "red");
                    break;
                default:
                    setTransactionResponse.css("border-color", "yellow");
                    break;
            }
        }).catch(err => {
            setTransactionResponse.text(() => err);
            setTransactionResponse.css("border-color", "red");
        });
}

function deleteTransaction() {
    let deleteTransactionResponse = $("#deleteTransactionResponse");

    let deleteTransactionForm = document.getElementById('deleteTransactionForm');
    let formData = new FormData(deleteTransactionForm);

    if (!formData.get('transactionId')) return;

    let url = hostAddress + transactionsAddress + "/" + formData.get('transactionId');

    customFetch({
        url,
        method: 'delete',
        body: JSON.stringify(convertFormToJson(formData)),
        useToken: true,
    })
        .then(response => {
            console.log('response', response);
            deleteTransactionResponse.text(() => JSON.stringify(response.message));
            switch (response.status) {
                case (201 || 200):
                    deleteTransactionResponse.css("border-color", "green");
                    break;
                case (400 || 404):
                    deleteTransactionResponse.css("border-color", "red");
                    break;
                default:
                    deleteTransactionResponse.css("border-color", "yellow");
                    break;
            }
        }).catch(err => {
            deleteTransactionResponse.text(() => err);
            deleteTransactionResponse.css("border-color", "red");
        });
}

function convertFormToJson(formData) {
    let object = {};
    formData.forEach(function (value, key) {
        object[key] = value;
    });
    return object;
}

function customFetch({ url, method = 'post', useToken = false, body = null, headers = { "Content-Type": "application/json", } }) {

    if (useToken) {
        let authToken = (localStorage.getItem("token"));
        headers = Object.assign(headers, { 'Authorization': 'Bearer ' + authToken });
    }
    return fetch(url, {
        method,
        body,
        headers,
    })
        .then(response => {
            return response.json()
                .then(jsonResp => ({
                    message: jsonResp.message,
                    data: jsonResp.data,
                    status: response.status,
                }));
        });
}