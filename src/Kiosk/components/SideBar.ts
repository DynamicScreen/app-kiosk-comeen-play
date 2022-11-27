import {defineComponent, h, PropType} from "vue";
import {CategoryWithId} from "../Kiosk";
import NameIcon from "./NameIcon";

const HOME = "Home"

export default defineComponent({
    props: {
        categories: {type: Array as PropType<CategoryWithId[]>, required: true},
        selectedCategoryId: {type: Number, required: true}
    },
    setup(props) {
        const renderCategory = (category) => {
            return h(NameIcon, {
                name: category.name,
                color: category.color,
                icon: category.icon
            })
        }

        return () => h("div", {
            class: "flex w-56 h-full flex-col bg-gray-50"
        }, [
            h(NameIcon, {
                name: HOME,
                color: "gray",
                icon: "fa-solid fa-caret-left"
            }),
            h("div", {
                class: "bg-gray-100 h-full flex flex-col space-y-8 overflow-y-scroll py-8 pl-8"
            }, [
                props.categories.map((category) => renderCategory(category))
            ])
        ])
    }
});