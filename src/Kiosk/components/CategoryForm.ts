import {defineComponent, h, PropType} from "vue";

export default defineComponent({
    props: {
        formComponent: {required: true}
    },
    setup(props) {
        return () => []
    }
})