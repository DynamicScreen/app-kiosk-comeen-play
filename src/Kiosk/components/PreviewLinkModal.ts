import {defineComponent, h} from "vue";

export default defineComponent({
    props: {
        url: {type: String, required: true}
    },
    setup(props) {
        const {context} = window.kiosk

        return () => h(context.modal.ModalBody, null, {
            default: () => h("iframe", {
                src: props.url,
                class: "h-full w-full object-cover"
            })
        })
    }
});
