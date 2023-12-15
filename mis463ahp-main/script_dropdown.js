const selectBtns = document.querySelectorAll(".select-btn");
const items = document.querySelectorAll(".item");
selectBtns.forEach((btn) => {

    btn.addEventListener("click", () => {
        // Close other buttons but open me
        selectBtns.forEach((btn2) => {
            if (btn2 !== btn) {
                btn2.classList.remove("open");
            }
        });

        btn.classList.toggle("open");

    });
    items.forEach(item => {
        item.addEventListener("click", () => {
            let parentBtn = item.parentElement.parentElement;
            let checked = parentBtn.querySelectorAll(".checked");
            let title= parentBtn.getAttribute("name");
            if((title=="Select Rating" || title=="Select Number Of Purchases") && checked.length > 0) {
                checked.forEach((selectedItem) => {
                    selectedItem.classList.remove("checked");
                    if (selectedItem != item) {
                        item.classList.toggle("checked");
                    }
                })
            }
            else {
                item.classList.toggle("checked");
            }
            

            checked = parentBtn.querySelectorAll(".checked");
            let btnText = parentBtn.querySelector(".btn-text");

            if((checked && checked.length > 0) &&  (title!="Select Rating" && title!="Select Number Of Purchases")){
                btnText.innerText = `${checked.length} Selected`;
            }else{
                btnText.innerText = title;
            }
        });
    })
});