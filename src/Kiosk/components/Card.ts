import {defineComponent, h} from "vue";

export default defineComponent({
    props: {
        icon: {type: String, default: "fa fa-folder"},
        color: {type: String, default: "gray"},
        name: {type: String, required: true},
        numberOfFiles: {type: Number, required: true},
        newFiles: {type: Number, default: 0}
    },
    setup(props) {
        const {t} = window.kiosk;
        const {toRef, computed} = window.kiosk.vue;
        const files = `${props.numberOfFiles} ${t('modules.kiosk.options.view.elements')}`;
        const newFiles = toRef(props, "newFiles");

        const showNotification = computed(() => {
            return newFiles.value !== 0;
        })

        const renderNotificationBuble = () => {
            return [
                h("div", {class: "absolute bg-red-500 w-8 h-8 animate-ping-slow rounded-full -top-3 -right-3"}),
                h("div", {
                    class: "absolute flex justify-center items-center bg-red-500 w-8 h-8 rounded-full -top-3 -right-3"
                }, [
                h("span", {
                    class: "text-white font-bold text-sm z-10"
                }, newFiles.value)
            ])]
        }

        return () =>
            h("div", {
                class: "relative flex flex-col justify-between p-5 h-36 w-60 bg-white rounded-lg shadow-lg cursor-pointer hover:-translate-y-2 transform duration-200 border border-gray-200",
            }, [
                showNotification.value && renderNotificationBuble(),
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