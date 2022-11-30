import {defineComponent, h} from "vue";

export default defineComponent({
    setup() {
        return () => h("div", {
            class: "bg-red-300 text-blue-300"
        }, "CECI EST UN TEST")
    }
})