import {defineComponent, h} from "vue";

export default defineComponent({
    props: {
        icon: {type: String, default: "fa fa-folder"},
        color: {type: String, default: "gray"},
        name: {type: String, required: true},
        numberOfFiles: {type: Number, required: true}
    },
    setup(props) {
        const {t} = window.kiosk
        const files = `${props.numberOfFiles} ${t('modules.kiosk.options.view.elements')}`;

        return () =>
            h("div", {
                class: "flex flex-col justify-between p-3 h-36 w-60 bg-white rounded-lg shadow-lg cursor-pointer hover:-translate-y-2 transform duration-200 border border-gray-200",
            }, [
                h("i", {
                    class: props.icon + ` text-${props.color}-400 text-3xl`
                }),
                h("div", {
                    class: "flex flex-col"
                }, [
                    h("span", {
                        class: "text-gray-700 font-bold text-xl"
                    }, props.name),
                    h("span", {
                        class: "text-gray-400 text"
                    }, files)
                ])
            ])
    }
});