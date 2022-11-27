import {defineComponent, h} from "vue";

export default defineComponent({
    props: {
        color: {type: String, default: "gray"},
        name: {type: String, required: true},
        icon: {type: String, required: true}
    },
    setup(props) {
        return () => h("div", {
            class: "space-x-3 flex items-center"
        }, [
            h("i", {
                class: `${props.icon} text-${props.color}-500 text-3xl`
            }),
            h("span", {
                class: `text-${props.color}-500 text-xl`
            }, props.name)
        ])
    }
})