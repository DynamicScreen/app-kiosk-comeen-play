import {defineComponent, h} from "vue";

export default defineComponent({
    props: {
        urlToDisplay: {type: String, required: true}
    },
    setup(props) {
        const {context} = window.kiosk

        return () => h(context.modal.ModalBody, null, {
            default: () => h("img", {
                src: props.urlToDisplay,
                class: "h-96 w-96 object-cover"
            })
        })
    }
});