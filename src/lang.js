export const lang = {
    // Common
    appTitle: 'Business app',
    closePromptText: 'Закрыть',
    rejectPromptText: 'Отмена',
    yesPromptText: 'Да',
    deletePromptText: 'Удалить',
    saveText: 'Сохранить',
    findText: 'Найти',
    checkAll: 'Все',
    loading: 'Загрузка...',
    entranceText: 'Войти',

    // NavBar
    entrance: 'Вход',
    exit: 'Выход',
    products: 'Каталог',
    orders: 'Заказы',
    tasks: 'Задачи',
    contacts: 'Контакты',
    statistics: 'Статистика',

    // Auth
    inputEmailLabel: 'Email',
    inputEmailErrorMsg: 'Введите корректный email',
    inputPasswordLabel: 'Пароль',
    inputPasswordHelpText: 'Пароль должен содержать минимум 6 символов',
    inputPasswordErrorMsg: 'Введите корректный пароль',
    signIn: 'Войти',
    signInError: 'Неверный логин или пароль!',
    signUp: 'Зарегистрироваться',

    // Public
    noProductsForOrder: 'Владелец еще не добавил ни одного продукта',
    cart: 'Корзина',
    addToCart: 'В корзину',
    productsInCart: 'В корзине ',
    makeOrder: 'Заказать',

    // Profile
    profile: {
        email: 'Email',
        newEmail: 'Новый email',
        login: 'Логин',
        phoneNumber: 'Номер телефона',
        publicUrl: 'Публичная ссылка на аккаунт',
        publicUrlSub: 'По ссылке для всех пользователей будет доступ к каталогу и созданию заказа' +
            '\nЗаполните ник, фото профиля и информацию для пользователей, так будет легче узнать вашу страницу',
        useMyTaxOption: 'Интеграция с «Мой налог»',
        newPassword: 'Новый пароль',
        password: 'Пароль',
        name: 'Имя пользователя',
        photo: 'Фото профиля',
        helpText: 'Информация для пользователей',
        helpTextPlaceholder: 'Инструкция как с вами связаться, краткие указания к оформлению заказа или другая важная информация',
    },
    resetPassword: 'Сбросить пароль',
    resetPasswordTitle: 'Сброс пароля',
    resetPasswordInfo: 'На вашу почту отправлена инструкция по сбросу пароля.',
    changePassword: 'Изменить пароль',
    changePasswordHelpText: 'Для изменения пароля необходимо ввести свои прежние учетные данные',
    changeEmailHelpText: 'Для изменения адреса email необходимо ввести свои прежние учетные данные',
    successSaveUserData: 'Учетные данные сохранены',
    errorSaveUserData: 'Не удалось сохранить учетные данные',
    deleteAccount: 'Удалить аккаунт',
    deleteAccountTitle: 'Удаление аккаунта',
    deleteAccountPrompt: 'Вы действительно хотите удалить аккаунт? Восстановить данные будет невозможно.',
    errorDeleteAccount: 'Не удалось удалить аккаунт',
    deletePhoto: 'Удаление фото профиля',
    deletePhotoPrompt: 'Вы действительно хотите удалить фото профиля?',

    loginToMyTax: 'Вход в аккаунт приложения "Мой налог"',
    loginToMyTaxHelp: 'Введите учетные данные своего аккаунта приложения "Мой налог", чтобы автоматичнски отправлять данные о выполненных заказах и получать чеки.',
    incomeName: 'Наименование товара/услуги для "Мой налог"',
    incomeNameShort: 'Наименование товара/услуги',
    incomeNameHelp: 'Номер для каждой продажи будет подставлен автоматически в соответствии с номером заказа',
    incomeNamePlaceholder: 'Предоставление информационных услуг',
    addIncomeName: 'Добавьте наименование товара/услуги для создания новых продаж',

    // Products
    noProductsWithThisFilters: 'Нет продуктов, удовлетворяющих условиям поиска',
    noProducts: 'Нет добавленных продуктов',
    categories: 'Категории',
    addCategory: 'Добавить категорию',
    addProduct: 'Добавить продукт',
    showProductsWithBadge: 'С наклейкой',
    sorting: {
        default: 'По добавлению',
        edit: 'По изменению',
        AZ: 'От А до Я',
        ZA: 'От Я до А',
    },
    noCategory: 'Без категории',
    editProduct: 'Изменение продукта',
    imagesEditHint: 'Выбор новых изображений заменит старые',
    imagesHint: 'Допустимые форматы: png, svg, jpg, jpeg',
    removeImages: 'Удалить все изображения',
    createProduct: 'Добавление продукта',
    errorCreateProduct: 'Сохранить продукт не удалось',
    successCreateProduct: 'Продукт сохранен',
    deleteProduct: 'Удаление продукта',
    errorDeleteProduct: 'Удалить продукт не удалось',
    successDeleteProduct: 'Продукт удален',

    createCategory: 'Добавление категории',
    errorCreateCategory: 'Сохранить категорию не удалось',
    successCreateCategory: 'Категория сохранена',
    deleteCategory: 'Удаление категории',
    errorDeleteCategory: 'Удалить категорию не удалось',
    successDeleteCategory: 'Категория удалена',

    category: {
        name: 'Название',
    },
    product: {
        name: 'Название',
        category: 'Категория',
        description: 'Описание',
        price: 'Стоимость',
        image: 'Изображение',
        badge: 'Наклейка',
        options: 'Дополнительные параметры',
        value: 'Значение'
    },

    addOption: 'Добавить опцию',

    badge: {
      limit: 'Осталось мало',
      new: 'Новинка',
      no: 'Нет в наличи'
    },


    // Contacts
    noContacts: 'Нет добавленных контактов',
    addContact: 'Добавить контакт',
    createContact: 'Добавление контакта',
    errorCreateContact: 'Сохранить контакт не удалось',
    successCreateContact: 'Контакт сохранен',
    deleteContact: 'Удаление контакта',
    errorDeleteContact: 'Удалить контакт не удалось',
    successDeleteContact: 'Контакт удален',
    contact: {
      name: 'Имя',
      phone: 'Номер',
      description: 'Описание',
    },

    // Tasks
    noTasks: 'Нет добавленных задач',
    addTask: 'Добавить задачу',
    errorCreateTask: 'Сохранить задачу не удалось',
    successCreateTask: 'Задача сохранена',
    deleteTask: 'Удаление задачи',
    errorDeleteTask: 'Удалить задачу не удалось',
    successDeleteTask: 'Задача удалена',

    // Orders
    noOrdersWithThisFilters: 'Нет заказов, удовлетворяющих условиям поиска',
    noOrders: 'Нет добавленных заказов',
    addOrder: 'Добавить заказ',
    editOrder: 'Изменение заказа',
    createOrder: 'Добавление заказа',
    errorCreateOrder: 'Сохранить заказ не удалось',
    successCreateOrder: 'Заказ сохранен',
    deleteOrder: 'Удаление заказа',
    errorDeleteOrder: 'Удалить заказ не удалось',
    successDeleteOrder: 'Заказ удален',
    findOrder: 'Найти заказ',
    findProduct: 'Найти продукт',
    noProductsInOrder: 'Добавьте продукты в заказ',
    orderStatus: {
        1: 'Создан',
        2: 'Ожидает оплаты',
        3: 'Оплачен',
        4: 'В работе',
        5: 'Отправлен',
        6: 'Завершен',
        7: 'Отменен',
    },
    orderStatusColors: {
        1: 'info',
        2: 'warning',
        3: 'secondary',
        4: 'secondary',
        5: 'secondary',
        6: 'success',
        7: 'danger',
    },
    order: {
        client: 'Заказчик',
        products: 'Состав заказа',
        amount: 'Стоимость',
        description: 'Описание',
        orderNumber: 'Номер заказа',
        status: 'Статус',
        deliveryPlace: 'Доставка',
        pickup: 'Самовывоз',
        date: 'Дата',
        country: 'Страна',
        city: 'Город / населенный пункт',
        address: 'Адрес',
        orderForEntity: 'Заказ для юридического лица или ИП',
        inn: 'ИНН',
        entityPlaceholder: 'Юридическое название',
        receipt: 'Чек'
    },
    russia: 'Россия',
    errorInn: 'ИНН для ЮЛ содержит 10 цифр, для ИП - 12',
}