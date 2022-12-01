import {defineComponent, h, PropType} from "vue";
import {CategoryWithId} from "../Kiosk";
import NameIcon from "./NameIcon";

const HOME = "Home"

export default defineComponent({
    props: {
        categories: {type: Array as PropType<CategoryWithId[]>, required: true},
        selectedCategoryId: {type: Number, required: true}
    },
    emits: ["closeCategory", "openCategory"],
    setup(props, {emit}) {
        const {t} = window.kiosk
        const renderCategory = (category) => {
            return h("div", {
                class: "w-full cursor-pointer",
                onClick: () => emit("openCategory", category)
            }, [
                h(NameIcon, {
                    name: category.name,
                    icon: category.icon,
                    textStyle: `text-sm font-semibold ${category.uid === props.selectedCategoryId ? 'text-gray-600' : 'text-gray-400'}`,
                    iconStyle: `text-3xl text-${category.color}-400`
                })
            ])
        }

        return () => h("div", {
            class: "flex w-72 h-full flex-col bg-gray-50"
        }, [
            h("div", {
                class: "h-20 w-full flex items-center pl-8 cursor-pointer",
                onClick: () => emit("closeCategory"),
            }, [
                h(NameIcon, {
                    name: t('modules.kiosk.options.view.home'),
                    icon: "fa-solid fa-caret-left",
                    textStyle: "font-semibold text text-gray-400",
                    iconStyle: "text-xl text-gray-400"
                }),
            ]),
            h("div", {
                class: "bg-gray-100 h-full flex flex-col space-y-8 overflow-y-scroll py-8 pl-8"
            }, [
                props.categories.map((category) => renderCategory(category))
            ])
        ])
    }
});