import {defineComponent, h, PropType} from "vue";

export default defineComponent({
    props: {
        name: {type: String, required: true},
        icon: {type: String, required: true},
        textStyle: {type: String, default: "text-xl"},
        iconStyle: {type: String, default: "text-3xl"}
    },
    setup(props) {
        return () => h("div", {
            class: "space-x-3 flex items-center"
        }, [
            h("i", {
                class: `${props.icon} ${props.iconStyle}`
            }),
            h("span", {
                class: `${props.textStyle}`
            }, props.name)
        ])
    }
})