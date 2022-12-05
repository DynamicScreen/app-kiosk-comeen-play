import {defineComponent, h} from "vue";
//@ts-ignore
import pdf from "pdfvuer"

export default defineComponent({
    props: {
        urlToDisplay: {type: String, required: true},
        page: {type: Number, required: true}
    },
    components: {pdf},
    setup(props) {
        const {ref, onMounted, toRef} = window.kiosk.vue
        const {context} = window.kiosk

        const pdfSrc = toRef(props, "urlToDisplay")
        const numOfPages = toRef(props, "page")

        return () => h(context.modal.ModalBody, null, {
            default: () => h(pdf, {
                src: pdfSrc.value,
                class: "w-full h-full",
                page: numOfPages.value
            }, {
                loading: () => h("div", {class: ""}, "LOADING")
            })
        })
    }
});