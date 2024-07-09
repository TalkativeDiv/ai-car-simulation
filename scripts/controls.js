class Controls {
    constructor(type) {
        this.forward = false;
        this.left = false;
        this.right = false;
        this.reverse = false;
        switch (type) {
            case "KEYS":
                this.#addKeyboardListners();
                break;
            case "DUMMY":
                this.forward = true;
                break;
        }
    }
    #addKeyboardListners() {
        document.onkeydown = (e) => {
            switch (e.key) {
                case "w":
                case "ArrowUp":
                    this.forward = true;
                    break;
                case "a":
                case "ArrowLeft":
                    this.left = true;
                    break;
                case "d":
                case "ArrowRight":
                    this.right = true;
                    break;
                case "s":
                case "ArrowDown":
                    this.reverse = true;
                    break;
            }
        }

        document.onkeyup = (e) => {
            switch (e.key) {
                case "w":
                case "ArrowUp":
                    this.forward = false;
                    break;
                case "a":
                case "ArrowLeft":
                    this.left = false;
                    break;
                case "d":
                case "ArrowRight":
                    this.right = false;
                    break;
                case "s":
                case "ArrowDown":
                    this.reverse = false;
                    break;
            }
        }
    }
}