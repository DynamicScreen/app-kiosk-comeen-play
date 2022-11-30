import {defineComponent, h} from "vue";
import Test from "./Test";

export default defineComponent({
    props: {
        test: {type: String, required: true}
    },
    name: "MODAL_APP",
    setup(props, {emit}) {
        const {context} = window.kiosk

        return () => h(context.modal.ModalBody, null, {
            title: () => h(Test),
            description: () => h("div", {
                class: "bg-green-300"
            }, "CECI EST UNE MODAL DE TEST DESCRIPTION"),
            buttons: () => h("button", {
                onClick: () => {console.log("BONJOUR JE CLIQUE")},
                class: "bg-red-500 text-white rounded-lg w-10 h-8"
            }),
            default: () => h(Test)
        })
    }
});