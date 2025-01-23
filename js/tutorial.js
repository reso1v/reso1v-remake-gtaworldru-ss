$(document).ready(function() {
    const tour = new Shepherd.Tour({
        useModalOverlay: true,
        defaultStepOptions: {
            classes: 'shepherd-theme-custom',
            scrollTo: false,
            cancelIcon: {
                enabled: true
            },
            modalOverlayOpeningPadding: 8,
            modalOverlayOpeningRadius: 8,
            when: {
                show: () => {
                    const element = document.querySelector('.shepherd-element');
                    if (element) {
                        element.style.opacity = '0';
                        setTimeout(() => {
                            element.style.opacity = '1';
                        }, 100);
                    }
                }
            }
        }
    });

    tour.addStep({
        id: 'welcome',
        text: `<div class="tutorial-step">
                 <h3 class="tutorial-title">Как использовать инструмент</h3>
                 <p>Привет! Быстро расскажем об инструменте чуть детальнее, чтобы освоиться было значительно проще и дополнительно — начать работу с ним значительно быстрее.</p>
                <p>Начнём. Нажми «Начать», чтобы продолжить или «Закрыть», чтобы покинуть меню обучения.</p>
                 </div>`,
        buttons: [
            {
                text: 'Закрыть',
                action: tour.cancel,
                classes: 'shepherd-button-secondary'
            },
            {
                text: 'Начать',
                action: tour.next
            }
        ]
    });

    const steps = [
        {
            id: 'font-size',
            element: 'input[name="font-label"]',
            title: 'Размер шрифта',
            text: 'Для того, чтобы СС получилась неплохой — лучше постараться подобрать размер шрифта. От него зависит: насколько четким будет отображение текста и каков будет внешний вид у текста.',
            attachTo: {
                element: 'input[name="font-label"]',
                on: 'bottom'
            }
        },
        {
            id: 'line-height',
            element: 'input[name="line-height"]',
            title: 'Межстрочный интервал',
            text: 'Часто бывает такое, что при создании СС строки накладываются друг на друга и читать содержимое становится значительно сложнее. Можешь воспользоваться динамичной настройкой межстрочного интервала, чтобы обойти этот казус.',
            attachTo: {
                element: 'input[name="line-height"]',
                on: 'bottom'
            }
        },
        {
            id: 'font-family',
            element: '#font-family',
            title: 'Шрифты',
            text: 'Можешь выбрать интересующий тебя шрифт из списка. Все представленные шрифты есть на самом сервере по команде /font.',
            attachTo: {
                element: '#font-family',
                on: 'bottom'
            }
        },
        {
            id: 'info-button',
            element: '#infoButton',
            title: 'Дисклеймер',
            text: 'Мы не стремимся говорить, что инструмент полностью принадлежит одному человеку — ни в коем случае, ведь это не так. По этой кнопке есть ссылки на авторов прошлых версий.',
            attachTo: {
                element: '#infoButton',
                on: 'bottom'
            }
        },
        {
            id: 'textarea',
            element: '.textarea-input',
            title: 'Поле для ввода текста',
            text: 'Сюда необходимо прописать текст из консоли RAGE, чтобы тот появился в предпросмотре.',
            attachTo: {
                element: '.textarea-input',
                on: 'bottom'
            }
        },
        {
            id: 'background-style',
            element: '.background-style-selector',
            title: 'Стиль фона картинки',
            text: 'Фоновое изображение, при желании, может отличаться: картинка может скачаться как с красным, зеленом фоном или даже вовсе без него. Во всех случаях формат единый — PNG.',
            attachTo: {
                element: '.background-style-selector',
                on: 'bottom'
            }
        },
        {
            id: 'resolution',
            element: '.resolution-selector',
            title: 'Разрешение изображения',
            text: 'Всё просто: чем выше разрешение изображения, тем чётче будет картинка. Рекомендуется использовать параметры в зависимости от разрешения вашего монитора.',
            attachTo: {
                element: '.resolution-selector',
                on: 'bottom'
            }
        },
        {
            id: 'download',
            element: '#downloadOutputTransparent',
            title: 'Скачивание',
            text: 'Как только всё будет готово — нажми на эту кнопку, чтобы скачать получившуюся картинку.',
            attachTo: {
                element: '#downloadOutputTransparent',
                on: 'bottom'
            }
        },
        {
            id: 'preview',
            element: '#output',
            title: 'Предпросмотр',
            text: 'Тут отображается текст, каким он будет скачан.',
            attachTo: {
                element: '#output',
                on: 'top'
            }
        }
    ];

    steps.forEach(step => {
        tour.addStep({
            id: step.id,
            attachTo: {
                element: step.element,
                on: 'top' // Всегда сверху, так как окно будет внизу
            },
            text: `<div class="tutorial-step">
                     <h3 class="tutorial-title">${step.title}</h3>
                     <p>${step.text}</p>
                   </div>`,
            buttons: [
                {
                    text: 'Назад',
                    action: tour.back,
                    classes: 'shepherd-button-secondary'
                },
                {
                    text: 'Далее',
                    action: tour.next
                }
            ]
        });
    });

    $('#tutorialButton').click(function() {
        tour.start();
    });
});
