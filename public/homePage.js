"use strict";

//Выход из личного кабинета
const logoutButton = new LogoutButton();
logoutButton.action = () => {
    ApiConnector.logout(response => {
        if (response.success) {
            location.reload();
        }
    });
}

//Получение информации о пользователе
ApiConnector.current(response => {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
    }
});

//Получение текущих курсов валюты
const ratesBoard = new RatesBoard();

function refreshCurrencies() {
    ApiConnector.getStocks(response => {
        if (response.success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data);
        }
    });
};
refreshCurrencies();
let intervalCurrencies = setInterval(() => refreshCurrencies(), 20000);

//Операции с деньгами
const moneyManager = new MoneyManager();
moneyManager.addMoneyCallback = data => {
    ApiConnector.addMoney(data, response => {
        let message = '';
        if (response.success) {
            message = `Счёт успешно пополнен на ${data.amount} ${data.currency}`;
            ProfileWidget.showProfile(response.data);
        } else {
            message = "Укажите сумму и валюту для пополнения";
        }
        moneyManager.setMessage(response.success, message);
    });
}

moneyManager.conversionMoneyCallback = data => {
    ApiConnector.convertMoney(data, response => {
        let message = '';
        if (response.success) {
            message = `${data.fromAmount} ${data.fromCurrency} успешно сконвертированы в ${data.targetCurrency}`;
            ProfileWidget.showProfile(response.data);
        } else {
            message = "Укажите сумму и валюты назначения";
        }
        moneyManager.setMessage(response.success, message);
    });
}

moneyManager.sendMoneyCallback = data => {
    ApiConnector.transferMoney(data, response => {
        let message = '';
        if (response.success) {
            message = `${data.amount} ${data.currency} успешно переведены пользователю с ID ${data.to}`;
            ProfileWidget.showProfile(response.data);
        } else {
            message = "Укажите сумму, валюту и адресата перевода";
        }
        moneyManager.setMessage(response.success, message);
    });
}

//Работа с избранным
const favoritesWidget = new FavoritesWidget();
ApiConnector.getFavorites(response => {
    if (response.success) {
        updateFavoriresTable(response);
    }
});

favoritesWidget.addUserCallback = data => {
    ApiConnector.addUserToFavorites(data, response => {
        let message = '';
        if (response.success) {
            message = `Пользователь ${data.name} добавлен в адресную книгу` ;
            updateFavoriresTable(response);
        } else {
            message = "Укажите имя и числовое ID пользователя";
        }
        favoritesWidget.setMessage(response.success, message);
    });    
}

favoritesWidget.removeUserCallback = data => {
    ApiConnector.removeUserFromFavorites(data, response => {
        let message = '';
        if (response.success) {
            message = `Пользователь c ID ${data} удалён` ;
/*            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);*/
            updateFavoriresTable(response);
        } else {
            message = "Такого пользователя не существует";
        }
        favoritesWidget.setMessage(response.success, message);
    });    
}

function updateFavoriresTable(response) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
}