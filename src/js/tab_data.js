export class PrintData {
    constructor() {
        this.form = document.querySelector(".tab_print_data__form");
        this.texts = document.querySelectorAll(".tab_print_data__text-input");
    }

    printToLog = () => {
        const controls = this.texts;
        this.form.addEventListener("submit", (event) => {
            event.preventDefault();
            controls.forEach(function (e) {
                let data = {
                    class: e.className,
                    id: e.id,
                    value: e.value
                }
                console.log(data);
                e.value = '';
            });
        });
    }
}